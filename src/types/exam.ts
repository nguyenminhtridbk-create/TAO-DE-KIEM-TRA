export type EducationLevel = 'THCS' | 'THPT';

export type ExamType =
  | 'Kiểm tra thường xuyên'
  | 'Kiểm tra 15 phút'
  | 'Kiểm tra giữa kỳ I'
  | 'Kiểm tra giữa kỳ II'
  | 'Kiểm tra cuối kỳ I'
  | 'Kiểm tra cuối kỳ II'
  | 'Đề ôn tập'
  | 'Đề luyện tập'
  | 'Đề khảo sát'
  | 'Đề tuyển chọn học sinh'
  | 'Đề tự tạo';

export type QuestionFormatId =
  | 'multiple_choice_4'
  | 'multiple_correct'
  | 'true_false'
  | 'matching'
  | 'fill_blank'
  | 'short_answer'
  | 'essay_short'
  | 'essay_explain'
  | 'essay_present'
  | 'essay_solve'
  | 'essay_analyze'
  | 'essay_compare'
  | 'essay_prove'
  | 'essay_practical'
  | 'essay_reading'
  | 'essay_writing';

export interface QuestionFormatConfig {
  id: QuestionFormatId;
  label: string;
  category: 'Trắc nghiệm' | 'Tự luận';
  defaultCount: number;
  description?: string;
}

export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export interface CognitiveDistribution {
  mode: 'count' | 'percent';
  nhan_biet: number;
  thong_hieu: number;
  van_dung: number;
}

export interface SubQuestionItem {
  label: string; // a, b, c, d
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ExamQuestion {
  id: string; // Q01, Q02,...
  subject: string;
  grade: string;
  topic: string;
  questionType: QuestionFormatId;
  level: CognitiveLevel;
  question: string;
  passage?: string; // Đoạn trích đọc hiểu nếu có
  options?: string[]; // A, B, C, D
  subQuestions?: SubQuestionItem[]; // Cho câu Đúng/Sai 4 ý
  matchingPairs?: { left: string; right: string }[];
  correctAnswer: string;
  explanation: string;
  score: number;
  learningOutcome: string;
  needsTeacherCheck?: boolean; // Cần giáo viên kiểm tra nếu dữ kiện phức tạp
  isTeacherCustom?: boolean; // Khóa / Giữ nguyên câu giáo viên đã nhập
}

export interface MatrixTopicRow {
  topicName: string;
  nhanBiet: { count: number; points: number; percent: number };
  thongHieu: { count: number; points: number; percent: number };
  vanDung: { count: number; points: number; percent: number };
  total: { count: number; points: number; percent: number };
}

export interface ExamMatrix {
  rows: MatrixTopicRow[];
  totalQuestions: number;
  totalPoints: number;
  nhanBietSummary: { count: number; points: number; percent: number };
  thongHieuSummary: { count: number; points: number; percent: number };
  vanDungSummary: { count: number; points: number; percent: number };
}

export interface SpecificationItem {
  id: string;
  topic: string;
  knowledgeUnit: string;
  learningOutcome: string;
  level: CognitiveLevel;
  questionType: QuestionFormatId;
  count: number;
  score: number;
  questionIds: string[];
}

export interface QualityAuditItem {
  id: number;
  title: string;
  passed: boolean;
  message: string;
  detail?: string;
}

export interface ExamVariant {
  code: string; // '101', '102', '103', '104'
  questions: ExamQuestion[];
  answerTable: { questionNumber: number; answer: string; score: number }[];
}

export interface ExamData {
  id: string;
  createdAt: string;
  title: string;
  schoolName: string;
  studentNamePrompt: string;
  level: EducationLevel;
  grade: string;
  subject: string;
  examType: ExamType;
  durationMinutes: number;
  totalScore: number;
  topic: string;
  chapter: string;
  knowledgeScope: string;
  testContent: string;
  learningOutcomes: string;
  teacherNotes: string;
  referenceDocText: string;
  referenceMode: 'doc_only' | 'doc_plus_standard' | 'manual_only';
  questions: ExamQuestion[];
  matrix: ExamMatrix;
  specifications: SpecificationItem[];
  gradingGuide: {
    rubricItems: { criteria: string; subScore: number; totalScore: number }[];
    generalNotes: string[];
  };
  auditChecks: QualityAuditItem[];
  variants: ExamVariant[];
  selectedVariantCode: string;
}

export interface TeacherPredefinedQuestion {
  id: string;
  question: string;
  questionType: QuestionFormatId;
  level: CognitiveLevel;
  correctAnswer: string;
  score: number;
  options?: string[];
}

export interface ExamConfigState {
  level: EducationLevel;
  grade: string;
  subject: string;
  customSubject: string;
  examType: ExamType;
  examTitle: string;
  schoolName: string;
  durationMinutes: number;
  isCustomDuration: boolean;
  topic: string;
  chapter: string;
  knowledgeScope: string;
  testContent: string;
  learningOutcomes: string;
  teacherNotes: string;
  lessonContentText: string;
  referenceDocText: string;
  referenceDocName: string;
  referenceMode: 'doc_only' | 'doc_plus_standard' | 'manual_only';
  selectedFormats: Record<QuestionFormatId, { enabled: boolean; count: number }>;
  cognitiveMode: 'count' | 'percent';
  cognitiveCount: { nhan_biet: number; thong_hieu: number; van_dung: number };
  cognitivePercent: { nhan_biet: number; thong_hieu: number; van_dung: number };
  totalScore: number;
  numberOfVariants: number; // 1, 2, 3, 4
  keepTeacherQuestions: boolean;
  teacherQuestions: TeacherPredefinedQuestion[];
}

export interface BankQuestion extends ExamQuestion {
  savedAt: string;
  tags?: string[];
}
