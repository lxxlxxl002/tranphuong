# Feature: progress (Tiến độ học tập)

Vòng % hoàn thành tổng, 4 ô số liệu (thời gian học, bài đã học, bài kiểm tra đạt/đã làm, điểm trung bình) và tiến độ từng khóa (sắp xếp được, bấm để vào học).

## Luồng
`Overview` → `OverviewCard` + `CourseProgressList` → `useProgress` → `progressService` → api → `progressAdapter`

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `progress.overview` | — | `[course]` **hoặc** `{ summary?, courses: [course] }` |
| `progress.heartbeat` | `{ courseId, lessonId, seconds }` | — (ghi nhận thời gian học) |

`course`: `{ id \| course_id, title, status?, progress, lessons_done, lessons_total, study_sec?, last_accessed_at?, best_score? }`
`summary` (tùy chọn, trường nào có sẽ ghi đè số tự tính): `{ overall_percent, total_study_sec, lessons_done, lessons_total, quizzes_taken, quizzes_passed, average_score }`

## Quy tắc tự tính
- `overallPercent` = số khóa hoàn thành / tổng khóa.
- Bài kiểm tra = khóa hoàn thành có điểm / khóa đã có điểm.
- Điểm trung bình = trung bình `best_score`, làm tròn 1 chữ số.
- Trạng thái dùng chung cách đọc của `my-courses` (`toCourseStatus`).