import { EducationLevel, ExamType, QuestionFormatConfig } from '../types/exam';

export const THCS_GRADES = ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'];
export const THPT_GRADES = ['Lớp 10', 'Lớp 11', 'Lớp 12'];

export const POPULAR_SUBJECTS_THCS = [
  'Toán',
  'Ngữ văn',
  'Tiếng Anh',
  'Khoa học tự nhiên',
  'Lịch sử và Địa lí',
  'Tin học',
  'Công nghệ',
  'Giáo dục công dân',
  'Âm nhạc',
  'Mĩ thuật',
];

export const POPULAR_SUBJECTS_THPT = [
  'Toán',
  'Ngữ văn',
  'Tiếng Anh',
  'Vật lí',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lí',
  'Giáo dục kinh tế và pháp luật',
  'Tin học',
  'Công nghệ',
  'Giáo dục quốc phòng và an ninh',
];

export const EXAM_TYPES: ExamType[] = [
  'Kiểm tra thường xuyên',
  'Kiểm tra 15 phút',
  'Kiểm tra giữa kỳ I',
  'Kiểm tra giữa kỳ II',
  'Kiểm tra cuối kỳ I',
  'Kiểm tra cuối kỳ II',
  'Đề ôn tập',
  'Đề luyện tập',
  'Đề khảo sát',
  'Đề tuyển chọn học sinh',
  'Đề tự tạo',
];

export const DURATION_OPTIONS = [10, 15, 30, 45, 60, 90, 120];

export const SCORE_OPTIONS = [10, 20, 100];

export const QUESTION_FORMATS: QuestionFormatConfig[] = [
  // Trắc nghiệm
  {
    id: 'multiple_choice_4',
    label: '4 lựa chọn A/B/C/D',
    category: 'Trắc nghiệm',
    defaultCount: 12,
    description: 'Trắc nghiệm nhiều lựa chọn tiêu chuẩn (chọn 1 phương án đúng nhất)',
  },
  {
    id: 'multiple_correct',
    label: 'Nhiều đáp án đúng',
    category: 'Trắc nghiệm',
    defaultCount: 0,
    description: 'Trắc nghiệm chọn tất cả các phương án đúng',
  },
  {
    id: 'true_false',
    label: 'Đúng / Sai (4 ý)',
    category: 'Trắc nghiệm',
    defaultCount: 4,
    description: 'Dạng trắc nghiệm Đúng/Sai gồm 4 lệnh hỏi a, b, c, d chuẩn mới',
  },
  {
    id: 'short_answer',
    label: 'Trả lời ngắn',
    category: 'Trắc nghiệm',
    defaultCount: 4,
    description: 'Học sinh tự điền đáp số / từ khóa ngắn gọn',
  },
  {
    id: 'matching',
    label: 'Ghép nối',
    category: 'Trắc nghiệm',
    defaultCount: 0,
    description: 'Ghép nối nội dung tương ứng giữa 2 cột A và B',
  },
  {
    id: 'fill_blank',
    label: 'Điền khuyết',
    category: 'Trắc nghiệm',
    defaultCount: 0,
    description: 'Điền từ / cụm từ còn thiếu vào chỗ trống',
  },

  // Tự luận
  {
    id: 'essay_short',
    label: 'Câu hỏi ngắn',
    category: 'Tự luận',
    defaultCount: 2,
    description: 'Câu hỏi yêu cầu trả lời ngắn gọn',
  },
  {
    id: 'essay_solve',
    label: 'Giải bài tập',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Giải chi tiết bài toán, bài tập tự luận',
  },
  {
    id: 'essay_explain',
    label: 'Giải thích',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Giải thích hiện tượng, khái niệm hoặc quy luật',
  },
  {
    id: 'essay_present',
    label: 'Trình bày',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Trình bày quá trình, nội dung, đặc điểm',
  },
  {
    id: 'essay_analyze',
    label: 'Phân tích',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Phân tích nhân vật, sự kiện, đồ thị, bảng số liệu',
  },
  {
    id: 'essay_compare',
    label: 'So sánh',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'So sánh điểm giống và khác nhau',
  },
  {
    id: 'essay_prove',
    label: 'Chứng minh',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Chứng minh tính chất, định lý, nhận định',
  },
  {
    id: 'essay_practical',
    label: 'Vận dụng thực tế',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Liên hệ thực tiễn và giải quyết vấn đề đời sống',
  },
  {
    id: 'essay_reading',
    label: 'Đọc hiểu',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Đọc đoạn trích văn bản và trả lời câu hỏi',
  },
  {
    id: 'essay_writing',
    label: 'Viết đoạn / bài',
    category: 'Tự luận',
    defaultCount: 0,
    description: 'Viết đoạn văn ngắn hoặc bài văn nghị luận/bài luận',
  },
];

export const INITIAL_CONFIG = {
  level: 'THCS' as EducationLevel,
  grade: 'Lớp 9',
  subject: 'Toán',
  customSubject: '',
  examType: 'Kiểm tra giữa kỳ I' as ExamType,
  examTitle: 'Đề kiểm tra giữa học kỳ I',
  schoolName: 'Trường THCS & THPT Nguyễn Du',
  durationMinutes: 45,
  isCustomDuration: false,
  topic: 'Phương trình bậc nhất và định lý Vi-ét',
  chapter: 'Chương I: Căn thức và Phương trình',
  knowledgeScope: 'Từ bài 1 đến bài 5',
  testContent: 'Hàm số bậc nhất, đồ thị hàm số, giải phương trình và hệ phương trình bậc nhất hai ẩn',
  learningOutcomes: 'Học sinh nắm vững định nghĩa, biết giải phương trình và vẽ đồ thị hàm số, vận dụng giải bài toán thực tế',
  teacherNotes: 'Chú ý cho số liệu nguyên đẹp, các phương án nhiễu logic, kiểm tra kỹ phép tính.',
  lessonContentText: '',
  referenceDocText: '',
  referenceDocName: '',
  referenceMode: 'doc_plus_standard' as const,
  selectedFormats: {
    multiple_choice_4: { enabled: true, count: 12 },
    multiple_correct: { enabled: false, count: 0 },
    true_false: { enabled: true, count: 2 },
    matching: { enabled: false, count: 0 },
    fill_blank: { enabled: false, count: 0 },
    short_answer: { enabled: true, count: 2 },
    essay_short: { enabled: true, count: 1 },
    essay_explain: { enabled: false, count: 0 },
    essay_present: { enabled: false, count: 0 },
    essay_solve: { enabled: true, count: 1 },
    essay_analyze: { enabled: false, count: 0 },
    essay_compare: { enabled: false, count: 0 },
    essay_prove: { enabled: false, count: 0 },
    essay_practical: { enabled: false, count: 0 },
    essay_reading: { enabled: false, count: 0 },
    essay_writing: { enabled: false, count: 0 },
  },
  cognitiveMode: 'percent' as const,
  cognitiveCount: { nhan_biet: 8, thong_hieu: 6, van_dung: 4 },
  cognitivePercent: { nhan_biet: 40, thong_hieu: 30, van_dung: 30 },
  totalScore: 10,
  numberOfVariants: 2,
  keepTeacherQuestions: false,
  teacherQuestions: [],
};
