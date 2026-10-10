import React, { useState } from 'react';
import { ExamQuestion } from '../types/exam';
import {
  RefreshCw,
  Edit3,
  Trash2,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from 'lucide-react';

interface QuestionCardProps {
  question: ExamQuestion;
  index: number;
  onRegenerate: (question: ExamQuestion) => void;
  onUpdate: (updated: ExamQuestion) => void;
  onDelete: (questionId: string) => void;
  onSaveToBank: (question: ExamQuestion) => void;
  isRegenerating?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onRegenerate,
  onUpdate,
  onDelete,
  onSaveToBank,
  isRegenerating = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [editForm, setEditForm] = useState<ExamQuestion>(question);

  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case 'nhan_biet':
        return 'Nhận biết';
      case 'thong_hieu':
        return 'Thông hiểu';
      case 'van_dung':
        return 'Vận dụng';
      default:
        return 'Vận dụng';
    }
  };

  const getLevelBadgeColor = (lvl: string) => {
    switch (lvl) {
      case 'nhan_biet':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'thong_hieu':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'van_dung':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSaveEdit = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-4 rounded-xl border bg-white transition-all print-page-break-inside-avoid ${
        question.needsTeacherCheck
          ? 'border-amber-300 ring-1 ring-amber-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header bar of question card */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm">
            Câu {index + 1}
          </span>
          <span className="text-xs font-semibold text-blue-700">
            ({question.score} điểm)
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getLevelBadgeColor(
              question.level
            )}`}
          >
            {getLevelLabel(question.level)}
          </span>
          {question.topic && (
            <span className="text-xs text-slate-500 hidden sm:inline">
              • {question.topic}
            </span>
          )}
          {question.isTeacherCustom && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Giáo viên cố định
            </span>
          )}
        </div>

        {/* Action buttons (hidden when printing) */}
        <div className="flex items-center gap-1 no-print">
          <button
            onClick={() => onRegenerate(question)}
            disabled={isRegenerating || question.isTeacherCustom}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='Tạo lại câu này'"
            title="Tạo lại câu này với AI"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : ''}`}
            />
          </button>

          <button
            onClick={() => {
              setEditForm(question);
              setIsEditing(!isEditing);
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Chỉnh sửa câu hỏi"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSaveToBank(question)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Lưu câu này vào ngân hàng câu hỏi"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(question.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa câu hỏi này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Warning Flag if needs review */}
      {question.needsTeacherCheck && (
        <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5 no-print">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">⚠️ Cần giáo viên kiểm tra:</span>
          <span>Dữ kiện bài toán cần thầy/cô rà soát trước khi thi chính thức.</span>
        </div>
      )}

      {/* Editing Mode */}
      {isEditing ? (
        <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-blue-200 my-2">
          <div>
            <label className="text-xs font-semibold text-slate-700">Nội dung câu hỏi:</label>
            <textarea
              rows={3}
              value={editForm.question}
              onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-1 bg-white"
            />
          </div>

          {/* Options edit if multiple choice */}
          {editForm.options && editForm.options.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Các phương án:</label>
              {editForm.options.map((opt, oIdx) => {
                const letters = ['A', 'B', 'C', 'D'];
                return (
                  <div key={oIdx} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-4">{letters[oIdx]}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...editForm.options!];
                        newOpts[oIdx] = e.target.value;
                        setEditForm({ ...editForm, options: newOpts });
                      }}
                      className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">Đáp án đúng:</label>
              <input
                type="text"
                value={editForm.correctAnswer}
                onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })}
                className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Điểm số:</label>
              <input
                type="number"
                step="0.05"
                value={editForm.score}
                onChange={(e) =>
                  setEditForm({ ...editForm, score: parseFloat(e.target.value) || 0 })
                }
                className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Hướng dẫn giải:</label>
            <textarea
              rows={2}
              value={editForm.explanation}
              onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-1 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Lưu thay đổi
            </button>
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="space-y-3">
          {/* Question Text */}
          <div className="text-sm font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
            {question.question}
          </div>

          {/* Options for Multiple Choice */}
          {question.options && question.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {question.options.map((opt, oIdx) => {
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                const isCorrect =
                  question.correctAnswer.trim().toUpperCase() === letters[oIdx];
                return (
                  <div
                    key={oIdx}
                    className="p-2 rounded-lg border border-slate-100 bg-slate-50/60 text-xs flex items-start gap-2"
                  >
                    <span className="font-bold text-slate-700 shrink-0">
                      {letters[oIdx]}.
                    </span>
                    <span className="text-slate-800">{opt}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub questions for True/False (4 statements) */}
          {question.subQuestions && question.subQuestions.length > 0 && (
            <div className="space-y-1.5 pt-1 pl-2 border-l-2 border-blue-200">
              {question.subQuestions.map((sq, sqIdx) => (
                <div key={sqIdx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="font-bold text-slate-900">{sq.label})</span>
                  <span>{sq.statement}</span>
                </div>
              ))}
            </div>
          )}

          {/* Collapsible Answer & Explanation toggle (hidden during print) */}
          <div className="pt-1 no-print">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <span>{showExplanation ? 'Ẩn lời giải & đáp án' : 'Xem đáp án & lời giải chi tiết'}</span>
              {showExplanation ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showExplanation && (
              <div className="mt-2 p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Đáp án chuẩn:</span>
                  <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {question.correctAnswer}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Hướng dẫn giải chi tiết:</span>
                  <div className="mt-1 text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-2.5 rounded-lg border border-blue-100">
                    {question.explanation}
                  </div>
                </div>
                {question.learningOutcome && (
                  <div className="text-slate-500 text-[11px]">
                    <strong>Yêu cầu cần đạt:</strong> {question.learningOutcome}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
