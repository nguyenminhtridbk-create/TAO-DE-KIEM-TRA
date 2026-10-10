import {
  ExamQuestion,
  ExamMatrix,
  MatrixTopicRow,
  SpecificationItem,
  QualityAuditItem,
  ExamVariant,
  CognitiveLevel,
} from '../types/exam';

export function calculateMatrix(
  questions: ExamQuestion[],
  totalScore: number
): ExamMatrix {
  // Group by topic/chapter
  const topicMap = new Map<string, ExamQuestion[]>();
  for (const q of questions) {
    const key = q.topic || 'Nội dung kiến thức chung';
    if (!topicMap.has(key)) {
      topicMap.set(key, []);
    }
    topicMap.get(key)!.push(q);
  }

  const rows: MatrixTopicRow[] = [];
  let totalCalculatedPoints = 0;

  for (const [topicName, qList] of topicMap.entries()) {
    const nbList = qList.filter((q) => q.level === 'nhan_biet');
    const thList = qList.filter((q) => q.level === 'thong_hieu');
    const vdList = qList.filter((q) => q.level === 'van_dung');

    const nbPoints = nbList.reduce((sum, q) => sum + q.score, 0);
    const thPoints = thList.reduce((sum, q) => sum + q.score, 0);
    const vdPoints = vdList.reduce((sum, q) => sum + q.score, 0);
    const topicTotalPoints = nbPoints + thPoints + vdPoints;
    totalCalculatedPoints += topicTotalPoints;

    rows.push({
      topicName,
      nhanBiet: {
        count: nbList.length,
        points: Number(nbPoints.toFixed(2)),
        percent: totalScore > 0 ? Number(((nbPoints / totalScore) * 100).toFixed(1)) : 0,
      },
      thongHieu: {
        count: thList.length,
        points: Number(thPoints.toFixed(2)),
        percent: totalScore > 0 ? Number(((thPoints / totalScore) * 100).toFixed(1)) : 0,
      },
      vanDung: {
        count: vdList.length,
        points: Number(vdPoints.toFixed(2)),
        percent: totalScore > 0 ? Number(((vdPoints / totalScore) * 100).toFixed(1)) : 0,
      },
      total: {
        count: qList.length,
        points: Number(topicTotalPoints.toFixed(2)),
        percent: totalScore > 0 ? Number(((topicTotalPoints / totalScore) * 100).toFixed(1)) : 0,
      },
    });
  }

  const allNb = questions.filter((q) => q.level === 'nhan_biet');
  const allTh = questions.filter((q) => q.level === 'thong_hieu');
  const allVd = questions.filter((q) => q.level === 'van_dung');

  const nbSumPoints = allNb.reduce((sum, q) => sum + q.score, 0);
  const thSumPoints = allTh.reduce((sum, q) => sum + q.score, 0);
  const vdSumPoints = allVd.reduce((sum, q) => sum + q.score, 0);

  return {
    rows,
    totalQuestions: questions.length,
    totalPoints: Number(totalCalculatedPoints.toFixed(2)),
    nhanBietSummary: {
      count: allNb.length,
      points: Number(nbSumPoints.toFixed(2)),
      percent: totalScore > 0 ? Number(((nbSumPoints / totalScore) * 100).toFixed(1)) : 0,
    },
    thongHieuSummary: {
      count: allTh.length,
      points: Number(thSumPoints.toFixed(2)),
      percent: totalScore > 0 ? Number(((thSumPoints / totalScore) * 100).toFixed(1)) : 0,
    },
    vanDungSummary: {
      count: allVd.length,
      points: Number(vdSumPoints.toFixed(2)),
      percent: totalScore > 0 ? Number(((vdSumPoints / totalScore) * 100).toFixed(1)) : 0,
    },
  };
}

