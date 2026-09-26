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
  const frame = useRef(null);

  useLayoutEffect(() => {
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const sw = w / 390, fh = h / sw;
      // No celular, preenche a largura inteira e ajusta a altura da tela ao aparelho.
      if (w < 700 && fh >= 760) { setScale(sw); setFh(fh); }
      else { setScale(Math.min(w / 390, h / 844, 1.25)); setFh(844); }
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
      <div ref={frame} className="app-frame" style={{ transform: `scale(${scale})`, height: fh, '--fh': fh + 'px' }}>
        <div style={{ display: route === 'alma' ? 'block' : 'none' }}><Alma /></div>
        <div style={{ display: route === 'simbolos' ? 'block' : 'none' }}><Simbolos /></div>
        {route === 'diario' ? <div><Diario /></div> : null}
        {route === 'constelacao' ? <div><Constelacao /></div> : null}
      </div>
    </div>
  );
}
