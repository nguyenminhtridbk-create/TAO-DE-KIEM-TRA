import React from 'react';
import { ExamData } from '../types/exam';

interface SpecificationTabProps {
  exam: ExamData;
}

export const SpecificationTab: React.FC<SpecificationTabProps> = ({ exam }) => {
  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case 'nhan_biet':
        return 'Nhận biết';
      case 'thong_hieu':
        return 'Thông hiểu';
      case 'van_dung':
        return 'Vận dụng';
      default:
        return 'Vận dụng';
    }
  };

  const getFormatLabel = (fmt: string) => {
    if (fmt === 'multiple_choice_4') return 'Trắc nghiệm 4 lựa chọn';
    if (fmt === 'true_false') return 'Trắc nghiệm Đúng/Sai';
    if (fmt === 'short_answer') return 'Trả lời ngắn';
    if (fmt.startsWith('essay')) return 'Tự luận';
    return fmt;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-bold text-slate-900 uppercase">
            BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ (CHUẨN GDPT 2018)
          </h2>
          <p className="text-xs text-slate-500">
            Môn: {exam.subject} • Khối {exam.grade} • Thời gian: {exam.durationMinutes} phút
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">
                  TT
                </th>
                <th className="py-2.5 px-3 border-r border-slate-300 min-w-[120px]">
                  Chủ đề
                </th>
                <th className="py-2.5 px-3 border-r border-slate-300 min-w-[130px]">
                  Đơn vị kiến thức
                </th>
                <th className="py-2.5 px-4 border-r border-slate-300 min-w-[240px]">
                  Mức độ đánh giá / Yêu cầu cần đạt
                </th>
                <th className="py-2.5 px-3 border-r border-slate-300 text-center min-w-[100px]">
                  Mức độ
                </th>
                <th className="py-2.5 px-3 border-r border-slate-300 min-w-[130px]">
                  Dạng câu hỏi
                </th>
                <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16">
                  Số câu
                </th>
                <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">
                  Câu số
                </th>
                <th className="py-2.5 px-3 text-center w-16 bg-blue-50/50">
                  Điểm
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exam.specifications.map((spec, sIdx) => (
                <tr key={spec.id || sIdx} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold bg-slate-50/30">
                    {sIdx + 1}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-slate-900">
                    {spec.topic}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700">
                    {spec.knowledgeUnit}
                  </td>
                  <td className="py-2.5 px-4 border-r border-slate-200 text-slate-700 leading-relaxed">
                    {spec.learningOutcome}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center font-medium">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 border border-slate-200">
                      {getLevelLabel(spec.level)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-800 font-medium">
                    {getFormatLabel(spec.questionType)}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-blue-700">
                    {spec.count}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center text-slate-600 text-[11px]">
                    {spec.questionIds.join(', ')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-blue-900 bg-blue-50/30">
                    {spec.score}đ
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                <td colSpan={6} className="py-2.5 px-4 text-right border-r border-slate-300 uppercase">
                  TỔNG CỘNG:
                </td>
                <td className="py-2.5 px-3 text-center border-r border-slate-300 text-blue-900">
                  {exam.questions.length} câu
                </td>
                <td className="border-r border-slate-300"></td>
                <td className="py-2.5 px-3 text-center bg-blue-100 text-blue-950 text-sm">
                  {exam.totalScore}đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
