import type { CourseContent, Lesson, LessonType, QuestionType, QuizQuestion } from '../model/types'

export type DemoQuestion = QuizQuestion & { correct: string[] }
export interface DemoCourse {
  content: CourseContent
  questions: DemoQuestion[]
}

const L = (id: string, order: number, title: string, type: LessonType, durationSec: number, content: string | null = null): Lesson => ({
  id,
  order,
  title,
  type,
  durationSec,
  videoUrl: null,
  documentUrl: null,
  content,
  completed: false
})

const Q = (id: string, text: string, options: string[], correct: number[], type: QuestionType = 'SINGLE'): DemoQuestion => ({
  id,
  text,
  type,
  options: options.map((t, i) => ({ id: `${id}-${i}`, text: t })),
  correct: correct.map((i) => `${id}-${i}`)
})

const BASEL_Q: DemoQuestion[] = [
  Q('b1', 'Hiệp ước Basel II được xây dựng dựa trên bao nhiêu trụ cột chính?', ['2 trụ cột', '3 trụ cột', '4 trụ cột', '5 trụ cột'], [1]),
  Q('b2', 'Trụ cột 1 của Basel II tập trung vào nội dung nào?', ['Yêu cầu vốn tối thiểu', 'Quy trình đánh giá giám sát', 'Kỷ luật thị trường', 'Quản lý thanh khoản'], [0]),
  Q('b3', 'Tỷ lệ an toàn vốn tối thiểu theo Basel II là bao nhiêu?', ['4%', '6%', '8%', '10%'], [2]),
  Q('b4', 'Những loại rủi ro nào được lượng hóa để tính vốn ở Trụ cột 1?', ['Rủi ro tín dụng', 'Rủi ro thị trường', 'Rủi ro hoạt động', 'Rủi ro danh tiếng'], [0, 1, 2], 'MULTIPLE'),
  Q('b5', 'Trụ cột 3 – Kỷ luật thị trường yêu cầu ngân hàng điều gì?', ['Công bố thông tin minh bạch về vốn và rủi ro', 'Tăng vốn điều lệ hằng năm', 'Giảm lãi suất cho vay', 'Mở rộng mạng lưới chi nhánh'], [0])
]

const GS_Q: DemoQuestion[] = [
  Q('g1', 'Giám sát từ xa được thực hiện chủ yếu dựa trên nguồn thông tin nào?', ['Báo cáo, số liệu do tổ chức tín dụng gửi định kỳ', 'Kiểm tra trực tiếp tại trụ sở', 'Phản ánh trên báo chí', 'Ý kiến của khách hàng'], [0])
]

const CDS_Q: DemoQuestion[] = [
  Q('c1', 'Chuyển đổi số trong ngân hàng trước hết là sự thay đổi về điều gì?', ['Chỉ nâng cấp phần cứng', 'Mô hình kinh doanh và cách vận hành dựa trên dữ liệu', 'Giảm số lượng nhân sự', 'Thay đổi nhận diện thương hiệu'], [1]),
  Q('c2', 'eKYC là gì?', ['Định danh khách hàng điện tử', 'Ví điện tử', 'Chữ ký số', 'Thẻ phi vật lý'], [0]),
  Q('c3', 'Công nghệ nào thường được dùng để phát hiện gian lận giao dịch theo thời gian thực?', ['Trí tuệ nhân tạo / học máy', 'Máy in hóa đơn', 'Bảng tính thủ công', 'Fax'], [0]),
  Q('c4', 'Những rủi ro nào cần được quản trị khi chuyển đổi số?', ['An ninh mạng', 'Bảo vệ dữ liệu cá nhân', 'Rủi ro vận hành hệ thống', 'Rủi ro thời tiết'], [0, 1, 2], 'MULTIPLE'),
  Q('c5', 'Open API trong ngân hàng cho phép điều gì?', ['Chia sẻ dữ liệu, dịch vụ an toàn với bên thứ ba được phép', 'Công khai toàn bộ dữ liệu khách hàng', 'Thay thế hoàn toàn hệ thống lõi', 'Bỏ qua quy trình xác thực'], [0])
]

