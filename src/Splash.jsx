import { useEffect, useState } from 'react';
import './css/Splash.css';

function Splash({ onStartFadeOut, onFinish }) {
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    const timerMostrar = setTimeout(() => {
      setExplode(true);
      onStartFadeOut();
    }, 3000);

    // Animação de explode dura 1.5s
    const timerSumir = setTimeout(() => {
      onFinish();
    }, 2000 + 1500);

    return () => {
      clearTimeout(timerMostrar);
      clearTimeout(timerSumir);
    };
  }, [onStartFadeOut, onFinish]);

  return (
    <div className={`splash-screen ${explode ? 'explode' : ''}`}>
      <h1 className="splash-title">Bem-vindo!

</h1>
      <p className="splash-subtitle">Crie uma linda enquete em minutos.</p>
    </div>
  );
}

export default Splash;
