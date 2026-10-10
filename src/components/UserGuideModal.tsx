import React from 'react';
import { HelpCircle, X, CheckCircle2, Zap, Printer, Copy, FileText, Layers, ShieldCheck } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                Hướng dẫn sử dụng nhanh (Chỉ 3 bước)
              </h2>
              <p className="text-xs text-slate-500">
                Quy trình tạo đề thi chuẩn Bộ GD&ĐT cho giáo viên THCS & THPT
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

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Bước 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-100 bg-blue-50/30">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm text-blue-950">
                Bước 1: Chọn Môn & Lớp (Cột bên trái)
              </div>
              <p className="text-slate-600 leading-relaxed">
                • Bấm chọn cấp <strong>THCS</strong> (Lớp 6-9) hoặc <strong>THPT</strong> (Lớp 10-12).<br />
                • Chọn khối lớp và bấm vào tên môn học (Toán, Văn, Anh, Lý, Hóa, Sinh, Sử, Địa...). Nếu dạy môn khác, bấm <em>&ldquo;+ Nhập môn học khác&rdquo;</em>.
              </p>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm text-emerald-950">
                Bước 2: Chọn mẫu đề nhanh hoặc chỉnh số câu
              </div>
              <p className="text-slate-600 leading-relaxed">
                • <strong>Mẹo nhanh nhất:</strong> Bấm vào một trong 3 nút mẫu phía trên cùng: <em>⚡ Đề 15 phút</em>, <em>⭐ Giữa kỳ (45p)</em> hoặc <em>🏆 Cuối kỳ (60p)</em>.<br />
                • Hệ thống sẽ tự động cấu hình sẵn số câu trắc nghiệm, đúng/sai, tự luận và tỷ lệ phần trăm (Nhận biết - Thông hiểu - Vận dụng).<br />
                • Thầy/cô chỉ cần gõ tên bài hoặc chủ đề vào mục số 4 (nếu muốn).
              </p>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-100 bg-amber-50/30">
            <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm text-amber-950">
                Bước 3: Bấm &ldquo;✨ TẠO ĐỀ KIỂM TRA&rdquo; và xem kết quả
              </div>
              <p className="text-slate-600 leading-relaxed">
                • Bấm nút màu xanh <strong>&ldquo;✨ TẠO ĐỀ KIỂM TRA&rdquo;</strong> ở cuối cột bên trái.<br />
                • Sau vài giây, toàn bộ đề thi sẽ hiện ở cột bên phải gồm 6 Tab chuyên nghiệp:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 pt-1 font-medium">
                <li><strong>Tab 1. Đề kiểm tra:</strong> Xem đề, in ấn A4, sao chép hoặc xuất file Word (.doc).</li>
                <li><strong>Tab 2. Đáp án:</strong> Bảng đáp án trắc nghiệm + lời giải chi tiết.</li>
                <li><strong>Tab 3. Hướng dẫn chấm:</strong> Barem điểm thành phần và lưu ý chấm.</li>
                <li><strong>Tab 4. Ma trận đề:</strong> Bảng ma trận 2 chiều chuẩn Bộ GD&ĐT.</li>
                <li><strong>Tab 5. Bản đặc tả:</strong> Mục tiêu cần đạt cho từng câu hỏi.</li>
              </ul>
            </div>
          </div>

          {/* Mẹo hữu ích */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>CÁC TÍNH NĂNG TIỆN ÍCH DÀNH CHO GIÁO VIÊN:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>🔄 Tạo lại câu hỏi:</strong> Bên cạnh mỗi câu hỏi đều có nút mũi tên tròn để đổi câu hỏi khác nếu chưa ưng ý.
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>✏️ Chỉnh sửa trực tiếp:</strong> Bấm biểu tượng cây bút để sửa câu chữ, đáp án hoặc điểm số trực tiếp.
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>🖨️ In ấn & Xuất Word:</strong> Bấm <em>In đề</em> để in giấy A4 (tự ẩn nút) hoặc <em>Xuất Word</em> để lưu file .doc.
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <strong>🔢 Đa mã đề:</strong> Hệ thống tự động tạo mã 101, 102 kèm bảng đáp án riêng cho từng mã.
              </div>
            </div>
          </div>

          {/* Quy định truy cập: Tác giả & Giáo viên khách */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-indigo-950">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>QUY ĐỊNH TRUY CẬP VÀ SỬ DỤNG HỆ THỐNG:</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              • <strong>Dành cho Tác giả website (Quản trị viên):</strong> Nhập mật khẩu quản trị <code>68686868@#</code> trên thanh menu để kích hoạt toàn quyền mà không cần điền API key.<br />
              • <strong>Dành cho Giáo viên / Người dùng khách:</strong> Nhập <strong>Google Gemini API Key</strong> cá nhân miễn phí (lấy tại <em>aistudio.google.com/apikey</em>) để tạo đề nhanh chóng, không bị nghẽn mạng và bảo mật 100% trong trình duyệt.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            Đã hiểu, bắt đầu sử dụng
          </button>
        </div>
      </div>
    </div>
  );
};
