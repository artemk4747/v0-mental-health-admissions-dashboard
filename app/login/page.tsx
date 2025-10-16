"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Brain } from "lucide-react"

const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "El usuario o email es requerido")
    .refine(
      (val) => {
        // If it contains @, validate as email
        if (val.includes("@")) {
          return z.string().email().safeParse(val).success
        }
        return true
      },
      { message: "Email inválido" },
    ),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  remember: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      remember: false,
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsSubmitting(true)

    try {
      await login(data)
      router.push(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
      // Focus on first input on error
      document.getElementById("usernameOrEmail")?.focus()
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoCredentials = () => {
    setValue("usernameOrEmail", "admin@demo.com")
    setValue("password", "demo123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Acceso — Mental Health Admissions</CardTitle>
          <CardDescription className="text-balance">
            Ingresa tus credenciales para acceder al dashboard de análisis
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Usuario o Email</Label>
              <Input
                id="usernameOrEmail"
                type="text"
                placeholder="admin@demo.com"
                autoComplete="username"
                aria-invalid={!!errors.usernameOrEmail}
                aria-describedby={errors.usernameOrEmail ? "usernameOrEmail-error" : undefined}
                {...register("usernameOrEmail")}
              />
              {errors.usernameOrEmail && (
                <p id="usernameOrEmail-error" className="text-sm text-destructive" role="alert">
                  {errors.usernameOrEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" {...register("remember")} />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Recordarme
                </Label>
              </div>
              <Button type="button" variant="link" className="px-0 text-sm" disabled>
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando sesión..." : "Entrar"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Credenciales de prueba</span>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Usuario:</strong> admin@demo.com
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Contraseña:</strong> demo123
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={fillDemoCredentials}
              >
                Autocompletar credenciales
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-muted-foreground text-balance">
            Al iniciar sesión, aceptas los términos de uso del sistema de análisis de admisiones de salud mental.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
