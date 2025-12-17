// src/pages/Login.jsx - CON VERIFICACIÓN DE ROL DESDE SUPABASE
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Por favor, completa todos los campos')
      setLoading(false)
      return
    }

    try {
      // Iniciar sesión
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (signInError) throw signInError

      // Obtener el rol del usuario desde la base de datos
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('rol')
        .eq('id', data.user.id)
        .single()

      if (userError) {
        console.error('Error obteniendo datos del usuario:', userError)
        // Si no se encuentra el usuario en la tabla, ir a profile por defecto
        nav('/profile')
        return
      }

      // Redirigir según el rol
      if (userData.rol === 'admin') {
        nav('/admin')
      } else {
        nav('/profile')
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError(error.message || 'Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-center mb-3">Bienvenido de vuelta</h2>
      <p className="text-center mb-4" style={{ color: 'var(--muted)' }}>
        Inicia sesión para continuar
      </p>

      <form onSubmit={handleSubmit} className="form card">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          style={{ width: '100%', marginTop: '16px' }}
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
        </button>

        <div className="text-center mt-3">
          <p style={{ color: 'var(--muted)', marginBottom: '12px' }}>
            ¿No tienes cuenta?
          </p>
          <Link to="/register" className="text-orange" style={{ fontWeight: '600' }}>
            Regístrate aquí
          </Link>
        </div>

        <div className="alert alert-info mt-3">
          <small>
            <strong>Para acceder como admin:</strong> Registra un usuario con email "admvinagrefit@gmail.com" y el sistema le asignará automáticamente el rol de administrador.
          </small>
        </div>
      </form>
    </div>
  )
}