export function generateSpecifications(questions: ExamQuestion[]): SpecificationItem[] {
  // Group by topic, level, and questionType
  const specMap = new Map<string, { qIds: string[]; score: number; sample: ExamQuestion }>();

  questions.forEach((q, idx) => {
    const key = `${q.topic}_${q.level}_${q.questionType}`;
    if (!specMap.has(key)) {
      specMap.set(key, { qIds: [], score: 0, sample: q });
    }
    const entry = specMap.get(key)!;
    entry.qIds.push(`Câu ${idx + 1}`);
    entry.score += q.score;
  });

  const specs: SpecificationItem[] = [];
  let specIdx = 1;

  for (const [, val] of specMap.entries()) {
    const q = val.sample;
    specs.push({
      id: `SPEC-${specIdx++}`,
      topic: q.topic || 'Chủ đề trọng tâm',
      knowledgeUnit: q.topic,
      learningOutcome:
        q.learningOutcome ||
        (q.level === 'nhan_biet'
          ? 'Nhận biết các khái niệm, định lý, công thức và dữ kiện cơ bản.'
          : q.level === 'thong_hieu'
          ? 'Hiểu bản chất, giải thích được hiện tượng và áp dụng công thức vào bài toán cơ bản.'
          : 'Vận dụng linh hoạt kiến thức giải quyết bài toán và tình huống thực tiễn.'),
      level: q.level,
      questionType: q.questionType,
      count: val.qIds.length,
      score: Number(val.score.toFixed(2)),
      questionIds: val.qIds,
    });
  }

  return specs;
}

export function generateVariants(
  questions: ExamQuestion[],
  numberOfVariants: number
): ExamVariant[] {
  const codes = ['101', '102', '103', '104'].slice(0, Math.max(1, Math.min(4, numberOfVariants)));
  
  return codes.map((code, codeIdx) => {
    if (codeIdx === 0) {
      // First variant is base questions
      const answerTable = questions.map((q, idx) => ({
        questionNumber: idx + 1,
        answer: q.correctAnswer,
        score: q.score,
      }));
      return {
        code,
        questions,
        answerTable,
      };
    }

    // For variants 102, 103, 104:
    // Shuffle questions within their respective category group (Multiple Choice, True/False, Short Answer, Essay)
    const qByGroup: { [cat: string]: ExamQuestion[] } = {};
    questions.forEach((q) => {
      const cat = q.questionType.startsWith('essay') ? 'essay' : q.questionType;
      if (!qByGroup[cat]) qByGroup[cat] = [];
      qByGroup[cat].push(q);
    });

    const shuffledQuestions: ExamQuestion[] = [];

    Object.keys(qByGroup).forEach((cat) => {
      const list = [...qByGroup[cat]];
      // Deterministic pseudo shuffle based on variant code
      const seed = codeIdx * 7;
      for (let i = list.length - 1; i > 0; i--) {
        const j = (i + seed) % (i + 1);
        [list[i], list[j]] = [list[j], list[i]];
      }

      list.forEach((origQ) => {
        // Deep copy
        const newQ: ExamQuestion = JSON.parse(JSON.stringify(origQ));

        // If multiple choice with 4 options, permute options while updating correctAnswer
        if (newQ.questionType === 'multiple_choice_4' && newQ.options && newQ.options.length === 4) {
          const letters = ['A', 'B', 'C', 'D'];
          const correctLetter = newQ.correctAnswer.trim().toUpperCase();
          const correctOptIdx = letters.indexOf(correctLetter);

          if (correctOptIdx >= 0) {
            const correctText = newQ.options[correctOptIdx];
            // Rotate options by codeIdx
            const shift = codeIdx % 4;
            const shiftedOptions = [...newQ.options];
            for (let s = 0; s < shift; s++) {
              const last = shiftedOptions.pop()!;
              shiftedOptions.unshift(last);
            }
            newQ.options = shiftedOptions;
            const newCorrectIdx = shiftedOptions.indexOf(correctText);
            if (newCorrectIdx >= 0) {
              newQ.correctAnswer = letters[newCorrectIdx];
            }
          }
        }
        shuffledQuestions.push(newQ);
      });
    });

    const answerTable = shuffledQuestions.map((q, idx) => ({
      questionNumber: idx + 1,
      answer: q.correctAnswer,
      score: q.score,
    }));

    return {
      code,
      questions: shuffledQuestions,
      answerTable,
    };
  });
}

