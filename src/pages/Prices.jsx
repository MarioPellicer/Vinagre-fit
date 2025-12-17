// src/pages/Prices.jsx - CON SUPABASE
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Prices() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('precio', { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      console.error('Error cargando planes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '48px' }}>
        <p style={{ color: 'var(--muted)' }}>Cargando planes...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-center mb-2">Planes y Precios</h2>
      <p className="text-center mb-4" style={{ fontSize: '18px', color: 'var(--muted)' }}>
        Elige tu suscripción para ponerte fuerte como una lechuga
      </p>

      <div className="price-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`price-card ${plan.featured ? 'featured' : ''}`}
          >
            {plan.featured && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#fbbf24',
                color: '#1f2937',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                MÁS POPULAR
              </div>
            )}

            <h3>{plan.nombre}</h3>
            <p style={{
              fontSize: '14px',
              opacity: plan.featured ? 0.9 : 0.7,
              marginBottom: '16px'
            }}>
              {plan.descripcion}
            </p>

            <div className="price-amount">
              {plan.precio}€
            </div>
            <p style={{
              fontSize: '14px',
              opacity: plan.featured ? 0.9 : 0.7,
              marginBottom: '24px'
            }}>
              /{plan.duracion === 1 ? 'mes' : 'año'}
            </p>

            <ul>
              {plan.caracteristicas && plan.caracteristicas.map((item, idx) => (
                <li key={idx} style={{
                  color: plan.featured ? 'rgba(255,255,255,0.95)' : 'var(--text)'
                }}>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              style={{
                display: 'inline-block',
                width: '100%',
                textAlign: 'center',
                padding: '12px',
                marginTop: '24px',
                background: plan.featured ? 'white' : 'linear-gradient(135deg, #FF6B35 0%, #ff8c42 100%)',
                color: plan.featured ? '#FF6B35' : 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}
            >
              ELEGIR PLAN
            </Link>
          </div>
        ))}
      </div>

      <div className="card mt-4" style={{ maxWidth: '900px', margin: '32px auto 0' }}>
        <h3 className="text-center mb-3">Todos los planes incluyen:</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {[
            'Sin permanencia obligatoria',
            'Cancela cuando quieras',
            'Acceso 24/7 con tu tarjeta',
            'Vestuarios premium',
            'WiFi de alta velocidad',
            'App de seguimiento'
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--orange)', fontWeight: '700' }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <p style={{ color: 'var(--muted)', marginBottom: '12px' }}>
          ¿Necesitas más información?
        </p>
        <Link to="/gyms" className="text-orange" style={{ fontWeight: '600', fontSize: '16px' }}>
          Visita nuestros gimnasios →
        </Link>
      </div>
    </div>
  )
}