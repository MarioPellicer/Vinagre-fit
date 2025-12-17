import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Elementos decorativos */}
        <div className="hero-decorations">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
        </div>

        <div className="hero-content">
          <div className="hero-inner">
            {/* Badge */}
            <div className="hero-badge">
              <span className="hero-badge-text">Transformando vidas desde 2015</span>
            </div>

            {/* Main Heading */}
            <div className="hero-text">
              <h1 className="hero-title">
                TRANSFORMA
                <span className="hero-title-accent">TU VIDA</span>
              </h1>
              <p className="hero-subtitle">
                Donde cada gota de esfuerzo cuenta. Únete a la familia Vinagre Fit y descubre tu mejor versión.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero-ctas">
              <button
                onClick={() => navigate('/register')}
                className="hero-cta-primary"
              >
                <span>APÚNTATE AHORA</span>
                <span className="hero-cta-arrow">→</span>
              </button>
              <button
                onClick={() => navigate('/prices')}
                className="hero-cta-secondary"
              >
                VER PLANES
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <p className="hero-stat-number">2+</p>
                <p className="hero-stat-label">Gimnasios</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-number">500+</p>
                <p className="hero-stat-label">Miembros</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-number">9</p>
                <p className="hero-stat-label">Años</p>
              </div>
            </div>
          </div>
        </div>

      
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              ¿Por qué <span className="text-orange">Vinagre Fit?</span>
            </h2>
            <p className="features-subtitle">El esfuerzo pica, pero sienta de lujo</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span className="feature-emoji">🏋️</span>
              </div>
              <h3 className="feature-title">Equipamiento Premium</h3>
              <p className="feature-description">Las mejores máquinas y equipos del mercado para tu entrenamiento óptimo</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span className="feature-emoji">👥</span>
              </div>
              <h3 className="feature-title">Comunidad Motivadora</h3>
              <p className="feature-description">Únete a una familia que te apoya en cada paso de tu transformación</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span className="feature-emoji">📅</span>
              </div>
              <h3 className="feature-title">Horario Flexible</h3>
              <p className="feature-description">Abiertos cuando tú lo necesites, entrena a tu ritmo sin compromisos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-header">
            <h2 className="gallery-title">
              Nuestras <span className="text-orange">Instalaciones</span>
            </h2>
            <p className="gallery-subtitle">Espacios diseñados para tu máximo rendimiento</p>
          </div>

          <div className="gallery-grid">
            <div className="gallery-item" style={{backgroundImage: 'linear-gradient(to top, rgba(17, 24, 39, 0.7), transparent), url(/img/img1.jpg)'}}>
              <div className="gallery-content">
                <p className="gallery-item-title">Zona de Musculación</p>
                <p className="gallery-item-desc">Equipamiento de última generación</p>
              </div>
            </div>

            <div className="gallery-item" style={{backgroundImage: 'linear-gradient(to top, rgba(17, 24, 39, 0.7), transparent), url(img/img2.jpg)'}}>
              <div className="gallery-content">
                <p className="gallery-item-title">Área Cardio</p>
                <p className="gallery-item-desc">Máquinas cardiovasculares premium</p>
              </div>
            </div>

            <div className="gallery-item" style={{backgroundImage: 'linear-gradient(to top, rgba(17, 24, 39, 0.7), transparent), url(/img/img3.jpg)'}}>
              <div className="gallery-content">
                <p className="gallery-item-title">Clases Grupales</p>
                <p className="gallery-item-desc">Ambiente motivador y energético</p>
              </div>
            </div>
          </div>

          <div className="gallery-cta">
            <button
              onClick={() => navigate('/gyms')}
              className="gallery-button"
            >
              <span>VER TODOS LOS GIMNASIOS</span>
              <span className="gallery-button-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">
              Lo que dicen <span className="text-orange">nuestros miembros</span>
            </h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className="testimonial-text">"Vinagre Fit cambió mi vida. El ambiente es increíble y los entrenadores son muy profesionales."</p>
              <p className="testimonial-author">María García</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className="testimonial-text">"Llevo 2 años entrenando aquí y es lo mejor que he hecho. ¡Totalmente recomendado!"</p>
              <p className="testimonial-author">Carlos Ruiz</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <p className="testimonial-text">"La comunidad es fantástica. Cada día es una motivación ir a entrenar."</p>
              <p className="testimonial-author">Laura Pérez</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-final-section">
        <div className="cta-final-container">
          <div className="cta-final-icon">⚡</div>
          <h2 className="cta-final-title">
            ¿Listo para comenzar tu transformación?
          </h2>
          <p className="cta-final-text">
            Únete hoy y obtén tu primera semana completamente gratis
          </p>
          <button
            onClick={() => navigate('/register')}
            className="cta-final-button"
          >
            <span>INSCRÍBETE AHORA</span>
            <span className="cta-final-badge">🏆</span>
          </button>
        </div>
      </section>
    </div>
  );
}