# Feature: question-bank (Ngân hàng câu hỏi)

- `/quan-tri/ngan-hang-cau-hoi` — lưới khóa học + số câu hỏi (nhiều câu xếp trước), tìm kiếm.
- `/quan-tri/ngan-hang-cau-hoi/:courseId` — thống kê, lọc/tìm/phân trang câu hỏi, thêm/sửa (popup), xóa, import Excel, tải file mẫu.

## Luồng
UI → `useQuestionBanks` / `useQuestionList` / `useQuestionMutation` → `questionService` (+ `questionImportService` cho Excel) → api → `questionAdapter`
Ghi xong làm mới: `question-bank`, `course-admin`, `learning`. Phân quyền: `question-bank:create | update | delete`.

## Contract backend
| Action | Payload | Trả về `data` |
|---|---|---|
| `questionBank.list` | — | `[{ course_id, course_title, cover_url?, question_count }]` |
| `questionBank.questions` | `{ courseId }` | `{ course: { id, title }, questions: [question] }` |
| `question.create` | `{ courseId, input }` | `question` |
| `question.update` | `{ questionId, input }` | `question` |
| `question.delete` | `{ questionId }` | — |
| `question.bulkCreate` | `{ courseId, inputs: input[] }` | `{ created }` |

`question`: `{ id, order?, text, type?, options: [{ id?, text, correct }], explanation?, updated_at? }` — `correct` nhận true/"x"/"đúng"…; nhiều đáp án đúng → tự là `MULTIPLE`.
`input`: `{ text, type: SINGLE|MULTIPLE, options: [{ text, correct }], explanation }`

## File Excel mẫu
Cột: STT · Câu hỏi · Loại câu hỏi · Đáp án A–F · Đáp án đúng (`C` hoặc `A,C`) · Giải thích. Sheet "Huong dan" kèm hướng dẫn. Tối đa 500 câu/lần.
Thư viện `exceljs` chỉ tải khi mở chức năng Excel.