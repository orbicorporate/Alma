import React, { useEffect, useState } from 'react';
import { load, save, getAuth, onAuth, sendMagicLink, signInWithGoogle, signOut } from '../store.js';
import Starfield from '../components/Starfield.jsx';
import './ajustes.css';

// Ajustes: conta, perfil de nascimento, preferências, dados e sobre.
const pref = (k, d) => { try { const v = localStorage.getItem('alma:pref:' + k); return v == null ? d : v === '1'; } catch (e) { return d; } };
const setPref = (k, v) => { try { localStorage.setItem('alma:pref:' + k, v ? '1' : '0'); } catch (e) { /* sem armazenamento */ } };
export function applyPrefs() { document.documentElement.classList.toggle('calm-motion', pref('calm', false)); }

export default function Ajustes() {
  const [auth, setAuth] = useState(getAuth());
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [calm, setCalm] = useState(pref('calm', false));
  const [confirmOut, setConfirmOut] = useState(false);
  const [confirmDel, setConfirmDel] = useState(0);
  const [toast, setToast] = useState('');
  const data = load();
  useEffect(() => onAuth(setAuth), []);
  const flash = (t) => { setToast(t); setTimeout(() => setToast(''), 2400); };
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.hash = '#/inicio'; };
  const counts = { q: (data.entries || []).length, j: (data.journal || []).filter((x) => !x.linkOf).length, p: (data.postits || []).length, t: (data.readings || []).length };

  const doSignOut = async () => {
    await signOut();
    try { localStorage.removeItem('alma:data'); localStorage.removeItem('alma:skipLogin'); } catch (e) { /* sem armazenamento */ }
    window.location.hash = '#/'; window.location.reload();
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'minha-alma.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const wipe = () => { save({ entries: [], journal: [], postits: [], readings: [] }); setConfirmDel(0); flash('Registros apagados'); };
  const link = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setMsg('Digite um e-mail válido.'); return; }
    setMsg('Enviando...'); const r = await sendMagicLink(email.trim());
    setMsg(r.error ? r.error : `Pronto. Abra o link que enviamos para ${email.trim()} neste aparelho.`);
  };
  const pl = (n, a, b) => `${n} ${n === 1 ? a : b}`;
  const Row = ({ ic, c, t, sub, onClick, danger, right, sw, on }) => (
    <button className={'aj-row' + (danger ? ' aj-danger' : '')} onClick={onClick} style={c ? { '--c': c } : undefined} role={sw ? 'switch' : undefined} aria-checked={sw ? (on ? 'true' : 'false') : undefined}>
      <span className="aj-ic" aria-hidden="true">{ic}</span>
      <span className="aj-txt"><span>{t}</span>{sub ? <small>{sub}</small> : null}</span>
      {right || <Chev />}
    </button>
  );

  return (
    <div className="aj">
      <div className="aj-aurora" />
      <Starfield n={30} />
      <div className="aj-scroll">
        <header className="aj-head">
          <button className="aj-back" aria-label="Voltar" onClick={back}><BackIc /></button>
          <h1 className="aj-title">Ajustes</h1>
        </header>

        <section className="aj-sec">
          <h2 className="aj-k">Conta</h2>
          {auth.loggedIn ? (
            <div className="aj-group">
              <div className="aj-acc">
                <span className="aj-avatar" aria-hidden="true">{(auth.email || '?').charAt(0).toUpperCase()}</span>
                <span className="aj-txt"><span className="aj-email">{auth.email}</span><small>Sua alma está salva na nuvem e aparece em qualquer aparelho.</small></span>
              </div>
              {confirmOut ? (
                <div className="aj-confirm aj-in">
                  <span>Sair desta conta? Seus registros continuam guardados na nuvem e voltam quando você entrar de novo.</span>
                  <div className="aj-btns"><button className="aj-btn aj-btn-danger" onClick={doSignOut}>Sair</button><button className="aj-btn" onClick={() => setConfirmOut(false)}>Cancelar</button></div>
                </div>
              ) : <Row ic={I.out} c="var(--ink-3)" t="Sair da conta" onClick={() => setConfirmOut(true)} right={<span />} />}
            </div>
          ) : (
            <div className="aj-card aj-login">
              <div className="aj-login-top">
                <span className="aj-ic" style={{ '--c': 'var(--lilac)' }} aria-hidden="true">{I.cloud}</span>
                <span className="aj-p">Entre para guardar sua alma na nuvem e usar em qualquer aparelho. Hoje tudo fica só neste aparelho.</span>
              </div>
              {auth.enabled ? (
                <>
                  <button className="aj-btn aj-btn-full aj-btn-light" onClick={async () => { const r = await signInWithGoogle(); if (r.error) setMsg(r.error); }}>Entrar com Google</button>
                  <div className="aj-inline">
                    <input className="aj-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" aria-label="E-mail" />
                    <button className="aj-btn" onClick={link}>Enviar link</button>
                  </div>
                  {msg ? <span className="aj-small" role="status">{msg}</span> : null}
                </>
              ) : <span className="aj-small">O login ainda não está disponível neste ambiente.</span>}
            </div>
          )}
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Você</h2>
          <div className="aj-group">
            <Row ic={I.sun} c="var(--gold)" t="Perfil de nascimento" sub={data.profile ? `${data.profile.name.split(' ')[0]}, ${data.profile.date}, ${data.profile.city}` : 'Crie para ver mapa, horóscopo e numerologia'} onClick={() => { window.dispatchEvent(new CustomEvent('sym:go', { detail: 'profile' })); window.location.hash = '#/simbolos'; }} />
            <Row ic={I.stars} c="var(--lilac)" t="Sua constelação" sub={`${pl(counts.q, 'pergunta', 'perguntas')}, ${pl(counts.j, 'registro', 'registros')}, ${pl(counts.p, 'post-it', 'post-its')} e ${pl(counts.t, 'tiragem', 'tiragens')}`} onClick={() => { window.location.hash = '#/constelacao'; }} />
          </div>
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Preferências</h2>
          <div className="aj-group">
            <Row ic={I.brush} c="var(--rose)" t="Personalizar minha Alma" sub="Cores da esfera, fundo, brilho e ritmo" onClick={() => { window.location.hash = '#/estilo'; }} />
            <Row ic={I.wave} c="var(--mint)" t="Animações mais calmas" sub="Menos movimento nas estrelas, esferas e bordas" sw on={calm} onClick={() => { const v = !calm; setCalm(v); setPref('calm', v); applyPrefs(); }} right={<span className={'aj-toggle' + (calm ? ' on' : '')} aria-hidden="true"><i /></span>} />
            <Row ic={I.help} c="var(--sky)" t="Como a Alma funciona" sub="Rever o tour de apresentação" onClick={() => { window.location.hash = '#/inicio'; setTimeout(() => window.dispatchEvent(new Event('alma:tour')), 300); }} />
            <Row ic={I.quote} c="var(--peach)" t="Frase de abertura" sub="Ver de novo a abertura com uma citação nova" onClick={() => { window.location.hash = '#/'; window.dispatchEvent(new CustomEvent('alma:go', { detail: { screen: 'intro' } })); }} />
          </div>
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Seus dados</h2>
          <div className="aj-group">
            <Row ic={I.down} c="var(--sky)" t="Baixar meus dados" sub="Um arquivo com tudo o que você registrou" onClick={exportData} />
            <Row ic={I.trash} t="Apagar meus registros" sub="Perguntas, diário, post-its e tiragens" danger onClick={() => setConfirmDel(1)} />
          </div>
          {confirmDel ? (
            <div className="aj-card aj-confirm aj-in" key={confirmDel} role="alertdialog" aria-label="Confirmar exclusão">
              <span>{confirmDel === 1 ? 'Apagar todas as perguntas, planos, registros do diário, post-its e tiragens? O perfil de nascimento fica.' : 'Tem certeza? Isso não pode ser desfeito.'}</span>
              <div className="aj-btns">
                <button className="aj-btn aj-btn-danger" onClick={() => (confirmDel === 1 ? setConfirmDel(2) : wipe())}>{confirmDel === 1 ? 'Apagar' : 'Sim, apagar tudo'}</button>
                <button className="aj-btn" onClick={() => setConfirmDel(0)}>Cancelar</button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Sobre</h2>
          <p className="aj-p aj-about">A Alma reúne religiões, filosofias e tradições simbólicas para aconselhar, não para dividir. As leituras são convites à reflexão e não substituem ajuda profissional.</p>
          <a className="aj-card aj-help" href="tel:188">
            <span className="aj-ic" style={{ '--c': 'var(--rose)' }} aria-hidden="true">{I.phone}</span>
            <span className="aj-txt"><span>Se o peso estiver grande demais</span><small>Você não precisa carregar sozinho. CVV, ligue 188, 24 horas, gratuito.</small></span>
          </a>
          <span className="aj-small aj-ver">Alma, versão 1.0</span>
        </section>
      </div>
      {toast ? <div className="aj-toast" role="status">{toast}</div> : null}
    </div>
  );
}

const svg = (d) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const I = {
  sun: svg(<><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>),
  stars: svg(<><path d="M5.5 17.5 11 7l7.5 5" opacity=".6" /><circle cx="5.5" cy="17.5" r="1.9" /><circle cx="11" cy="7" r="1.9" /><circle cx="18.5" cy="12" r="1.9" /></>),
  brush: svg(<><circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10" r="1.2" /><circle cx="12" cy="7.5" r="1.2" /><circle cx="15.5" cy="10" r="1.2" /><path d="M12 20.5c-1.5 0-2-1-2-2s1-1.8 2.2-1.8h1.6a3.2 3.2 0 0 0 3.2-3.2" /></>),
  wave: svg(<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />),
  help: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></>),
  quote: svg(<path d="M10 7c-3 1-4.5 3.2-4.5 6.5V17H10v-4.5H7.6M18.5 7c-3 1-4.5 3.2-4.5 6.5V17h4.5v-4.5h-2.4" />),
  down: svg(<><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M5 19.5h14" /></>),
  trash: svg(<><path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9l1-12.5" /><path d="M10.5 11v5M13.5 11v5" /></>),
  cloud: svg(<path d="M7 18.5a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17 18.5z" />),
  out: svg(<><path d="M14 4.5H6.5v15H14" /><path d="M10.5 12H20M16.5 8.5 20 12l-3.5 3.5" /></>),
  phone: svg(<path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />)
};
function Chev() { return <svg className="aj-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" /></svg>; }
export function BackIc() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" /></svg>; }
