import React, { useState, useEffect } from 'react';
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
import { findCurriculumPreset } from '../utils/vietnameseCurriculumData';
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
  BookmarkCheck,
  Library,
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
    step1: true, // Cấp, Lớp & Môn
    stepBook: true, // Bộ sách & Nạp kiến thức tự động (ĐẶC BIỆT)
    step2: false, // Loại đề & Thời gian
    step3: true, // Cấu trúc câu hỏi
    step4: false, // Nội dung chi tiết & Tài liệu (tùy chọn)
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [showCustomSubjectField, setShowCustomSubjectField] = useState(false);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [loadedBookNotice, setLoadedBookNotice] = useState<string | null>(null);

  const currentGrades = config.level === 'THCS' ? THCS_GRADES : THPT_GRADES;
  const popularSubjects = config.level === 'THCS' ? POPULAR_SUBJECTS_THCS : POPULAR_SUBJECTS_THPT;

  const currentBook = config.textbookSeries || 'Kết nối tri thức';
  const currentTerm = config.termScope || 'Giữa học kỳ I';

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

  // Auto Load Curriculum from Textbook Series (Kết nối tri thức)
  const handleLoadCurriculum = (
    term: 'Giữa học kỳ I' | 'Cuối học kỳ I' | 'Giữa học kỳ II' | 'Cuối học kỳ II',
    subjectOverride?: string,
    gradeOverride?: string
  ) => {
    const book = 'Kết nối tri thức';
    const subj = subjectOverride || config.subject;
    const grd = gradeOverride || config.grade;
    const preset = findCurriculumPreset(subj, grd, term);

    if (preset) {
      // Build updated formats if preset suggests
      const newFormats = { ...config.selectedFormats };
      if (preset.suggestedFormats) {
        Object.keys(newFormats).forEach((k) => {
          newFormats[k as QuestionFormatId] = {
            enabled: false,
            count: 0,
          };
        });
        Object.keys(preset.suggestedFormats).forEach((k) => {
          const count = preset.suggestedFormats[k];
          newFormats[k as QuestionFormatId] = {
            enabled: count > 0,
            count,
          };
        });
      }

      onChange({
        textbookSeries: book,
        termScope: term,
        examTitle: `Đề kiểm tra ${term.toLowerCase()} môn ${subj}`,
        examType: (term.includes('Giữa') ? 'Kiểm tra giữa kỳ I' : 'Kiểm tra cuối kỳ I') as ExamType,
        topic: preset.topic,
        chapter: preset.chapter,
        knowledgeScope: preset.knowledgeScope,
        testContent: preset.testContent,
        learningOutcomes: preset.learningOutcomes,
        selectedFormats: newFormats,
      });

      setLoadedBookNotice(`Đã nạp kiến thức SGK Kết nối tri thức - ${term} (${subj} ${grd})`);
    } else {
      onChange({
        textbookSeries: book,
        termScope: term,
        examTitle: `Đề kiểm tra ${term.toLowerCase()} môn ${subj}`,
        topic: `Kiến thức trọng tâm ${term} môn ${subj} (${grd})`,
        chapter: `Chương trình ${term} SGK Kết nối tri thức`,
        knowledgeScope: `Bám sát sách giáo khoa Kết nối tri thức môn ${subj} ${grd}`,
        testContent: `Các bài học trọng tâm giai đoạn ${term} theo sách Kết nối tri thức`,
        learningOutcomes: `Nắm vững định nghĩa, quy tắc và kĩ năng giải quyết vấn đề theo chuẩn bộ sách Kết nối tri thức.`,
      });
      setLoadedBookNotice(`Đã cập nhật phạm vi ${term} theo SGK Kết nối tri thức`);
    }

    setTimeout(() => setLoadedBookNotice(null), 4000);
  };

  // Level change
  const handleLevelChange = (level: EducationLevel) => {
    const newGrades = level === 'THCS' ? THCS_GRADES : THPT_GRADES;
    const defaultGrade = newGrades[0];
    const defaultSubject = level === 'THCS' ? POPULAR_SUBJECTS_THCS[0] : POPULAR_SUBJECTS_THPT[0];
    onChange({
      level,
      grade: defaultGrade,
      subject: defaultSubject,
    });
    handleLoadCurriculum(currentTerm, defaultSubject, defaultGrade);
  };

  // Subject change
  const handleSelectSubject = (sub: string) => {
    setShowCustomSubjectField(false);
    onChange({ subject: sub, customSubject: '' });
    handleLoadCurriculum(currentTerm, sub, config.grade);
  };

  // Grade change
  const handleSelectGrade = (grd: string) => {
    onChange({ grade: grd });
    handleLoadCurriculum(currentTerm, config.subject, grd);
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
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2">
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

        {/* Notice banner when textbook is loaded */}
        {loadedBookNotice && (
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{loadedBookNotice}</span>
          </div>
        )}
      </div>

      {/* Accordion Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {/* ================= SECTION 1: CẤP, LỚP & MÔN ================= */}
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
                      onClick={() => handleSelectGrade(g)}
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
                      onClick={() => handleSelectSubject(sub)}
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
                            handleLoadCurriculum(currentTerm, customSubjectInput.trim(), config.grade);
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

        {/* ================= SECTION BỘ SÁCH: TỰ ĐỘNG NẠP NỘI DUNG SGK ================= */}
        <div className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-2xs ring-1 ring-blue-100">
          <button
            type="button"
            onClick={() => toggleSection('stepBook')}
            className="w-full p-3 bg-blue-50/70 flex items-center justify-between text-left hover:bg-blue-100/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="font-bold text-xs text-blue-950 uppercase flex items-center gap-1.5">
                <Library className="w-3.5 h-3.5 text-blue-600" />
                <span>Bộ sách SGK & Tự động lấy nội dung</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 font-bold">
              <span>{currentBook} • {currentTerm}</span>
              {openSections.stepBook ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />}
            </div>
          </button>

          {openSections.stepBook && (
            <div className="p-3.5 space-y-3 border-t border-blue-100 bg-blue-50/20">
              {/* Official Textbook Badge */}
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">Bộ SGK chuẩn:</span>
                </div>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Kết nối tri thức với cuộc sống
                </span>
              </div>

              {/* Select Term */}
              <div>
                <span className="text-xs text-slate-700 font-bold">Chọn kỳ kiểm tra cần tạo:</span>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {(['Giữa học kỳ I', 'Cuối học kỳ I', 'Giữa học kỳ II', 'Cuối học kỳ II'] as const).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleLoadCurriculum(term)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        currentTerm === term
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary of Loaded Textbook Content */}
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nội dung đã nạp từ sách:</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {config.subject} {config.grade}
                  </span>
                </div>
                <div className="text-slate-800 font-semibold leading-snug">
                  {config.topic}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2">
                  <strong>Phạm vi:</strong> {config.knowledgeScope}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 3: LOẠI ĐỀ & THỜI GIAN ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step2')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="font-bold text-xs text-slate-800 uppercase">
                Thời gian, Thang điểm & Số mã đề
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>{config.durationMinutes}p • {config.totalScore}đ • {config.numberOfVariants} mã đề</span>
              {openSections.step2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {openSections.step2 && (
            <div className="p-3.5 space-y-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
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
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">Số mã đề cần tạo (xáo trộn tự động):</span>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => onChange({ numberOfVariants: v })}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-colors ${
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
          )}
        </div>

        {/* ================= SECTION 4: CẤU TRÚC CÂU HỎI & MỨC ĐỘ ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step3')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                4
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

        {/* ================= SECTION 5: CHI TIẾT TỰ ĐIỀN / TÀI LIỆU (TÙY CHỌN) ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('step4')}
            className="w-full p-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                5
              </span>
              <span className="font-bold text-xs text-slate-800 uppercase">
                Tùy chỉnh chi tiết & Tải tệp (Tùy chọn)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="truncate max-w-[140px]">{config.topic}</span>
              {openSections.step4 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {openSections.step4 && (
            <div className="p-3.5 space-y-3 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-600 font-medium">Tên bài / Chủ đề:</span>
                <input
                  type="text"
                  value={config.topic}
                  onChange={(e) => onChange({ topic: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1 font-medium"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">Chương:</span>
                <input
                  type="text"
                  value={config.chapter}
                  onChange={(e) => onChange({ chapter: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">Phạm vi kiến thức SGK:</span>
                <input
                  type="text"
                  value={config.knowledgeScope}
                  onChange={(e) => onChange({ knowledgeScope: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1"
                />
              </div>

              <div>
                <span className="text-xs text-slate-600 font-medium">Yêu cầu cần đạt:</span>
                <textarea
                  rows={2}
                  value={config.learningOutcomes}
                  onChange={(e) => onChange({ learningOutcomes: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tải tệp tài liệu riêng (.txt, word)</span>
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
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
