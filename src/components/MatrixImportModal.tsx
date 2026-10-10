import React, { useState } from 'react';
import { FileSpreadsheet, X, Sparkles, Upload } from 'lucide-react';

interface MatrixImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedMatrix: (parsed: any, rawText: string) => void;
  subject: string;
  grade: string;
}

export const MatrixImportModal: React.FC<MatrixImportModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedMatrix,
  subject,
  grade,
}) => {
  const [matrixText, setMatrixText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setMatrixText(text);
    };
    reader.readAsText(file);
  };

  const handleParseAndApply = async () => {
    if (!matrixText.trim()) return;
    setIsParsing(true);
    try {
      const response = await fetch('/api/exam/parse-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matrixText,
          subject,
          grade,
        }),
      });
      const data = await response.json();
      onApplyParsedMatrix(data.parsed || {}, matrixText);
      onClose();
    } catch (err) {
      console.error(err);
      // Fallback
      onApplyParsedMatrix({}, matrixText);
      onClose();
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                Tải ma trận / Bản đặc tả có sẵn
              </h2>
              <p className="text-xs text-slate-500">
                AI sẽ đọc cấu trúc ma trận của thầy/cô và tạo đề chuẩn theo đúng tỷ lệ
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

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                Dán bảng ma trận hoặc đặc tả nội dung:
              </label>
              <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Tải tệp văn bản</span>
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={8}
              value={matrixText}
              onChange={(e) => setMatrixText(e.target.value)}
              placeholder={`Ví dụ copy từ Word hoặc bảng ma trận:\nChương 1: 4 câu nhận biết (1đ), 2 câu thông hiểu (0.5đ), 1 câu vận dụng (1đ)\nChương 2: 6 câu trắc nghiệm (1.5đ), 1 câu tự luận (2đ)...`}
              className="w-full p-3 border border-slate-300 rounded-xl font-mono text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-slate-700 space-y-1">
            <div className="font-bold text-blue-900">Cam kết bảo toàn ma trận:</div>
            <div>
              Hệ thống sẽ giữ nguyên tuyệt đối số câu, thang điểm và tỷ lệ các mức độ nhận thức (Nhận biết - Thông hiểu - Vận dụng) như thầy/cô đã định sẵn, không tự ý thêm bớt.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            Đóng
          </button>
          <button
            onClick={handleParseAndApply}
            disabled={isParsing || !matrixText.trim()}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs disabled:bg-slate-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isParsing ? 'Đang đọc ma trận...' : 'Đọc & Áp dụng ma trận'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
