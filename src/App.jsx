import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Alma from './screens/Alma.jsx';
import Simbolos from './screens/Simbolos.jsx';

const routeOf = () => (window.location.hash.startsWith('#/simbolos') ? 'simbolos' : 'alma');

export default function App() {
  const [route, setRoute] = useState(routeOf());
  const [scale, setScale] = useState(1);
  const frame = useRef(null);

  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 390, window.innerHeight / 844, 1.25));
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
      <div ref={frame} className="app-frame" style={{ transform: `scale(${scale})` }}>
        <div style={{ display: route === 'alma' ? 'block' : 'none' }}><Alma /></div>
        <div style={{ display: route === 'simbolos' ? 'block' : 'none' }}><Simbolos /></div>
      </div>
    </div>
  );
}
