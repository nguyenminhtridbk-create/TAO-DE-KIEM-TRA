import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ADMIN_PASSWORD = '68686868@#';

interface AuthContext {
  authorized: boolean;
  isAdmin: boolean;
  client: GoogleGenAI | null;
  error?: string;
}

// Function to resolve Auth and Gemini client:
// - Creator/Admin uses ADMIN_PASSWORD: uses server's Gemini client without needing personal key
// - Guest/Teacher uses personal Gemini API Key
function verifyAuth(req: express.Request): AuthContext {
  const adminKey =
    (req.headers['x-admin-key'] as string) ||
    req.body?.adminKey ||
    (req.headers['authorization']?.replace(/^Bearer\s+/i, ''));
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.userApiKey;

  // 1. Quản trị viên / Tác giả website
  if (adminKey && adminKey.trim() === ADMIN_PASSWORD) {
    return {
      authorized: true,
      isAdmin: true,
      client: ai,
    };
  }

  // 2. Giáo viên / Người dùng khách với API Key cá nhân
  if (customKey && typeof customKey === 'string' && customKey.trim().length > 10) {
    try {
      const userAi = new GoogleGenAI({
        apiKey: customKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      return {
        authorized: true,
        isAdmin: false,
        client: userAi,
      };
    } catch (err: any) {
      return {
        authorized: false,
        isAdmin: false,
        client: null,
        error: 'Khóa API Gemini không đúng định dạng.',
      };
    }
  }

  // 3. Chưa xác thực
  return {
    authorized: false,
    isAdmin: false,
    client: null,
    error: 'YÊU CẦU XÁC THỰC: Bạn cần nhập Google Gemini API Key cá nhân hoặc Mật khẩu Quản trị viên (68686868@#) để tạo đề kiểm tra.',
  };
}

// Helper to sanitize JSON string from Gemini
function extractJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleaned);
}

