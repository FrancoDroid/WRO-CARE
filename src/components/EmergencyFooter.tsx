import { TriangleAlert } from 'lucide-react';
import { playEmergencyAlarmSound } from '../utils/audio';

interface EmergencyFooterProps {
  onEmergencyStop: () => void;
  disabled?: boolean;
}

export function EmergencyFooter({ onEmergencyStop, disabled = false }: EmergencyFooterProps) {
  const handleClick = () => {
    playEmergencyAlarmSound();
    onEmergencyStop();
  };

  return (
    <footer
      id="emergency-footer"
      className="fixed bottom-0 left-0 w-full bg-[#ffdad6] border-t-2 border-dashed border-[#ba1a1a] z-30 py-3.5 px-4 flex justify-center items-center shadow-lg"
    >
      <button
        id="btn-emergency-stop"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className="bg-[#ba1a1a] hover:bg-[#a01515] text-white font-bold text-base md:text-lg rounded-xl px-8 md:px-12 py-3 md:py-3.5 transition-all active:scale-95 duration-75 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer select-none tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 fill-white text-[#ba1a1a]" strokeWidth={2.5} />
        <span>DESLIGAR TUDO</span>
      </button>
    </footer>
  );
}
