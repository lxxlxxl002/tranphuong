# Feature: my-courses (Khóa học của tôi)

Lưới khóa học học viên được ghi danh: bìa, trạng thái, nút Bắt đầu học / Tiếp tục học / Xem lại, lọc nhanh theo trạng thái.

## Luồng
`List` → `CourseGrid` → `useMyCourses` (danh sách + lọc) / `useCourseStatus` (mỗi card) → `myCourseService` → api → `myCourseAdapter`
Bấm nút → `startCourse` (ghi nhận nếu chưa bắt đầu, lỗi không chặn) → điều hướng `/hoc/:courseId`.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `myCourses.list` | — | `[{ id \| course_id, title, description?, cover_url?, status?, progress, lessons_total, lessons_done, enrolled_at?, completed_at?, last_accessed_at?, score?, has_certificate? }]` |
| `myCourses.start` | `{ courseId }` | — |

- `status` nhận: `NOT_STARTED/IN_PROGRESS/COMPLETED` hoặc tiếng Việt ("Chưa bắt đầu", "Đang học", "Hoàn thành"…). Không có → suy ra từ `progress`.
- `progress` nhận 0–1 hoặc 0–100. Khóa hoàn thành luôn hiển thị 100%.
- `has_certificate` nhận `true`, `1`, `"x"`, `"có"`…
- Không có `cover_url` → bìa gradient tự sinh theo id.

## Public API
`useMyCourses`, `useCourseStatus`, `myCourseService`, `CourseStatusBadge`, `CourseCover`, `COURSE_STATUS_META`, `MY_COURSES_QUERY_KEYS`