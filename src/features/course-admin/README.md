# Feature: course-admin (Quản lý khóa học)

- `/quan-tri/khoa-hoc` — lưới khóa học (lọc trạng thái, tìm kiếm), tạo/sửa nhanh bằng Drawer, xóa có xác nhận.
- `/quan-tri/khoa-hoc/tao-moi`, `/:id/chinh-sua` — form trang đầy đủ (chia sẻ link được).
- `/quan-tri/khoa-hoc/:id` — thông tin khóa, xuất bản / về nháp, danh sách bài học (thêm/sửa/xóa, đổi thứ tự).

## Luồng
UI → `useCourseList` / `useCourseDetail` / `useCourseMutation` → `courseService` + `lessonService` → api → `courseAdapter` / `lessonAdapter`
Sau mỗi thao tác ghi: làm mới `course-admin`, `my-courses`, `learning`, `question-bank`, `dashboard`, `reports`, `progress`.
Phân quyền nút: `course-admin:create | update | delete`.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `courseAdmin.list` | — | `[course]` |
| `courseAdmin.detail` | `{ courseId }` | `{ course, lessons: [lesson] }` |
| `courseAdmin.create` | `{ input }` | `course` |
| `courseAdmin.update` | `{ courseId, input }` | `course` |
| `courseAdmin.delete` | `{ courseId }` | — |
| `courseAdmin.setStatus` | `{ courseId, status }` | — |
| `courseAdmin.uploadCover` | `{ fileName, mimeType, base64 }` | `{ url }` |
| `lessonAdmin.create` | `{ courseId, input }` | `lesson` |
| `lessonAdmin.update` | `{ lessonId, input }` | `lesson` |
| `lessonAdmin.delete` | `{ lessonId }` | — |
| `lessonAdmin.reorder` | `{ courseId, lessonIds }` | — |

`course`: `{ id, title, description?, cover_url?, status, lesson_count, question_count, enrollment_count, pass_score, duration_min, max_attempts, created_at?, updated_at? }`
`lesson`: `{ id, course_id, order, title, type, duration_sec, video_url?, document_url?, content? }`
`input` khóa học: `{ title, description, cover_url, status, pass_score, duration_min, max_attempts }`
`input` bài học: `{ title, type, duration_sec, video_url, document_url, content }`
`status`: `DRAFT | PUBLISHED | ARCHIVED` (nhận cả "Đã xuất bản", "Bản nháp"…).

## Demo
"Database" trong bộ nhớ (`demoDb`) — tạo/sửa/xóa thấy kết quả ngay, mất khi tải lại trang.