/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ExamConfigState,
  ExamData,
  ExamQuestion,
  BankQuestion,
  EducationLevel,
} from './types/exam';
import { INITIAL_CONFIG } from './utils/constants';
import {
  calculateMatrix,
  generateSpecifications,
  generateVariants,
  runQualityAudit,
} from './utils/matrixEngine';
import {
  formatExamAsText,
  formatAnswerKeyAsText,
  formatMatrixAsText,
  downloadWordDocument,
  copyToClipboard,
} from './utils/exportUtils';
import { Header } from './components/Header';
import { ConfigSidebar } from './components/ConfigSidebar';
import { ExamViewTab } from './components/ExamViewTab';
import { AnswerKeyTab } from './components/AnswerKeyTab';
import { GradingGuideTab } from './components/GradingGuideTab';
import { MatrixTab } from './components/MatrixTab';
import { SpecificationTab } from './components/SpecificationTab';
import { AuditTab } from './components/AuditTab';
import { ProgressModal } from './components/ProgressModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { SavedExamsModal } from './components/SavedExamsModal';
import { MatrixImportModal } from './components/MatrixImportModal';
import {
  FileText,
  CheckCircle,
  Table,
  ListOrdered,
  ShieldCheck,
  Printer,
  Copy,
  Download,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Undo2,
  Check,
  AlertCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

const STORAGE_KEY_CONFIG = 'exam_ai_config_v1';
const STORAGE_KEY_SAVED_EXAMS = 'exam_ai_saved_exams_v1';
const STORAGE_KEY_BANK = 'exam_ai_question_bank_v1';

export default function App() {
  // Config state
  const [config, setConfig] = useState<ExamConfigState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONFIG;
  });

  // Current Generated Exam
  const [exam, setExam] = useState<ExamData | null>(null);

  // Undo history for questions
  const [history, setHistory] = useState<ExamQuestion[][]>([]);

  // Saved Exams & Question Bank
  const [savedExams, setSavedExams] = useState<ExamData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_EXAMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BANK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Active Tab: 'exam' | 'answer' | 'grading' | 'matrix' | 'spec' | 'audit'
  const [activeTab, setActiveTab] = useState<
    'exam' | 'answer' | 'grading' | 'matrix' | 'spec' | 'audit'
  >('exam');

  // Generation & progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [regeneratingQuestionId, setRegeneratingQuestionId] = useState<string | null>(null);

  // UI Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isMatrixImportOpen, setIsMatrixImportOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist config
  const handleConfigChange = (updated: Partial<ExamConfigState>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Restore latest configuration
  const handleRestoreConfig = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        setConfig(JSON.parse(saved));
        showToast('Đã khôi phục cấu hình gần nhất.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reset to initial
  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY_CONFIG);
    } catch (e) {
      console.error(e);
    }
    showToast('Đã thiết lập lại cấu hình về mặc định.');
  };

  // Record undo state before modifying questions
  const pushUndoState = (currentQuestions: ExamQuestion[]) => {
    setHistory((prev) => [...prev.slice(-10), currentQuestions]);
  };

  const handleUndo = () => {
    if (history.length === 0 || !exam) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));

    const matrix = calculateMatrix(previous, exam.totalScore);
    const specifications = generateSpecifications(previous);
    const variants = generateVariants(previous, exam.variants.length);
    const auditChecks = runQualityAudit(
      previous,
      exam.totalScore,
      previous.length,
      exam.subject,
      exam.grade
    );

    setExam({
      ...exam,
      questions: previous,
      matrix,
      specifications,
      variants,
      auditChecks,
    });
    showToast('Đã hoàn tác thao tác vừa rồi.');
  };

  // Generate Exam Action
  const handleGenerateExam = async () => {
    setIsGenerating(true);
    setShowProgressModal(true);
    setIsGenerationComplete(false);
    setProgressStep(0);

    // Simulated progress steps matching Page 11
    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      clearInterval(stepInterval);
      setProgressStep(4);

      const rawQuestions: ExamQuestion[] = data.questions || [];
      const totalScore = config.totalScore || 10;
      const matrix = calculateMatrix(rawQuestions, totalScore);
      const specifications = generateSpecifications(rawQuestions);
      const variants = generateVariants(rawQuestions, config.numberOfVariants || 2);
      const auditChecks = runQualityAudit(
        rawQuestions,
        totalScore,
        rawQuestions.length,
        config.subject,
        config.grade
      );

      const newExam: ExamData = {
        id: `EXAM-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: config.examTitle || `Đề kiểm tra môn ${config.subject}`,
        schoolName: config.schoolName || 'Trường THCS & THPT',
        studentNamePrompt: 'Họ và tên: ....................................',
        level: config.level,
        grade: config.grade,
        subject: config.subject,
        examType: config.examType,
        durationMinutes: config.durationMinutes,
        totalScore,
        topic: config.topic,
        chapter: config.chapter,
        knowledgeScope: config.knowledgeScope,
        testContent: config.testContent,
        learningOutcomes: config.learningOutcomes,
        teacherNotes: config.teacherNotes,
        referenceDocText: config.referenceDocText,
        referenceMode: config.referenceMode,
        questions: rawQuestions,
        matrix,
        specifications,
        gradingGuide: {
          rubricItems: rawQuestions.map((q, i) => ({
            criteria: `Câu ${i + 1}: ${q.learningOutcome || q.topic}`,
            subScore: q.score,
            totalScore: q.score,
          })),
          generalNotes: [
            'Chấm đúng barem, các bước lập luận hợp lý vẫn cho điểm tương đương.',
            'Trừ điểm sai đơn vị hoặc thiếu điều kiện theo quy định của tổ chuyên môn.',
          ],
        },
        auditChecks,
        variants,
        selectedVariantCode: '101',
      };

      setExam(newExam);
      setIsGenerationComplete(true);
      showToast('✨ Đề đã được tạo và kiểm tra thành công!');
    } catch (err: any) {
      console.error('Error generating exam:', err);
      clearInterval(stepInterval);
      showToast('Có lỗi xảy ra khi tạo đề. Đang sử dụng chế độ dự phòng an toàn.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Matrix Only
  const handleGenerateMatrixOnly = () => {
    handleGenerateExam();
    setActiveTab('matrix');
  };

  // Generate Equivalent Exam (Page 9, 20)
  const handleGenerateEquivalentExam = async () => {
    if (!exam) return;
    setIsGenerating(true);
    setShowProgressModal(true);
    setIsGenerationComplete(false);
    setProgressStep(2);

    try {
      const response = await fetch('/api/exam/generate-equivalent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalQuestions: exam.questions,
          subject: exam.subject,
          grade: exam.grade,
          topic: exam.topic,
          totalScore: exam.totalScore,
        }),
      });

      const data = await response.json();
      const newQuestions = data.questions || [];
      const matrix = calculateMatrix(newQuestions, exam.totalScore);
      const specifications = generateSpecifications(newQuestions);
      const variants = generateVariants(newQuestions, exam.variants.length);
      const auditChecks = runQualityAudit(
        newQuestions,
        exam.totalScore,
        newQuestions.length,
        exam.subject,
        exam.grade
      );

      pushUndoState(exam.questions);

      setExam({
        ...exam,
        id: `EXAM-${Date.now()}`,
        title: `${exam.title} (Đề tương đương)`,
        questions: newQuestions,
        matrix,
        specifications,
        variants,
        auditChecks,
      });

      setProgressStep(4);
      setIsGenerationComplete(true);
      showToast('✨ Đã tạo bộ đề thi tương đương mới!');
    } catch (e) {
      console.error(e);
      showToast('Không thể tạo đề tương đương. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate single question
  const handleRegenerateQuestion = async (q: ExamQuestion) => {
    if (!exam) return;
    setRegeneratingQuestionId(q.id);

    try {
      const response = await fetch('/api/exam/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestion: q,
          subject: exam.subject,
          grade: exam.grade,
          topic: exam.topic,
        }),
      });

      const data = await response.json();
      if (data.question) {
        pushUndoState(exam.questions);
        const updated = exam.questions.map((oldQ) =>
          oldQ.id === q.id ? { ...data.question, id: q.id } : oldQ
        );
        const matrix = calculateMatrix(updated, exam.totalScore);
        const specifications = generateSpecifications(updated);
        const variants = generateVariants(updated, exam.variants.length);
        const auditChecks = runQualityAudit(
          updated,
          exam.totalScore,
          updated.length,
          exam.subject,
          exam.grade
        );

        setExam({
          ...exam,
          questions: updated,
          matrix,
          specifications,
          variants,
          auditChecks,
        });
        showToast(`Đã tạo mới câu hỏi ${q.id}.`);
      }
    } catch (e) {
      console.error(e);
      showToast('Lỗi khi tạo lại câu hỏi.');
    } finally {
      setRegeneratingQuestionId(null);
    }
  };

  // Update question from inline edit
  const handleUpdateQuestion = (updatedQ: ExamQuestion) => {
    if (!exam) return;
    pushUndoState(exam.questions);
    const updated = exam.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    const matrix = calculateMatrix(updated, exam.totalScore);
    const specifications = generateSpecifications(updated);
    const variants = generateVariants(updated, exam.variants.length);
    const auditChecks = runQualityAudit(
      updated,
      exam.totalScore,
      updated.length,
      exam.subject,
      exam.grade
    );

    setExam({
      ...exam,
      questions: updated,
      matrix,
      specifications,
      variants,
      auditChecks,
    });
    showToast('Đã cập nhật câu hỏi.');
  };

  // Delete question
  const handleDeleteQuestion = (qId: string) => {
    if (!exam) return;
    pushUndoState(exam.questions);
    const filtered = exam.questions.filter((q) => q.id !== qId);
    const matrix = calculateMatrix(filtered, exam.totalScore);
    const specifications = generateSpecifications(filtered);
    const variants = generateVariants(filtered, exam.variants.length);
    const auditChecks = runQualityAudit(
      filtered,
      exam.totalScore,
      filtered.length,
      exam.subject,
      exam.grade
    );

    setExam({
      ...exam,
      questions: filtered,
      matrix,
      specifications,
      variants,
      auditChecks,
    });
    showToast('Đã xóa câu hỏi khỏi đề.');
  };

  // Add new question
  const handleAddQuestion = () => {
    if (!exam) return;
    pushUndoState(exam.questions);
    const newIdx = exam.questions.length + 1;
    const newQ: ExamQuestion = {
      id: `Q${String(newIdx).padStart(2, '0')}`,
      subject: exam.subject,
      grade: exam.grade,
      topic: exam.topic || 'Nội dung bổ sung',
      questionType: 'multiple_choice_4',
      level: 'thong_hieu',
      question: `Nội dung câu hỏi mới số ${newIdx}: Hãy xác định phương án chính xác trong chương trình ${exam.grade}?`,
      options: [
        'Phương án A: Khẳng định đúng chuẩn kiến thức.',
        'Phương án B: Nhận định không chính xác.',
        'Phương án C: Dữ kiện thiếu căn cứ.',
        'Phương án D: Kết luận không phù hợp quy luật.',
      ],
      correctAnswer: 'A',
      explanation: 'Phương án A chính xác theo kiến thức chuẩn trong sách giáo khoa.',
      score: 0.25,
      learningOutcome: 'Áp dụng và phân tích câu hỏi mới.',
    };

    const updated = [...exam.questions, newQ];
    const matrix = calculateMatrix(updated, exam.totalScore);
    const specifications = generateSpecifications(updated);
    const variants = generateVariants(updated, exam.variants.length);
    const auditChecks = runQualityAudit(
      updated,
      exam.totalScore,
      updated.length,
      exam.subject,
      exam.grade
    );

    setExam({
      ...exam,
      questions: updated,
      matrix,
      specifications,
      variants,
      auditChecks,
    });
    showToast('Đã thêm 1 câu hỏi mới vào đề.');
  };

  // Save question to question bank
  const handleSaveToBank = (q: ExamQuestion) => {
    const bankItem: BankQuestion = {
      ...q,
      savedAt: new Date().toISOString(),
    };
    const nextBank = [bankItem, ...bankQuestions.filter((item) => item.id !== q.id)];
    setBankQuestions(nextBank);
    try {
      localStorage.setItem(STORAGE_KEY_BANK, JSON.stringify(nextBank));
    } catch (e) {
      console.error(e);
    }
    showToast('🔖 Đã lưu câu hỏi vào Ngân hàng câu hỏi!');
  };

  // Save current exam
  const handleSaveCurrentExam = () => {
    if (!exam) return;
    const nextSaved = [exam, ...savedExams.filter((item) => item.id !== exam.id)];
    setSavedExams(nextSaved);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_EXAMS, JSON.stringify(nextSaved));
    } catch (e) {
      console.error(e);
    }
    showToast('💾 Đã lưu đề thi vào thư viện đề!');
  };

  // Copy full exam to clipboard
  const handleCopyExam = () => {
    if (!exam) return;
    const text = formatExamAsText(exam);
    copyToClipboard(text);
    showToast('📋 Đã sao chép toàn bộ đề thi vào bộ nhớ tạm (dễ dán vào Word/Docs)!');
  };

  // Print Exam
  const handlePrint = () => {
    window.print();
  };

  // Apply parsed matrix
  const handleApplyParsedMatrix = (parsed: any, rawText: string) => {
    if (parsed.topics && parsed.topics.length > 0) {
      handleConfigChange({
        topic: parsed.topics[0],
        referenceDocText: rawText,
      });
    }
    if (parsed.cognitivePercent) {
      handleConfigChange({
        cognitivePercent: parsed.cognitivePercent,
      });
    }
    showToast('Đã áp dụng cấu trúc ma trận của giáo viên!');
  };

  // Initial auto-generation on first load if no exam yet
  useEffect(() => {
    if (!exam) {
      handleGenerateExam();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        onOpenQuestionBank={() => setIsBankOpen(true)}
        onOpenSavedExams={() => setIsSavedOpen(true)}
        onOpenMatrixImport={() => setIsMatrixImportOpen(true)}
        onRestoreConfig={handleRestoreConfig}
        onResetConfig={handleResetConfig}
      />

      {/* Main Workspace (Split View: Left Sidebar Settings & Right Preview) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Setup & Configuration (5 cols) */}
          <div className="lg:col-span-5 w-full sticky top-20">
            <ConfigSidebar
              config={config}
              onChange={handleConfigChange}
              onGenerateExam={handleGenerateExam}
              onGenerateMatrixOnly={handleGenerateMatrixOnly}
              isGenerating={isGenerating}
            />
          </div>

          {/* RIGHT COLUMN: Exam Preview, Matrix, Tabs & Export Controls (7 cols) */}
          <div className="lg:col-span-7 w-full space-y-4">
            {/* Top Action Ribbon / Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2 no-print">
              {/* Left Buttons: Variant Selector & Undo */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Variant Code Selector (101, 102, 103, 104) */}
                {exam && exam.variants && exam.variants.length > 1 && (
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                    <span className="text-[11px] font-bold text-slate-500 px-1.5 hidden sm:inline">
                      Mã đề:
                    </span>
                    {exam.variants.map((v) => (
                      <button
                        key={v.code}
                        onClick={() =>
                          setExam({ ...exam, selectedVariantCode: v.code })
                        }
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                          exam.selectedVariantCode === v.code
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {v.code}
                      </button>
                    ))}
                  </div>
                )}

                {/* Undo */}
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Hoàn tác chỉnh sửa câu hỏi"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hoàn tác</span>
                </button>

                {/* Regenerate Equivalent Exam */}
                <button
                  onClick={handleGenerateEquivalentExam}
                  disabled={isGenerating || !exam}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  title="Tạo bộ đề thi tương đương khác (giữ nguyên ma trận)"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Đề tương đương</span>
                </button>
              </div>

              {/* Right Export Actions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Print */}
                <button
                  onClick={handlePrint}
                  disabled={!exam}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  title="In khổ A4 chuẩn"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In đề</span>
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopyExam}
                  disabled={!exam}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Sao chép toàn bộ đề sang clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sao chép</span>
                </button>

                {/* Save Exam */}
                <button
                  onClick={handleSaveCurrentExam}
                  disabled={!exam}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  title="Lưu đề vào thư viện"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu đề</span>
                </button>

                {/* Download Word */}
                {exam && (
                  <button
                    onClick={() => downloadWordDocument(exam, 'exam')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                    title="Xuất file Microsoft Word (.doc)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Word</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB SELECTOR (Pages 7-8: TAB 1: Đề, TAB 2: Đáp án, TAB 3: Hướng dẫn chấm, TAB 4: Ma trận, TAB 5: Bản đặc tả, TAB 6: Kiểm tra đề) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex items-center overflow-x-auto gap-1 text-xs font-bold no-print">
              <button
                onClick={() => setActiveTab('exam')}
                className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'exam'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. ĐỀ KIỂM TRA</span>
              </button>

              <button
                onClick={() => setActiveTab('answer')}
                className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'answer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>2. ĐÁP ÁN</span>
              </button>

              <button
                onClick={() => setActiveTab('grading')}
                className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'grading'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>3. HƯỚNG DẪN CHẤM</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'matrix'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>4. MA TRẬN ĐỀ</span>
              </button>

              <button
                onClick={() => setActiveTab('spec')}
                className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'spec'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>5. BẢN ĐẶC TẢ</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'audit'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>6. KIỂM ĐỊNH (12 TIÊU CHÍ)</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            {exam ? (
              <div>
                {activeTab === 'exam' && (
                  <ExamViewTab
                    exam={exam}
                    onRegenerateQuestion={handleRegenerateQuestion}
                    onUpdateQuestion={handleUpdateQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                    onSaveToBank={handleSaveToBank}
                    onAddQuestion={handleAddQuestion}
                    regeneratingQuestionId={regeneratingQuestionId}
                  />
                )}

                {activeTab === 'answer' && <AnswerKeyTab exam={exam} />}

                {activeTab === 'grading' && <GradingGuideTab exam={exam} />}

                {activeTab === 'matrix' && <MatrixTab exam={exam} />}

                {activeTab === 'spec' && <SpecificationTab exam={exam} />}

                {activeTab === 'audit' && (
                  <AuditTab
                    auditChecks={exam.auditChecks}
                    onReaudit={() => {
                      const updatedAudit = runQualityAudit(
                        exam.questions,
                        exam.totalScore,
                        exam.questions.length,
                        exam.subject,
                        exam.grade
                      );
                      setExam({ ...exam, auditChecks: updatedAudit });
                      showToast('Đã chạy lại kiểm định chất lượng đề thi.');
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto opacity-40" />
                <h3 className="text-base font-bold text-slate-800">
                  Chưa có đề thi nào được tạo
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hãy thiết lập cấp học, môn học và số lượng câu hỏi ở cột bên trái, sau đó nhấn nút{' '}
                  <strong>&ldquo;TẠO ĐỀ KIỂM TRA&rdquo;</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER DISCLAIMER (Page 12, Rule 28: Academic Safety Principle) */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-600">
            &ldquo;Đề được AI hỗ trợ tạo. Giáo viên cần kiểm duyệt nội dung, đáp án và mức độ phù hợp trước khi sử dụng chính thức.&rdquo;
          </p>
          <span className="text-[11px] text-slate-400 shrink-0">
            Chương trình GDPT 2018 • THCS & THPT
          </span>
        </div>
      </footer>

      {/* PROGRESS MODAL (Page 11: 5 Sequential AI Stages) */}
      <ProgressModal
        isOpen={showProgressModal}
        currentStepIndex={progressStep}
        isComplete={isGenerationComplete}
        onClose={() => setShowProgressModal(false)}
      />

      {/* QUESTION BANK MODAL */}
      <QuestionBankModal
        isOpen={isBankOpen}
        onClose={() => setIsBankOpen(false)}
        bankQuestions={bankQuestions}
        onAddQuestionToExam={(bankQ) => {
          if (!exam) return;
          pushUndoState(exam.questions);
          const updated = [...exam.questions, bankQ];
          const matrix = calculateMatrix(updated, exam.totalScore);
          const specifications = generateSpecifications(updated);
          const variants = generateVariants(updated, exam.variants.length);
          const auditChecks = runQualityAudit(
            updated,
            exam.totalScore,
            updated.length,
            exam.subject,
            exam.grade
          );
          setExam({
            ...exam,
            questions: updated,
            matrix,
            specifications,
            variants,
            auditChecks,
          });
          showToast('Đã chèn câu hỏi từ ngân hàng vào đề!');
        }}
        onDeleteFromBank={(qId) => {
          const updated = bankQuestions.filter((q) => q.id !== qId);
          setBankQuestions(updated);
          try {
            localStorage.setItem(STORAGE_KEY_BANK, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          showToast('Đã xóa câu hỏi khỏi ngân hàng.');
        }}
        onDuplicateQuestion={(q) => {
          const copy: BankQuestion = {
            ...q,
            id: `BANK-${Date.now()}`,
            question: `${q.question} (Bản sao)`,
            savedAt: new Date().toISOString(),
          };
          const updated = [copy, ...bankQuestions];
          setBankQuestions(updated);
          try {
            localStorage.setItem(STORAGE_KEY_BANK, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          showToast('Đã nhân bản câu hỏi thành công.');
        }}
        onSaveManualQuestion={(q) => {
          const updated = [q, ...bankQuestions];
          setBankQuestions(updated);
          try {
            localStorage.setItem(STORAGE_KEY_BANK, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          showToast('Đã lưu câu hỏi mới vào ngân hàng.');
        }}
      />

      {/* SAVED EXAMS MODAL */}
      <SavedExamsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedExams={savedExams}
        onLoadExam={(loadedExam) => {
          setExam(loadedExam);
          showToast(`Đã mở lại đề thi: ${loadedExam.title}`);
        }}
        onDeleteExam={(id) => {
          const updated = savedExams.filter((e) => e.id !== id);
          setSavedExams(updated);
          try {
            localStorage.setItem(STORAGE_KEY_SAVED_EXAMS, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          showToast('Đã xóa đề thi khỏi danh sách đã lưu.');
        }}
      />

      {/* MATRIX IMPORT MODAL */}
      <MatrixImportModal
        isOpen={isMatrixImportOpen}
        onClose={() => setIsMatrixImportOpen(false)}
        onApplyParsedMatrix={handleApplyParsedMatrix}
        subject={config.subject}
        grade={config.grade}
      />
    </div>
  );
}
