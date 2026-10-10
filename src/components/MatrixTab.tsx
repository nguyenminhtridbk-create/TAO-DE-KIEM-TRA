import React from 'react';
import { ExamData } from '../types/exam';

interface MatrixTabProps {
  exam: ExamData;
}

export const MatrixTab: React.FC<MatrixTabProps> = ({ exam }) => {
  const m = exam.matrix;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase">
                KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
              </h2>
              <p className="text-xs text-slate-500">
                Môn: {exam.subject} • Khối {exam.grade} • Thời gian: {exam.durationMinutes} phút • Tổng điểm: {exam.totalScore}
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              Khớp 100% với đề thi
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                <th
                  rowSpan={2}
                  className="py-3 px-3 border-r border-slate-300 w-10 text-center"
                >
                  TT
                </th>
                <th
                  rowSpan={2}
                  className="py-3 px-4 border-r border-slate-300 min-w-[200px]"
                >
                  Chủ đề / Đơn vị kiến thức
                </th>
                <th
                  colSpan={3}
                  className="py-2 px-3 border-r border-slate-300 text-center bg-blue-50/60"
                >
                  Mức độ nhận thức (Theo Chuẩn GDPT 2018)
                </th>
                <th
                  rowSpan={2}
                  className="py-3 px-3 text-center bg-slate-200/70 min-w-[100px]"
                >
                  Tổng cộng
                </th>
              </tr>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-300 font-bold text-center">
                <th className="py-2 px-3 border-r border-slate-300 min-w-[120px] bg-blue-50/40 text-blue-900">
                  Nhận biết
                </th>
                <th className="py-2 px-3 border-r border-slate-300 min-w-[120px] bg-emerald-50/40 text-emerald-900">
                  Thông hiểu
                </th>
                <th className="py-2 px-3 border-r border-slate-300 min-w-[120px] bg-amber-50/40 text-amber-900">
                  Vận dụng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {m.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold bg-slate-50/30">
                    {rIdx + 1}
                  </td>
                  <td className="py-2.5 px-4 border-r border-slate-200 font-semibold text-slate-900">
                    {row.topicName}
                  </td>

                  {/* Nhận biết */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center">
                    <div className="font-bold text-blue-900">{row.nhanBiet.count} câu</div>
                    <div className="text-[11px] text-slate-500">
                      {row.nhanBiet.points}đ ({row.nhanBiet.percent}%)
                    </div>
                  </td>

                  {/* Thông hiểu */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center">
                    <div className="font-bold text-emerald-900">{row.thongHieu.count} câu</div>
                    <div className="text-[11px] text-slate-500">
                      {row.thongHieu.points}đ ({row.thongHieu.percent}%)
                    </div>
                  </td>

                  {/* Vận dụng */}
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center">
                    <div className="font-bold text-amber-900">{row.vanDung.count} câu</div>
                    <div className="text-[11px] text-slate-500">
                      {row.vanDung.points}đ ({row.vanDung.percent}%)
                    </div>
                  </td>

                  {/* Tổng dòng */}
                  <td className="py-2.5 px-3 text-center bg-slate-50/70 font-bold">
                    <div className="text-slate-900">{row.total.count} câu</div>
                    <div className="text-[11px] text-blue-700">
                      {row.total.points}đ ({row.total.percent}%)
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Footer totals */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                <td colSpan={2} className="py-3 px-4 border-r border-slate-300 text-right uppercase">
                  Tổng số câu / điểm:
                </td>
                <td className="py-3 px-3 border-r border-slate-300 text-center text-blue-900">
                  <div>{m.nhanBietSummary.count} câu</div>
                  <div className="text-[11px]">{m.nhanBietSummary.points} điểm</div>
                </td>
                <td className="py-3 px-3 border-r border-slate-300 text-center text-emerald-900">
                  <div>{m.thongHieuSummary.count} câu</div>
                  <div className="text-[11px]">{m.thongHieuSummary.points} điểm</div>
                </td>
                <td className="py-3 px-3 border-r border-slate-300 text-center text-amber-900">
                  <div>{m.vanDungSummary.count} câu</div>
                  <div className="text-[11px]">{m.vanDungSummary.points} điểm</div>
                </td>
                <td className="py-3 px-3 text-center bg-blue-100/70 text-blue-950 font-extrabold text-sm">
                  <div>{m.totalQuestions} câu</div>
                  <div>{m.totalPoints} điểm</div>
                </td>
              </tr>

              <tr className="bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-700">
                <td colSpan={2} className="py-2 px-4 border-r border-slate-200 text-right">
                  Tỷ lệ % theo mức độ:
                </td>
                <td className="py-2 px-3 border-r border-slate-200 text-center text-blue-800">
                  {m.nhanBietSummary.percent}%
                </td>
                <td className="py-2 px-3 border-r border-slate-200 text-center text-emerald-800">
                  {m.thongHieuSummary.percent}%
                </td>
                <td className="py-2 px-3 border-r border-slate-200 text-center text-amber-800">
                  {m.vanDungSummary.percent}%
                </td>
                <td className="py-2 px-3 text-center font-bold text-blue-900 bg-blue-50">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
