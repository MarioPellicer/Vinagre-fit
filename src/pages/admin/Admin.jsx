// src/pages/admin/Admin.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import GymList from './GymList'
import GymForm from './GymForm'


import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

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

  // 🔥 ESTADOS USABILIDAD
  const [totalClicks, setTotalClicks] = useState(0)
  const [clicksPorMinuto, setClicksPorMinuto] = useState({})

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user || user.email !== 'admvinagrefit@gmail.com') {
      nav('/login')
      return
    }

    loadData()
  }

  const loadData = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select(`*, plan:plans(*)`)

      const { data: gymsData } = await supabase
        .from('gyms')
        .select('*')

      setUsers(usersData || [])

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
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 BOTÓN CLICK
  const handleClickUsabilidad = () => {
    const ahora = new Date()
    const minuto = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, '0')}`

    setTotalClicks(prev => prev + 1)

    setClicksPorMinuto(prev => ({
      ...prev,
      [minuto]: (prev[minuto] || 0) + 1
    }))
  }

  // DATOS PARA GRÁFICOS
  const dataGrafico = Object.entries(clicksPorMinuto).map(([hora, clicks]) => ({
    hora,
    clicks
  }))

  const COLORS = ['#ff6b35', '#f7931e', '#ffb347', '#ffcc70']

  const filteredUsers = users.filter(user =>
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p style={{ padding: 40 }}>Cargando admin...</p>

  return (
    <div>

      <h2>🛠️ Panel de Administración</h2>

      {/* ESTADÍSTICAS */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <span className="stat-number">{stats.totalUsers}</span>
          <span className="stat-label">Total Usuarios</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.activeUsers}</span>
          <span className="stat-label">Usuarios Activos</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.revenue.toFixed(0)}€</span>
          <span className="stat-label">Ingresos</span>
        </div>

        <div className="stat-card">
          <span className="stat-number">{stats.totalGyms}</span>
          <span className="stat-label">Gimnasios</span>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav style={{ marginBottom: 20 }}>
        <NavLink to="">Gyms</NavLink> |{" "}
        <NavLink to="add">Agregar</NavLink> |{" "}
        <NavLink to="users">Usuarios</NavLink>
      </nav>

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

      {/* 🔥 INFORME USABILIDAD */}
      <div style={{ marginTop: 40, padding: 20, border: '2px solid #eee' }}>
        <h2>📊 Informe de Usabilidad (Tiempo Real)</h2>

        <button onClick={handleClickUsabilidad}>
          Simular interacción
        </button>

        <h3>Total clicks: {totalClicks}</h3>

        {/* TABLA */}
        <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Clicks</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(clicksPorMinuto).map(([hora, clicks]) => (
              <tr key={hora}>
                <td>{hora}</td>
                <td>{clicks}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td><b>Total</b></td>
              <td><b>{totalClicks}</b></td>
            </tr>
          </tfoot>
        </table>

        {/* GRÁFICO LÍNEAS */}
        <h3 style={{ marginTop: 30 }}>Clicks por minuto</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="clicks" stroke="#ff6b35" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>

        {/* GRÁFICO SECTORES */}
        <h3>Distribución de clicks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataGrafico}
              dataKey="clicks"
              nameKey="hora"
              outerRadius={100}
              label
            >
              {dataGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

function UsersListView({ users, searchTerm, setSearchTerm }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar usuario"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {users.map((user, i) => (
        <div key={i}>
          {user.nombre} {user.apellidos}
        </div>
      ))}
    </div>
  )
}
