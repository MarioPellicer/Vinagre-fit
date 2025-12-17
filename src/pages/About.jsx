import React from 'react';

export default function About() {
  return (
    <div className="container mt-8">
      <h2 className="text-center mb-4 text-3xl font-black">Sobre Nosotros</h2>
      
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px' }}>
        <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '24px' }}>
          En Zaragoza, dos amigos con grandes sueños y recursos modestos decidieron cambiar la manera en que la gente vive el fitness. <strong style={{ color: 'var(--orange)' }}>David Piazuelo y Mario Pellicer</strong>, personas humildes pero llenas de pasión y determinación, tenían un objetivo claro: crear un gimnasio diferente, donde cada persona se sintiera bienvenida, motivada y parte de una verdadera comunidad.
        </p>

        <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '24px' }}>
          En 2015, con apenas unos ahorros y un montón de ideas, abrieron las puertas del primer <strong style={{ color: 'var(--orange)' }}>Vinagre Fit</strong>. El nombre, curioso y memorable, nació de una broma entre ellos: así como el vinagre es ácido pero saludable, ellos querían que su gimnasio representara esfuerzo, autenticidad y beneficios reales para todos.
        </p>

        <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '24px' }}>
          El primer local era pequeño, con lo esencial: algunas máquinas, pesas libres y mucho entusiasmo. Pero lo que realmente lo hacía especial no eran las instalaciones, sino la cercanía y dedicación de sus fundadores.
        </p>

        <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '24px' }}>
          Con el tiempo, Vinagre Fit se convirtió en un nombre reconocido en Zaragoza. Cada nuevo gimnasio mantenía la misma filosofía: espacios acogedores, entrenadores atentos, precios justos y un ambiente donde la diversión y el esfuerzo iban de la mano.
        </p>

        <p style={{ fontSize: '18px', lineHeight: 1.8 }}>
          Hoy, <strong style={{ color: 'var(--orange)' }}>Vinagre Fit</strong> sigue creciendo, pero su esencia permanece intacta. David y Mario continúan liderando con el mismo corazón, recordando que todo comenzó con una idea simple, un sueño compartido y la convicción de que, con esfuerzo y dedicación, se puede transformar la vida de quienes te rodean.
        </p>

        <div className="stats-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e5e7eb', textAlign: 'center' }}>
            <span className="stat-number" style={{ fontSize: '48px', fontWeight: 900, color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>2015</span>
            <span className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Año de fundación</span>
          </div>
          <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e5e7eb', textAlign: 'center' }}>
            <span className="stat-number" style={{ fontSize: '48px', fontWeight: 900, color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>2</span>
            <span className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Fundadores apasionados</span>
          </div>
          <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e5e7eb', textAlign: 'center' }}>
            <span className="stat-number" style={{ fontSize: '48px', fontWeight: 900, color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>∞</span>
            <span className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Pasión y dedicación</span>
          </div>
        </div>
      </div>

      <div className="card text-center mt-4" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #ff8c42 100%)', color: 'white', padding: '32px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '12px', color: 'white' }}>Nuestra Misión</h3>
        <p style={{ fontSize: '16px', maxWidth: '700px', margin: '0 auto', color: 'rgba(255,255,255,0.95)' }}>
          Transformar vidas a través del fitness, creando una comunidad donde cada persona, sin importar su nivel, se sienta apoyada, motivada y capaz de alcanzar sus metas. El esfuerzo pica, pero sienta de lujo.
        </p>
      </div>
    </div>
  );
}