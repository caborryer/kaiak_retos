import { Users, ArrowRight } from 'lucide-react';
import '@/styles/comunidad.css';

export default function WhatsAppCTA() {
  const whatsappUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/grouplink';

  return (
    <div className="whatsapp-cta">
      <div className="whatsapp-cta-inner">
        <div className="whatsapp-cta-left">
          <div className="whatsapp-cta-icon">
            <Users size={24} color="#4FCBFE" />
          </div>
          <div>
            <div className="whatsapp-cta-title">SOMOS COMUNIDAD 21K</div>
            <div className="whatsapp-cta-subtitle">
              Compartí tus logros y conectá con otros runners
            </div>
          </div>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary whatsapp-cta-btn"
        >
          IR A LA COMUNIDAD <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
