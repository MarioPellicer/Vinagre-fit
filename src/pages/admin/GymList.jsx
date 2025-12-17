// src/pages/admin/GymList.jsx - CON SUPABASE
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

export default function GymList({ onUpdate }) {
  const [gyms, setGyms] = useState([])
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
      setGyms(data || [])
    } catch (error) {
      console.error('Error cargando gimnasios:', error)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar este gym?')) return

    try {
      const { error } = await supabase
        .from('gyms')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Recargar lista
      await loadGyms()
      
      // Notificar al padre para actualizar stats
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error eliminando gym:', error)
      alert('Error al eliminar el gimnasio')
    }
  }

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '48px' }}>
        <p style={{ color: 'var(--muted)' }}>Cargando gimnasios...</p>
      </div>
    )
  }

  return (
    <div>
      <p className="card">
        Listado de gimnasios (editable). Puedes agregar, editar o eliminar. 
        Los cambios se guardan en <strong>Supabase</strong>.
      </p>
      
      <div style={{ marginTop: 12 }}>
        {gyms.length === 0 && (
          <p className="card">
            No hay gyms. <Link to="add">Crear uno</Link>.
          </p>
        )}
        
        <div className="gyms-grid">
          {gyms.map(g => (
            <div key={g.id} className="gym-card">
              <h3>{g.nombre}</h3>
              <p><strong>Dirección:</strong> {g.direccion}</p>
              <p><strong>Horario:</strong> {g.horario}</p>
              {g.telefono && <p><strong>Teléfono:</strong> {g.telefono}</p>}
              
              {g.servicios && g.servicios.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <strong>Servicios:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {g.servicios.map((servicio, idx) => (
                      <li key={idx}>{servicio}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div style={{ marginTop: 16, display: 'flex', gap: '8px' }}>
                <Link 
                  to={'edit/' + g.id} 
                  className="button-secondary" 
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Editar
                </Link>
                <button onClick={() => remove(g.id)} style={{ flex: 1 }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}