// Fallback question generator when AI is unavailable or offline
function generateFallbackQuestions(config: any): any[] {
  const { subject, grade, topic, selectedFormats, totalScore, chapter } = config;
  const questions: any[] = [];
  let qNum = 1;

  const formatList: string[] = [];
  Object.keys(selectedFormats || {}).forEach((key) => {
    const item = selectedFormats[key];
    if (item && item.enabled && item.count > 0) {
      for (let i = 0; i < item.count; i++) {
        formatList.push(key);
      }
    }
  });

  if (formatList.length === 0) {
    for (let i = 0; i < 10; i++) formatList.push('multiple_choice_4');
  }

  const levels: ('nhan_biet' | 'thong_hieu' | 'van_dung')[] = ['nhan_biet', 'thong_hieu', 'van_dung'];
  const baseScorePerQ = Number((totalScore / formatList.length).toFixed(2));
  const cleanTopic = topic || chapter || `Chương trình ${subject} ${grade}`;

  // Subject-specific templates
  const isMath = subject.includes('Toán');
  const isLit = subject.includes('Ngữ văn') || subject.includes('Tiếng Việt');
  const isEng = subject.includes('Anh');
  const isScience = subject.includes('Lý') || subject.includes('Hóa') || subject.includes('Sinh') || subject.includes('Khoa học');
  const isHistory = subject.includes('Sử') || subject.includes('Địa') || subject.includes('GDCD') || subject.includes('Kinh tế');

  formatList.forEach((fmt, idx) => {
    const level = levels[idx % levels.length];
    const id = `Q${String(qNum).padStart(2, '0')}`;

    if (fmt === 'multiple_choice_4') {
      let qText = `Trong chương trình môn ${subject} (${grade}), nội dung "${cleanTopic}": Khẳng định nào sau đây là đúng?`;
      let opts = [
        `Khẳng định A: Thể hiện chính xác quy luật, định lý hoặc quy tắc trong SGK ${subject}.`,
        `Khẳng định B: Chỉ đúng khi áp dụng cho một số trường hợp ngoại lệ.`,
        `Khẳng định C: Trái ngược với bản chất tự nhiên và khoa học của ${cleanTopic}.`,
        `Khẳng định D: Không có tính xác thực và không được áp dụng trong thực tiễn.`,
      ];
      let exp = `Phương án A là nhận định chuẩn mực được trình bày rõ trong bài học "${cleanTopic}" của môn ${subject} (${grade}).`;

      if (isMath) {
        const a = (idx + 2) * 2;
        const b = idx + 1;
        qText = `Cho biểu thức P = √(${a}x - ${b}). Điều kiện xác định của biểu thức P trong phần "${cleanTopic}" là:`;
        opts = [
          `x ≥ ${b}/${a}`,
          `x > ${b}/${a}`,
          `x ≤ ${b}/${a}`,
          `x < ${b}/${a}`,
        ];
        exp = `Biểu thức dưới dấu căn bậc hai không âm khi và chỉ khi ${a}x - ${b} ≥ 0 <=> x ≥ ${b}/${a}. Đáp án A chính xác.`;
      } else if (isLit) {
        qText = `Trong văn bản thuộc chủ đề "${cleanTopic}", nét đặc sắc nổi bật nhất về nội dung và nghệ thuật là:`;
        opts = [
          `Khắc họa chân thực vẻ đẹp tâm hồn nhân vật và ý nghĩa nhân văn sâu sắc.`,
          `Sử dụng ngôn ngữ trừu tượng khó hiểu, không phản ánh đời sống.`,
          `Chỉ tập trung miêu tả ngoại cảnh mà không diễn tả nội tâm.`,
          `Mang tính chất ước lệ cứng nhắc, thiếu cảm xúc thực tế.`,
        ];
        exp = `Phương án A thể hiện đúng giá trị hiện thực và tư tưởng nghệ thuật của tác phẩm trong chương trình ${grade}.`;
      } else if (isEng) {
        qText = `Choose the correct answer to complete the sentence regarding "${cleanTopic}":`;
        opts = [
          `Students should practice speaking English every day to improve their fluency.`,
          `Students should practice to speak English every day.`,
          `Students should practicing speaking English every day.`,
          `Students should practice spoken English everyday without practice.`,
        ];
        exp = `After the modal verb 'should' we use bare infinitive (practice), and 'practice doing something' (practice speaking).`;
      }

      questions.push({
        id,
        subject,
        grade,
        topic: cleanTopic,
        questionType: 'multiple_choice_4',
        level,
        question: qText,
        options: opts,
        correctAnswer: 'A',
        explanation: exp,
        score: baseScorePerQ,
        learningOutcome: `Học sinh nắm vững kiến thức cốt lõi về ${cleanTopic} theo chuẩn GDPT 2018.`,
      });
    } else if (fmt === 'true_false') {
      questions.push({
        id,
        subject,
        grade,
        topic: cleanTopic,
        questionType: 'true_false',
        level,
        question: `Xét tính đúng/sai của các mệnh đề sau đây đối với kiến thức "${cleanTopic}" (${subject} - ${grade}):`,
        subQuestions: [
          { label: 'a', statement: `Nội dung này là kiến thức trọng tâm trong chương trình ${subject} ${grade}.`, isCorrect: true, explanation: 'Đúng theo quy định của chương trình GDPT 2018.' },
          { label: 'b', statement: `Kiến thức này không thể vận dụng vào giải bài tập hoặc tình huống thực tế.`, isCorrect: false, explanation: 'Sai vì có tính liên hệ và ứng dụng thực tiễn cao.' },
          { label: 'c', statement: `Có thể chứng minh và suy luận từ các tiên đề, định lý nền tảng đã học.`, isCorrect: true, explanation: 'Đúng theo phương pháp suy luận khoa học.' },
          { label: 'd', statement: `Quy tắc này áp dụng không cần điều kiện hay giới hạn xác định nào.`, isCorrect: false, explanation: 'Sai vì luôn có tập xác định hoặc phạm vi điều kiện chặt chẽ.' },
        ],
        correctAnswer: 'a-Đ, b-S, c-Đ, d-S',
        explanation: 'Ý a và c đúng; ý b và d sai do vi phạm nguyên lý khoa học và tính ứng dụng thực tế.',
        score: baseScorePerQ,
        learningOutcome: `Phân biệt chính xác tính đúng/sai của các mệnh đề liên quan đến ${cleanTopic}.`,
      });
    } else if (fmt === 'short_answer') {
      questions.push({
        id,
        subject,
        grade,
        topic: cleanTopic,
        questionType: 'short_answer',
        level,
        question: isMath
          ? `Tìm giá trị của x để hàm số/biểu thức trong chủ đề "${cleanTopic}" đạt giá trị nguyên dương nhỏ nhất.`
          : `Ghi lại thuật ngữ khoa học hoặc từ khóa chính xác nhất thể hiện bản chất của nội dung "${cleanTopic}":`,
        correctAnswer: isMath ? 'x = 1' : 'Khái niệm chuẩn theo SGK',
        explanation: 'Học sinh áp dụng trực tiếp công thức hoặc định nghĩa trong bài học để đưa ra câu trả lời ngắn gọn, chính xác.',
        score: baseScorePerQ,
        learningOutcome: `Ghi nhớ và tính toán nhanh kết quả trọng tâm của ${cleanTopic}.`,
      });
    } else {
      questions.push({
        id,
        subject,
        grade,
        topic: cleanTopic,
        questionType: fmt,
        level,
        question: `Em hãy trình bày chi tiết lời giải hoặc bài phân tích cho câu hỏi liên quan đến nội dung "${cleanTopic}" (${grade}).`,
        correctAnswer: 'Lời giải chi tiết gồm các bước suy luận logic, công thức và đáp số/kết luận chuẩn mực.',
        explanation: 'Bước 1: Nêu căn cứ lý thuyết, công thức hoặc dẫn chứng liên quan. Bước 2: Trình bày các bước biến đổi/lập luận logic. Bước 3: Đưa ra kết luận rõ ràng, đầy đủ đơn vị.',
        score: baseScorePerQ,
        learningOutcome: `Vận dụng năng lực giải quyết vấn đề và kỹ năng trình bày logic trong môn ${subject}.`,
      });
    }
    qNum++;
  });

  return questions;
}

