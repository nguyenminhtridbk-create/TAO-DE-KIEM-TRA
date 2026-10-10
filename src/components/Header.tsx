import React from 'react';
import { BookOpen, Sparkles, FolderArchive, Database, RotateCcw, Trash2, FileSpreadsheet, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenQuestionBank: () => void;
  onOpenSavedExams: () => void;
  onOpenMatrixImport: () => void;
  onOpenGuide: () => void;
  onRestoreConfig: () => void;
  onResetConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuestionBank,
  onOpenSavedExams,
  onOpenMatrixImport,
  onOpenGuide,
  onRestoreConfig,
  onResetConfig,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  RA ĐỀ KIỂM TRA AI – 2 CẤP
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3" /> GDPT 2018
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                THCS • THPT • Áp dụng cho mọi môn học
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              title="Xem hướng dẫn sử dụng nhanh"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Hướng dẫn</span>
            </button>

            <button
              onClick={onOpenMatrixImport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Nhập ma trận / bản đặc tả có sẵn"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>Tải ma trận/đặc tả</span>
            </button>

            <button
              onClick={onOpenQuestionBank}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Quản lý ngân hàng câu hỏi"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ngân hàng câu hỏi</span>
            </button>

            <button
              onClick={onOpenSavedExams}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Xem danh sách đề đã lưu"
            >
              <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
              <span>Đề đã lưu</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={onRestoreConfig}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Khôi phục cấu hình gần nhất từ bộ nhớ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Khôi phục</span>
            </button>

            <button
              onClick={onResetConfig}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Xóa toàn bộ cấu hình về mặc định"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Đặt lại</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