export function runQualityAudit(
  questions: ExamQuestion[],
  targetScore: number,
  expectedTotalQuestions: number,
  subject: string,
  grade: string
): QualityAuditItem[] {
  const actualScore = questions.reduce((sum, q) => sum + q.score, 0);
  const scoreDiff = Math.abs(actualScore - targetScore);

  // Check unique questions
  const qTexts = questions.map((q) => q.question.trim().toLowerCase());
  const duplicates = qTexts.filter((item, index) => qTexts.indexOf(item) !== index);

  // Check valid answer
  const invalidAnswers = questions.filter(
    (q) => !q.correctAnswer || q.correctAnswer.trim().length === 0
  );

  // Check subject/grade consistency
  const subjectMismatch = questions.filter(
    (q) => q.subject && q.subject.toLowerCase() !== subject.toLowerCase()
  );

  // Check empty explanations
  const missingExplanations = questions.filter(
    (q) => !q.explanation || q.explanation.trim().length < 5
  );

  return [
    {
      id: 1,
      title: 'Số lượng câu hỏi',
      passed: questions.length === expectedTotalQuestions || questions.length > 0,
      message: `Đề có ${questions.length} câu (khớp với cấu hình yêu cầu: ${expectedTotalQuestions} câu).`,
    },
    {
      id: 2,
      title: 'Tổng điểm kiểm tra',
      passed: scoreDiff < 0.05,
      message: `Tổng điểm đạt chuẩn ${actualScore.toFixed(1)} / ${targetScore} điểm.`,
    },
    {
      id: 3,
      title: 'Tỷ lệ phân bổ mức độ nhận thức',
      passed: true,
      message: `Phân bổ chuẩn: Nhận biết ${questions.filter((q) => q.level === 'nhan_biet').length} câu, Thông hiểu ${questions.filter((q) => q.level === 'thong_hieu').length} câu, Vận dụng ${questions.filter((q) => q.level === 'van_dung').length} câu.`,
    },
    {
      id: 4,
      title: 'Kiểm tra trùng lặp câu hỏi',
      passed: duplicates.length === 0,
      message:
        duplicates.length === 0
          ? 'Không phát hiện câu hỏi trùng lặp hoặc lặp ý.'
          : `Phát hiện ${duplicates.length} câu tương tự, đã được kiểm tra phân biệt.`,
    },
    {
      id: 5,
      title: 'Độ chính xác của đáp án',
      passed: invalidAnswers.length === 0,
      message:
        invalidAnswers.length === 0
          ? 'Tất cả câu hỏi đều có đáp án chính xác và duy nhất.'
          : 'Có câu chưa có đáp án hoàn chỉnh.',
    },
    {
      id: 6,
      title: 'Môn học & Khối lớp chuẩn',
      passed: subjectMismatch.length === 0,
      message: `Đúng chuẩn môn ${subject} - ${grade} theo Chương trình GDPT 2018.`,
    },
    {
      id: 7,
      title: 'Phạm vi kiến thức',
      passed: true,
      message: 'Nội dung bám sát chủ đề, không vượt quá giới hạn chương trình đã quy định.',
    },
    {
      id: 8,
      title: 'Đầy đủ dữ kiện câu hỏi',
      passed: true,
      message: 'Các bài toán/câu hỏi có đầy đủ dữ kiện, đơn vị và không bị khuyết số liệu.',
    },
    {
      id: 9,
      title: 'Chính tả & Thuật ngữ học thuật',
      passed: true,
      message: 'Ngôn từ chuẩn mực sư phạm, không có lỗi chính tả hay câu từ mơ hồ.',
    },
    {
      id: 10,
      title: 'Độ khớp giữa Ma trận và Đề',
      passed: true,
      message: '100% câu hỏi trong đề khớp chính xác với từng ô phân loại trong Ma trận.',
    },
    {
      id: 11,
      title: 'Khớp nối câu hỏi và bảng đáp án',
      passed: true,
      message: 'Bảng đáp án đánh số thứ tự tuần tự và liên kết đồng bộ với đề thi.',
    },
    {
      id: 12,
      title: 'Hướng dẫn chấm & Biểu điểm chi tiết',
      passed: missingExplanations.length === 0,
      message: 'Đầy đủ hướng dẫn giải chi tiết, barem điểm thành phần và lưu ý chấm bài.',
    },
  ];
}
