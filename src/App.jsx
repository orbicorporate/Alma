import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Alma from './screens/Alma.jsx';
import Simbolos from './screens/Simbolos.jsx';
import Diario from './screens/Diario.jsx';
import Constelacao from './screens/Constelacao.jsx';

const routeOf = () => { const h = window.location.hash; return h.startsWith('#/simbolos') ? 'simbolos' : h.startsWith('#/diario') ? 'diario' : h.startsWith('#/constelacao') ? 'constelacao' : 'alma'; };

export default function App() {
  const [route, setRoute] = useState(routeOf());
  const [scale, setScale] = useState(1);
  const [fh, setFh] = useState(844);
  const [fw, setFw] = useState(390);
  const [fill, setFill] = useState(false);
  const frame = useRef(null);

  useLayoutEffect(() => {
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight;
      if (w < 700) {
        // No celular: o conteúdo cabe inteiro e o fundo do app preenche a tela toda, em qualquer proporção.
        const sc = Math.min(w / 390, h / 844);
        setScale(sc); setFw(w / sc); setFh(h / sc); setFill(true);
      } else {
        setScale(Math.min(w / 390, h / 844, 1.25)); setFw(390); setFh(844); setFill(false);
      }
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const on = () => {
      const r = routeOf();
      setRoute(r);
      if (r === 'alma') setTimeout(() => window.dispatchEvent(new Event('alma:show')), 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  // Garante que nenhum container role na horizontal (foco em campos pode empurrar a tela).
  useEffect(() => {
    const fix = (e) => { const t = e.target; if (t && t.scrollLeft) t.scrollLeft = 0; };
    document.addEventListener('scroll', fix, true);
    return () => document.removeEventListener('scroll', fix, true);
  }, []);

  // Links entre as duas áreas (herdados do protótipo) viram navegação interna.
  const onClickCapture = (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === 'Simbolos.dc.html') { e.preventDefault(); window.location.hash = '#/simbolos'; }
    else if (href === 'Main.dc.html') { e.preventDefault(); window.location.hash = '#/'; }
  };

  return (
    <div className="app-bg" onClickCapture={onClickCapture}>
      <div ref={frame} className={'app-frame' + (fill ? ' app-fill' : '')} style={{ transform: `scale(${scale})`, width: fw, height: fh, '--fh': fh + 'px' }}>
        <div className="route" style={{ display: route === 'alma' ? 'block' : 'none', background: '#0b0a16' }}><Alma /></div>
        <div className="route" style={{ display: route === 'simbolos' ? 'block' : 'none', background: '#0a0918' }}><Simbolos /></div>
        {route === 'diario' ? <div className="route" style={{ background: '#0b0a16' }}><Diario /></div> : null}
        {route === 'constelacao' ? <div className="route" style={{ background: '#05040c' }}><Constelacao /></div> : null}
      </div>
    </div>
  );
}
