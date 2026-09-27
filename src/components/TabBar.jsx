import React, { useEffect, useState } from 'react';
import './tabbar.css';

// Barra de navegação fixa, com nome em cada aba, e o tour da primeira vez.
const I = {
  inicio: <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />,
  diario: <><rect x="4" y="5" width="16" height="15.5" rx="3" /><path d="M4 10h16M8.5 3v4M15.5 3v4" /></>,
  ceu: <><path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z" /><path d="M17 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" /></>,
  minha: <><path d="M5.5 17.5 11 7l7.5 5" opacity=".6" /><circle cx="5.5" cy="17.5" r="1.9" /><circle cx="11" cy="7" r="1.9" /><circle cx="18.5" cy="12" r="1.9" /></>
};
export const TABS = [
  { k: 'inicio', label: 'Início' },
  { k: 'diario', label: 'Diário' },
  { k: 'perguntar', label: 'Perguntar' },
  { k: 'ceu', label: 'Céu' },
  { k: 'minha', label: 'Minha Alma' }
];
const TOUR = [
  { tab: null, title: 'Bem-vindo à Alma', text: 'Um lugar para pensar com calma, ouvir muitas sabedorias e transformar reflexão em ação. Veja em 4 passos como funciona.' },
  { tab: 'perguntar', title: '1 · Perguntar', text: 'Traga uma dúvida, um medo ou uma alegria. A Alma faz 3 perguntas rápidas e 14 sabedorias respondem com você. No fim, você cria um plano de ação.' },
  { tab: 'diario', title: '2 · Diário', text: 'Registre sonhos, gratidões, intenções e decisões. O calendário mostra a Lua e os dias bons para agir e decidir.' },
  { tab: 'ceu', title: '3 · Céu', text: 'Seu mapa natal, horóscopo, numerologia e tarô guiado, a partir dos seus dados de nascimento.' },
  { tab: 'minha', title: '4 · Minha Alma', text: 'Tudo o que você vive aqui vira uma estrela: perguntas, respostas favoritas, planos e registros. Entre com sua conta para guardar em qualquer aparelho.' }
];

export default function TabBar({ active, visible, onTab, route }) {
  const [tour, setTour] = useState(-1);
  useEffect(() => {
    const open = () => setTour(0);
    window.addEventListener('alma:tour', open);
    return () => window.removeEventListener('alma:tour', open);
  }, []);
  useEffect(() => {
    if (route !== 'inicio' || !visible) return;
    let seen = true;
    try { seen = localStorage.getItem('alma:tour') === '1'; } catch (e) { /* sem armazenamento */ }
    if (!seen) { const k = setTimeout(() => setTour(0), 900); return () => clearTimeout(k); }
  }, [route, visible]);
  const endTour = () => { setTour(-1); try { localStorage.setItem('alma:tour', '1'); } catch (e) { /* sem armazenamento */ } };
  const step = tour >= 0 ? TOUR[tour] : null;
  const tIdx = step && step.tab ? TABS.findIndex((t) => t.k === step.tab) : -1;

  return (
    <>
      <nav className={'tb' + (visible ? '' : ' tb-hidden')} aria-label="Navegação principal">
        <div className="tb-inner">
          {TABS.map((t, i) => {
            const on = active === t.k, lit = tIdx === i;
            if (t.k === 'perguntar') {
              return (
                <button key={t.k} className={'tb-ask' + (on ? ' tb-on' : '') + (lit ? ' tb-lit' : '')} onClick={() => onTab(t.k)} aria-current={on ? 'page' : undefined}>
                  <span className="tb-orb" />
                  <span className="tb-label">{t.label}</span>
                </button>
              );
            }
            return (
              <button key={t.k} className={'tb-item' + (on ? ' tb-on' : '') + (lit ? ' tb-lit' : '')} onClick={() => onTab(t.k)} aria-current={on ? 'page' : undefined}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[t.k]}</svg>
                <span className="tb-label">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      {step ? (
        <div className="tt" role="dialog" aria-modal="true" aria-label="Como a Alma funciona">
          <div className="tt-scrim" onClick={endTour} />
          <div className="tt-card" key={tour} style={tIdx >= 0 ? { bottom: 118 } : { top: '30%' }}>
            <div className="tt-dots">{TOUR.map((_, i) => <i key={i} className={i === tour ? 'on' : ''} />)}</div>
            <div className="tt-title">{step.title}</div>
            <p className="tt-text">{step.text}</p>
            <div className="tt-actions">
              <button className="tt-skip" onClick={endTour}>{tour === 0 ? 'Pular' : 'Fechar'}</button>
              <button className="tt-next" onClick={() => (tour < TOUR.length - 1 ? setTour(tour + 1) : endTour())}>{tour === 0 ? 'Mostrar' : tour < TOUR.length - 1 ? 'Próximo' : 'Começar'}</button>
            </div>
            {tIdx >= 0 ? <span className="tt-arrow" style={{ left: 8 + (tIdx + 0.5) * 74.8 - 16 - 9 }} /> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
