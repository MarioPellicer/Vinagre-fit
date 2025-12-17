// src/pages/admin/GymForm.jsx - CON SUPABASE
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

export default function GymForm({ onSave }) {
  const nav = useNavigate()
  const { id } = useParams()
  const editing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [horario, setHorario] = useState('')
  const [telefono, setTelefono] = useState('')
  const [servicios, setServicios] = useState('')

  useEffect(() => {
    if (editing) {
      loadGym()
    }
  }, [id])

  const loadGym = async () => {
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setNombre(data.nombre || '')
      setDireccion(data.direccion || '')
      setHorario(data.horario || '')
      setTelefono(data.telefono || '')
      setServicios(data.servicios ? data.servicios.join(', ') : '')
    } catch (error) {
      console.error('Error cargando gym:', error)
      alert('Error al cargar el gimnasio')
    }
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!nombre || !direccion) {
      alert('⚠️ Nombre y dirección son obligatorios')
      return
    }

    setLoading(true)

    try {
      // Convertir servicios de string a array
      const serviciosArray = servicios
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      if (editing) {
        // Actualizar
        const { error } = await supabase
          .from('gyms')
          .update({
            nombre,
            direccion,
            horario,
            telefono,
            servicios: serviciosArray
          })
          .eq('id', id)

        if (error) throw error
      } else {
        // Crear
        const { error } = await supabase
          .from('gyms')
          .insert([{
            nombre,
            direccion,
            horario,
            telefono,
            servicios: serviciosArray
          }])

        if (error) throw error
      }

      // Notificar al padre para actualizar stats
      if (onSave) onSave()

      nav('/admin')
    } catch (error) {
      console.error('Error guardando gym:', error)
      alert('Error al guardar el gimnasio: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: '900',
          color: 'var(--black)',
          marginBottom: '8px'
        }}>
          {editing ? '✏️ Editar Gimnasio' : '➕ Agregar Nuevo Gimnasio'}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {editing
            ? 'Modifica la información del gimnasio'
            : 'Completa los datos para agregar un nuevo gimnasio'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="card" style={{ maxWidth: '700px' }}>
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre del Gimnasio *
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Vinagre Fit Centro"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">
            Dirección *
          </label>
          <input
            id="direccion"
            type="text"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            placeholder="Ej. Calle Alfonso I, 23, Zaragoza"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="horario">
            Horario
          </label>
          <input
            id="horario"
            type="text"
            value={horario}
            onChange={e => setHorario(e.target.value)}
            placeholder="Ej. L-V: 6:00 - 23:00, S-D: 8:00 - 21:00"
            disabled={loading}
          />
          <small style={{ display: 'block', marginTop: '4px', color: 'var(--muted)' }}>
            🕐 Especifica los días y horarios de apertura
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            type="text"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="Ej. 976 123 456"
            disabled={loading}
          />
          <small style={{ display: 'block', marginTop: '4px', color: 'var(--muted)' }}>
            📞 Número de contacto del gimnasio
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="servicios">
            Servicios
          </label>
          <input
            id="servicios"
            type="text"
            value={servicios}
            onChange={e => setServicios(e.target.value)}
            placeholder="Ej. Parking, Vestuarios, Duchas, Sauna"
            disabled={loading}
          />
          <small style={{ display: 'block', marginTop: '4px', color: 'var(--muted)' }}>
            ✨ Separa los servicios con comas
          </small>
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '2px solid var(--gray-light)'
        }}>
          <button
            type="button"
            className="secondary"
            onClick={() => nav('/admin')}
            style={{ flex: 1 }}
            disabled={loading}
          >
            ← Cancelar
          </button>
          <button
            type="submit"
            style={{ flex: 2 }}
            disabled={loading}
          >
            {loading 
              ? 'Guardando...' 
              : (editing ? '💾 Guardar Cambios' : '✅ Crear Gimnasio')
            }
          </button>
        </div>
      </form>
    </div>
  )
}