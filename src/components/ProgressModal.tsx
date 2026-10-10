import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  currentStepIndex: number;
  isComplete: boolean;
  onClose: () => void;
}

export const STEPS = [
  'Đang phân tích yêu cầu...',
  'Đang xây dựng ma trận...',
  'Đang tạo câu hỏi...',
  'Đang kiểm tra đáp án...',
  'Đang hoàn thiện đề...',
];

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  currentStepIndex,
  isComplete,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Top Icon */}
        <div className="flex justify-center">
          {isComplete ? (
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 relative">
              <Sparkles className="w-8 h-8 animate-pulse text-blue-600" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        {/* Status text */}
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isComplete ? '✅ Đề đã được tạo và kiểm tra.' : 'Hệ thống AI đang khởi tạo đề thi'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isComplete
              ? 'Tất cả câu hỏi, ma trận và barem chấm đã sẵn sàng.'
              : 'Quy trình kiểm định và tối ưu học thuật đang được thực thi.'}
          </p>
        </div>

        {/* Step progress list */}
        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
          {STEPS.map((step, idx) => {
            const isDone = isComplete || idx < currentStepIndex;
            const isCurrent = !isComplete && idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-colors ${
                  isDone
                    ? 'text-emerald-700 font-semibold'
                    : isCurrent
                    ? 'text-blue-700 font-bold'
                    : 'text-slate-400 font-normal'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Xem kết quả đề thi
          </button>
        )}
      </div>
    </div>
  );
};
