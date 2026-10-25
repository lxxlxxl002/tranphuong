import type { Question } from '../model/types'

const Q = (courseId: string, order: number, text: string, options: string[], correct: number[], explanation: string | null = null): Question => {
  const id = `${courseId}-q${order}`
  return {
    id,
    courseId,
    order,
    text,
    type: correct.length > 1 ? 'MULTIPLE' : 'SINGLE',
    options: options.map((t, i) => ({ id: `${id}-${i}`, text: t, correct: correct.includes(i) })),
    explanation,
    updatedAt: '2026-06-20'
  }
}

const CDS = 'chuyen-doi-so'
const GS = 'cong-tac-giam-sat'

const questions: Question[] = [
  Q(CDS, 1, 'Chuyển đổi số trong ngân hàng trước hết là sự thay đổi về điều gì?', ['Chỉ nâng cấp phần cứng', 'Mô hình kinh doanh và cách vận hành dựa trên dữ liệu', 'Giảm số lượng nhân sự', 'Thay đổi nhận diện thương hiệu'], [1]),
  Q(CDS, 2, 'eKYC là gì?', ['Ví điện tử', 'Chữ ký số', 'Định danh khách hàng điện tử', 'Thẻ phi vật lý'], [2]),
  Q(CDS, 3, 'Công nghệ nào thường được dùng để phát hiện gian lận giao dịch theo thời gian thực?', ['Máy in hóa đơn', 'Trí tuệ nhân tạo / học máy', 'Bảng tính thủ công', 'Fax'], [1]),
  Q(CDS, 4, 'Những rủi ro nào cần được quản trị khi chuyển đổi số?', ['An ninh mạng', 'Bảo vệ dữ liệu cá nhân', 'Rủi ro vận hành hệ thống', 'Rủi ro thời tiết'], [0, 1, 2], 'Cả ba rủi ro đều phát sinh trực tiếp từ quá trình số hóa.'),
  Q(CDS, 5, 'Open API trong ngân hàng cho phép điều gì?', ['Công khai toàn bộ dữ liệu khách hàng', 'Thay thế hoàn toàn hệ thống lõi', 'Chia sẻ dữ liệu, dịch vụ an toàn với bên thứ ba được phép', 'Bỏ qua quy trình xác thực'], [2]),
  Q(CDS, 6, 'Dữ liệu lớn (Big Data) mang lại lợi ích chính nào cho ngân hàng?', ['Phân tích hành vi khách hàng và quản trị rủi ro tốt hơn', 'Giảm dung lượng lưu trữ', 'Thay thế hoàn toàn nhân viên', 'Không cần bảo mật dữ liệu'], [0]),
  Q(CDS, 7, 'Điện toán đám mây giúp ngân hàng điều gì?', ['Loại bỏ mọi rủi ro an ninh', 'Không cần sao lưu dữ liệu', 'Không cần kết nối Internet', 'Linh hoạt mở rộng hạ tầng, tối ưu chi phí'], [3]),
  Q(CDS, 8, 'Xác thực đa yếu tố (MFA) nhằm mục đích gì?', ['Tăng tốc độ mạng', 'Tăng cường bảo mật khi đăng nhập, giao dịch', 'Giảm phí giao dịch', 'Thay mật khẩu bằng tên đăng nhập'], [1]),
  Q(CDS, 9, 'RegTech là gì?', ['Công nghệ hỗ trợ tuân thủ quy định', 'Công nghệ in tiền', 'Mạng xã hội ngân hàng', 'Phần mềm kế toán cá nhân'], [0]),
  Q(CDS, 10, 'SupTech được cơ quan giám sát sử dụng để làm gì?', ['Quảng cáo sản phẩm', 'Tuyển dụng nhân sự', 'Nâng cao hiệu quả thu thập, phân tích dữ liệu giám sát', 'Thiết kế nhận diện'], [2]),
  Q(CDS, 11, 'Blockchain có đặc điểm nổi bật nào?', ['Dữ liệu tập trung một máy chủ', 'Sổ cái phân tán, khó sửa đổi dữ liệu đã ghi', 'Có thể xóa giao dịch tùy ý', 'Không cần mã hóa'], [1]),
  Q(CDS, 12, 'Mã QR trong thanh toán giúp điều gì?', ['Tăng chi phí in ấn', 'Thay thế tài khoản ngân hàng', 'Bỏ qua bước xác thực', 'Thanh toán nhanh, giảm nhập liệu thủ công'], [3]),
  Q(CDS, 13, 'Nguyên tắc quan trọng khi bảo vệ dữ liệu cá nhân là gì?', ['Chỉ thu thập, xử lý dữ liệu cần thiết và có sự đồng ý', 'Chia sẻ rộng rãi để tăng doanh thu', 'Lưu vĩnh viễn mọi dữ liệu', 'Không cần thông báo cho chủ thể dữ liệu'], [0]),
  Q(CDS, 14, 'Ngân hàng số khác ngân hàng truyền thống chủ yếu ở điểm nào?', ['Không chịu sự giám sát', 'Cung cấp dịch vụ chủ yếu qua kênh số', 'Không phục vụ doanh nghiệp', 'Không sử dụng tiền đồng'], [1]),
  Q(CDS, 15, 'Chỉ số nào phản ánh mức độ số hóa giao dịch?', ['Số chi nhánh mở mới', 'Số máy ATM', 'Vốn điều lệ', 'Tỷ lệ giao dịch qua kênh số trên tổng giao dịch'], [3]),
  Q(GS, 1, 'Giám sát từ xa được thực hiện chủ yếu dựa trên nguồn thông tin nào?', ['Báo cáo, số liệu do tổ chức tín dụng gửi định kỳ', 'Kiểm tra trực tiếp tại trụ sở', 'Phản ánh trên báo chí', 'Ý kiến của khách hàng'], [0])
]

export const QUESTION_BANK_CONFIG = {
  timeout: 60_000,
  staleTime: 30_000,
  demoDelayMs: 300,
  demo: { questions }
}