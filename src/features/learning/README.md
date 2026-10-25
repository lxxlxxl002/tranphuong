# Feature: learning (Học bài + Bài kiểm tra)

## Màn hình
- `/hoc/:courseId?bai=<lessonId>` — trình học: video (Drive/YouTube/mp4) · tài liệu (PDF/Drive preview) · bài đọc; sidebar danh sách bài + thẻ bài kiểm tra.
- `/hoc/:courseId/kiem-tra` — giới thiệu đề → làm bài (đồng hồ, đánh dấu, bảng số câu) → popup kết quả.

## Luồng
- Học: `useLessonPlayer` → `lessonService` → api → `lessonAdapter`. Đánh dấu hoàn thành cập nhật lạc quan, lỗi tự hoàn tác.
- Thi: `useQuizSession` (đề + đáp án đang chọn, store zustand, lưu localStorage theo khóa) → `useSubmitQuiz` (chống nộp trùng) → `quizService` → `quizAdapter`.
- Sau khi nộp: làm mới dữ liệu `my-courses`, `progress`, `exam-results`, `certificates`, `dashboard`, `reports`.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `learning.course` | `{ courseId }` | `{ course: { id, title, description? }, lessons: [{ id, order, title, type?, duration_sec, video_url?, document_url?, content?, completed }], quiz?: { id, title?, question_count, duration_min, pass_score?, max_attempts, attempts_used, best_score? } }` |
| `learning.completeLesson` | `{ courseId, lessonId }` | — |
| `quiz.start` | `{ courseId }` | `{ attempt_id, started_at?, duration_sec, pass_score?, questions: [{ id, text, type?, options: [{ id, text }] }] }` — **không gửi đáp án** |
| `quiz.submit` | `{ attemptId, courseId, answers: { [questionId]: optionId[] }, timeSpentSec }` | `{ attempt_id, score, correct_count, total, passed?, pass_score?, certificate_code?, time_spent_sec?, submitted_at? }` |

- Backend tự kiểm tra: đủ điều kiện thi, số lượt, thời hạn, chấm điểm, cấp chứng chỉ.
- `type` bài: `VIDEO / DOCUMENT / TEXT` (hoặc `pdf`, `tai_lieu`…); không có → suy theo `video_url` / `document_url`.
- `type` câu hỏi: `SINGLE` (mặc định) / `MULTIPLE` (`multi`, `checkbox`, `nhieu`…).
- `pass_score` mặc định 70. `max_attempts = 0` → không giới hạn.

## Cấu hình (`config/learning.config.ts`)
`requireAllLessons`, `autoNextOnComplete`, `lessonParam`, dữ liệu demo 3 khóa.