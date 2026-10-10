export interface CurriculumPreset {
  subject: string;
  grade: string;
  bookSeries: 'Kết nối tri thức';
  term: 'Giữa học kỳ I' | 'Cuối học kỳ I' | 'Giữa học kỳ II' | 'Cuối học kỳ II';
  chapter: string;
  topic: string;
  knowledgeScope: string;
  testContent: string;
  learningOutcomes: string;
  suggestedFormats: { [format: string]: number };
}

export const VIETNAMESE_CURRICULUM_DATABASE: CurriculumPreset[] = [
  // ===================== SINH HỌC 12 (KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Sinh học',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Chương 1: Di truyền phân tử và di truyền tế bào (Phần 5: Di truyền học)',
    topic: 'Cơ chế di truyền phân tử, đột biến gen và biến dị nhiễm sắc thể',
    knowledgeScope: 'Từ Bài 1 đến Bài 6 (SGK Sinh học 12 Kết nối tri thức)',
    testContent:
      'Gen, mã di truyền và quá trình nhân đôi DNA; Phiên mã và dịch mã; Điều hòa hoạt động của gen (Operon Lac); Đột biến gen; Nhiễm sắc thể và đột biến cấu trúc, số lượng NST; Các quy luật di truyền của Mendel và mở rộng học thuyết Mendel.',
    learningOutcomes:
      'Nêu được cấu trúc của gen, bản chất mã di truyền; Trình bày các giai đoạn nhân đôi DNA, phiên mã, dịch mã; Phân tích cơ chế phát sinh và hậu quả của đột biến gen, đột biến NST; Vận dụng giải các bài toán về xác suất phân ly kiểu gen, kiểu hình và cơ chế di truyền.',
    suggestedFormats: {
      multiple_choice_4: 18,
      true_false: 4,
      short_answer: 6,
    },
  },
  {
    subject: 'Sinh học',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Cuối học kỳ I',
    chapter: 'Chương 1 & Chương 2: Di truyền học quần thể và Di truyền học người',
    topic: 'Di truyền học liên kết giới tính, quần thể và công nghệ di truyền',
    knowledgeScope: 'Từ Bài 1 đến Bài 12 (Toàn bộ Học kỳ I Sinh 12 KNTT)',
    testContent:
      'Di truyền liên kết với giới tính và di truyền ngoài nhân; Di truyền học quần thể (Cấu trúc di truyền và định luật Hardy - Weinberg); Di truyền học người; Ứng dụng công nghệ gen và tế bào.',
    learningOutcomes:
      'Tính toán trạng thái cân bằng di truyền của quần thể; Phân tích sơ đồ phả hệ di truyền học người; Vận dụng giải quyết các tình huống sinh học thực tiễn.',
    suggestedFormats: {
      multiple_choice_4: 18,
      true_false: 4,
      short_answer: 6,
    },
  },
  {
    subject: 'Sinh học',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ II',
    chapter: 'Phần 6: Tiến hóa - Chương 3: Bằng chứng và các học thuyết tiến hóa',
    topic: 'Học thuyết tiến hóa tổng hợp hiện đại và các nhân tố tiến hóa',
    knowledgeScope: 'Từ Bài 13 đến Bài 18 (SGK Sinh học 12 KNTT)',
    testContent:
      'Bằng chứng giải phẫu so sánh, phôi sinh học và sinh học phân tử; Học thuyết Darwin; Học thuyết tiến hóa tổng hợp hiện đại; Các nhân tố tiến hóa (Đột biến, Di nhập gen, Chọn lọc tự nhiên, Dạt trôi di truyền, Giao phối không ngẫu nhiên); Quá trình hình thành loài mới.',
    learningOutcomes:
      'Phân tích vai trò của từng nhân tố tiến hóa; Giải thích được sự thích nghi của sinh vật và cơ chế hình thành loài mới.',
    suggestedFormats: {
      multiple_choice_4: 18,
      true_false: 4,
      short_answer: 6,
    },
  },
  {
    subject: 'Sinh học',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Cuối học kỳ II',
    chapter: 'Phần 7: Sinh thái học và Môi trường',
    topic: 'Sinh thái học cá thể, quần thể, quần xã sinh vật và hệ sinh thái',
    knowledgeScope: 'Từ Bài 19 đến Bài 26 (SGK Sinh học 12 KNTT)',
    testContent:
      'Môi trường sống và các nhân tố sinh thái; Sinh thái học quần thể sinh vật; Quần xã sinh vật và diễn thế sinh thái; Hệ sinh thái, chu trình sinh địa hóa và bảo vệ môi trường, phát triển bền vững.',
    learningOutcomes:
      'Hiểu rõ mối quan hệ giữa sinh vật với môi trường; Phân tích dòng năng lượng và chuỗi/lưới thức ăn trong hệ sinh thái; Vận dụng bảo vệ đa dạng sinh học.',
    suggestedFormats: {
      multiple_choice_4: 18,
      true_false: 4,
      short_answer: 6,
    },
  },

  // ===================== TOÁN 12 (KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Toán',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số',
    topic: 'Tính đơn điệu, cực trị, GTLN-GTNN và đường tiệm cận của đồ thị hàm số',
    knowledgeScope: 'Bài 1 đến Bài 5 (SGK Toán 12 Tập 1 Kết nối tri thức)',
    testContent:
      'Tính đơn điệu và cực trị của hàm số; Giá trị lớn nhất và giá trị nhỏ nhất của hàm số trên đoạn/khoảng; Đường tiệm cận đứng, tiệm cận ngang và tiệm cận xiên; Khảo sát sự biến thiên và vẽ đồ thị của một số hàm số cơ bản (bậc ba, phân thức bậc nhất/bậc nhất, phân thức bậc hai/bậc nhất); Ứng dụng đạo hàm giải bài toán thực tế (tối ưu hóa).',
    learningOutcomes:
      'Xác định được các khoảng đơn điệu, điểm cực trị của hàm số thông qua đạo hàm; Tìm được tiệm cận đứng, ngang, xiên; Đọc và phân tích bảng biến thiên, đồ thị hàm số; Giải được bài toán thực tế tìm giá trị lớn nhất, nhỏ nhất.',
    suggestedFormats: {
      multiple_choice_4: 12,
      true_false: 4,
      short_answer: 6,
    },
  },
  {
    subject: 'Toán',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Cuối học kỳ I',
    chapter: 'Chương II: Vectơ và tọa độ trong không gian & Chương III: Các số đặc trưng đo độ phân tán',
    topic: 'Tọa độ vectơ trong không gian Oxyz và thống kê mẫu số liệu ghép nhóm',
    knowledgeScope: 'Từ Bài 6 đến Bài 10 (SGK Toán 12 Tập 1 Kết nối tri thức)',
    testContent:
      'Vectơ trong không gian; Hệ trục tọa độ Oxyz; Biểu thức tọa độ của các phép toán vectơ, tích vô hướng; Khoảng biến thiên, khoảng tứ phân vị, phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm.',
    learningOutcomes:
      'Thành thạo các phép toán vectơ trong hệ trục Oxyz; Tính được khoảng cách, góc giữa hai vectơ; Tính toán và diễn giải ý nghĩa các số đo độ phân tán của mẫu số liệu ghép nhóm.',
    suggestedFormats: {
      multiple_choice_4: 12,
      true_false: 4,
      short_answer: 6,
    },
  },

  // ===================== VẬT LÍ 12 (KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Vật lí',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Chương 1: Vật lí nhiệt',
    topic: 'Nhiệt độ, thang nhiệt độ, nhiệt lượng và sự chuyển thể của chất',
    knowledgeScope: 'Bài 1 đến Bài 7 (SGK Vật lí 12 Kết nối tri thức)',
    testContent:
      'Cấu trúc của chất và mô hình động học phân tử; Thang nhiệt độ Celsius và Kelvin; Nội năng và sự biến thiên nội năng; Định luật 1 Nhiệt động lực học; Nhiệt dung riêng, nhiệt nóng chảy riêng và nhiệt hóa hơi riêng; Thực hành đo nhiệt hóa hơi / nhiệt dung riêng.',
    learningOutcomes:
      'Giải thích cấu trúc các thể của chất theo mô hình phân tử; Vận dụng công thức chuyển đổi nhiệt độ Celsius và Kelvin; Áp dụng công thức Q = mcΔt, Q = Lm, Q = λm giải bài toán cân bằng nhiệt và nguyên lí 1 NĐLH.',
    suggestedFormats: {
      multiple_choice_4: 18,
      true_false: 4,
      short_answer: 6,
    },
  },

  // ===================== HÓA HỌC 12 (KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Hóa học',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Chương 1: Ester - Lipid và Chương 2: Carbohydrate',
    topic: 'Ester, chất béo, glucose, fructose, saccharose, tinh bột và cellulose',
    knowledgeScope: 'Bài 1 đến Bài 6 (SGK Hóa học 12 Kết nối tri thức)',
    testContent:
      'Cấu tạo, đồng phân, danh pháp và tính chất hóa học của ester; Phản ứng xà phòng hóa chất béo; Cấu tạo phân tử và tính chất hóa học của Glucose, Fructose (phản ứng tráng bạc, khử Cu(OH)2); Tính chất của Saccharose, Maltose; Phản ứng thủy phân và phản ứng màu của Tinh bột, Cellulose; Ứng dụng thực tiễn.',
    learningOutcomes:
      'Viết được CTCT và PTHH phản ứng thủy phân ester, xà phòng hóa lipid; Phân biệt các loại carbohydrate bằng phản ứng hóa học đặc trưng; Vận dụng giải bài toán tính hiệu suất, khối lượng bạc tạo thành hoặc xà phòng hóa.',
    suggestedFormats: {
      multiple_choice_4: 18,
      true_false: 4,
      short_answer: 6,
    },
  },

  // ===================== NGỮ VĂN 12 (KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Ngữ văn',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Bài 1: Khả năng lớn lao của tiểu thuyết & Bài 2: Những thế giới thơ',
    topic: 'Đọc hiểu truyện hiện đại / trích đoạn tiểu thuyết và thơ trữ tình',
    knowledgeScope: 'Bài 1 và Bài 2 (SGK Ngữ văn 12 Tập 1 Kết nối tri thức)',
    testContent:
      'Đọc hiểu: Nhận biết ngôi kể, điểm nhìn trần thuật, nhân vật, chi tiết nghệ thuật tiêu biểu, cảm hứng chủ đạo, ngôn từ nghệ thuật; Tiếng Việt: Giữ gìn và phát triển tiếng Việt, biện pháp tu từ; Viết: Bài văn nghị luận so sánh, đánh giá hai tác phẩm truyện/thơ hoặc bài văn nghị luận xã hội về một vấn đề đời sống.',
    learningOutcomes:
      'Phân tích được các yếu tố nghệ thuật của thể loại tiểu thuyết và thơ trữ tình; Thể hiện cảm nhận sâu sắc về tư tưởng tác phẩm; Viết bài văn nghị luận mạch lạc, luận điểm sắc bén, dẫn chứng thuyết phục.',
    suggestedFormats: {
      multiple_choice_4: 0,
      essay_reading: 1,
      essay_short: 2,
      essay_writing: 1,
    },
  },

  // ===================== TIẾNG ANH 12 (KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Tiếng Anh',
    grade: 'Lớp 12',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Unit 1: Life stories we admire & Unit 2: A diversity of cultures',
    topic: 'Past simple vs Past continuous, Articles, Compound adjectives & Culture vocabulary',
    knowledgeScope: 'Unit 1 to Unit 2 (Global Success / KNTT Grade 12)',
    testContent:
      'Phonetics (Stress & Pronunciation); Vocabulary related to admirable life stories and world cultures; Grammar: Past simple, past continuous, relative clauses, articles (a/an/the); Reading comprehension passages; Cloze test; Sentence rewriting and error identification.',
    learningOutcomes:
      'Understand and use target vocabulary in context; Master narrative past tenses; Demonstrate reading skills including skimming, scanning, and inferencing; Complete sentence transformation tasks accurately.',
    suggestedFormats: {
      multiple_choice_4: 28,
      true_false: 4,
      short_answer: 4,
    },
  },

  // ===================== KHOA HỌC TỰ NHIÊN 9 (THCS - KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Khoa học tự nhiên',
    grade: 'Lớp 9',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Chủ đề: Năng lượng cơ học, Ánh sáng & Hóa học vô cơ',
    topic: 'Động năng, thế năng, khúc xạ ánh sáng, kim loại và phi kim',
    knowledgeScope: 'Từ Bài 1 đến Bài 12 (KHTN 9 Kết nối tri thức)',
    testContent:
      'Động năng, thế năng và cơ năng; Hiện tượng khúc xạ ánh sáng và phản xạ toàn phần; Tính chất hóa học của kim loại, dãy hoạt động hóa học của kim loại; Nhôm, Sắt và hợp kim.',
    learningOutcomes:
      'Tính được động năng, thế năng và cơ năng của vật; Vận dụng định luật khúc xạ ánh sáng; Viết đúng PTHH của kim loại với axit, muối; Giải bài toán định lượng cơ bản.',
    suggestedFormats: {
      multiple_choice_4: 16,
      true_false: 2,
      short_answer: 4,
      essay_solve: 1,
    },
  },

  // ===================== TOÁN 9 (THCS - KẾT NỐI TRI THỨC) =====================
  {
    subject: 'Toán',
    grade: 'Lớp 9',
    bookSeries: 'Kết nối tri thức',
    term: 'Giữa học kỳ I',
    chapter: 'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn & Chương II: Căn bậc hai',
    topic: 'Giải hệ phương trình bậc nhất hai ẩn và căn thức bậc hai',
    knowledgeScope: 'Bài 1 đến Bài 6 (SGK Toán 9 Tập 1 Kết nối tri thức)',
    testContent:
      'Phương trình bậc nhất hai ẩn; Hệ hai phương trình bậc nhất hai ẩn (phương pháp thế và cộng đại số); Giải bài toán bằng cách lập hệ phương trình; Căn bậc hai, căn bậc ba và các phép biến đổi đơn giản biểu thức chứa căn thức bậc hai.',
    learningOutcomes:
      'Giải thành thạo hệ hai phương trình bậc nhất hai ẩn; Rút gọn biểu thức chứa căn thức bậc hai; Lập được hệ phương trình giải bài toán thực tế (toán chuyển động, năng suất, phần trăm).',
    suggestedFormats: {
      multiple_choice_4: 12,
      true_false: 2,
      short_answer: 2,
      essay_solve: 2,
    },
  },
];

/**
 * Find matching curriculum preset strictly for Kết nối tri thức
 */
export function findCurriculumPreset(
  subject: string,
  grade: string,
  term: 'Giữa học kỳ I' | 'Cuối học kỳ I' | 'Giữa học kỳ II' | 'Cuối học kỳ II'
): CurriculumPreset | null {
  const match = VIETNAMESE_CURRICULUM_DATABASE.find(
    (item) =>
      item.subject.toLowerCase() === subject.toLowerCase() &&
      item.grade.toLowerCase() === grade.toLowerCase() &&
      item.term === term
  );
  if (match) return match;

  const fallbackMatch = VIETNAMESE_CURRICULUM_DATABASE.find(
    (item) =>
      item.subject.toLowerCase().includes(subject.toLowerCase()) &&
      item.grade.toLowerCase() === grade.toLowerCase() &&
      item.term === term
  );
  return fallbackMatch || null;
}
