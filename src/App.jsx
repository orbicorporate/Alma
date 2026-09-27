import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Alma from './screens/Alma.jsx';
import Simbolos from './screens/Simbolos.jsx';
import Diario from './screens/Diario.jsx';
import Constelacao from './screens/Constelacao.jsx';
import Home from './screens/Home.jsx';
import Banhos from './screens/Banhos.jsx';
import TabBar from './components/TabBar.jsx';

const routeOf = () => { const h = window.location.hash; return h.startsWith('#/simbolos') ? 'simbolos' : h.startsWith('#/diario') ? 'diario' : h.startsWith('#/constelacao') ? 'constelacao' : h.startsWith('#/inicio') ? 'inicio' : h.startsWith('#/banhos') ? 'banhos' : 'alma'; };

export default function App() {
  const [route, setRoute] = useState(routeOf());
  const [scale, setScale] = useState(1);
  const [fh, setFh] = useState(844);
  const [fw, setFw] = useState(390);
  const [fill, setFill] = useState(false);
  const frame = useRef(null);
  // Cada área avisa se a barra deve sumir (rituais, painéis abertos) e em que tela está.
  const [chrome, setChrome] = useState({});
  useEffect(() => {
    const on = (e) => setChrome((c) => Object.assign({}, c, { [e.detail.src]: e.detail }));
    window.addEventListener('alma:chrome', on);
    return () => window.removeEventListener('alma:chrome', on);
  }, []);
  const src = route === 'simbolos' ? 'sym' : route;
  const almaScreen = (chrome.alma || {}).screen || 'intro';
  const visible = !((chrome[src] || {}).hide) && !(route === 'alma' && (chrome.alma || {}).hide === undefined);
  const active = route === 'inicio' ? 'inicio' : route === 'diario' ? 'diario' : route === 'simbolos' || route === 'banhos' ? 'ceu' : route === 'constelacao' ? 'minha'
    : (['journal', 'plan'].includes(almaScreen) ? 'minha' : 'perguntar');
  const onTab = (k) => {
    const go = (d) => window.dispatchEvent(new CustomEvent('alma:go', { detail: d }));
    if (k === 'inicio') window.location.hash = '#/inicio';
    else if (k === 'diario') window.location.hash = '#/diario';
    else if (k === 'ceu') { if (route === 'simbolos') window.dispatchEvent(new CustomEvent('sym:go', { detail: 'hub' })); window.location.hash = '#/simbolos'; }
    else if (k === 'minha') { go({ screen: 'journal', prev: 'ask' }); window.location.hash = '#/'; }
    else if (k === 'perguntar') {
      const inFlow = ['answers', 'deepen', 'council', 'releasing', 'breath'].includes(almaScreen);
      if (route === 'alma' || !inFlow) go({ screen: 'ask', open: -1, lit: 0, stars: [], filter: 'all', savedNow: false, ans: [null, null, null], step: 0, text: '', fromWhere: '', voicesOpen: false });
      window.location.hash = '#/';
    }
  };

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
      <div ref={frame} className={'app-frame' + (fill ? ' app-fill' : '') + (visible ? ' tabs-on' : '')} style={{ transform: `scale(${scale})`, width: fw, height: fh, '--fh': fh + 'px' }}>
        <div className="route" style={{ display: route === 'alma' ? 'block' : 'none', background: '#0b0a16' }}><Alma /></div>
        <div className="route" style={{ display: route === 'simbolos' ? 'block' : 'none', background: '#0a0918' }}><Simbolos /></div>
        {route === 'diario' ? <div className="route" style={{ background: '#0b0a16' }}><Diario /></div> : null}
        {route === 'constelacao' ? <div className="route" style={{ background: '#05040c' }}><Constelacao /></div> : null}
        {route === 'banhos' ? <div className="route" style={{ background: '#120e2e' }}><Banhos /></div> : null}
        {route === 'inicio' ? <div className="route" style={{ background: '#120e2e' }}><Home /></div> : null}
        <TabBar active={active} visible={visible} onTab={onTab} route={route} />
      </div>
    </div>
  );
}
