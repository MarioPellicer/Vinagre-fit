// src/pages/Register.jsx - Supabase Auth + Trigger
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Register() {
  const nav = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    direccion: '',
    dni: '',
    datosBancarios: '',
    planId: ''
  })
  const [plans, setPlans] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadPlans() }, [])

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('precio', { ascending: true })
      if (error) throw error
      setPlans(data || [])
      if (data && data.length > 0) setFormData(prev => ({ ...prev, planId: data[0].id }))
    } catch (error) {
      console.error('Error cargando planes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.nombre || !formData.email || !formData.password) {
      setError('Nombre, email y contraseña son obligatorios')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      // Registrar usuario en Supabase Auth con user_metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            dni: formData.dni,
            direccion: formData.direccion,
            datos_bancarios: formData.datosBancarios,
            plan_id: formData.planId
          }
        }
      })

      if (signUpError) throw signUpError

      setSuccess(true)
      setTimeout(() => nav('/login'), 2000)
    } catch (error) {
      console.error('Error en registro:', error)
      setError(error.message || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="form card text-center">
        <div className="alert alert-success">
          <h3>¡Registro exitoso!</h3>
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-center mb-3">Únete a Vinagre Fit</h2>
      <p className="text-center mb-4" style={{ color: 'var(--muted)' }}>
        Completa el formulario para comenzar tu transformación
      </p>

      <form onSubmit={handleSubmit} className="form card">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre" type="text"
            value={formData.nombre}
            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Tu nombre" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="apellidos">Apellidos</label>
          <input
            id="apellidos" type="text"
            value={formData.apellidos}
            onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
            placeholder="Tus apellidos" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email" type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@email.com" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña * (mínimo 6 caracteres)</label>
          <input
            id="password" type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="dni">DNI</label>
          <input
            id="dni" type="text"
            value={formData.dni}
            onChange={e => setFormData({ ...formData, dni: e.target.value })}
            placeholder="12345678X" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion" type="text"
            value={formData.direccion}
            onChange={e => setFormData({ ...formData, direccion: e.target.value })}
            placeholder="Tu dirección" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="datosBancarios">Datos Bancarios (IBAN)</label>
          <input
            id="datosBancarios" type="text"
            value={formData.datosBancarios}
            onChange={e => setFormData({ ...formData, datosBancarios: e.target.value })}
            placeholder="ES00 0000 0000 0000 0000" disabled={loading} />
        </div>

        <div className="form-group">
          <label htmlFor="plan">Selecciona tu Plan</label>
          <select
            id="plan" value={formData.planId}
            onChange={e => setFormData({ ...formData, planId: e.target.value })}
            disabled={loading}>
            {plans.length === 0 && <option>Cargando planes...</option>}
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.nombre} - {plan.precio}€/{plan.duracion === 1 ? 'mes' : 'año'}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="button" className="secondary"
            onClick={() => nav('/login')} disabled={loading}>Volver</button>
          <button type="submit" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'REGISTRANDO...' : 'REGISTRARME'}
          </button>
        </div>
      </form>
    </div>
  )
}
