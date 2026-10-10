import { ExamData, ExamQuestion, ExamVariant } from '../types/exam';

export function formatExamAsText(exam: ExamData, variantCode?: string): string {
  const variant = exam.variants.find((v) => v.code === (variantCode || exam.selectedVariantCode)) || exam.variants[0];
  const questions = variant ? variant.questions : exam.questions;
  const currentCode = variant ? variant.code : '101';

  let text = `SỞ GDĐT TỈNH ĐỒNG THÁP\nTRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU\n(Điểm Đốc Binh Kiều • Điểm Tân Kiều)\n`;
  text += `HỌ VÀ TÊN: .................................................... LỚP: ${exam.grade}\n`;
  text += `------------------------------------------------------------\n`;
  text += `${exam.title.toUpperCase()}\n`;
  text += `Môn: ${exam.subject} - Khối: ${exam.grade}\n`;
  text += `Thời gian làm bài: ${exam.durationMinutes} phút (Không kể thời gian phát đề)\n`;
  text += `Mã đề thi: ${currentCode}\n`;
  text += `------------------------------------------------------------\n\n`;

  // Group by question category/type
  const mcqQuestions = questions.filter((q) => q.questionType === 'multiple_choice_4' || q.questionType === 'multiple_correct');
  const tfQuestions = questions.filter((q) => q.questionType === 'true_false');
  const shortQuestions = questions.filter((q) => q.questionType === 'short_answer' || q.questionType === 'fill_blank' || q.questionType === 'matching');
  const essayQuestions = questions.filter((q) => q.questionType.startsWith('essay'));

  let questionIndex = 1;

  if (mcqQuestions.length > 0) {
    text += `PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN\n`;
    text += `(Thí sinh chọn một phương án trả lời đúng nhất)\n\n`;
    mcqQuestions.forEach((q) => {
      text += `Câu ${questionIndex++} (${q.score} điểm): ${q.question}\n`;
      if (q.options && q.options.length > 0) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        q.options.forEach((opt, oIdx) => {
          text += `   ${letters[oIdx]}. ${opt}\n`;
        });
      }
      text += `\n`;
    });
  }

  if (tfQuestions.length > 0) {
    text += `PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI\n`;
    text += `(Thí sinh trả lời từ câu 1 đến câu ${tfQuestions.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai)\n\n`;
    tfQuestions.forEach((q) => {
      text += `Câu ${questionIndex++} (${q.score} điểm): ${q.question}\n`;
      if (q.subQuestions && q.subQuestions.length > 0) {
        q.subQuestions.forEach((sq) => {
          text += `   ${sq.label}) ${sq.statement}\n`;
        });
      }
      text += `\n`;
    });
  }

  if (shortQuestions.length > 0) {
    text += `PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN\n`;
    text += `(Thí sinh viết câu trả lời / đáp số ngắn gọn vào giấy làm bài)\n\n`;
    shortQuestions.forEach((q) => {
      text += `Câu ${questionIndex++} (${q.score} điểm): ${q.question}\n\n`;
    });
  }

  if (essayQuestions.length > 0) {
    text += `PHẦN IV. TỰ LUẬN\n`;
    text += `(Thí sinh trình bày chi tiết lời giải vào giấy thi)\n\n`;
    essayQuestions.forEach((q) => {
      text += `Câu ${questionIndex++} (${q.score} điểm): ${q.question}\n\n`;
    });
  }

  text += `------------------- HẾT -------------------\n`;
  text += `(Cán bộ coi thi không giải thích gì thêm)\n`;
  return text;
}

export function formatAnswerKeyAsText(exam: ExamData, variantCode?: string): string {
  const variant = exam.variants.find((v) => v.code === (variantCode || exam.selectedVariantCode)) || exam.variants[0];
  const questions = variant ? variant.questions : exam.questions;
  const currentCode = variant ? variant.code : '101';

  let text = `ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM - MÃ ĐỀ: ${currentCode}\n`;
  text += `Môn: ${exam.subject} - ${exam.grade}\n`;
  text += `------------------------------------------------------------\n\n`;

  text += `1. BẢNG ĐÁP ÁN TRẮC NGHIỆM:\n`;
  questions
    .filter((q) => !q.questionType.startsWith('essay'))
    .forEach((q, idx) => {
      text += `Câu ${idx + 1}: ${q.correctAnswer} (${q.score} điểm)\n`;
    });

  text += `\n2. HƯỚNG DẪN CHẤM VÀ GIẢI CHI TIẾT:\n\n`;
  questions.forEach((q, idx) => {
    text += `Câu ${idx + 1}: [${q.score} điểm]\n`;
    text += `Nội dung: ${q.question}\n`;
    text += `Đáp án: ${q.correctAnswer}\n`;
    text += `Lời giải chi tiết: ${q.explanation}\n\n`;
  });

  return text;
}

