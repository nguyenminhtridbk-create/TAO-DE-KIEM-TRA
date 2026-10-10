import React, { useState } from 'react';
import {
  ExamConfigState,
  EducationLevel,
  ExamType,
  QuestionFormatId,
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
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TableProperties,
  ChevronDown,
  ChevronUp,
  Upload,
  Zap,
  SlidersHorizontal,
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
  // Accordion open states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    step1: true, // Cấp & Môn
    step2: false, // Loại đề & Thời gian
    step3: true, // Cấu trúc câu hỏi
    step4: false, // Nội dung chi tiết & Tài liệu (tùy chọn)
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [showCustomSubjectField, setShowCustomSubjectField] = useState(false);
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  const currentGrades = config.level === 'THCS' ? THCS_GRADES : THPT_GRADES;
  const popularSubjects = config.level === 'THCS' ? POPULAR_SUBJECTS_THCS : POPULAR_SUBJECTS_THPT;

  // Total questions count
  const totalQuestions = Object.values(config.selectedFormats).reduce(
    (sum, item) => (item.enabled ? sum + (Number(item.count) || 0) : sum),
    0
  );

  const percentSum =
    (Number(config.cognitivePercent.nhan_biet) || 0) +
    (Number(config.cognitivePercent.thong_hieu) || 0) +
    (Number(config.cognitivePercent.van_dung) || 0);

  const isPercentValid = percentSum === 100;

  // Level change
  const handleLevelChange = (level: EducationLevel) => {
    const newGrades = level === 'THCS' ? THCS_GRADES : THPT_GRADES;
    onChange({
      level,
      grade: newGrades[0],
      subject: level === 'THCS' ? POPULAR_SUBJECTS_THCS[0] : POPULAR_SUBJECTS_THPT[0],
    });
  };

  // Preset Handlers
  const applyPreset = (type: '15min' | 'midterm' | 'final') => {
    if (type === '15min') {
      onChange({
        examType: 'Kiểm tra 15 phút',
        examTitle: `Kiểm tra 15 phút môn ${config.subject}`,
        durationMinutes: 15,
        totalScore: 10,
        selectedFormats: {
          ...config.selectedFormats,
          multiple_choice_4: { enabled: true, count: 10 },
          true_false: { enabled: false, count: 0 },
          short_answer: { enabled: false, count: 0 },
          essay_short: { enabled: false, count: 0 },
          essay_solve: { enabled: false, count: 0 },
        },
        cognitivePercent: { nhan_biet: 50, thong_hieu: 30, van_dung: 20 },
      });
    } else if (type === 'midterm') {
      onChange({
        examType: 'Kiểm tra giữa kỳ I',
        examTitle: `Đề kiểm tra giữa học kỳ I môn ${config.subject}`,
        durationMinutes: 45,
        totalScore: 10,
        selectedFormats: {
          ...config.selectedFormats,
          multiple_choice_4: { enabled: true, count: 12 },
          true_false: { enabled: true, count: 2 },
          short_answer: { enabled: true, count: 2 },
          essay_short: { enabled: true, count: 1 },
          essay_solve: { enabled: true, count: 1 },
        },
        cognitivePercent: { nhan_biet: 40, thong_hieu: 30, van_dung: 30 },
      });
    } else if (type === 'final') {
      onChange({
        examType: 'Kiểm tra cuối kỳ I',
        examTitle: `Đề kiểm tra cuối học kỳ I môn ${config.subject}`,
        durationMinutes: 60,
        totalScore: 10,
        selectedFormats: {
          ...config.selectedFormats,
          multiple_choice_4: { enabled: true, count: 16 },
          true_false: { enabled: true, count: 4 },
          short_answer: { enabled: true, count: 4 },
          essay_short: { enabled: true, count: 1 },
          essay_solve: { enabled: true, count: 1 },
        },
        cognitivePercent: { nhan_biet: 40, thong_hieu: 30, van_dung: 30 },
      });
    }
  };

  const handleFormatCountChange = (formatId: QuestionFormatId, count: number) => {
    onChange({
      selectedFormats: {
        ...config.selectedFormats,
        [formatId]: {
          enabled: count > 0,
          count: Math.max(0, count),
        },
      },
    });
  };

  const handleToggleFormat = (formatId: QuestionFormatId) => {
    const current = config.selectedFormats[formatId] || { enabled: false, count: 0 };
    const willEnable = !current.enabled;
    onChange({
      selectedFormats: {
        ...config.selectedFormats,
        [formatId]: {
          enabled: willEnable,
          count: willEnable ? (current.count > 0 ? current.count : 2) : 0,
        },
      },
    });
  };

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
      {/* Top Header & Presets */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Thiết lập đề thi
            </h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
            {totalQuestions} câu • {config.totalScore} điểm
          </span>
        </div>

        {/* Quick Presets for Teacher */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Mẫu đề nhanh (Bấm để áp dụng ngay cấu trúc):</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('15min')}
              className="py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-700 transition-all text-center shadow-2xs"
            >
              ⚡ Đề 15 phút
            </button>
            <button
              type="button"
              onClick={() => applyPreset('midterm')}
              className="py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-700 transition-all text-center shadow-2xs"
            >
              ⭐ Giữa kỳ (45p)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('final')}
              className="py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-slate-700 transition-all text-center shadow-2xs"
            >
              🏆 Cuối kỳ (60p)
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {/* ================= SECTION 1: CẤP & MÔN ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step1')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="font-bold text-xs text-slate-800 uppercase">
                Cấp học, Lớp & Môn học
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold">
              <span>{config.level} • {config.grade} • {config.subject}</span>
              {openSections.step1 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {openSections.step1 && (
            <div className="p-3.5 space-y-3 border-t border-slate-100">
              {/* Level Cards */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLevelChange('THCS')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    config.level === 'THCS'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-bold">THCS</div>
                  <div className="text-[11px] text-slate-500 font-normal">Lớp 6, 7, 8, 9</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelChange('THPT')}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    config.level === 'THPT'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-bold">THPT</div>
                  <div className="text-[11px] text-slate-500 font-normal">Lớp 10, 11, 12</div>
                </button>
              </div>

              {/* Grade */}
              <div>
                <span className="text-xs text-slate-600 font-medium">Khối lớp:</span>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {currentGrades.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onChange({ grade: g })}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                        config.grade === g
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-xs text-slate-600 font-medium">Môn học:</span>
                <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto p-1 mt-1 border border-slate-100 rounded-lg bg-slate-50/50">
                  {popularSubjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setShowCustomSubjectField(false);
                        onChange({ subject: sub, customSubject: '' });
                      }}
                      className={`px-2 py-1.5 text-[11px] rounded-md text-left truncate transition-colors ${
                        config.subject === sub && !config.customSubject
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                      title={sub}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                {/* Custom subject */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomSubjectField(!showCustomSubjectField)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <span>+ Nhập môn học khác / Chuyên đề tùy chỉnh</span>
                  </button>
                  {showCustomSubjectField && (
                    <div className="flex gap-1.5 mt-1">
                      <input
                        type="text"
                        placeholder="Nhập tên môn học..."
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg"
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
                        className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Chọn
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 2: THÔNG TIN ĐỀ & THỜI GIAN ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step2')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="font-bold text-xs text-slate-800 uppercase">
                Loại đề, Thời gian & Thang điểm
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>{config.examType} • {config.durationMinutes}p</span>
              {openSections.step2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {openSections.step2 && (
            <div className="p-3.5 space-y-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-600 font-medium">Loại đề kiểm tra:</span>
                  <select
                    value={config.examType}
                    onChange={(e) => {
                      const examType = e.target.value as ExamType;
                      onChange({
                        examType,
                        examTitle: `${examType} - Môn ${config.subject}`,
                      });
                    }}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1 bg-white font-medium"
                  >
                    {EXAM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs text-slate-600 font-medium">Thời gian làm bài:</span>
                  <select
                    value={config.durationMinutes}
                    onChange={(e) => onChange({ durationMinutes: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1 bg-white font-medium"
                  >
                    {DURATION_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} phút
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-600 font-medium">Thang điểm:</span>
                  <select
                    value={config.totalScore}
                    onChange={(e) => onChange({ totalScore: Number(e.target.value) })}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1 bg-white font-bold text-blue-700"
                  >
                    {SCORE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s} điểm
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs text-slate-600 font-medium">Số mã đề (đảo đề):</span>
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    {[1, 2, 3, 4].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onChange({ numberOfVariants: v })}
                        className={`py-1 text-xs font-semibold rounded-md border text-center transition-colors ${
                          config.numberOfVariants === v
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">Tên hiển thị trên đề:</span>
                <input
                  type="text"
                  value={config.examTitle}
                  onChange={(e) => onChange({ examTitle: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1 font-medium text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 3: CẤU TRÚC CÂU HỎI & MỨC ĐỘ ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step3')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="font-bold text-xs text-slate-800 uppercase">
                Số lượng câu & Mức độ nhận thức
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-bold">
              <span>{totalQuestions} câu</span>
              {openSections.step3 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {openSections.step3 && (
            <div className="p-3.5 space-y-4 border-t border-slate-100">
              {/* Question Formats Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Dạng câu hỏi (Tích chọn & điền số câu):</span>

                <div className="space-y-1.5">
                  {QUESTION_FORMATS.filter((f) =>
                    ['multiple_choice_4', 'true_false', 'short_answer', 'essay_short', 'essay_solve'].includes(f.id)
                  ).map((fmt) => {
                    const current = config.selectedFormats[fmt.id] || { enabled: false, count: 0 };
                    return (
                      <div
                        key={fmt.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-white"
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={current.enabled}
                            onChange={() => handleToggleFormat(fmt.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-medium text-slate-800 truncate">{fmt.label}</span>
                        </label>
                        {current.enabled && (
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              min="1"
                              max="50"
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

              {/* Cognitive level percentages */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Tỷ lệ mức độ nhận thức (Tổng = 100%):</span>
                  <span className={`font-bold ${isPercentValid ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {percentSum}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-center">
                    <div className="text-[11px] text-blue-900 font-semibold">Nhận biết</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
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
                        className="w-12 text-center text-xs p-1 border border-slate-300 rounded font-bold bg-white"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-center">
                    <div className="text-[11px] text-emerald-900 font-semibold">Thông hiểu</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
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
                        className="w-12 text-center text-xs p-1 border border-slate-300 rounded font-bold bg-white"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100 text-center">
                    <div className="text-[11px] text-amber-900 font-semibold">Vận dụng</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
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
                        className="w-12 text-center text-xs p-1 border border-slate-300 rounded font-bold bg-white"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  </div>
                </div>

                {!isPercentValid && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Tổng tỷ lệ phải bằng 100% (Hiện tại {percentSum}%)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 4: NỘI DUNG BÀI HỌC & TÀI LIỆU (TÙY CHỌN) ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step4')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span className="font-bold text-xs text-slate-800 uppercase">
                Chủ đề & Tài liệu (Tùy chọn)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="truncate max-w-[140px]">{config.topic || 'Mặc định SGK'}</span>
              {openSections.step4 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {openSections.step4 && (
            <div className="p-3.5 space-y-3 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-600 font-medium">Tên bài / Chủ đề trọng tâm:</span>
                <input
                  type="text"
                  value={config.topic}
                  onChange={(e) => onChange({ topic: e.target.value })}
                  placeholder="VD: Căn bậc hai, Dao động cơ, Lặng lẽ Sa Pa..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">Chương / Phạm vi kiến thức:</span>
                <input
                  type="text"
                  value={config.chapter}
                  onChange={(e) => onChange({ chapter: e.target.value })}
                  placeholder="VD: Chương I, Bài 1 đến bài 4..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">
                  Dán nội dung SGK / Ngữ liệu đọc hiểu (nếu có):
                </span>
                <textarea
                  rows={2}
                  value={config.lessonContentText}
                  onChange={(e) => onChange({ lessonContentText: e.target.value })}
                  placeholder="Dán đoạn văn bản hoặc ghi chú nếu muốn AI bám sát..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1 font-mono"
                />
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tải tệp tài liệu (.txt, word)</span>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {config.referenceDocName && (
                  <span className="text-xs text-emerald-600 ml-2 font-medium">
                    ✓ {config.referenceDocName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4 border-t border-slate-200 bg-white space-y-2">
        <button
          type="button"
          onClick={onGenerateExam}
          disabled={isGenerating || totalQuestions === 0}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isGenerating ? 'ĐANG TẠO ĐỀ...' : '✨ TẠO ĐỀ KIỂM TRA'}</span>
        </button>

        <button
          type="button"
          onClick={onGenerateMatrixOnly}
          disabled={isGenerating}
          className="w-full py-2 px-3 rounded-lg font-medium text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <TableProperties className="w-3.5 h-3.5 text-blue-600" />
          <span>XEM MA TRẬN & ĐẶC TẢ</span>
        </button>
      </div>
    </div>
  );
};
