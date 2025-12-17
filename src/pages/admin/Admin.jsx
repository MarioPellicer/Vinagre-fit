// src/pages/admin/Admin.jsx - CON SUPABASE
import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import GymList from './GymList'
import GymForm from './GymForm'

export default function Admin() {
  const nav = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
    totalGyms: 0
  })
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Verificar si es admin
  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user || user.email !== 'admvinagrefit@gmail.com') {
        nav('/login')
        return
      }

      // Si es admin, cargar datos
      loadData()
    } catch (error) {
      console.error('Error verificando admin:', error)
      nav('/login')
    }
  }

  const loadData = async () => {
    try {
      // Cargar usuarios
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          plan:plans(*)
        `)

      if (usersError) throw usersError

      // Cargar gimnasios
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('*')

      if (gymsError) throw gymsError

      setUsers(usersData || [])

      // Calcular estadísticas
      const totalUsers = usersData?.length || 0
      const activeUsers = usersData?.filter(u => u.plan_id).length || 0
      const revenue = usersData?.reduce((sum, u) => sum + (u.plan?.precio || 0), 0) || 0

      setStats({
        totalUsers,
        activeUsers,
        revenue,
        totalGyms: gymsData?.length || 0
      })
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '48px' }}>
        <p style={{ color: 'var(--muted)' }}>Cargando panel de administración...</p>
      </div>
    )
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <h2 style={{
          fontSize: '32px',
          fontWeight: '900',
          color: 'var(--black)',
          marginBottom: '8px'
        }}>
          🛠️ Panel de Administración
        </h2>
        <p style={{ color: 'var(--muted)' }}>
          Gestiona usuarios, gimnasios y visualiza estadísticas
        </p>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <span className="stat-number">{stats.totalUsers}</span>
          <span className="stat-label">Total Usuarios</span>
          <div style={{
            marginTop: '8px',
            padding: '4px 12px',
            background: '#dbeafe',
            color: '#1e40af',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'inline-block'
          }}>
            Registrados
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.activeUsers}</span>
          <span className="stat-label">Usuarios Activos</span>
          <div style={{
            marginTop: '8px',
            padding: '4px 12px',
            background: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'inline-block'
          }}>
            Con Plan
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.revenue.toFixed(0)}€</span>
          <span className="stat-label">Ingresos Mensuales</span>
          <div style={{
            marginTop: '8px',
            padding: '4px 12px',
            background: '#fed7aa',
            color: '#9a3412',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'inline-block'
          }}>
            Estimados
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.totalGyms}</span>
          <span className="stat-label">Gimnasios</span>
          <div style={{
            marginTop: '8px',
            padding: '4px 12px',
            background: '#fce7f3',
            color: '#831843',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'inline-block'
          }}>
            Activos
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN DE PESTAÑAS */}
      <nav className="card" style={{
        marginBottom: '24px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <NavLink
          to=""
          end
          className={({ isActive }) => isActive ? 'badge' : 'button-secondary'}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          🏋️ Gestionar Gimnasios
        </NavLink>
        <NavLink
          to="add"
          className={({ isActive }) => isActive ? 'badge' : 'button-secondary'}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          ➕ Agregar Gym
        </NavLink>
        <NavLink
          to="users"
          className={({ isActive }) => isActive ? 'badge' : 'button-secondary'}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px'
          }}
        >
          👥 Ver Usuarios
        </NavLink>
      </nav>

      {/* RUTAS */}
      <Routes>
        <Route index element={<GymList onUpdate={loadData} />} />
        <Route path="add" element={<GymForm onSave={loadData} />} />
        <Route path="edit/:id" element={<GymForm onSave={loadData} />} />
        <Route path="users" element={
          <UsersListView
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        } />
      </Routes>
    </div>
  )
}

// COMPONENTE PARA MOSTRAR USUARIOS
function UsersListView({ users, searchTerm, setSearchTerm }) {
  return (
    <div>
      <div className="card mb-3" style={{ padding: '20px' }}>
        <label htmlFor="search-user" style={{
          display: 'block',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--gray-dark)'
        }}>
          Buscar Usuario
        </label>
        <input
          id="search-user"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '2px solid var(--gray-light)',
            fontSize: '15px'
          }}
        />
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--black)',
            margin: 0
          }}>
            Usuarios Registrados ({users.length})
          </h3>
        </div>

        {users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--muted)'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>
              {searchTerm ? '🔍 No se encontraron usuarios' : '🔭 No hay usuarios registrados aún'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ marginTop: '12px' }}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {users.map((user, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  boxShadow: 'none',
                  border: '2px solid var(--gray-light)',
                  padding: '20px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--orange)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gray-light)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--orange) 0%, #ff8c42 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    {user.nombre?.charAt(0) || '?'}
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'var(--black)',
                      marginBottom: '4px'
                    }}>
                      {user.nombre} {user.apellidos}
                    </h4>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                      <span className="badge" style={{ fontSize: '11px' }}>
                        {user.plan?.nombre || 'Sin plan'}
                      </span>
                      {user.direccion && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'var(--gray-light)',
                          color: 'var(--gray-dark)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          📍 {user.direccion}
                        </span>
                      )}
                      {user.dni && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'var(--gray-light)',
                          color: 'var(--gray-dark)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          🆔 {user.dni}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <button style={{
                      padding: '8px 16px',
                      background: '#d1fae5',
                      color: '#065f46',
                      fontSize: '13px',
                      boxShadow: 'none'
                    }}>
                      ✅ Pagado
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}