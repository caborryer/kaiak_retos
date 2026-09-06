import ComunidadBanner from '@/components/comunidad/ComunidadBanner';
import WhatsAppCTA from '@/components/comunidad/WhatsAppCTA';
import '@/styles/comunidad.css';

export default function ComunidadPage() {
  return (
    <div className="comunidad-page">
      <ComunidadBanner />
      <WhatsAppCTA />
    </div>
  );
}
