import React from 'react';
import { BookOpen, Sparkles, FolderArchive, Database, RotateCcw, Trash2, FileSpreadsheet, HelpCircle, KeyRound, Crown } from 'lucide-react';

interface HeaderProps {
  onOpenQuestionBank: () => void;
  onOpenSavedExams: () => void;
  onOpenMatrixImport: () => void;
  onOpenGuide: () => void;
  onOpenApiKey: () => void;
  hasCustomApiKey: boolean;
  isAdmin?: boolean;
  onRestoreConfig: () => void;
  onResetConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuestionBank,
  onOpenSavedExams,
  onOpenMatrixImport,
  onOpenGuide,
  onOpenApiKey,
  hasCustomApiKey,
  isAdmin = false,
  onRestoreConfig,
  onResetConfig,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  SỞ GDĐT ĐỒNG THÁP • TRƯỜNG THCS VÀ THPT ĐỐC BINH KIỀU
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5" /> CV 471 / SGDĐT
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                RA ĐỀ KIỂM TRA, ĐÁNH GIÁ ĐỊNH KỲ AI – 2 CẤP
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Năm học 2026 - 2027 • Điểm Đốc Binh Kiều & Điểm Tân Kiều • SGK Kết nối tri thức
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

            {isAdmin ? (
              <button
                onClick={onOpenApiKey}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 shadow-xs transition-colors"
                title="Quyền Tác giả website: Miễn phí, dùng trực tiếp máy chủ không cần API key"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>👑 Quản trị viên (Tác giả)</span>
              </button>
            ) : hasCustomApiKey ? (
              <button
                onClick={onOpenApiKey}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 shadow-xs transition-colors"
                title="Đang sử dụng Google Gemini API Key cá nhân của bạn"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>🔑 API Key cá nhân</span>
              </button>
            ) : (
              <button
                onClick={onOpenApiKey}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-red-300 bg-red-50 text-red-800 hover:bg-red-100 animate-pulse transition-colors"
                title="Chưa mở khóa! Bấm để nhập API Key hoặc Mật khẩu Quản trị"
              >
                <KeyRound className="w-3.5 h-3.5 text-red-600" />
                <span>⚠️ Nhập Key / Mật khẩu</span>
              </button>
            )}

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
