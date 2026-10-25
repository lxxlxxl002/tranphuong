import type { AttemptDetail, ReviewQuestion, ReviewQuestionType } from '../model/types'

const R = (
  order: number,
  text: string,
  options: string[],
  correct: number[],
  selected: number[],
  type: ReviewQuestionType = 'SINGLE',
  explanation: string | null = null
): ReviewQuestion => {
  const id = `cds-${order}`
  const c = correct.map((i) => `${id}-${i}`)
  const s = selected.map((i) => `${id}-${i}`)
  return {
    id,
    order,
    text,
    type,
    options: options.map((t, i) => ({ id: `${id}-${i}`, text: t })),
    selected: s,
    correct: c,
    isCorrect: c.length === s.length && c.every((x) => s.includes(x)),
    explanation
  }
}

const questions: ReviewQuestion[] = [
  R(1, 'Chuyển đổi số trong ngân hàng trước hết là sự thay đổi về điều gì?', ['Chỉ nâng cấp phần cứng', 'Mô hình kinh doanh và cách vận hành dựa trên dữ liệu', 'Giảm số lượng nhân sự', 'Thay đổi nhận diện thương hiệu'], [1], [1]),
  R(2, 'eKYC là gì?', ['Ví điện tử', 'Chữ ký số', 'Định danh khách hàng điện tử', 'Thẻ phi vật lý'], [2], [2]),
  R(3, 'Công nghệ nào thường được dùng để phát hiện gian lận giao dịch theo thời gian thực?', ['Máy in hóa đơn', 'Trí tuệ nhân tạo / học máy', 'Bảng tính thủ công', 'Fax'], [1], [1]),
  R(4, 'Những rủi ro nào cần được quản trị khi chuyển đổi số?', ['An ninh mạng', 'Bảo vệ dữ liệu cá nhân', 'Rủi ro vận hành hệ thống', 'Rủi ro thời tiết'], [0, 1, 2], [0, 1], 'MULTIPLE',
    'Cả ba rủi ro an ninh mạng, bảo vệ dữ liệu cá nhân và vận hành hệ thống đều phát sinh trực tiếp từ quá trình số hóa.'),
  R(5, 'Open API trong ngân hàng cho phép điều gì?', ['Công khai toàn bộ dữ liệu khách hàng', 'Thay thế hoàn toàn hệ thống lõi', 'Chia sẻ dữ liệu, dịch vụ an toàn với bên thứ ba được phép', 'Bỏ qua quy trình xác thực'], [2], [2]),
  R(6, 'Dữ liệu lớn (Big Data) mang lại lợi ích chính nào cho ngân hàng?', ['Phân tích hành vi khách hàng và quản trị rủi ro tốt hơn', 'Giảm dung lượng lưu trữ', 'Thay thế hoàn toàn nhân viên', 'Không cần bảo mật dữ liệu'], [0], [0]),
  R(7, 'Điện toán đám mây giúp ngân hàng điều gì?', ['Loại bỏ mọi rủi ro an ninh', 'Không cần sao lưu dữ liệu', 'Không cần kết nối Internet', 'Linh hoạt mở rộng hạ tầng, tối ưu chi phí'], [3], [3]),
  R(8, 'Xác thực đa yếu tố (MFA) nhằm mục đích gì?', ['Tăng tốc độ mạng', 'Tăng cường bảo mật khi đăng nhập, giao dịch', 'Giảm phí giao dịch', 'Thay mật khẩu bằng tên đăng nhập'], [1], [1]),
  R(9, 'RegTech là gì?', ['Công nghệ hỗ trợ tuân thủ quy định', 'Công nghệ in tiền', 'Mạng xã hội ngân hàng', 'Phần mềm kế toán cá nhân'], [0], [0]),
  R(10, 'SupTech được cơ quan giám sát sử dụng để làm gì?', ['Quảng cáo sản phẩm', 'Tuyển dụng nhân sự', 'Nâng cao hiệu quả thu thập, phân tích dữ liệu giám sát', 'Thiết kế nhận diện'], [2], [2]),
  R(11, 'Blockchain có đặc điểm nổi bật nào?', ['Dữ liệu tập trung một máy chủ', 'Sổ cái phân tán, khó sửa đổi dữ liệu đã ghi', 'Có thể xóa giao dịch tùy ý', 'Không cần mã hóa'], [1], [1]),
  R(12, 'Mã QR trong thanh toán giúp điều gì?', ['Tăng chi phí in ấn', 'Thay thế tài khoản ngân hàng', 'Bỏ qua bước xác thực', 'Thanh toán nhanh, giảm nhập liệu thủ công'], [3], [3]),
  R(13, 'Nguyên tắc quan trọng khi bảo vệ dữ liệu cá nhân là gì?', ['Chỉ thu thập, xử lý dữ liệu cần thiết và có sự đồng ý', 'Chia sẻ rộng rãi để tăng doanh thu', 'Lưu vĩnh viễn mọi dữ liệu', 'Không cần thông báo cho chủ thể dữ liệu'], [0], [0]),
  R(14, 'Ngân hàng số khác ngân hàng truyền thống chủ yếu ở điểm nào?', ['Không chịu sự giám sát', 'Cung cấp dịch vụ chủ yếu qua kênh số', 'Không phục vụ doanh nghiệp', 'Không sử dụng tiền đồng'], [1], [1]),
  R(15, 'Chỉ số nào phản ánh mức độ số hóa giao dịch?', ['Số chi nhánh mở mới', 'Số máy ATM', 'Vốn điều lệ', 'Tỷ lệ giao dịch qua kênh số trên tổng giao dịch'], [3], [3])
]

const sample: AttemptDetail = {
  attemptId: 'demo-cds-1',
  courseId: 'chuyen-doi-so',
  courseTitle: 'CHUYỂN ĐỔI SỐ',
  submittedAt: '2026-07-02T09:30:00',
  score: 94,
  passScore: 70,
  passed: true,
  correctCount: 14,
  total: 15,
  timeSpentSec: 1080,
  certificateCode: 'QLGS-2026-161451',
  questions
}

export const EXAM_RESULTS_CONFIG = {
  timeout: 20_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  demo: { attempts: [sample] }
}