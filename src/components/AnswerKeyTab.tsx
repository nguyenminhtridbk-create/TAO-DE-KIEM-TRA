import React from 'react';
import { ExamData } from '../types/exam';

interface AnswerKeyTabProps {
  exam: ExamData;
}

export const AnswerKeyTab: React.FC<AnswerKeyTabProps> = ({ exam }) => {
  const currentVariant =
    exam.variants.find((v) => v.code === exam.selectedVariantCode) || exam.variants[0];
  const questions = currentVariant ? currentVariant.questions : exam.questions;

  const mcqQuestions = questions.filter((q) => !q.questionType.startsWith('essay'));
  const essayQuestions = questions.filter((q) => q.questionType.startsWith('essay'));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="border-b border-slate-200 pb-3 mb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase">
            BẢNG ĐÁP ÁN VÀ THANG ĐIỂM — MÃ ĐỀ: {exam.selectedVariantCode || '101'}
          </h2>
          <p className="text-xs text-slate-500">
            Môn: {exam.subject} • Lớp: {exam.grade} • Thời gian: {exam.durationMinutes} phút
          </p>
        </div>

        {/* 1. Multiple Choice Table */}
        {mcqQuestions.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Bảng đáp án trắc nghiệm
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-4 font-bold w-16 text-center border-r border-slate-200">
                      Câu
                    </th>
                    <th className="py-2.5 px-4 font-bold text-center border-r border-slate-200">
                      Đáp án đúng
                    </th>
                    <th className="py-2.5 px-4 font-bold text-center border-r border-slate-200">
                      Điểm
                    </th>
                    <th className="py-2.5 px-4 font-bold">
                      Gợi ý / Tóm tắt giải
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mcqQuestions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-bold text-slate-900 text-center border-r border-slate-200 bg-slate-50/30">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-4 text-center font-bold text-emerald-700 border-r border-slate-200">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                          {q.correctAnswer}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center font-semibold text-blue-700 border-r border-slate-200">
                        {q.score}đ
                      </td>
                      <td className="py-2 px-4 text-slate-600 line-clamp-2">
                        {q.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Essay Questions & Detailed Solutions */}
        {essayQuestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Hướng dẫn giải chi tiết phần tự luận
            </h3>
            <div className="space-y-4">
              {essayQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Câu {mcqQuestions.length + idx + 1} ({q.score} điểm)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Mức độ: {q.level === 'nhan_biet' ? 'Nhận biết' : q.level === 'thong_hieu' ? 'Thông hiểu' : 'Vận dụng'}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong>Đề bài:</strong> {q.question}
                  </div>

                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-emerald-800">Đáp án / Lời giải chi tiết:</div>
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                      {q.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
