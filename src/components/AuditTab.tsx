import React from 'react';
import { QualityAuditItem } from '../types/exam';
import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface AuditTabProps {
  auditChecks: QualityAuditItem[];
  onReaudit: () => void;
  isAuditing?: boolean;
}

export const AuditTab: React.FC<AuditTabProps> = ({ auditChecks, onReaudit, isAuditing }) => {
  const allPassed = auditChecks.every((c) => c.passed);
  const passedCount = auditChecks.filter((c) => c.passed).length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                allPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase">
                HỆ THỐNG KIỂM TRA CHẤT LƯỢNG HỌC THUẬT (12 TIÊU CHÍ)
              </h2>
              <p className="text-xs text-slate-500">
                Tự động kiểm định tính chuẩn xác theo chuẩn khảo thí Bộ GD&ĐT
              </p>
            </div>
          </div>

          <button
            onClick={onReaudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Chạy kiểm định lại</span>
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            allPassed
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          {allPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div className="text-xs">
            <div className="font-bold text-sm">
              {allPassed
                ? 'ĐẠT 100% TIÊU CHUẨN KHẢO THÍ SƯ PHẠM'
                : `ĐÃ KIỂM ĐỊNH: ${passedCount}/12 TIÊU CHÍ ĐẠT YÊU CẦU`}
            </div>
            <div className="text-slate-600 mt-0.5">
              Đề thi đã được rà soát đối sánh với ma trận, số câu, tổng điểm, độ khó và tính khả thi của các bài toán.
            </div>
          </div>
        </div>

        {/* 12 Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {auditChecks.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                item.passed
                  ? 'border-slate-200 bg-white hover:border-slate-300'
                  : 'border-amber-300 bg-amber-50/30'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>
                    {item.id}. {item.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      item.passed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.passed ? 'ĐẠT' : 'CẦN CHÚ Ý'}
                  </span>
                </div>
                <div className="text-slate-600 mt-1 leading-relaxed">
                  {item.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
