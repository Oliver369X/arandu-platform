"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { courseService } from "@/lib/course-service"
import { aiService } from "@/lib/ai-service"
import { apiService } from "@/lib/api"
import type { Course, CourseProgress } from "@/lib/data-adapter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  FileText,
  Download,
  Star,
  CheckCircle,
  Lock,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Brain,
  Target,
  Lightbulb,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface CoursePlayerProps {
  courseId?: string
}

export function CoursePlayer({ courseId }: CoursePlayerProps) {
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<CourseProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [aiContent, setAiContent] = useState<any>(null)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  
  // Mock resources data
  const resources = [
    {
      title: "Presentación de la Lección",
      size: "2.5 MB",
      type: "pdf"
    },
    {
      title: "Ejercicios Prácticos",
      size: "1.8 MB", 
      type: "pdf"
    },
    {
      title: "Código de Ejemplo",
      size: "450 KB",
      type: "zip"
    }
  ]

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !user?.id) return
      
      try {
        setIsLoading(true)
        
        // Fetch course details
        const course = await courseService.getCourseById(courseId)
        setCourseData(course)
        
        // Fetch course modules/lessons
        try {
          const courseModulesResponse = await apiService.getSubtopicsBySubjectId(courseId)
          if (courseModulesResponse.success && courseModulesResponse.data) {
            setLessons(courseModulesResponse.data)
            
            // Generate AI content for the current lesson
            if (courseModulesResponse.data.length > 0) {
              await generateAIContent(courseModulesResponse.data[0].id)
            }
          } else {
            console.error('Error fetching course modules:', courseModulesResponse.error)
            // Fallback to empty array
            setLessons([])
          }
        } catch (apiError) {
          console.error('API Error fetching course modules:', apiError)
          // Fallback to empty array if API fails completely
          setLessons([])
        }
        
        // Fetch user progress
        const progress = await courseService.getUserProgress(user.id, courseId)
        setUserProgress(progress)
        
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const generateAIContent = async (moduleId: string) => {
      try {
        setIsGeneratingContent(true)
        const content = await aiService.generateEducationalContent(moduleId)
        setAiContent(content)
      } catch (error) {
        console.error('Error generating AI content:', error)
      } finally {
        setIsGeneratingContent(false)
      }
    }

    fetchCourseData()
  }, [courseId, user?.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
          <p className="text-muted-foreground">El curso que buscas no existe o no tienes acceso.</p>
        </div>
      </div>
    )
  }

  const currentLessonData = Array.isArray(lessons) && lessons.length > 0 
    ? lessons.find((lesson) => lesson.current) || lessons[0] 
    : null

  // Show message if no lessons are available
  if (!Array.isArray(lessons) || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/dashboard/student">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No hay lecciones disponibles</h2>
              <p className="text-muted-foreground mb-4">Este curso aún no tiene contenido disponible o hay un problema de conexión con el servidor.</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Verifica que el servidor backend esté ejecutándose en http://localhost:3001</p>
                <p>• Asegúrate de que el endpoint /api-v1/subtopics esté disponible</p>
                <p>• Revisa la consola del navegador para más detalles del error</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with course info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/dashboard/student">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{courseData.category}</Badge>
              <Badge variant="outline">{courseData.difficulty}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-foreground mb-2">{courseData.title}</h1>
              <p className="text-muted-foreground">
                Por {courseData.instructor?.name || 'Instructor'} • {courseData.completedLessons}/{courseData.totalLessons} lecciones
                completadas
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progreso del curso</div>
              <div className="flex items-center gap-2">
                <Progress value={courseData.progress} className="w-32" />
                <span className="text-sm font-medium">{courseData.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video Container */}
                <div className="aspect-video bg-black rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Video+Player"
                      alt="Video Player"
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button size="lg" className="rounded-full w-16 h-16" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4" />
                        <div className="w-20 h-1 bg-muted rounded-full">
                          <div className="w-3/4 h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">5:30 / {currentLessonData?.duration || '00:00'}</span>
                      <Button variant="ghost" size="sm">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full h-1 bg-muted rounded-full">
                      <div className="w-1/3 h-full bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="ai-content">Contenido IA</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
                <TabsTrigger value="discussion">Discusión</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                                      <CardTitle>{currentLessonData?.title || 'Lección no disponible'}</CardTitle>
                  <CardDescription>{currentLessonData?.description || 'Descripción no disponible'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentLessonData?.duration || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {courseData.totalStudents} estudiantes
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          {courseData.rating}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-2">Objetivos de Aprendizaje</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Comprender los conceptos fundamentales de las redes neuronales
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Identificar los componentes básicos de una neurona artificial
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Aplicar conceptos básicos en ejemplos prácticos
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Contenido Generado por IA
                    </CardTitle>
                    <CardDescription>Contenido educativo personalizado generado por inteligencia artificial</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isGeneratingContent ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Generando contenido personalizado...</span>
                        </div>
                      </div>
                    ) : aiContent ? (
                      <div className="space-y-6">
                        {/* Summary */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            Resumen
                          </h3>
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                            <p className="text-blue-800 dark:text-blue-200">{aiContent.summary}</p>
                          </div>
                        </div>

                        {/* Key Points */}
                        {aiContent.keyPoints && aiContent.keyPoints.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-green-600" />
                              Puntos Clave
                            </h3>
                            <ul className="space-y-2">
                              {aiContent.keyPoints.map((point: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Examples */}
                        {aiContent.examples && aiContent.examples.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-600" />
                              Ejemplos Prácticos
                            </h3>
                            <ul className="space-y-2">
                              {aiContent.examples.map((example: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Full Content */}
                        <div>
                          <h3 className="font-semibold mb-3">Contenido Completo</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{aiContent.content}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Descargar Contenido
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Generar Quiz
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Ver Plan de Lección
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No hay contenido generado</h3>
                        <p className="text-muted-foreground mb-4">
                          Haz clic en el botón para generar contenido personalizado con IA
                        </p>
                        <Button onClick={() => currentLessonData?.id && generateAIContent(currentLessonData.id)}>
                          <Brain className="h-4 w-4 mr-2" />
                          Generar Contenido IA
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Notas</CardTitle>
                    <CardDescription>Toma notas durante la lección</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <textarea
                        className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Escribe tus notas aquí..."
                      />
                      <Button>Guardar Notas</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recursos de la Lección</CardTitle>
                    <CardDescription>Materiales adicionales para descargar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">{resource.size}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discusión de la Lección</CardTitle>
                    <CardDescription>Participa en la conversación con otros estudiantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                            JD
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Juan Díaz</span>
                              <span className="text-sm text-muted-foreground">hace 2 horas</span>
                            </div>
                            <p className="text-sm">
                              Excelente explicación sobre las redes neuronales. ¿Podrían profundizar más en las
                              funciones de activación?
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            CM
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Dr. Carlos Mendoza</span>
                              <Badge variant="secondary" className="text-xs">
                                Instructor
                              </Badge>
                              <span className="text-sm text-muted-foreground">hace 1 hora</span>
                            </div>
                            <p className="text-sm">
                              @Juan Díaz Excelente pregunta. En la próxima lección cubriremos las funciones de
                              activación en detalle.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                          MG
                        </div>
                        <div className="flex-1">
                          <textarea
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Únete a la discusión..."
                            rows={3}
                          />
                          <Button className="mt-2">Publicar Comentario</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar with lesson list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contenido del Curso</CardTitle>
                <CardDescription>
                  {courseData.completedLessons} de {courseData.totalLessons} lecciones
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          lesson.current
                            ? "bg-primary text-primary-foreground"
                            : lesson.completed
                              ? "bg-muted hover:bg-muted/80"
                              : "hover:bg-muted/50"
                        }`}
                        onClick={() => setCurrentLesson(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : lesson.current ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{lesson.title}</h4>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="mt-4 space-y-2">
              <Button className="w-full" disabled={currentLesson === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lección Anterior
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Siguiente Lección
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
