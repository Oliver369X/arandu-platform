import { CoursePlayer } from "@/components/pages/course-player"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return <CoursePlayer courseId={params.id} />
}
