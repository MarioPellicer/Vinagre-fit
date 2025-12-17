// src/pages/Profile.jsx - CON SUPABASE
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Profile() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      // 1. Obtener usuario autenticado
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        nav('/login')
        return
      }

      setUser(authUser)

      // 2. Obtener datos adicionales del usuario
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) throw profileError
      setUserData(userProfile)

      // 3. Si tiene plan, obtener info del plan
      if (userProfile.plan_id) {
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('*')
          .eq('id', userProfile.plan_id)
          .single()

        if (!planError) {
          setPlan(planData)
        }
      }
    } catch (error) {
      console.error('Error cargando perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '48px' }}>
        <p style={{ color: 'var(--muted)' }}>Cargando perfil...</p>
      </div>
    )
  }

  if (!user || !userData) {
    return (
      <div className="card text-center">
        <p>No se pudo cargar el perfil</p>
        <button onClick={() => nav('/login')}>Volver al login</button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-center mb-4">Mi Perfil</h2>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B35 0%, #ff8c42 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '900',
            color: 'white'
          }}>
            {userData.nombre?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ marginBottom: '4px' }}>
              {userData.nombre} {userData.apellidos}
            </h3>
            <p style={{ color: 'var(--muted)' }}>{user.email}</p>
            <span className="badge">Miembro Activo</span>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <span className="stat-label">Tu Plan</span>
            <h4 style={{ color: 'var(--orange)', marginTop: '8px' }}>
              {plan?.nombre || 'Sin plan'}
            </h4>
          </div>
          <div className="stat-card">
            <span className="stat-label">Precio</span>
            <h4 style={{ marginTop: '8px' }}>
              {plan?.precio || '0'}€/mes
            </h4>
          </div>
        </div>

        <h3 className="mb-2">Información Personal</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--gray-light)' }}>
            <strong>DNI:</strong> {userData.dni || 'No especificado'}
          </div>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--gray-light)' }}>
            <strong>Dirección:</strong> {userData.direccion || 'No especificada'}
          </div>
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--gray-light)' }}>
            <strong>Datos Bancarios:</strong> {userData.datos_bancarios ? '•••• •••• •••• ' + userData.datos_bancarios.slice(-4) : 'No especificados'}
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button onClick={() => nav('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}