"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, User, Wallet } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { apiService } from "@/lib/api"
import { determineUserRole, getDashboardRoute } from "@/lib/roles"

export function LoginPage() {
  const { login, loginWithWallet, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 [LoginPage] Formulario enviado, iniciando login...');
    console.log('🔍 [LoginPage] Datos del formulario:', { email, password: '***' });
    setError("")

    const result = await login(email, password)
    console.log('🔍 [LoginPage] Resultado del login:', result);
    
    if (result.success) {
      console.log('✅ [LoginPage] Login exitoso, redirigiendo...');
      
      // Obtener el usuario actual para determinar el rol
      const currentUser = await apiService.getCurrentUser();
      console.log('🔍 [LoginPage] Usuario actual:', currentUser);
      
      if (currentUser.success && currentUser.data) {
        const user = currentUser.data;
        console.log('🔍 [LoginPage] Datos del usuario:', user);
        
        // Determinar el rol y redirigir
        const role = determineUserRole(user);
        const dashboardRoute = getDashboardRoute(role);
        
        console.log(`🎯 [LoginPage] Rol determinado: ${role}, redirigiendo a: ${dashboardRoute}`);
        router.push(dashboardRoute);
      } else {
        // Fallback: redirigir a dashboard de estudiante por defecto
        console.log('👨‍🎓 [LoginPage] No se pudo determinar el rol, redirigiendo a dashboard de estudiante por defecto');
        router.push("/dashboard/student");
      }
    } else {
      console.log('❌ [LoginPage] Login falló:', result.error);
      setError(result.error || "Error al iniciar sesión")
    }
  }

  const handleWalletLogin = async () => {
    const result = await loginWithWallet("0x123...", "signature")
    if (result.success) {
      router.push("/dashboard/teacher")
    } else {
      setError(result.error || "Error al conectar wallet")
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-poppins text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta de ARANDU</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    <Mail className="mr-2 w-4 h-4" />
                    {isLoading ? "Entrando..." : "Entrar con Email"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Conecta tu wallet para acceder con Web3</p>
                  {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                  >
                    <Wallet className="mr-2 w-4 h-4" />
                    {isLoading ? "Conectando..." : "Conectar Wallet"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-4">
              <Button variant="link" className="text-sm">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export function RegisterPage() {
  const { register, registerWithWallet, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  })
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 [RegisterPage] Formulario enviado, iniciando registro...');
    console.log('🔍 [RegisterPage] Datos del formulario:', { ...formData, password: '***' });
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos")
      return
    }

    const result = await register(formData)
    console.log('🔍 [RegisterPage] Resultado del registro:', result);
    
    if (result.success) {
      console.log('✅ [RegisterPage] Registro exitoso, redirigiendo...');
      
      // Redirigir según el rol seleccionado
      const dashboardRoute = getDashboardRoute(formData.role as any);
      console.log(`🎯 [RegisterPage] Rol seleccionado: ${formData.role}, redirigiendo a: ${dashboardRoute}`);
      router.push(dashboardRoute);
    } else {
      console.log('❌ [RegisterPage] Registro falló:', result.error);
      setError(result.error || "Error al crear la cuenta")
    }
  }

  const handleWalletRegister = async () => {
    const result = await registerWithWallet("0x123...", "signature")
    if (result.success) {
      router.push("/dashboard/student")
    } else {
      setError(result.error || "Error al conectar wallet")
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-poppins text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>Únete a la revolución educativa</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Tu nombre" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="tu@email.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <select 
                  name="role"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="student">Estudiante</option>
                  <option value="teacher">Profesor</option>
                  <option value="institution">Institución</option>
                </select>
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                <User className="mr-2 w-4 h-4" />
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full bg-transparent mt-4"
              onClick={handleWalletRegister}
              disabled={isLoading}
            >
              <Wallet className="mr-2 w-4 h-4" />
              Registrarse con Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
