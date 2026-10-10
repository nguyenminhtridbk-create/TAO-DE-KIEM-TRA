import React, { useState } from 'react';
import {
  ExamConfigState,
  EducationLevel,
  ExamType,
  QuestionFormatId,
  TeacherPredefinedQuestion,
} from '../types/exam';
import {
  THCS_GRADES,
  THPT_GRADES,
  POPULAR_SUBJECTS_THCS,
  POPULAR_SUBJECTS_THPT,
  EXAM_TYPES,
  DURATION_OPTIONS,
  SCORE_OPTIONS,
  QUESTION_FORMATS,
} from '../utils/constants';
import {
  Sparkles,
  BookMarked,
  Layers,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  TableProperties,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ConfigSidebarProps {
  config: ExamConfigState;
  onChange: (updated: Partial<ExamConfigState>) => void;
  onGenerateExam: () => void;
  onGenerateMatrixOnly: () => void;
  isGenerating: boolean;
}

export const ConfigSidebar: React.FC<ConfigSidebarProps> = ({
  config,
  onChange,
  onGenerateExam,
  onGenerateMatrixOnly,
  isGenerating,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');
  const [showCustomSubjectField, setShowCustomSubjectField] = useState<boolean>(false);
  const [showTeacherQuestionsModal, setShowTeacherQuestionsModal] = useState<boolean>(false);

  // Available grades based on education level
  const currentGrades = config.level === 'THCS' ? THCS_GRADES : THPT_GRADES;
  const popularSubjects = config.level === 'THCS' ? POPULAR_SUBJECTS_THCS : POPULAR_SUBJECTS_THPT;

  // Calculate total number of questions selected
  const totalQuestions = Object.values(config.selectedFormats).reduce(
    (sum, item) => (item.enabled ? sum + (Number(item.count) || 0) : sum),
    0
  );

  // Check percent sum
  const percentSum =
    (Number(config.cognitivePercent.nhan_biet) || 0) +
    (Number(config.cognitivePercent.thong_hieu) || 0) +
    (Number(config.cognitivePercent.van_dung) || 0);

  const isPercentValid = percentSum === 100;

  // Handle Level Change
  const handleLevelChange = (level: EducationLevel) => {
    const newGrades = level === 'THCS' ? THCS_GRADES : THPT_GRADES;
    const defaultGrade = newGrades[0];
    const defaultSubject = level === 'THCS' ? POPULAR_SUBJECTS_THCS[0] : POPULAR_SUBJECTS_THPT[0];
    onChange({
      level,
      grade: defaultGrade,
      subject: defaultSubject,
    });
  };

  // Format count update
  const handleFormatCountChange = (formatId: QuestionFormatId, count: number) => {
    const updated = {
      ...config.selectedFormats,
      [formatId]: {
        enabled: count > 0,
        count: Math.max(0, count),
      },
    };
    onChange({ selectedFormats: updated });
  };

  // Toggle format enable
  const handleToggleFormat = (formatId: QuestionFormatId) => {
    const current = config.selectedFormats[formatId] || { enabled: false, count: 0 };
    const willEnable = !current.enabled;
    const updated = {
      ...config.selectedFormats,
      [formatId]: {
        enabled: willEnable,
        count: willEnable ? (current.count > 0 ? current.count : 2) : 0,
      },
    };
    onChange({ selectedFormats: updated });
  };

  // File upload simulation (read text)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onChange({
        referenceDocText: text,
        referenceDocName: file.name,
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden no-print">
      {/* Title & Quick summary */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Thiết lập cấu hình đề thi
            </h2>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            Tổng: {totalQuestions} câu • {config.totalScore} điểm
          </span>
        </div>
      </div>

      {/* Main Form Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm divide-y divide-slate-100">
        {/* BƯỚC 1 & 2: CẤP HỌC & LỚP */}
        <div className="pt-2 first:pt-0 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Chọn cấp học & Lớp
          </label>
          {/* Level Cards */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleLevelChange('THCS')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                config.level === 'THCS'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="font-bold text-base">THCS</div>
              <div className="text-xs text-slate-500">Lớp 6, 7, 8, 9</div>
            </button>

            <button
              type="button"
              onClick={() => handleLevelChange('THPT')}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                config.level === 'THPT'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="font-bold text-base">THPT</div>
              <div className="text-xs text-slate-500">Lớp 10, 11, 12</div>
            </button>
          </div>

          {/* Grade selection */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-600 font-medium">Khối lớp:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {currentGrades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ grade: g })}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    config.grade === g
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BƯỚC 3: MÔN HỌC */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Chọn môn học
            </label>
            <span className="text-xs text-blue-600 font-medium">Hiện tại: {config.subject}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
            {popularSubjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setShowCustomSubjectField(false);
                  onChange({ subject: sub, customSubject: '' });
                }}
                className={`px-2 py-1.5 text-xs rounded-lg text-left truncate transition-colors ${
                  config.subject === sub && !config.customSubject
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title={sub}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Custom Subject Input */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setShowCustomSubjectField(!showCustomSubjectField)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>+ Nhập tên môn học khác / Chuyên đề tùy chỉnh</span>
            </button>
            {showCustomSubjectField && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Tiếng Pháp, Lịch sử Đảng, Hoạt động TN..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customSubjectInput.trim()) {
                      onChange({
                        subject: customSubjectInput.trim(),
                        customSubject: customSubjectInput.trim(),
                      });
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BƯỚC 4: NHẬP NỘI DUNG KIẾN THỨC */}
        <div className="pt-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Nội dung kiến thức cần kiểm tra
          </label>

          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-600">Tên bài / Chủ đề trọng tâm:</span>
              <input
                type="text"
                value={config.topic}
                onChange={(e) => onChange({ topic: e.target.value })}
                placeholder="VD: Căn bậc hai, Dao động cơ, Văn bản Lặng lẽ Sa Pa..."
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-slate-600">Chương:</span>
                <input
                  type="text"
                  value={config.chapter}
                  onChange={(e) => onChange({ chapter: e.target.value })}
                  placeholder="VD: Chương I, Bài 1-4..."
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5"
                />
              </div>
              <div>
                <span className="text-xs text-slate-600">Phạm vi kiến thức:</span>
                <input
                  type="text"
                  value={config.knowledgeScope}
                  onChange={(e) => onChange({ knowledgeScope: e.target.value })}
                  placeholder="VD: Tuần 1 đến tuần 8..."
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5"
                />
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-600">Nội dung chi tiết cần kiểm tra:</span>
              <input
                type="text"
                value={config.testContent}
                onChange={(e) => onChange({ testContent: e.target.value })}
                placeholder="VD: Định nghĩa, tính chất, đồ thị, bài toán tìm cực trị..."
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5"
              />
            </div>

            <div>
              <span className="text-xs text-slate-600">Yêu cầu cần đạt:</span>
              <input
                type="text"
                value={config.learningOutcomes}
                onChange={(e) => onChange({ learningOutcomes: e.target.value })}
                placeholder="VD: Nhận biết khái niệm, giải thành thạo bài toán cơ bản..."
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5"
              />
            </div>

            <div>
              <span className="text-xs text-slate-600">Ghi chú của giáo viên:</span>
              <input
                type="text"
                value={config.teacherNotes}
                onChange={(e) => onChange({ teacherNotes: e.target.value })}
                placeholder="VD: Cho số liệu chẵn, có bài toán liên hệ thực tế..."
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5"
              />
            </div>

            <div>
              <span className="text-xs text-slate-600 font-medium">
                Vùng văn bản dán nội dung bài học / trích đoạn SGK:
              </span>
              <textarea
                rows={3}
                value={config.lessonContentText}
                onChange={(e) => onChange({ lessonContentText: e.target.value })}
                placeholder="Dán nội dung bài học, văn bản đọc hiểu hoặc công thức vào đây để AI bám sát..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-1 font-mono text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* BƯỚC 5: TÀI LIỆU THAM CHIẾU */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Tài liệu tham chiếu
            </label>
            {config.referenceDocText && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã nạp tài liệu
              </span>
            )}
          </div>

          {/* Mode Selection */}
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="radio"
                name="refMode"
                checked={config.referenceMode === 'doc_only'}
                onChange={() => onChange({ referenceMode: 'doc_only' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Chỉ sử dụng tài liệu đã cung cấp</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="radio"
                name="refMode"
                checked={config.referenceMode === 'doc_plus_standard'}
                onChange={() => onChange({ referenceMode: 'doc_plus_standard' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Tài liệu tải lên + kiến thức CT phổ thông (Khuyên dùng)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="radio"
                name="refMode"
                checked={config.referenceMode === 'manual_only'}
                onChange={() => onChange({ referenceMode: 'manual_only' })}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Giáo viên tự nhập nội dung hoàn toàn</span>
            </label>
          </div>

          {/* File Upload / Paste Area */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Tải tệp (.txt, word text)</span>
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {config.referenceDocName && (
                <span className="text-xs text-slate-500 truncate max-w-[180px]">
                  {config.referenceDocName}
                </span>
              )}
            </div>

            <textarea
              rows={2}
              value={config.referenceDocText}
              onChange={(e) => onChange({ referenceDocText: e.target.value })}
              placeholder="Hoặc dán trực tiếp ma trận cũ, đề thi cũ, giáo án, kế hoạch bài dạy tại đây..."
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* BƯỚC 6: LOẠI ĐỀ, THỜI GIAN & THANG ĐIỂM */}
        <div className="pt-4 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            5. Loại đề, Thời gian & Thang điểm
          </label>

          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-600">Loại đề kiểm tra:</span>
              <select
                value={config.examType}
                onChange={(e) => {
                  const examType = e.target.value as ExamType;
                  onChange({
                    examType,
                    examTitle: `${examType} - Môn ${config.subject}`,
                  });
                }}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5 bg-white"
              >
                {EXAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-xs text-slate-600">Tên bài kiểm tra:</span>
              <input
                type="text"
                value={config.examTitle}
                onChange={(e) => onChange({ examTitle: e.target.value })}
                className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-slate-600">Thời gian làm bài:</span>
                <select
                  value={config.durationMinutes}
                  onChange={(e) => onChange({ durationMinutes: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5 bg-white font-medium"
                >
                  {DURATION_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} phút
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-xs text-slate-600">Thang điểm:</span>
                <select
                  value={config.totalScore}
                  onChange={(e) => onChange({ totalScore: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden mt-0.5 bg-white font-medium text-blue-700"
                >
                  {SCORE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s} điểm
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Số mã đề thi */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Số mã đề cần tạo:</span>
                <span className="text-xs text-blue-600 font-semibold">
                  Mã đề {['101', '102', '103', '104'].slice(0, config.numberOfVariants).join(', ')}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[1, 2, 3, 4].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onChange({ numberOfVariants: v })}
                    className={`py-1 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      config.numberOfVariants === v
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {v} mã đề
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BƯỚC 7: HÌNH THỨC CÂU HỎI */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              6. Hình thức câu hỏi & Số lượng
            </label>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {totalQuestions} câu
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase">A. TRẮC NGHIỆM</div>
            {QUESTION_FORMATS.filter((f) => f.category === 'Trắc nghiệm').map((fmt) => {
              const current = config.selectedFormats[fmt.id] || { enabled: false, count: 0 };
              return (
                <div
                  key={fmt.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-white"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={current.enabled}
                      onChange={() => handleToggleFormat(fmt.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium text-slate-700 truncate">{fmt.label}</span>
                  </label>
                  {current.enabled && (
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={current.count}
                        onChange={(e) =>
                          handleFormatCountChange(fmt.id, parseInt(e.target.value) || 0)
                        }
                        className="w-12 text-xs text-center py-1 border border-slate-300 rounded font-bold text-blue-700"
                      />
                      <span className="text-[11px] text-slate-500">câu</span>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="text-[11px] font-bold text-slate-500 uppercase pt-2">B. TỰ LUẬN</div>
            {QUESTION_FORMATS.filter((f) => f.category === 'Tự luận').map((fmt) => {
              const current = config.selectedFormats[fmt.id] || { enabled: false, count: 0 };
              return (
                <div
                  key={fmt.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-white"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={current.enabled}
                      onChange={() => handleToggleFormat(fmt.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium text-slate-700 truncate">{fmt.label}</span>
                  </label>
                  {current.enabled && (
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={current.count}
                        onChange={(e) =>
                          handleFormatCountChange(fmt.id, parseInt(e.target.value) || 0)
                        }
                        className="w-12 text-xs text-center py-1 border border-slate-300 rounded font-bold text-blue-700"
                      />
                      <span className="text-[11px] text-slate-500">câu</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BƯỚC 8: THIẾT LẬP MỨC ĐỘ CÂU HỎI */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              7. Mức độ câu hỏi (Bộ GD&ĐT)
            </label>
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => onChange({ cognitiveMode: 'percent' })}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  config.cognitiveMode === 'percent'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Tỷ lệ %
              </button>
              <button
                type="button"
                onClick={() => onChange({ cognitiveMode: 'count' })}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  config.cognitiveMode === 'count'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Số câu
              </button>
            </div>
          </div>

          {config.cognitiveMode === 'percent' ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-xs text-slate-600">Nhận biết:</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.cognitivePercent.nhan_biet}
                      onChange={(e) =>
                        onChange({
                          cognitivePercent: {
                            ...config.cognitivePercent,
                            nhan_biet: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full text-xs p-1.5 border border-slate-300 rounded text-center font-bold"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-600">Thông hiểu:</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.cognitivePercent.thong_hieu}
                      onChange={(e) =>
                        onChange({
                          cognitivePercent: {
                            ...config.cognitivePercent,
                            thong_hieu: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full text-xs p-1.5 border border-slate-300 rounded text-center font-bold"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-600">Vận dụng:</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.cognitivePercent.van_dung}
                      onChange={(e) =>
                        onChange({
                          cognitivePercent: {
                            ...config.cognitivePercent,
                            van_dung: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full text-xs p-1.5 border border-slate-300 rounded text-center font-bold"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>

              {!isPercentValid && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Tổng tỷ lệ hiện là <strong>{percentSum}%</strong>. Bắt buộc bằng 100%!
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-xs text-slate-600">Nhận biết:</span>
                <input
                  type="number"
                  min="0"
                  value={config.cognitiveCount.nhan_biet}
                  onChange={(e) =>
                    onChange({
                      cognitiveCount: {
                        ...config.cognitiveCount,
                        nhan_biet: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-xs p-1.5 border border-slate-300 rounded text-center font-bold mt-0.5"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">Thông hiểu:</span>
                <input
                  type="number"
                  min="0"
                  value={config.cognitiveCount.thong_hieu}
                  onChange={(e) =>
                    onChange({
                      cognitiveCount: {
                        ...config.cognitiveCount,
                        thong_hieu: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-xs p-1.5 border border-slate-300 rounded text-center font-bold mt-0.5"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600">Vận dụng:</span>
                <input
                  type="number"
                  min="0"
                  value={config.cognitiveCount.van_dung}
                  onChange={(e) =>
                    onChange({
                      cognitiveCount: {
                        ...config.cognitiveCount,
                        van_dung: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-xs p-1.5 border border-slate-300 rounded text-center font-bold mt-0.5"
                />
              </div>
            </div>
          )}
        </div>

        {/* BƯỚC 9: CHẾ ĐỘ NHẬP CÂU HỎI CỦA GIÁO VIÊN */}
        <div className="pt-4 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={config.keepTeacherQuestions}
              onChange={(e) => onChange({ keepTeacherQuestions: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Giữ nguyên câu hỏi giáo viên đã nhập</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Khi bật, hệ thống tuyệt đối không chỉnh sửa các câu giáo viên đã nhập sẵn, AI chỉ sinh thêm các câu còn thiếu theo ma trận.
          </p>
        </div>
      </div>

      {/* FOOTER ACTIONS - BIG BUTTONS */}
      <div className="p-4 border-t border-slate-200 bg-white space-y-2">
        <button
          type="button"
          onClick={onGenerateExam}
          disabled={isGenerating || totalQuestions === 0}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isGenerating ? 'ĐANG KHỞI TẠO ĐỀ THI...' : '✨ TẠO ĐỀ KIỂM TRA'}</span>
        </button>

        <button
          type="button"
          onClick={onGenerateMatrixOnly}
          disabled={isGenerating}
          className="w-full py-2 px-3 rounded-lg font-medium text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <TableProperties className="w-3.5 h-3.5 text-blue-600" />
          <span>TẠO MA TRẬN & BẢN ĐẶC TẢ</span>
        </button>
      </div>
    </div>
  );
};
