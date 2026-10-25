# Feature: exam-results (Kết quả kiểm tra)

- `/ket-qua-kiem-tra` — bảng lịch sử làm bài (mới nhất trước), lọc Đạt / Không đạt.
- `/ket-qua-kiem-tra/:attemptId` — thẻ tổng kết + xem lại từng câu (lọc Đúng / Sai / Bỏ trống).

## Luồng
`ResultTable` → `useResultList` · `Detail` + `AnswerReview` → `useResultDetail` → `resultService` → api → `resultAdapter`
Phiên demo: gộp bài mẫu trong `config` + các bài vừa làm ở feature learning (`getDemoAttemptLog`).

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `results.list` | — | `[attempt]` |
| `results.detail` | `{ attemptId }` | `attempt & { questions: [question] }` |

`attempt`: `{ attempt_id, course_id, course_title, submitted_at, score, pass_score?, passed?, correct_count, total, time_spent_sec?, certificate_code? }`
`question`: `{ id, order?, text, type?, options: [{ id, text }], selected: id[] | "a,b", correct: id[] | "a,b" | [], is_correct?, explanation? }`

- `correct` rỗng = ẩn đáp án → giao diện chỉ tô đúng/sai theo lựa chọn (dựa `is_correct`).
- `passed` nhận true/"Đạt"/"x"…; thiếu → tự so `score` với `pass_score` (mặc định 70).
- Ghi kết quả do `quiz.submit` (feature learning) đảm nhận.