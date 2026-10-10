import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, ExternalLink, Trash2, Check, RefreshCw, X, ShieldCheck, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userApiKey: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  userApiKey,
  onSaveApiKey,
  onClearApiKey,
}) => {
  const [inputKey, setInputKey] = useState(userApiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Vui lòng nhập API key trước khi kiểm tra.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/exam/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': inputKey.trim(),
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || 'Kết nối thành công! Khóa API sẵn sàng hoạt động.',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Khóa API không hợp lệ hoặc đã chạm hạn mức.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Lỗi kết nối máy chủ: ' + (err.message || 'Không thể kiểm tra API key'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    setTestResult(null);
    onClearApiKey();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                Cấu hình API Key Gemini AI
              </h2>
              <p className="text-xs text-slate-500">
                Lựa chọn chế độ dùng chung máy chủ hoặc dùng API Key cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Giải thích rõ ràng cho câu hỏi của thầy */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Người lạ vào web có tự tạo đề được không?</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              • <strong>Có thể tạo ngay:</strong> Khi thầy/cô đã cấu hình biến <code className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> trên Vercel hoặc máy chủ, bất kỳ giáo viên hay học sinh nào truy cập cũng có thể bấm <strong>&ldquo;TẠO ĐỀ KIỂM TRA&rdquo;</strong> ngay mà <em>không cần phải nhập bất kỳ API key nào</em>.
            </p>
            <p className="text-slate-700 leading-relaxed">
              • <strong>Khi nào nên dùng API Key cá nhân?</strong> Vì tài khoản Google Gemini Free bị giới hạn tốc độ (15 lượt gọi/phút), nếu nhiều người cùng tạo đề một lúc sẽ dễ bị nghẽn. Khi đó, thầy/cô có thể tự nhập API key cá nhân của mình vào ô bên dưới để dùng hạn mức riêng biệt 100% miễn phí!
            </p>
          </div>

          {/* Form nhập key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <span>Google Gemini API Key cá nhân của bạn:</span>
                {userApiKey && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Đang sử dụng Key riêng
                  </span>
                )}
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
              >
                <span>Lấy key miễn phí (Google AI Studio)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-24"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting || !inputKey.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {isTesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Kiểm tra</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-500 italic">
              * Khóa API chỉ được lưu trong bộ nhớ trình duyệt riêng của thầy/cô (Local Storage) và không bị chia sẻ cho bất kỳ ai khác.
            </p>
          </div>

          {/* Hướng dẫn 3 bước lấy API key */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cách lấy API Key miễn phí từ Google AI Studio (30 giây):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>Truy cập <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">aistudio.google.com/apikey</a> bằng tài khoản Google.</li>
              <li>Bấm nút <strong>&ldquo;Create API key&rdquo;</strong> (Tạo khóa API mới).</li>
              <li>Sao chép khóa (bắt đầu bằng <code>AIzaSy...</code>) và dán vào ô trên, sau đó bấm <strong>&ldquo;Lưu API Key&rdquo;</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {userApiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa key cá nhân (Dùng mặc định)</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 rounded-lg transition-colors font-medium"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu API Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
