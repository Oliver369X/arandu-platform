// API Service para conectar ARANDU Frontend con SchoolAI Backend
import { config } from './config';

const API_BASE_URL = config.api.baseUrl;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  originalResponse?: any; // Para casos especiales como login
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  subtopics?: Subtopic[];
  assignments?: ClassAssignment[];
}

export interface Subtopic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
  progress?: Progress;
}

export interface Progress {
  id: string;
  userId: string;
  subtopicId: string;
  progressType: string;
  percentage: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassAssignment {
  id: string;
  gradeId: string;
  subjectId: string;
  teacherId: string;
  grade?: Grade;
  subject?: Subject;
  teacher?: User;
  schedules?: Schedule[];
}

export interface Grade {
  id: string;
  name: string;
  year: number;
}

export interface Schedule {
  id: string;
  assignmentId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  quarter: string;
}

export interface AIFeedback {
  id: string;
  subtopicId: string;
  timeMinutes: number;
  stepNumber: number;
  stepName: string;
  content: string;
  studentActivity?: string;
  timeAllocation: string;
  materialsNeeded?: string;
  successIndicator?: string;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('arandu_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔍 [apiService] Haciendo request a:', url);
    console.log('🔍 [apiService] Opciones del request:', { method: options.method, body: options.body });
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log('🔍 [apiService] Enviando fetch...');
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('🔍 [apiService] Respuesta HTTP recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      const data = await response.json();
      console.log('🔍 [apiService] Datos JSON parseados:', data);

      if (!response.ok) {
        console.log('❌ [apiService] Response no OK:', response.status, response.statusText);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      console.log('✅ [apiService] Response OK, retornando datos');
      return {
        success: true,
        data,
        // Incluir la respuesta completa para casos especiales como login
        originalResponse: data
      };
    } catch (error) {
      console.error('❌ [apiService] Error en fetch:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ==================== AUTENTICACIÓN ====================

  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🔍 [apiService] Iniciando login...', { email, password: '***' });
    console.log('🔍 [apiService] URL base:', this.baseURL);
    
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    console.log('🔍 [apiService] Respuesta del request:', response);

    if (response.success && response.originalResponse) {
      console.log('✅ [apiService] Login exitoso, procesando datos...');
      
      // El backend devuelve: { success: true, data: { ... }, token: "..." }
      const backendResponse = response.originalResponse;
      console.log('🔍 [apiService] Respuesta completa del backend:', backendResponse);
      
      const userData = backendResponse.data;
      const token = backendResponse.token;
      
      console.log('🔍 [apiService] Datos del usuario:', userData);
      console.log('🔍 [apiService] Token extraído:', token ? 'Presente' : 'Faltante');
      
      this.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('arandu_token', token || '');
        localStorage.setItem('arandu_user', JSON.stringify(userData));
        console.log('🔍 [apiService] Datos guardados en localStorage');
      }
      
      const result = {
        success: true,
        token: token,
        user: userData,
      };
      
      console.log('✅ [apiService] Retornando resultado exitoso:', result);
      return result;
    }

    console.log('❌ [apiService] Login falló:', response.error);
    return {
      success: false,
      error: response.error || 'Login failed',
    };
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/usuario', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('arandu_user') : null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return { success: true, data: user };
      } catch (error) {
        // Si hay error parseando, hacer request al servidor
      }
    }
    
    // Fallback: obtener usuario del servidor
    return this.request<User>('/usuario/me');
  }

