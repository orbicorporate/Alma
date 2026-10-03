import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Alma from './screens/Alma.jsx';
import Simbolos from './screens/Simbolos.jsx';
import Diario from './screens/Diario.jsx';
import Constelacao from './screens/Constelacao.jsx';
import Home from './screens/Home.jsx';
import Banhos from './screens/Banhos.jsx';
import Ajustes, { applyPrefs } from './screens/Ajustes.jsx';
import Estilo from './screens/Estilo.jsx';
import { applyTheme } from './theme.js';
import TabBar from './components/TabBar.jsx';
import { daypart } from './insight.js';

const routeOf = () => { const h = window.location.hash; return h.startsWith('#/simbolos') ? 'simbolos' : h.startsWith('#/diario') ? 'diario' : h.startsWith('#/constelacao') ? 'constelacao' : h.startsWith('#/inicio') ? 'inicio' : h.startsWith('#/banhos') ? 'banhos' : h.startsWith('#/ajustes') ? 'ajustes' : h.startsWith('#/estilo') ? 'estilo' : 'alma'; };

export default function App() {
  const [route, setRoute] = useState(routeOf());
  const [scale, setScale] = useState(1);
  const [fh, setFh] = useState(844);
  const [fw, setFw] = useState(390);
  const [fill, setFill] = useState(false);
  const [sat, setSat] = useState(0);
  const [sab, setSab] = useState(0);
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
  const active = route === 'inicio' ? 'inicio' : route === 'diario' ? 'diario' : route === 'simbolos' || route === 'banhos' ? 'ceu' : route === 'constelacao' || route === 'ajustes' || route === 'estilo' ? 'minha'
    : (['journal', 'plan'].includes(almaScreen) ? 'minha' : 'perguntar');
  const onTab = (k) => {
    const go = (d) => window.dispatchEvent(new CustomEvent('alma:go', { detail: d }));
    if (k === 'inicio') window.location.hash = '#/inicio';
    else if (k === 'diario') window.location.hash = '#/diario';
    else if (k === 'ceu') { if (route === 'simbolos') window.dispatchEvent(new CustomEvent('sym:go', { detail: 'hub' })); window.location.hash = '#/simbolos'; }
    else if (k === 'minha') { go({ screen: 'journal', prev: 'ask' }); window.location.hash = '#/'; }
    else if (k === 'perguntar') {
      const inFlow = ['answers', 'deepen', 'council', 'releasing', 'breath'].includes(almaScreen);
      if (route === 'alma' || !inFlow) go({ screen: 'ask', open: -1, lit: 0, stars: [], filter: 'all', savedNow: false, ans: [null, null, null], step: 0, text: '', fromWhere: '', voicesOpen: false, kindPicked: false, kind: 'Dúvida' });
      window.location.hash = '#/';
    }
  };

  useEffect(() => { applyPrefs(); applyTheme(); }, []);
  // Ritmo do dia: manhã, tarde ou noite mudam o tom do céu e o que a Alma sugere.
  useEffect(() => {
    const set = () => { document.documentElement.dataset.daypart = daypart(); };
    set();
    const k = setInterval(set, 10 * 60 * 1000);
    return () => clearInterval(k);
  }, []);
  useLayoutEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      // No app instalado no iPhone, innerHeight às vezes vem menor que a tela real e sobra uma faixa vazia embaixo.
      const standalone = window.navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
      const bgH = document.querySelector('.app-bg') ? document.querySelector('.app-bg').getBoundingClientRect().height : 0;
      const h = Math.max(window.innerHeight, bgH, standalone && w < 700 ? (window.screen.height > window.screen.width ? window.screen.height : window.screen.width) : 0);
      // Em qualquer tela (celular ou navegador), a coluna do app fica no centro
      // e os fundos, auroras e estrelas preenchem as laterais.
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;top:0;left:0;height:0;padding-top:env(safe-area-inset-top);visibility:hidden';
      document.body.appendChild(probe);
      const top = probe.offsetHeight;
      probe.style.paddingTop = 'env(safe-area-inset-bottom)';
      const bottom = probe.offsetHeight; probe.remove();
      const sc = w < 700 ? Math.min(w / 390, (h - top) / 844) : Math.min((h - top) / 844, 1.15);
      setSat(Math.ceil(top / sc)); setSab(Math.ceil(bottom / sc));
      setScale(sc); setFw(w / sc); setFh(h / sc); setFill(true);
    };
    fit();
    const t1 = setTimeout(fit, 300), t2 = setTimeout(fit, 1200);
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', fit); window.removeEventListener('orientationchange', fit); };
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
      <div ref={frame} className={'app-frame' + (fill ? ' app-fill' : '') + (visible ? ' tabs-on' : '')} style={{ transform: `scale(${scale})`, width: fw, height: fh, '--fh': (fh - sat) + 'px', '--sat': sat + 'px', '--sab': sab + 'px' }}>
        <div className="route" style={{ display: route === 'alma' ? 'block' : 'none', background: '#0b0a16' }}><Alma /></div>
        <div className="route" style={{ display: route === 'simbolos' ? 'block' : 'none', background: '#0a0918' }}><Simbolos /></div>
        {route === 'diario' ? <div className="route" style={{ background: '#0b0a16' }}><Diario /></div> : null}
        {route === 'constelacao' ? <div className="route" style={{ background: '#05040c' }}><Constelacao /></div> : null}
        {route === 'ajustes' ? <div className="route" style={{ background: '#1b1542' }}><Ajustes /></div> : null}
        {route === 'estilo' ? <div className="route" style={{ background: '#1b1542' }}><Estilo /></div> : null}
        {route === 'banhos' ? <div className="route" style={{ background: '#120e2e' }}><Banhos /></div> : null}
        {route === 'inicio' ? <div className="route" style={{ background: '#120e2e' }}><Home /></div> : null}
        <TabBar active={active} visible={visible} onTab={onTab} route={route} />
      </div>
    </div>
  );
}
