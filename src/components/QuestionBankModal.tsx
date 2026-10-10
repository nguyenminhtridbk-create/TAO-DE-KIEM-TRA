import React, { useState } from 'react';
import { BankQuestion, ExamQuestion, EducationLevel, CognitiveLevel, QuestionFormatId } from '../types/exam';
import {
  Database,
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Check,
  X,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankQuestions: BankQuestion[];
  onAddQuestionToExam: (question: ExamQuestion) => void;
  onDeleteFromBank: (questionId: string) => void;
  onDuplicateQuestion: (question: BankQuestion) => void;
  onSaveManualQuestion: (question: BankQuestion) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  bankQuestions,
  onAddQuestionToExam,
  onDeleteFromBank,
  onDuplicateQuestion,
  onSaveManualQuestion,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterCognitive, setFilterCognitive] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New question form state
  const [newQ, setNewQ] = useState<Partial<BankQuestion>>({
    level: 'nhan_biet',
    grade: 'Lớp 9',
    subject: 'Toán',
    topic: 'Căn thức bậc hai',
    questionType: 'multiple_choice_4',
    question: '',
    correctAnswer: 'A',
    options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
    explanation: '',
    score: 0.25,
    learningOutcome: 'Nhận biết khái niệm cơ bản',
  });

  if (!isOpen) return null;

  // Filtered list
  const filtered = bankQuestions.filter((q) => {
    if (filterGrade !== 'all' && q.grade !== filterGrade) return false;
    if (filterSubject !== 'all' && q.subject !== filterSubject) return false;
    if (filterCognitive !== 'all' && q.level !== filterCognitive) return false;
    if (filterFormat !== 'all' && q.questionType !== filterFormat) return false;
    if (searchQuery.trim()) {
      const qText = `${q.question} ${q.topic} ${q.explanation}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const handleCreateNew = () => {
    if (!newQ.question?.trim()) return;
    const item: BankQuestion = {
      id: `BANK-${Date.now()}`,
      subject: newQ.subject || 'Toán',
      grade: newQ.grade || 'Lớp 9',
      topic: newQ.topic || 'Chủ đề',
      questionType: (newQ.questionType as QuestionFormatId) || 'multiple_choice_4',
      level: (newQ.level as CognitiveLevel) || 'nhan_biet',
      question: newQ.question || '',
      options: newQ.options || [],
      correctAnswer: newQ.correctAnswer || 'A',
      explanation: newQ.explanation || '',
      score: newQ.score || 0.25,
      learningOutcome: newQ.learningOutcome || '',
      savedAt: new Date().toISOString(),
    };
    onSaveManualQuestion(item);
    setShowAddForm(false);
    setNewQ({
      level: 'nhan_biet',
      grade: 'Lớp 9',
      subject: 'Toán',
      topic: 'Chủ đề',
      questionType: 'multiple_choice_4',
      question: '',
      correctAnswer: 'A',
      options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
      explanation: '',
      score: 0.25,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                Ngân hàng câu hỏi giáo viên
              </h2>
              <p className="text-xs text-slate-500">
                Kho lưu trữ câu hỏi đạt chuẩn phân loại theo môn, khối lớp và mức độ nhận thức
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm câu hỏi mới</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          {/* Search bar */}
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo nội dung, chủ đề, lời giải..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Grade */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="py-1.5 px-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tất cả khối lớp</option>
            {['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Level */}
          <select
            value={filterCognitive}
            onChange={(e) => setFilterCognitive(e.target.value)}
            className="py-1.5 px-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="nhan_biet">Nhận biết</option>
            <option value="thong_hieu">Thông hiểu</option>
            <option value="van_dung">Vận dụng</option>
          </select>

          {/* Question Format */}
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="py-1.5 px-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">Tất cả dạng câu</option>
            <option value="multiple_choice_4">Trắc nghiệm 4 lựa chọn</option>
            <option value="true_false">Đúng / Sai</option>
            <option value="short_answer">Trả lời ngắn</option>
            <option value="essay_short">Tự luận</option>
          </select>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {/* Add form drawer */}
          {showAddForm && (
            <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-sm space-y-3 text-xs mb-4">
              <div className="flex items-center justify-between font-bold text-emerald-800">
                <span>Soạn câu hỏi mới vào ngân hàng:</span>
                <button onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Môn (VD: Toán, Ngữ văn...)"
                  value={newQ.subject}
                  onChange={(e) => setNewQ({ ...newQ, subject: e.target.value })}
                  className="p-1.5 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Khối (VD: Lớp 9, 10...)"
                  value={newQ.grade}
                  onChange={(e) => setNewQ({ ...newQ, grade: e.target.value })}
                  className="p-1.5 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Chủ đề kiến thức"
                  value={newQ.topic}
                  onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })}
                  className="p-1.5 border border-slate-300 rounded"
                />
                <select
                  value={newQ.level}
                  onChange={(e) => setNewQ({ ...newQ, level: e.target.value as CognitiveLevel })}
                  className="p-1.5 border border-slate-300 rounded"
                >
                  <option value="nhan_biet">Nhận biết</option>
                  <option value="thong_hieu">Thông hiểu</option>
                  <option value="van_dung">Vận dụng</option>
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Nhập nội dung câu hỏi..."
                value={newQ.question}
                onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Đáp án đúng (VD: A hoặc 12cm...)"
                  value={newQ.correctAnswer}
                  onChange={(e) => setNewQ({ ...newQ, correctAnswer: e.target.value })}
                  className="p-1.5 border border-slate-300 rounded font-bold text-emerald-700"
                />
                <input
                  type="number"
                  step="0.05"
                  placeholder="Điểm (VD: 0.25)"
                  value={newQ.score}
                  onChange={(e) => setNewQ({ ...newQ, score: parseFloat(e.target.value) || 0.25 })}
                  className="p-1.5 border border-slate-300 rounded"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Hướng dẫn giải chi tiết..."
                value={newQ.explanation}
                onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded text-slate-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                >
                  Lưu vào ngân hàng
                </button>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Chưa có câu hỏi nào trong ngân hàng phù hợp với bộ lọc hiện tại.
              <div className="mt-2 text-slate-500">
                (Thầy/cô có thể lưu câu hỏi từ đề vừa tạo bằng biểu tượng Bookmark 🔖 trên từng câu)
              </div>
            </div>
          ) : (
            filtered.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {q.subject} - {q.grade}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">{q.topic}</span>
                    <span className="text-slate-400">•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {q.level === 'nhan_biet' ? 'Nhận biết' : q.level === 'thong_hieu' ? 'Thông hiểu' : 'Vận dụng'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDuplicateQuestion(q)}
                      className="p-1 text-slate-500 hover:text-blue-600 rounded"
                      title="Nhân bản câu này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteFromBank(q.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Xóa khỏi ngân hàng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onAddQuestionToExam(q);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-bold flex items-center gap-1 ml-1"
                      title="Chèn câu này vào đề thi hiện tại"
                    >
                      <span>Chèn vào đề</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-slate-900 font-medium whitespace-pre-wrap">{q.question}</div>

                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 pl-2 text-slate-600">
                    {q.options.map((opt, i) => (
                      <div key={i}>
                        {['A', 'B', 'C', 'D'][i]}. {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>
                    <strong>Đáp án:</strong>{' '}
                    <span className="font-bold text-emerald-700">{q.correctAnswer}</span>
                  </div>
                  <div>
                    <strong>Điểm:</strong> {q.score}đ
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