export function formatMatrixAsText(exam: ExamData): string {
  let text = `MA TRẬN ĐỀ KIỂM TRA MÔN ${exam.subject.toUpperCase()} - ${exam.grade.toUpperCase()}\n`;
  text += `Thời gian: ${exam.durationMinutes} phút - Tổng điểm: ${exam.totalScore} điểm\n`;
  text += `=========================================================================\n`;
  text += `Chủ đề / Đơn vị kiến thức | Nhận biết | Thông hiểu | Vận dụng | Tổng cộng\n`;
  text += `-------------------------------------------------------------------------\n`;

  exam.matrix.rows.forEach((row) => {
    text += `${row.topicName.padEnd(25)} | ${row.nhanBiet.count}c (${row.nhanBiet.points}đ) | ${row.thongHieu.count}c (${row.thongHieu.points}đ) | ${row.vanDung.count}c (${row.vanDung.points}đ) | ${row.total.count}c (${row.total.points}đ)\n`;
  });

  text += `-------------------------------------------------------------------------\n`;
  const m = exam.matrix;
  text += `TỔNG SỐ CÂU: ${m.totalQuestions} câu\n`;
  text += `TỔNG ĐIỂM: ${m.totalPoints} điểm\n`;
  text += `TỶ LỆ MỨC ĐỘ: Nhận biết ${m.nhanBietSummary.percent}% - Thông hiểu ${m.thongHieuSummary.percent}% - Vận dụng ${m.vanDungSummary.percent}%\n`;
  return text;
}

export function downloadWordDocument(exam: ExamData, type: 'exam' | 'solution' | 'matrix'): void {
  let contentHtml = '';
  let filename = `${exam.subject}_${exam.grade}_${type}.doc`;

  if (type === 'exam') {
    const text = formatExamAsText(exam);
    contentHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${exam.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; margin: 20mm; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td { vertical-align: top; }
        .title { text-align: center; font-weight: bold; font-size: 14pt; margin: 15px 0; }
        .question { margin-bottom: 12px; }
        .options { margin-left: 20px; }
      </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td style="width: 50%; text-align: center;">
              <b>SỞ GDĐT TỈNH ĐỒNG THÁP</b><br>
              <b>TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU</b><br>
              <i>(Điểm Đốc Binh Kiều • Điểm Tân Kiều)</i><br>
              Tổ Chuyên Môn
            </td>
            <td style="width: 50%; text-align: center;">
              <b>KIỂM TRA ĐỊNH KỲ</b><br>
              Năm học: 2026 - 2027<br>
              <i>(Theo KH số 39 & CV 471/SGDĐT)</i>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; padding-top: 15px;">
              <div class="title">${exam.title.toUpperCase()}</div>
              <div><b>Môn: ${exam.subject} - Lớp: ${exam.grade}</b></div>
              <div><i>Thời gian làm bài: ${exam.durationMinutes} phút (không kể thời gian phát đề)</i></div>
              <div><b>Mã đề thi: ${exam.selectedVariantCode}</b></div>
            </td>
          </tr>
        </table>
        <hr style="border: 0.5px solid #000; margin-bottom: 15px;">
        <pre style="font-family: 'Times New Roman', serif; font-size: 13pt; white-space: pre-wrap;">${text.split('------------------------------------------------------------')[2] || text}</pre>
      </body>
      </html>
    `;
  } else if (type === 'solution') {
    const text = formatAnswerKeyAsText(exam);
    contentHtml = `
      <html><head><meta charset='utf-8'></head>
      <body style="font-family: 'Times New Roman'; font-size: 13pt; line-height: 1.4; margin: 20mm;">
        <h2 style="text-align: center;">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM</h2>
        <h3 style="text-align: center;">${exam.title} - Môn: ${exam.subject} (${exam.grade})</h3>
        <pre style="font-family: 'Times New Roman', serif; font-size: 13pt; white-space: pre-wrap;">${text}</pre>
      </body></html>
    `;
  } else {
    const text = formatMatrixAsText(exam);
    contentHtml = `
      <html><head><meta charset='utf-8'></head>
      <body style="font-family: 'Times New Roman'; font-size: 13pt; margin: 20mm;">
        <h2 style="text-align: center;">MA TRẬN ĐỀ KIỂM TRA</h2>
        <pre style="font-family: 'Times New Roman', serif; font-size: 13pt; white-space: pre-wrap;">${text}</pre>
      </body></html>
    `;
  }

  const blob = new Blob(['\ufeff', contentHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
