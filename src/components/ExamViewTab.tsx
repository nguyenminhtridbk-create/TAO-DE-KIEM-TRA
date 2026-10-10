import React from 'react';
import { ExamData, ExamQuestion } from '../types/exam';
import { QuestionCard } from './QuestionCard';
import { Plus } from 'lucide-react';

interface ExamViewTabProps {
  exam: ExamData;
  onRegenerateQuestion: (question: ExamQuestion) => void;
  onUpdateQuestion: (updated: ExamQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onSaveToBank: (question: ExamQuestion) => void;
  onAddQuestion: () => void;
  regeneratingQuestionId: string | null;
}

export const ExamViewTab: React.FC<ExamViewTabProps> = ({
  exam,
  onRegenerateQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onSaveToBank,
  onAddQuestion,
  regeneratingQuestionId,
}) => {
  const currentVariant =
    exam.variants.find((v) => v.code === exam.selectedVariantCode) || exam.variants[0];
  const questions = currentVariant ? currentVariant.questions : exam.questions;

  // Group questions according to Ministry exam structure
  const part1 = questions.filter(
    (q) => q.questionType === 'multiple_choice_4' || q.questionType === 'multiple_correct'
  );
  const part2 = questions.filter((q) => q.questionType === 'true_false');
  const part3 = questions.filter(
    (q) =>
      q.questionType === 'short_answer' ||
      q.questionType === 'fill_blank' ||
      q.questionType === 'matching'
  );
  const part4 = questions.filter((q) => q.questionType.startsWith('essay'));

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {/* Official Vietnamese School Header (Standardized Exam Layout) */}
      <div className="border border-slate-300 rounded-2xl p-6 bg-white shadow-xs print:border-none print:p-0 print:shadow-none exam-print-sheet">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-xs text-slate-800">
          <div>
            <div className="font-bold uppercase tracking-wide text-slate-900">
              {exam.schoolName || 'TRƯỜNG THCS & THPT NGUYỄN DU'}
            </div>
            <div className="text-slate-600 mt-1">
              Họ và tên: ..........................................................................
            </div>
            <div className="text-slate-600 mt-1">
              Lớp: ................................ SBD: .................................
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold uppercase text-slate-900">
              {exam.title.toUpperCase()}
            </div>
            <div className="font-semibold text-blue-700 mt-1">
              Môn: {exam.subject} — Khối {exam.grade}
            </div>
            <div className="text-slate-600 italic mt-0.5">
              Thời gian làm bài: {exam.durationMinutes} phút (Không kể phát đề)
            </div>
            <div className="font-bold text-slate-900 mt-1">
              Mã đề thi: <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300">{exam.selectedVariantCode || '101'}</span>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="pt-6 space-y-8">
          {/* PHẦN I */}
          {part1.length > 0 && (
            <div className="space-y-3">
              <div className="bg-blue-50/80 border-l-4 border-blue-600 p-2.5 rounded-r-lg">
                <h3 className="font-bold text-xs uppercase text-blue-900">
                  PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn
                </h3>
                <p className="text-[11px] text-blue-800 italic">
                  Thí sinh trả lời từ câu 1 đến câu {part1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
                </p>
              </div>
              <div className="space-y-3">
                {part1.map((q) => {
                  const currentIdx = globalIndex++;
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={currentIdx}
                      onRegenerate={onRegenerateQuestion}
                      onUpdate={onUpdateQuestion}
                      onDelete={onDeleteQuestion}
                      onSaveToBank={onSaveToBank}
                      isRegenerating={regeneratingQuestionId === q.id}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* PHẦN II */}
          {part2.length > 0 && (
            <div className="space-y-3">
              <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-2.5 rounded-r-lg">
                <h3 className="font-bold text-xs uppercase text-emerald-900">
                  PHẦN II. Câu trắc nghiệm đúng / sai
                </h3>
                <p className="text-[11px] text-emerald-800 italic">
                  Thí sinh trả lời từng lệnh hỏi a), b), c), d). Trong mỗi ý ở mỗi câu, thí sinh chọn đúng hoặc sai.
                </p>
              </div>
              <div className="space-y-3">
                {part2.map((q) => {
                  const currentIdx = globalIndex++;
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={currentIdx}
                      onRegenerate={onRegenerateQuestion}
                      onUpdate={onUpdateQuestion}
                      onDelete={onDeleteQuestion}
                      onSaveToBank={onSaveToBank}
                      isRegenerating={regeneratingQuestionId === q.id}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* PHẦN III */}
          {part3.length > 0 && (
            <div className="space-y-3">
              <div className="bg-amber-50/80 border-l-4 border-amber-600 p-2.5 rounded-r-lg">
                <h3 className="font-bold text-xs uppercase text-amber-900">
                  PHẦN III. Câu trắc nghiệm trả lời ngắn / ghép nối / điền khuyết
                </h3>
                <p className="text-[11px] text-amber-800 italic">
                  Thí sinh điền kết quả / từ khóa tương ứng vào bài làm.
                </p>
              </div>
              <div className="space-y-3">
                {part3.map((q) => {
                  const currentIdx = globalIndex++;
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={currentIdx}
                      onRegenerate={onRegenerateQuestion}
                      onUpdate={onUpdateQuestion}
                      onDelete={onDeleteQuestion}
                      onSaveToBank={onSaveToBank}
                      isRegenerating={regeneratingQuestionId === q.id}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* PHẦN IV */}
          {part4.length > 0 && (
            <div className="space-y-3">
              <div className="bg-purple-50/80 border-l-4 border-purple-600 p-2.5 rounded-r-lg">
                <h3 className="font-bold text-xs uppercase text-purple-900">
                  PHẦN IV. Tự luận
                </h3>
                <p className="text-[11px] text-purple-800 italic">
                  Thí sinh trình bày chi tiết lời giải, bài văn hoặc lập luận vào giấy làm bài.
                </p>
              </div>
              <div className="space-y-3">
                {part4.map((q) => {
                  const currentIdx = globalIndex++;
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={currentIdx}
                      onRegenerate={onRegenerateQuestion}
                      onUpdate={onUpdateQuestion}
                      onDelete={onDeleteQuestion}
                      onSaveToBank={onSaveToBank}
                      isRegenerating={regeneratingQuestionId === q.id}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer exam notes */}
        <div className="text-center text-xs text-slate-500 italic pt-8 pb-4 border-t border-slate-200 mt-8">
          ---------- HẾT ----------
          <div className="mt-1 font-normal">(Cán bộ coi thi không giải thích gì thêm)</div>
        </div>
      </div>

      {/* Add question CTA button (hidden on print) */}
      <div className="no-print flex justify-center">
        <button
          onClick={onAddQuestion}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm câu hỏi mới vào đề</span>
        </button>
      </div>
    </div>
  );
};