// Generate Exam Route
app.post('/api/exam/generate', async (req, res) => {
  const config = req.body;
  try {
    const {
      level,
      grade,
      subject,
      examType,
      topic,
      chapter,
      knowledgeScope,
      testContent,
      learningOutcomes,
      teacherNotes,
      referenceDocText,
      referenceMode,
      selectedFormats,
      cognitiveMode,
      cognitiveCount,
      cognitivePercent,
      totalScore,
      keepTeacherQuestions,
      teacherQuestions,
      textbookSeries,
    } = config;

    // Calculate question format counts
    const requestedFormats: { format: string; count: number }[] = [];
    let totalQuestionsCount = 0;
    Object.keys(selectedFormats || {}).forEach((key) => {
      const item = selectedFormats[key];
      if (item && item.enabled && item.count > 0) {
        requestedFormats.push({ format: key, count: item.count });
        totalQuestionsCount += item.count;
      }
    });

    if (totalQuestionsCount === 0) {
      requestedFormats.push({ format: 'multiple_choice_4', count: 10 });
      totalQuestionsCount = 10;
    }

    const auth = verifyAuth(req);
    if (!auth.authorized) {
      return res.status(401).json({
        success: false,
        requiresAuth: true,
        error: auth.error,
      });
    }

    const activeAi = auth.client;
    if (!activeAi) {
      // Fallback if no Gemini API key configured on server for admin
      const fallbackQuestions = generateFallbackQuestions(config);
      return res.json({
        success: true,
        source: 'fallback',
        questions: fallbackQuestions,
        message: 'Đang dùng bộ câu hỏi theo chuẩn GDPT 2018 (Chế độ dự phòng)',
      });
    }

    // Build strict prompt in Vietnamese according to prompt specification
    const prompt = `
Bạn là Chuyên gia Khảo thí và Đo lường Giáo dục hàng đầu tại Việt Nam, am hiểu sâu sắc Chương trình GDPT 2018 cho cấp THCS và THPT.
Hãy tạo một bộ câu hỏi đề kiểm tra hoàn chỉnh chuẩn mực theo đúng các thông số sau:

THÔNG TIN ĐỀ KIỂM TRA:
- Cấp học: ${level} (Trung học cơ sở / Trung học phổ thông)
- Khối lớp: ${grade}
- Môn học: ${subject}
- Bộ sách giáo khoa chuẩn GDPT 2018: ${textbookSeries || 'Kết nối tri thức với cuộc sống'}
- Loại đề: ${examType}
- Chủ đề / Tên bài: ${topic || 'Theo chương trình'}
- Chương: ${chapter || 'Chương hiện tại'}
- Phạm vi kiến thức: ${knowledgeScope || 'Bám sát SGK ' + (textbookSeries || 'Kết nối tri thức')}
- Nội dung trọng tâm cần kiểm tra: ${testContent || 'Nội dung cốt lõi'}
- Yêu cầu cần đạt: ${learningOutcomes || 'Chuẩn kiến thức, kĩ năng GDPT 2018'}
- Ghi chú của giáo viên: ${teacherNotes || 'Không có'}
- Thang điểm tổng: ${totalScore} điểm
- Chế độ tài liệu: ${referenceMode}
${referenceDocText ? `\nTÀI LIỆU THAM CHIẾU GIÁO VIÊN CUNG CẤP:\n"""\n${referenceDocText.slice(0, 8000)}\n"""\n` : ''}

CƠ CẤU DẠNG CÂU HỎI VÀ SỐ LƯỢNG (BẮT BUỘC ĐÚNG TỪNG CON SỐ):
${requestedFormats.map((f) => `- Dạng '${f.format}': ${f.count} câu`).join('\n')}
TỔNG SỐ CÂU: ${totalQuestionsCount} câu. (Tuyệt đối không sinh thừa hoặc thiếu câu!)

PHÂN BỔ MỨC ĐỘ NHẬN THỨC:
${
  cognitiveMode === 'count'
    ? `- Nhận biết: ${cognitiveCount?.nhan_biet || 0} câu\n- Thông hiểu: ${cognitiveCount?.thong_hieu || 0} câu\n- Vận dụng: ${cognitiveCount?.van_dung || 0} câu`
    : `- Tỷ lệ Nhận biết: ${cognitivePercent?.nhan_biet || 40}%\n- Tỷ lệ Thông hiểu: ${cognitivePercent?.thong_hieu || 30}%\n- Tỷ lệ Vận dụng: ${cognitivePercent?.van_dung || 30}%`
}

QUY TẮC BẮT BUỘC (NGHIÊM NGẶT):
1. Đúng môn, đúng lớp, chuẩn thuật ngữ GDPT 2018.
2. Với môn Toán, Lý, Hóa, môn tính toán: Phải tự giải lại và kiểm tra kỹ số liệu, công thức, đơn vị; tuyệt đối không tạo bài toán vô nghiệm hoặc đáp án sai số.
3. Với môn Ngữ văn, Tiếng Việt, Ngoại ngữ: Nếu có trích đoạn văn bản đọc hiểu, đảm bảo ngữ liệu nguyên bản, câu hỏi sâu sắc, gợi ý chấm rõ ràng.
4. Với môn Lịch sử, Địa lí, GDCD, Kinh tế pháp luật: Tuyệt đối chuẩn xác về mốc thời gian, địa danh, nhân vật, thuật ngữ; không tạo dữ kiện sai.
5. Với câu Trắc nghiệm 4 lựa chọn (multiple_choice_4):
   - 4 lựa chọn A, B, C, D đồng nhất về kiểu dữ liệu và độ dài tương đối.
   - Các phương án nhiễu phải hợp lý, phân loại được học sinh. Không tạo nhiễu ngớ ngẩn.
   - Đáp án đúng phải là duy nhất.
6. Với câu Đúng/Sai (true_false):
   - Cung cấp 'subQuestions' gồm đúng 4 lệnh hỏi có nhãn 'a', 'b', 'c', 'd', mỗi lệnh có 'statement', 'isCorrect' (true/false) và 'explanation'.
7. Thang điểm: Chia điểm từng câu sao cho tổng điểm của ${totalQuestionsCount} câu bằng chính xác ${totalScore} điểm.
8. Nếu có bất kỳ câu nào AI không chắc chắn dữ liệu: Đặt cờ 'needsTeacherCheck: true'.

HÃY TRẢ VỀ DẠNG JSON DUY NHẤT VỚI CẤU TRÚC:
{
  "questions": [
    {
      "id": "Q01",
      "subject": "${subject}",
      "grade": "${grade}",
      "topic": "${topic || 'Chủ đề'}",
      "questionType": "multiple_choice_4",
      "level": "nhan_biet" | "thong_hieu" | "van_dung",
      "question": "Nội dung câu hỏi...",
      "options": ["Nội dung A", "Nội dung B", "Nội dung C", "Nội dung D"],
      "subQuestions": [
        {"label": "a", "statement": "...", "isCorrect": true, "explanation": "..."},
        {"label": "b", "statement": "...", "isCorrect": false, "explanation": "..."},
        {"label": "c", "statement": "...", "isCorrect": true, "explanation": "..."},
        {"label": "d", "statement": "...", "isCorrect": false, "explanation": "..."}
      ],
      "correctAnswer": "A",
      "explanation": "Hướng dẫn giải chi tiết...",
      "score": 0.25,
      "learningOutcome": "Yêu cầu cần đạt cụ thể...",
      "needsTeacherCheck": false
    }
  ]
}
`;

    const response = await activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = extractJson(response.text || '{}');
    let questions = parsed.questions || [];

    // Ensure scores add up precisely to totalScore
    if (questions.length > 0) {
      const sum = questions.reduce((s: number, q: any) => s + (q.score || 0), 0);
      if (Math.abs(sum - totalScore) > 0.05 && sum > 0) {
        // Adjust proportionally
        const ratio = totalScore / sum;
        questions.forEach((q: any) => {
          q.score = Number((q.score * ratio).toFixed(2));
        });
      }
    }

    // Merge teacher questions if requested
    if (keepTeacherQuestions && Array.isArray(teacherQuestions) && teacherQuestions.length > 0) {
      teacherQuestions.forEach((tq, i) => {
        if (questions[i]) {
          questions[i] = {
            ...questions[i],
            ...tq,
            isTeacherCustom: true,
          };
        }
      });
    }

    return res.json({
      success: true,
      source: 'gemini',
      questions,
    });
  } catch (error: any) {
    console.error('Error generating exam with Gemini:', error);
    // Return robust fallback
    const fallback = generateFallbackQuestions(config);
    return res.json({
      success: true,
      source: 'fallback_error',
      error: error.message,
      questions: fallback,
    });
  }
});