  async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/usuario', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/usuario/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arandu_token');
      localStorage.removeItem('arandu_user');
    }
  }

  // ==================== USUARIOS ====================

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/usuario');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/usuario/${id}`);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/usuario/email/${email}`);
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/usuario/${id}`, {
      method: 'DELETE',
    });
  }

  async assignRole(userId: string, roleId: string): Promise<ApiResponse> {
    return this.request('/usuario/assign-rol', {
      method: 'POST',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  async removeRole(userId: string, roleId: string): Promise<ApiResponse> {
    return this.request('/usuario/remove-rol', {
      method: 'DELETE',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  // ==================== ROLES ====================

  async getRoles(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/roles');
  }

  async getRoleById(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/roles/${id}`);
  }

  async createRole(roleData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async updateRole(roleData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/roles', {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== GRADOS ====================

  async getGrades(): Promise<ApiResponse<Grade[]>> {
    return this.request<Grade[]>('/grades');
  }

  async getGradeById(id: string): Promise<ApiResponse<Grade>> {
    return this.request<Grade>(`/grades/${id}`);
  }

  async createGrade(gradeData: Partial<Grade>): Promise<ApiResponse<Grade>> {
    return this.request<Grade>('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  }

  async updateGrade(gradeData: Partial<Grade>): Promise<ApiResponse<Grade>> {
    return this.request<Grade>('/grades', {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  async deleteGrade(id: string): Promise<ApiResponse> {
    return this.request(`/grades/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== MATERIAS (CURSOS) ====================

  async getSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.request<Subject[]>('/subjects');
  }

  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    return this.request<Subject>(`/subjects/${id}`);
  }

  async createSubject(subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    return this.request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    return this.request<Subject>('/subjects', {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(id: string): Promise<ApiResponse> {
    return this.request(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== SUBTEMAS (MÓDULOS) ====================

  async getSubtopics(subjectId?: string): Promise<ApiResponse<Subtopic[]>> {
    const endpoint = subjectId ? `/subtopics?subjectId=${subjectId}` : '/subtopics';
    return this.request<Subtopic[]>(endpoint);
  }

  async getSubtopicsBySubjectId(subjectId: string): Promise<ApiResponse<Subtopic[]>> {
    return this.getSubtopics(subjectId);
  }

  async getSubtopicById(id: string): Promise<ApiResponse<Subtopic>> {
    return this.request<Subtopic>(`/subtopics/${id}`);
  }

  async createSubtopic(subtopicData: Partial<Subtopic>): Promise<ApiResponse<Subtopic>> {
    return this.request<Subtopic>('/subtopics', {
      method: 'POST',
      body: JSON.stringify(subtopicData),
    });
  }

  async updateSubtopic(subtopicData: Partial<Subtopic>): Promise<ApiResponse<Subtopic>> {
    return this.request<Subtopic>('/subtopics', {
      method: 'PUT',
      body: JSON.stringify(subtopicData),
    });
  }

  async deleteSubtopic(id: string): Promise<ApiResponse> {
    return this.request(`/subtopics/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ASIGNACIONES DE CLASE ====================

  async getClassAssignments(): Promise<ApiResponse<ClassAssignment[]>> {
    return this.request<ClassAssignment[]>('/class-assignments');
  }

  async getClassAssignmentById(id: string): Promise<ApiResponse<ClassAssignment>> {
    return this.request<ClassAssignment>(`/class-assignments/${id}`);
  }

  async createClassAssignment(assignmentData: Partial<ClassAssignment>): Promise<ApiResponse<ClassAssignment>> {
    return this.request<ClassAssignment>('/class-assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateClassAssignment(assignmentData: Partial<ClassAssignment>): Promise<ApiResponse<ClassAssignment>> {
    return this.request<ClassAssignment>('/class-assignments', {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteClassAssignment(id: string): Promise<ApiResponse> {
    return this.request(`/class-assignments/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== HORARIOS ====================

  async getSchedules(): Promise<ApiResponse<Schedule[]>> {
    return this.request<Schedule[]>('/schedules');
  }

  async getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>(`/schedules/${id}`);
  }

  async createSchedule(scheduleData: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async updateSchedule(scheduleData: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>('/schedules', {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  async deleteSchedule(id: string): Promise<ApiResponse> {
    return this.request(`/schedules/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROGRESO ====================

  async getProgress(): Promise<ApiResponse<Progress[]>> {
    return this.request<Progress[]>('/progress');
  }

  async getProgressById(id: string): Promise<ApiResponse<Progress>> {
    return this.request<Progress>(`/progress/${id}`);
  }

  async getProgressByUser(userId: string): Promise<ApiResponse<Progress[]>> {
    return this.request<Progress[]>(`/progress/usuario/${userId}`);
  }

  async getProgressBySubtopic(subtopicId: string): Promise<ApiResponse<Progress[]>> {
    return this.request<Progress[]>(`/progress/subtopic/${subtopicId}`);
  }

  async getProgressByType(progressType: string): Promise<ApiResponse<Progress[]>> {
    return this.request<Progress[]>(`/progress/tipo/${progressType}`);
  }

  async getCompletedProgress(): Promise<ApiResponse<Progress[]>> {
    return this.request<Progress[]>('/progress/completado');
  }

  async createProgress(progressData: Partial<Progress>): Promise<ApiResponse<Progress>> {
    return this.request<Progress>('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async updateProgress(progressData: Partial<Progress>): Promise<ApiResponse<Progress>> {
    return this.request<Progress>('/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async deleteProgress(id: string): Promise<ApiResponse> {
    return this.request(`/progress/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== IA Y FEEDBACK ====================

  async getAIFeedback(): Promise<ApiResponse<AIFeedback[]>> {
    return this.request<AIFeedback[]>('/ai-feedback');
  }

  async getAIFeedbackById(id: string): Promise<ApiResponse<AIFeedback>> {
    return this.request<AIFeedback>(`/ai-feedback/${id}`);
  }

  async createAIFeedback(feedbackData: Partial<AIFeedback>): Promise<ApiResponse<AIFeedback>> {
    return this.request<AIFeedback>('/ai-feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async updateAIFeedback(feedbackData: Partial<AIFeedback>): Promise<ApiResponse<AIFeedback>> {
    return this.request<AIFeedback>('/ai-feedback', {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteAIFeedback(id: string): Promise<ApiResponse> {
    return this.request(`/ai-feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== AI WRITING ASSISTANT ====================

  async generateAIFeedback(subtopicId: string): Promise<ApiResponse<{
    subtopic: Subject;
    steps: AIFeedback[];
  }>> {
    console.log('🔍 [apiService] Generando AI Feedback para subtopic:', subtopicId);
    return this.request<{
      subtopic: Subject;
      steps: AIFeedback[];
    }>(`/ai-writing-assistant/generate-feedback/${subtopicId}`, {
      method: 'POST',
    });
  }

  // ==================== AI FEEDBACK MANAGEMENT ====================

  async getAllAIFeedback(): Promise<ApiResponse<AIFeedback[]>> {
    console.log('🔍 [apiService] Obteniendo todos los AI Feedback');
    return this.request<AIFeedback[]>('/ai-feedback');
  }

  async getAIFeedbackBySubtopicId(subtopicId: string): Promise<ApiResponse<AIFeedback[]>> {
    console.log('🔍 [apiService] Obteniendo AI Feedback por subtopic:', subtopicId);
    return this.request<AIFeedback[]>(`/ai-feedback/subtopic/${subtopicId}`);
  }

  async createAIFeedbackStep(feedbackData: {
    subtopicId: string;
    timeMinutes: number;
    stepNumber: number;
    stepName: string;
    content: string;
    studentActivity?: string;
    timeAllocation: string;
    materialsNeeded?: string;
    successIndicator?: string;
  }): Promise<ApiResponse<AIFeedback>> {
    console.log('🔍 [apiService] Creando paso de AI Feedback:', feedbackData);
    return this.request<AIFeedback>('/ai-feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async updateAIFeedbackStep(id: string, feedbackData: Partial<AIFeedback>): Promise<ApiResponse<AIFeedback>> {
    console.log('🔍 [apiService] Actualizando paso de AI Feedback:', id);
    return this.request<AIFeedback>(`/ai-feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteAIFeedbackStep(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando paso de AI Feedback:', id);
    return this.request(`/ai-feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROGRESS MANAGEMENT ====================

  async getAllProgress(): Promise<ApiResponse<Progress[]>> {
    console.log('🔍 [apiService] Obteniendo todo el progreso');
    return this.request<Progress[]>('/progress');
  }

  async getProgressByUser(userId: string): Promise<ApiResponse<Progress[]>> {
    console.log('🔍 [apiService] Obteniendo progreso por usuario:', userId);
    return this.request<Progress[]>(`/progress/user/${userId}`);
  }

  async getProgressBySubtopic(subtopicId: string): Promise<ApiResponse<Progress[]>> {
    console.log('🔍 [apiService] Obteniendo progreso por subtopic:', subtopicId);
    return this.request<Progress[]>(`/progress/subtopic/${subtopicId}`);
  }

  async createProgress(progressData: {
    userId: string;
    subtopicId: string;
    progressType: string;
    percentage: number;
  }): Promise<ApiResponse<Progress>> {
    console.log('🔍 [apiService] Creando progreso:', progressData);
    return this.request<Progress>('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async updateProgress(id: string, progressData: Partial<Progress>): Promise<ApiResponse<Progress>> {
    console.log('🔍 [apiService] Actualizando progreso:', id);
    return this.request<Progress>(`/progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async deleteProgress(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando progreso:', id);
    return this.request(`/progress/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CLASS ASSIGNMENTS ====================

  async getAllClassAssignments(): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo todas las asignaciones de clase');
    return this.request<ClassAssignment[]>('/class-assignments');
  }

  async getClassAssignmentsByTeacher(teacherId: string): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo asignaciones por profesor:', teacherId);
    return this.request<ClassAssignment[]>(`/class-assignments/teacher/${teacherId}`);
  }

  async getClassAssignmentsByGrade(gradeId: string): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo asignaciones por grado:', gradeId);
    return this.request<ClassAssignment[]>(`/class-assignments/grade/${gradeId}`);
  }

  async getClassAssignmentsBySubject(subjectId: string): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo asignaciones por materia:', subjectId);
    return this.request<ClassAssignment[]>(`/class-assignments/subject/${subjectId}`);
  }

  async createClassAssignment(assignmentData: {
    gradeId: string;
    subjectId: string;
    teacherId: string;
  }): Promise<ApiResponse<ClassAssignment>> {
    console.log('🔍 [apiService] Creando asignación de clase:', assignmentData);
    return this.request<ClassAssignment>('/class-assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateClassAssignment(id: string, assignmentData: Partial<ClassAssignment>): Promise<ApiResponse<ClassAssignment>> {
    console.log('🔍 [apiService] Actualizando asignación de clase:', id);
    return this.request<ClassAssignment>(`/class-assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteClassAssignment(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando asignación de clase:', id);
    return this.request(`/class-assignments/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== SUBJECTS MANAGEMENT ====================

  async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
    console.log('🔍 [apiService] Obteniendo todas las materias');
    return this.request<Subject[]>('/subjects');
  }

  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    console.log('🔍 [apiService] Obteniendo materia por ID:', id);
    return this.request<Subject>(`/subjects/${id}`);
  }

  async createSubject(subjectData: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<Subject>> {
    console.log('🔍 [apiService] Creando materia:', subjectData);
    return this.request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    console.log('🔍 [apiService] Actualizando materia:', id);
    return this.request<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando materia:', id);
    return this.request(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  async getSubjectsWithSubtopics(): Promise<ApiResponse<Subject[]>> {
    console.log('🔍 [apiService] Obteniendo materias con subtopics');
    return this.request<Subject[]>('/subjects?include=subtopics');
  }

  async getSubjectsWithAssignments(): Promise<ApiResponse<Subject[]>> {
    console.log('🔍 [apiService] Obteniendo materias con asignaciones');
    return this.request<Subject[]>('/subjects?include=assignments');
  }

  // ==================== UTILIDADES ====================

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('arandu_token', token);
    }
  }

  async getSubjectsByTeacherId(teacherId: string): Promise<Subject[]> {
    try {
      const response = await this.request(`/teachers/${teacherId}/subjects`)
      return response.data
    } catch (error) {
      console.error('Error fetching teacher subjects:', error)
      return []
    }
  }

  // Teacher-specific endpoints
  async getStudentsByTeacherId(teacherId: string): Promise<User[]> {
    try {
      const response = await this.request(`/teachers/${teacherId}/students`)
      return response.data
    } catch (error) {
      console.error('Error fetching teacher students:', error)
      return []
    }
  }

  async getCourseContentByTeacherId(teacherId: string): Promise<any[]> {
    try {
      const response = await this.request(`/teachers/${teacherId}/content`)
      return response.data
    } catch (error) {
      console.error('Error fetching teacher content:', error)
      return []
    }
  }

  async getRecentActivityByTeacherId(teacherId: string): Promise<any[]> {
    try {
      const response = await this.request(`/teachers/${teacherId}/activity`)
      return response.data
    } catch (error) {
      console.error('Error fetching teacher activity:', error)
      return []
    }
  }
}

export const apiService = new ApiService();