const demo: Record<string, DemoCourse> = {
  'basel-2': {
    content: {
      courseId: 'basel-2',
      title: 'TÌM HIỂU VỀ BASEL II',
      description: 'Khung an toàn vốn Basel II và lộ trình áp dụng tại Việt Nam.',
      lessons: [
        L('b2-l1', 1, 'Tổng quan về Ủy ban Basel và các Hiệp ước vốn', 'VIDEO', 900, 'Giới thiệu Ủy ban Basel về giám sát ngân hàng (BCBS) và quá trình hình thành Basel I, Basel II, Basel III.'),
        L('b2-l2', 2, 'Trụ cột 1 – Yêu cầu vốn tối thiểu', 'VIDEO', 1200, 'Phương pháp đo lường rủi ro tín dụng, rủi ro thị trường, rủi ro hoạt động và cách tính tỷ lệ an toàn vốn (CAR).'),
        L('b2-l3', 3, 'Trụ cột 2 – Quy trình đánh giá giám sát', 'TEXT', 600,
          'Trụ cột 2 yêu cầu ngân hàng tự đánh giá mức độ đủ vốn nội bộ (ICAAP) tương xứng với hồ sơ rủi ro của mình.\n\nCơ quan giám sát rà soát, đánh giá quy trình này và có thể yêu cầu ngân hàng duy trì mức vốn cao hơn mức tối thiểu khi cần thiết.\n\nTrụ cột 2 cũng bao quát các rủi ro chưa được phản ánh đầy đủ ở Trụ cột 1 như rủi ro lãi suất trên sổ ngân hàng, rủi ro tập trung và rủi ro thanh khoản.'),
        L('b2-l4', 4, 'Trụ cột 3 – Kỷ luật thị trường', 'TEXT', 480,
          'Trụ cột 3 yêu cầu ngân hàng công bố thông tin về cơ cấu vốn, mức độ chịu rủi ro và quy trình quản trị rủi ro.\n\nViệc công bố thông tin minh bạch giúp thị trường đánh giá đúng sức khỏe ngân hàng, từ đó tạo áp lực để ngân hàng quản trị rủi ro thận trọng hơn.')
      ],
      quiz: { id: 'q-basel', title: 'Bài kiểm tra: Tìm hiểu về Basel II', questionCount: BASEL_Q.length, durationMin: 15, passScore: 70, maxAttempts: 3, attemptsUsed: 0, bestScore: null }
    },
    questions: BASEL_Q
  },
  'cong-tac-giam-sat': {
    content: {
      courseId: 'cong-tac-giam-sat',
      title: 'CÔNG TÁC GIÁM SÁT',
      description: 'Nghiệp vụ quản lý, giám sát tổ chức tín dụng.',
      lessons: [
        L('gs-l1', 1, 'Khái quát về giám sát ngân hàng', 'VIDEO', 840, 'Mục tiêu, nguyên tắc và vai trò của hoạt động giám sát đối với sự an toàn của hệ thống ngân hàng.'),
        L('gs-l2', 2, 'Giám sát từ xa và thanh tra tại chỗ', 'TEXT', 720,
          'Giám sát từ xa là việc theo dõi, phân tích tình hình hoạt động của tổ chức tín dụng dựa trên báo cáo, số liệu định kỳ và các nguồn thông tin khác.\n\nThanh tra, kiểm tra tại chỗ được thực hiện trực tiếp tại tổ chức tín dụng nhằm xác minh, đánh giá sâu các vấn đề phát hiện qua giám sát từ xa.\n\nHai hình thức này bổ trợ cho nhau, giúp phát hiện sớm rủi ro và xử lý kịp thời.'),
        L('gs-l3', 3, 'Hệ thống cảnh báo sớm', 'DOCUMENT', 600, 'Bộ chỉ tiêu cảnh báo sớm và cách đọc tín hiệu rủi ro từ dữ liệu giám sát.')
      ],
      quiz: { id: 'q-gs', title: 'Bài kiểm tra: Công tác giám sát', questionCount: GS_Q.length, durationMin: 10, passScore: 70, maxAttempts: 3, attemptsUsed: 0, bestScore: null }
    },
    questions: GS_Q
  },
  'chuyen-doi-so': {
    content: {
      courseId: 'chuyen-doi-so',
      title: 'CHUYỂN ĐỔI SỐ',
      description: 'Công nghệ số – động lực tăng trưởng – kiến tạo tương lai.',
      lessons: [],
      quiz: { id: 'q-cds', title: 'Bài kiểm tra: Chuyển đổi số', questionCount: CDS_Q.length, durationMin: 20, passScore: 70, maxAttempts: 3, attemptsUsed: 1, bestScore: 94 }
    },
    questions: CDS_Q
  }
}

export const LEARNING_CONFIG = {
  timeout: 25_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  /** Phải học xong mọi bài mới được làm bài kiểm tra */
  requireAllLessons: true,
  /** Đánh dấu hoàn thành xong tự chuyển bài kế */
  autoNextOnComplete: true,
  /** Query param chọn bài: /hoc/:id?bai=lessonId */
  lessonParam: 'bai',
  demo
}