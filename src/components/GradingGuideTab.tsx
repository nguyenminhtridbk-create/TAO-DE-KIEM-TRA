import React from 'react';
import { ExamData } from '../types/exam';
import { CheckSquare, AlertCircle, FileText } from 'lucide-react';

interface GradingGuideTabProps {
  exam: ExamData;
}

export const GradingGuideTab: React.FC<GradingGuideTabProps> = ({ exam }) => {
  const currentVariant =
    exam.variants.find((v) => v.code === exam.selectedVariantCode) || exam.variants[0];
  const questions = currentVariant ? currentVariant.questions : exam.questions;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-bold text-slate-900 uppercase">
            HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT
          </h2>
          <p className="text-xs text-slate-500">
            {exam.title} • Thang điểm chuẩn: {exam.totalScore} điểm
          </p>
        </div>

        {/* Nguyên tắc chung khi chấm thi */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
          <div className="font-bold text-blue-900 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-700" />
            <span>NGUYÊN TẮC CHẤM BÀI CHUNG:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
            <li>
              <strong>Phần trắc nghiệm:</strong> Chấm theo đáp án chuẩn đã công bố. Thí sinh chọn đúng phương án nào thì được điểm phương án đó theo barem.
            </li>
            <li>
              <strong>Phần tự luận:</strong> Giám khảo chấm đúng các bước lập luận, biến đổi toán học hoặc luận điểm văn học. Học sinh có cách giải khác đúng vẫn cho điểm tối đa.
            </li>
            <li>
              <strong>Sai đơn vị / thiếu điều kiện:</strong> Trừ từ 0.25 điểm cho mỗi lỗi hoặc theo quy chế của tổ chuyên môn.
            </li>
            <li>
              Điểm toàn bài là tổng điểm các câu thành phần, làm tròn đến 0.25 điểm hoặc theo quy định hiện hành của Bộ GD&ĐT.
            </li>
          </ul>
        </div>

        {/* Barem điểm chi tiết từng câu */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Biểu điểm thành phần chi tiết từng câu
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold text-center w-16 border-r border-slate-200">
                    Câu
                  </th>
                  <th className="py-2.5 px-4 font-bold border-r border-slate-200">
                    Nội dung yêu cầu cần đạt & Các bước giải
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center w-24 border-r border-slate-200">
                    Điểm thành phần
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center w-24">
                    Tổng điểm câu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900 text-center border-r border-slate-200 bg-slate-50/30">
                      Câu {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 border-r border-slate-200 space-y-1.5">
                      <div className="font-semibold text-slate-900">
                        {q.question.length > 100 ? `${q.question.slice(0, 100)}...` : q.question}
                      </div>
                      <div className="text-slate-600">
                        <strong>Đáp án:</strong> {q.correctAnswer}
                      </div>
                      <div className="text-slate-500 italic text-[11px]">
                        <strong>Hướng dẫn:</strong> {q.explanation}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 font-medium text-slate-700">
                      {q.questionType.startsWith('essay') ? `${(q.score / 2).toFixed(2)}đ + ${(q.score / 2).toFixed(2)}đ` : `${q.score}đ`}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-700 bg-slate-50/20">
                      {q.score}đ
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 font-bold text-blue-900 border-t border-slate-200">
                  <td colSpan={3} className="py-2.5 px-4 text-right">
                    TỔNG ĐIỂM TOÀN BÀI:
                  </td>
                  <td className="py-2.5 px-3 text-center text-sm font-extrabold text-blue-700">
                    {exam.totalScore}đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