// Regenerate single question route
app.post('/api/exam/regenerate-question', async (req, res) => {
  try {
    const { currentQuestion, subject, grade, topic } = req.body;
    const auth = verifyAuth(req);
    if (!auth.authorized) {
      return res.status(401).json({ success: false, requiresAuth: true, error: auth.error });
    }
    const activeAi = auth.client;

    if (!activeAi) {
      return res.json({
        success: true,
        question: {
          ...currentQuestion,
          question: `[Tạo mới] Câu hỏi tương đương cho phần "${topic || subject}": Hãy phân tích tính chất đặc trưng trong chương trình ${grade}?`,
          explanation: `Giải thích chi tiết cho câu hỏi tương đương mới được sinh ra.`,
        },
      });
    }

    const prompt = `
Hãy sinh lại 1 câu hỏi MỚI DUY NHẤT để thay thế câu hỏi sau, giữ nguyên môn (${subject}), khối (${grade}), chủ đề (${topic || currentQuestion.topic}), định dạng (${currentQuestion.questionType}), mức độ (${currentQuestion.level}) và điểm số (${currentQuestion.score}):
CÂU CŨ: "${currentQuestion.question}"

YÊU CẦU:
- Câu hỏi mới phải khác câu cũ về cách hỏi/số liệu nhưng cùng độ khó và chuẩn kiến thức.
- Nếu là trắc nghiệm 4 lựa chọn, tạo 4 phương án A, B, C, D rõ ràng, không trùng, 1 đáp án đúng.
- Trả về JSON 1 câu hỏi duy nhất có cấu trúc:
{
  "id": "${currentQuestion.id}",
  "subject": "${subject}",
  "grade": "${grade}",
  "topic": "${topic || currentQuestion.topic}",
  "questionType": "${currentQuestion.questionType}",
  "level": "${currentQuestion.level}",
  "question": "Nội dung câu hỏi mới...",
  "options": ["A...", "B...", "C...", "D..."],
  "subQuestions": [],
  "correctAnswer": "A",
  "explanation": "Lời giải chi tiết mới...",
  "score": ${currentQuestion.score},
  "learningOutcome": "${currentQuestion.learningOutcome || 'Yêu cầu cần đạt'}",
  "needsTeacherCheck": false
}
`;

    const response = await activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = extractJson(response.text || '{}');
    return res.json({
      success: true,
      question: parsed.question || parsed,
    });
  } catch (error: any) {
    console.error('Error regenerating question:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Equivalent Exam Route (Làm đề khác tương đương)
app.post('/api/exam/generate-equivalent', async (req, res) => {
  try {
    const { originalQuestions, subject, grade, topic, totalScore } = req.body;
    const auth = verifyAuth(req);
    if (!auth.authorized) {
      return res.status(401).json({ success: false, requiresAuth: true, error: auth.error });
    }
    const activeAi = auth.client;

    if (!activeAi) {
      const regenerated = originalQuestions.map((q: any, i: number) => ({
        ...q,
        id: `Q${String(i + 1).padStart(2, '0')}`,
        question: `[Đề tương đương] ${q.question} (Biến thể số ${i + 1})`,
      }));
      return res.json({ success: true, questions: regenerated });
    }

    const prompt = `
Dưới đây là danh sách các câu hỏi của một đề thi chuẩn môn ${subject} - ${grade}.
Hãy tạo một ĐỀ THI MỚI TƯƠNG ĐƯƠNG 100% về:
- Số lượng câu (${originalQuestions.length} câu)
- Định dạng từng câu (theo đúng thứ tự)
- Mức độ nhận thức từng câu (nhận biết, thông hiểu, vận dụng)
- Điểm số từng câu (tổng điểm bằng ${totalScore})
- Chuẩn kiến thức và ma trận
NHƯNG THAY ĐỔI TOÀN BỘ NỘI DUNG CÂU HỎI, SỐ LIỆU, VĂN BẢN TRÍCH ĐOẠN ĐỂ THÀNH ĐỀ MỚI HOÀN TOÀN KHÔNG BỊ TRÙNG LẶP.

CÂU HỎI GỐC:
${JSON.stringify(originalQuestions.map((q: any) => ({ id: q.id, type: q.questionType, level: q.level, score: q.score, topic: q.topic, brief: q.question.slice(0, 80) })))}

Trả về JSON:
{
  "questions": [
    ...các câu hỏi mới tương đương
  ]
}
`;

    const response = await activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = extractJson(response.text || '{}');
    return res.json({
      success: true,
      questions: parsed.questions || originalQuestions,
    });
  } catch (error: any) {
    console.error('Error generating equivalent exam:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Parse pasted matrix / specification sheet text
app.post('/api/exam/parse-matrix', async (req, res) => {
  try {
    const { matrixText, subject, grade } = req.body;
    const auth = verifyAuth(req);
    if (!auth.authorized) {
      return res.status(401).json({ success: false, requiresAuth: true, error: auth.error });
    }
    const activeAi = auth.client;

    if (!activeAi || !matrixText) {
      return res.json({
        success: true,
        detectedTopics: ['Chương I', 'Chương II'],
        estimatedCount: 15,
      });
    }

    const prompt = `
Giáo viên đã cung cấp bảng hoặc văn bản Ma trận / Bản đặc tả đề thi môn ${subject || ''} (${grade || ''}):
"""
${matrixText.slice(0, 4000)}
"""

Hãy phân tích và trích xuất cấu trúc ma trận:
1. Danh sách các chủ đề/nội dung kiến thức chính.
2. Tổng số câu hỏi trắc nghiệm và tự luận ước tính.
3. Tỷ lệ % hoặc số câu cho 3 mức: Nhận biết, Thông hiểu, Vận dụng.
4. Gợi ý phân bổ câu hỏi.

Trả về JSON:
{
  "topics": ["Tên chủ đề 1", "Tên chủ đề 2"],
  "totalQuestions": 20,
  "cognitivePercent": { "nhan_biet": 40, "thong_hieu": 30, "van_dung": 30 },
  "formats": { "multiple_choice_4": 12, "true_false": 2, "short_answer": 4, "essay_short": 2 }
}
`;

    const response = await activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = extractJson(response.text || '{}');
    return res.json({ success: true, parsed });
  } catch (error: any) {
    console.error('Error parsing matrix:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify Auth endpoint (Admin password or User API Key)
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { adminPassword, apiKey } = req.body;

    if (adminPassword !== undefined) {
      if (typeof adminPassword === 'string' && adminPassword.trim() === ADMIN_PASSWORD) {
        return res.json({
          success: true,
          role: 'admin',
          message: '👑 Xác thực Quản trị viên (Tác giả website) thành công! Không cần nhập API key.',
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Mật khẩu Quản trị viên không chính xác. Vui lòng kiểm tra lại!',
        });
      }
    }

    if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 10) {
      const testAi = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const response = await testAi.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Trả lời đúng 1 từ tiếng Việt: "OK"',
      });
      return res.json({
        success: true,
        role: 'user',
        message: '🔑 Khóa Gemini API cá nhân hợp lệ và đã kết nối thành công!',
        reply: response.text?.trim() || 'OK',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Vui lòng cung cấp mật khẩu Quản trị hoặc Gemini API Key hợp lệ.',
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Khóa API không hợp lệ hoặc đã chạm hạn mức rate limit của Google.',
    });
  }
});

// Test API Key endpoint for user validation in UI
app.post('/api/exam/test-key', async (req, res) => {
  try {
    const auth = verifyAuth(req);
    if (!auth.authorized) {
      return res.status(401).json({
        success: false,
        error: auth.error || 'Chưa được xác thực. Vui lòng nhập API key hoặc mật khẩu quản trị.',
      });
    }

    const activeAi = auth.client;
    if (!activeAi) {
      if (auth.isAdmin) {
        return res.json({
          success: true,
          message: '👑 Xác thực Quản trị viên thành công! Máy chủ đang sẵn sàng ở chế độ tác giả.',
          reply: 'Sẵn sàng',
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Chưa có API key nào được thiết lập.',
      });
    }

    const response = await activeAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Trả lời đúng 1 từ tiếng Việt: "Sẵn sàng"',
    });

    return res.json({
      success: true,
      message: auth.isAdmin
        ? '👑 Chế độ Tác giả: Kết nối máy chủ AI Gemini thành công!'
        : '🔑 Khóa API Gemini cá nhân hoạt động tốt và kết nối thành công!',
      reply: response.text?.trim() || 'Sẵn sàng',
    });
  } catch (error: any) {
    console.error('Error testing API key:', error);
    return res.status(400).json({
      success: false,
      error: error.message || 'Khóa API không hợp lệ hoặc đã chạm hạn mức rate limit của Google.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;

