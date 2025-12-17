// src/App.jsx - CON SUPABASE AUTH Y ROL DESDE BD
import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { supabase } from './supabaseClient'
import Home from './pages/Home'
import Gyms from './pages/Gyms'
import Prices from './pages/Prices'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import About from './pages/About'
import Admin from './pages/admin/Admin'
import NotFound from './pages/NotFound'

export default function App(){
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar sesión al cargar
  useEffect(() => {
    checkUserAndRole()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUserAndRole()
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserAndRole = async () => {
    try {
      // Obtener sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        setCurrentUser(null)
        setUserRole(null)
        setLoading(false)
        return
      }

      setCurrentUser(session.user)

      // Obtener el rol desde la base de datos
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('rol')
        .eq('id', session.user.id)
        .single()

      if (userError) {
        console.error('Error obteniendo rol:', userError)
        setUserRole('user') // Por defecto user si hay error
      } else {
        setUserRole(userData.rol)
      }
    } catch (error) {
      console.error('Error verificando usuario:', error)
      setUserRole('user')
    } finally {
      setLoading(false)
    }
  }

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setUserRole(null)
    navigate('/')
  }

  // Función para ir al home al clickear el logo
  const handleLogoClick = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      }}>
        <div style={{textAlign: 'center'}}>
          <Heart style={{
            width: '64px',
            height: '64px',
            color: '#FF6B35',
            animation: 'pulse 2s infinite'
          }} />
          <p style={{color: 'white', marginTop: '16px', fontSize: '18px'}}>
            Cargando...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="site-header" role="banner">
        <div className="container header-inner">
          {/* Logo con corazón clickeable */}
          <div className="brand-container" onClick={handleLogoClick}>
            <div className="heart-wrapper">
              <Heart className="heart-icon" />
              <div className="heart-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="brand">
                <span style={{ color: '#FF6B35' }}>VINAGRE</span> FIT
              </h1>
              <p className="slogan">Donde cada gota cuenta</p>
            </div>
          </div>
          
          <nav aria-label="Main navigation">
            <ul className="nav-list">
              {/* ENLACES SIEMPRE VISIBLES */}
              <li>
                <NavLink to="/" end className={({isActive})=>isActive?'active':''}>
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/gyms" className={({isActive})=>isActive?'active':''}>
                  Gimnasios
                </NavLink>
              </li>
              <li>
                <NavLink to="/prices" className={({isActive})=>isActive?'active':''}>
                  Precios
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({isActive})=>isActive?'active':''}>
                  Nosotros
                </NavLink>
              </li>
              
              {/* SI HAY USUARIO LOGUEADO */}
              {currentUser ? (
                <>
                  {/* Si es admin, mostrar botón de Admin */}
                  {userRole === 'admin' && (
                    <li>
                      <NavLink 
                        to="/admin" 
                        className={({isActive})=>isActive?'active admin':'admin'}
                      >
                        👑 Admin
                      </NavLink>
                    </li>
                  )}
                  
                  {/* Botón de perfil (solo para usuarios normales) */}
                  {userRole === 'user' && (
                    <li>
                      <NavLink 
                        to="/profile" 
                        className={({isActive})=>isActive?'active':''}
                      >
                        Mi Perfil
                      </NavLink>
                    </li>
                  )}
                  
                  {/* Botón de cerrar sesión */}
                  <li>
                    <button onClick={handleLogout} className="nav-btn">
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                /* SI NO HAY USUARIO, MOSTRAR LOGIN Y REGISTRO */
                <>
                  <li>
                    <NavLink to="/login" className={({isActive})=>isActive?'active':''}>
                      Entrar
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className="cta-nav">
                      Apúntate
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container main-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gyms" element={<Gyms />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="container footer-content">
          <div className="footer-top">
            <div className="footer-logo-section">
              <div className="footer-logo">
                <div className="footer-heart-wrapper">
                  <Heart className="footer-heart-icon" />
                  <div className="footer-heart-glow"></div>
                </div>
                <div>
                  <h3 className="footer-brand">
                    <span style={{color:'#FF6B35'}}>VINAGRE</span> FIT
                  </h3>
                  <p className="footer-slogan">Donde cada gota cuenta</p>
                </div>
              </div>
              <p className="footer-description">
                Tu cadena de gimnasios de confianza en Zaragoza. Transforma tu vida con nosotros.
              </p>
            </div>

            <div className="footer-links-section">
              <div className="footer-column">
                <h4 className="footer-column-title">Enlaces Rápidos</h4>
                <ul className="footer-links-list">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Inicio</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/gyms'); }}>Gimnasios</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/prices'); }}>Precios</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>Nosotros</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-column-title">Contacto</h4>
                <ul className="footer-contact-list">
                  <li>📧 info@vinagrefit.com</li>
                  <li>📞 976 123 456</li>
                  <li>📍 Zaragoza, España</li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-column-title">Horarios</h4>
                <ul className="footer-schedule-list">
                  <li>
                    <span className="schedule-days">Lunes - Viernes</span>
                    <span className="schedule-hours">6:00 - 23:00</span>
                  </li>
                  <li>
                    <span className="schedule-days">Sábado - Domingo</span>
                    <span className="schedule-hours">8:00 - 21:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Vinagre Fit. Todos los derechos reservados.
            </p>
            <p className="footer-founders">
              Fundado por <span className="founder-name">David Piazuelo</span> y <span className="founder-name">Mario Pellicer</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}