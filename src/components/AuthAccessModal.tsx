import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Crown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  X,
  LogOut,
  RefreshCw,
  Lock,
  UserCheck,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface AuthAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  userApiKey: string;
  onLoginAdmin: (password: string) => Promise<boolean>;
  onSaveApiKey: (key: string) => Promise<boolean>;
  onLogoutAuth: () => void;
}

export const AuthAccessModal: React.FC<AuthAccessModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  userApiKey,
  onLoginAdmin,
  onSaveApiKey,
  onLogoutAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'guest'>(isAdmin ? 'admin' : userApiKey ? 'guest' : 'admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(userApiKey || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const isUnlocked = isAdmin || (userApiKey && userApiKey.trim().length > 10);

  const handleAdminSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adminPasswordInput.trim()) {
      setFeedback({ success: false, message: 'Vui lòng nhập mật khẩu quản trị!' });
      return;
    }

    setIsVerifying(true);
    setFeedback(null);

    const ok = await onLoginAdmin(adminPasswordInput.trim());
    setIsVerifying(false);

    if (ok) {
      setFeedback({
        success: true,
        message: '👑 Xác thực Quản trị viên thành công! Bạn không cần nhập API key cá nhân.',
      });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setFeedback({
        success: false,
        message: 'Mật khẩu quản trị không đúng. Vui lòng kiểm tra lại!',
      });
    }
  };

  const handleApiKeySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!apiKeyInput.trim()) {
      setFeedback({ success: false, message: 'Vui lòng nhập Google Gemini API Key!' });
      return;
    }

    setIsVerifying(true);
    setFeedback(null);

    const ok = await onSaveApiKey(apiKeyInput.trim());
    setIsVerifying(false);

    if (ok) {
      setFeedback({
        success: true,
        message: '🔑 Khóa API Gemini hợp lệ và đã lưu thành công vào trình duyệt!',
      });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setFeedback({
        success: false,
        message: 'Khóa API không hợp lệ hoặc không có quyền truy cập Gemini API.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800 border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-xs">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight">
                  Xác thực quyền truy cập website
                </h2>
                {isUnlocked && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase">
                    Đã mở khóa
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Dành cho Tác giả website (Quản trị viên) hoặc Người dùng khách (Giáo viên)
              </p>
            </div>
          </div>
          {isUnlocked && (
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Status Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Trạng thái hiện tại:</span>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>👑 Quản trị viên / Tác giả website (Miễn phí)</span>
              </span>
            ) : userApiKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>🔑 API Key cá nhân ({userApiKey.slice(0, 4)}...{userApiKey.slice(-4)})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>⚠️ Chưa xác thực (Chưa mở khóa tạo đề)</span>
              </span>
            )}
          </div>

          {isUnlocked && (
            <button
              type="button"
              onClick={() => {
                onLogoutAuth();
                setAdminPasswordInput('');
                setApiKeyInput('');
                setFeedback({ success: true, message: 'Đã đăng xuất. Vui lòng chọn phương thức xác thực mới.' });
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors"
              title="Xóa thông tin đăng nhập và khóa lại hệ thống"
            >
              <LogOut className="w-3 h-3 text-red-500" />
              <span>Đăng xuất / Đổi</span>
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setFeedback(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Crown className={`w-4 h-4 ${activeTab === 'admin' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>Tôi là Tác giả website (Quản trị viên)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('guest');
              setFeedback(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'guest'
                ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <KeyRound className={`w-4 h-4 ${activeTab === 'guest' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Tôi là Giáo viên / Khách (Nhập API Key)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="font-semibold leading-relaxed">{feedback.message}</div>
            </div>
          )}

          {activeTab === 'admin' ? (
            /* TAB 1: ADMIN */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-xs text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Quyền lợi dành cho Tác giả website:</span>
                </div>
                <p className="leading-relaxed text-amber-900/90">
                  • <strong>Không cần nhập API Key cá nhân:</strong> Hệ thống sử dụng trực tiếp tài nguyên máy chủ để tạo đề.<br />
                  • Chỉ cần điền mật khẩu quản trị một lần, hệ thống sẽ tự động ghi nhớ trên trình duyệt này.<br />
                  • Mật khẩu quản trị được bảo vệ an toàn trên hệ thống.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu Quản trị viên (Admin Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Nhập mật khẩu quản trị..."
                    className="w-full text-sm px-3.5 py-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang kiểm tra mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Xác nhận & Mở khóa Quyền Tác giả</span>
                    </>
                  )}
                </button>
                {isUnlocked && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* TAB 2: GUEST / TEACHER */
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-1.5 text-xs text-blue-950">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Vì sao người dùng khách cần điền API Key?</span>
                </div>
                <p className="leading-relaxed text-blue-900/90">
                  • Do tài khoản miễn phí của máy chủ có giới hạn số lượt (15 yêu cầu/phút), để tránh bị quá tải khi nhiều người cùng dùng, mỗi thầy/cô điền <strong>API Key Gemini miễn phí</strong> của riêng mình.<br />
                  • <strong>An toàn 100%:</strong> API Key chỉ lưu trong trình duyệt của bạn (localStorage), không bị lộ ra ngoài.<br />
                  • Tạo đề thi tốc độ cao, không bao giờ bị giới hạn bởi người dùng khác.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Google Gemini API Key (Bắt đầu bằng &ldquo;AIza...&rdquo;)
                  </label>
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <span>Lấy Key miễn phí tại đây</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Dán API Key của bạn (ví dụ: AIzaSy...)"
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Instructions on how to get API Key */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cách lấy API Key miễn phí từ Google (Chỉ mất 1 phút):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-700">
                  <li>
                    Truy cập trang:{' '}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 underline"
                    >
                      aistudio.google.com/apikey
                    </a>{' '}
                    (Đăng nhập bằng tài khoản Gmail của thầy/cô).
                  </li>
                  <li>Bấm nút xanh <strong>&ldquo;Create API key&rdquo;</strong> (Tạo khóa API).</li>
                  <li>Sao chép mã khóa (bắt đầu bằng <em>AIzaSy...</em>) và dán vào ô bên trên rồi bấm Lưu.</li>
                </ol>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang kiểm tra & kích hoạt Key...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Lưu & Kích hoạt API Key</span>
                    </>
                  )}
                </button>
                {isUnlocked && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
