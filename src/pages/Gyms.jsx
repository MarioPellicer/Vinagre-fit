// src/pages/Gyms.jsx - CON SUPABASE
import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Gyms() {
  const [gymsList, setGymsList] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGyms()
  }, [])

  const loadGyms = async () => {
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setGymsList(data || [])
    } catch (error) {
      console.error('Error cargando gimnasios:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = gymsList.filter(g =>
    g.nombre.toLowerCase().includes(query.toLowerCase()) ||
    g.direccion.toLowerCase().includes(query.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: '18px' }}>Cargando gimnasios...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#111827', marginBottom: '1rem' }}>
            Nuestros <span style={{ color: '#f97316' }}>Gyms</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '0.5rem' }}>
            Explora nuestras instalaciones en Zaragoza
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Busca por nombre o dirección. Los datos se cargan desde <code style={{ backgroundColor: '#e5e7eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Supabase</code>.
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div style={{ maxWidth: '42rem', margin: '0 auto 3rem auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '2px solid #e5e7eb', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} role="search" aria-label="Buscar gimnasios">
            <label htmlFor="q" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
              Buscar Gimnasio
            </label>
            <input
              id="q"
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none'
              }}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ej. Central, Norte, Plaza Mayor..."
              onFocus={e => e.target.style.borderColor = '#f97316'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Grid de gimnasios */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }} aria-live="polite">
          {filtered.map(g => {
            return (
              <article
                key={g.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: '2px solid #e5e7eb',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                aria-labelledby={'gym-' + g.id}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#f97316'
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Header con gradiente */}
                <div style={{
                  position: 'relative',
                  height: '16rem',
                  background: 'linear-gradient(to bottom right, #d1d5db, #e5e7eb, #d1d5db)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), transparent)',
                    transition: 'all 0.3s'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem'
                  }}>
                    <div style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      color: '#f97316',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}>
                      Gimnasio {g.id}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '2rem' }}>
                  <h3 id={'gym-' + g.id} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                    {g.nombre}
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>📍</span>
                      <div>
                        <p style={{ color: '#374151', fontWeight: '500' }}>{g.direccion}</p>
                      </div>
                    </div>

                    {g.telefono && (
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>📞</span>
                        <a
                          href={`tel:${g.telefono}`}
                          style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color = '#f97316'}
                          onMouseLeave={e => e.target.style.color = '#374151'}
                        >
                          {g.telefono}
                        </a>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>🕐</span>
                      <div>
                        <p style={{ color: '#374151', fontWeight: '500' }}>{g.horario}</p>
                      </div>
                    </div>
                  </div>

                  {/* Servicios */}
                  {g.servicios && g.servicios.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.75rem' }}>
                        Servicios disponibles:
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {g.servicios.map((servicio, idx) => {
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                              <span style={{ marginRight: '0.5rem', color: '#f97316' }}>✓</span>
                              <span>{servicio}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}

          {filtered.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '2px solid #e5e7eb',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#4b5563', fontWeight: '500', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                No se encontraron gimnasios que coincidan.
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}