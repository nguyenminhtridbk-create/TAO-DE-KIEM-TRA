import React from 'react';
import { ExamData } from '../types/exam';
import { FolderArchive, X, Clock, Trash2, ArrowRight, Download } from 'lucide-react';
import { downloadWordDocument } from '../utils/exportUtils';

interface SavedExamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedExams: ExamData[];
  onLoadExam: (exam: ExamData) => void;
  onDeleteExam: (id: string) => void;
}

export const SavedExamsModal: React.FC<SavedExamsModalProps> = ({
  isOpen,
  onClose,
  savedExams,
  onLoadExam,
  onDeleteExam,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                Danh sách đề thi đã lưu
              </h2>
              <p className="text-xs text-slate-500">
                Các bộ đề kiểm tra, ma trận và barem chấm đã được lưu lại
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedExams.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có đề thi nào được lưu.
              <div className="mt-1 text-slate-500">
                Nhấn nút &ldquo;Lưu đề&rdquo; ở thanh công cụ sau khi tạo để lưu trữ vào đây.
              </div>
            </div>
          ) : (
            savedExams.map((exam) => (
              <div
                key={exam.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 shadow-2xs flex items-center justify-between gap-4 transition-all"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 truncate">
                    {exam.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>
                      {exam.subject} • {exam.grade}
                    </span>
                    <span>•</span>
                    <span>{exam.questions.length} câu</span>
                    <span>•</span>
                    <span>{exam.durationMinutes} phút</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Lưu ngày: {new Date(exam.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadWordDocument(exam, 'exam')}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Xuất file Word (.doc)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa đề này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onLoadExam(exam);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Mở đề</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
