import { useParams } from 'react-router'
import { QuizPanel } from '../modules/QuizPanel'

export default function Quiz() {
  const { courseId = '' } = useParams()
  return <QuizPanel courseId={courseId} />
}