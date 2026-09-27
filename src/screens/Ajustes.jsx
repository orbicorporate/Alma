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
  const Row = ({ ic, t, sub, onClick, danger, right }) => (
    <button className={'aj-row' + (danger ? ' aj-danger' : '')} onClick={onClick}>
      <span className="aj-ic">{ic}</span>
      <span className="aj-txt"><span>{t}</span>{sub ? <small>{sub}</small> : null}</span>
      {right || <span className="aj-chev">›</span>}
    </button>
  );

  return (
    <div className="aj">
      <div className="aj-aurora" />
      <Starfield n={30} />
      <div className="aj-scroll">
        <header className="aj-head">
          <button className="aj-back" aria-label="Voltar" onClick={back}>‹</button>
          <span className="aj-title">Ajustes</span>
        </header>

        <section className="aj-sec">
          <span className="aj-k">Conta</span>
          {auth.loggedIn ? (
            <div className="aj-card">
              <div className="aj-acc">
                <span className="aj-avatar">{(auth.email || '?').charAt(0).toUpperCase()}</span>
                <span className="aj-txt"><span>{auth.email}</span><small>Sua alma está salva na nuvem e aparece em qualquer aparelho.</small></span>
              </div>
              {confirmOut ? (
                <div className="aj-confirm">
                  <span>Sair desta conta? Seus registros continuam guardados na nuvem e voltam quando você entrar de novo.</span>
                  <div className="aj-btns"><button className="aj-btn aj-btn-danger" onClick={doSignOut}>Sair</button><button className="aj-btn" onClick={() => setConfirmOut(false)}>Cancelar</button></div>
                </div>
              ) : <button className="aj-btn aj-btn-full" onClick={() => setConfirmOut(true)}>Sair da conta</button>}
            </div>
          ) : (
            <div className="aj-card">
              <span className="aj-p">Entre para guardar sua alma na nuvem e usar em qualquer aparelho. Hoje tudo fica só neste aparelho.</span>
              {auth.enabled ? (
                <>
                  <button className="aj-btn aj-btn-full aj-btn-light" onClick={async () => { const r = await signInWithGoogle(); if (r.error) setMsg(r.error); }}>Entrar com Google</button>
                  <div className="aj-inline">
                    <input className="aj-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" aria-label="E-mail" />
                    <button className="aj-btn" onClick={link}>Enviar link</button>
                  </div>
                  {msg ? <span className="aj-small">{msg}</span> : null}
                </>
              ) : <span className="aj-small">O login ainda não está disponível neste ambiente.</span>}
            </div>
          )}
        </section>

        <section className="aj-sec">
          <span className="aj-k">Você</span>
          <div className="aj-card aj-list">
            <Row ic="☉" t="Perfil de nascimento" sub={data.profile ? `${data.profile.name.split(' ')[0]} · ${data.profile.date} · ${data.profile.city}` : 'Crie para ver mapa, horóscopo e numerologia'} onClick={() => { window.dispatchEvent(new CustomEvent('sym:go', { detail: 'profile' })); window.location.hash = '#/simbolos'; }} />
            <Row ic="✧" t="Sua constelação" sub={`${counts.q} perguntas · ${counts.j} registros · ${counts.p} post-its · ${counts.t} tiragens`} onClick={() => { window.location.hash = '#/constelacao'; }} />
          </div>
        </section>

        <section className="aj-sec">
          <span className="aj-k">Preferências</span>
          <div className="aj-card aj-list">
            <Row ic="≈" t="Animações mais calmas" sub="Menos movimento nas estrelas, esferas e bordas" onClick={() => { const v = !calm; setCalm(v); setPref('calm', v); applyPrefs(); }} right={<span className={'aj-toggle' + (calm ? ' on' : '')}><i /></span>} />
            <Row ic="?" t="Como a Alma funciona" sub="Rever o tour de apresentação" onClick={() => { window.location.hash = '#/inicio'; setTimeout(() => window.dispatchEvent(new Event('alma:tour')), 300); }} />
            <Row ic="❝" t="Frase de abertura" sub="Ver de novo a tela de abertura com uma citação nova" onClick={() => { window.location.hash = '#/'; window.dispatchEvent(new CustomEvent('alma:go', { detail: { screen: 'intro' } })); }} />
          </div>
        </section>

        <section className="aj-sec">
          <span className="aj-k">Seus dados</span>
          <div className="aj-card aj-list">
            <Row ic="⇩" t="Baixar meus dados" sub="Um arquivo com tudo o que você registrou" onClick={exportData} />
            <Row ic="✕" t="Apagar meus registros" sub="Perguntas, diário, post-its e tiragens" danger onClick={() => setConfirmDel(1)} />
          </div>
          {confirmDel ? (
            <div className="aj-card aj-confirm">
              <span>{confirmDel === 1 ? 'Apagar todas as perguntas, planos, registros do diário, post-its e tiragens? O perfil de nascimento fica.' : 'Tem certeza? Isso não pode ser desfeito.'}</span>
              <div className="aj-btns">
                <button className="aj-btn aj-btn-danger" onClick={() => (confirmDel === 1 ? setConfirmDel(2) : wipe())}>{confirmDel === 1 ? 'Apagar' : 'Sim, apagar tudo'}</button>
                <button className="aj-btn" onClick={() => setConfirmDel(0)}>Cancelar</button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="aj-sec">
          <span className="aj-k">Sobre</span>
          <div className="aj-card">
            <span className="aj-p">A Alma reúne religiões, filosofias e tradições simbólicas para aconselhar, não para dividir. As leituras são convites à reflexão e não substituem ajuda profissional.</span>
            <span className="aj-p">Se o peso estiver grande demais, você não precisa carregar sozinho: CVV, ligue 188, 24 horas, gratuito.</span>
            <span className="aj-small">Alma · versão 1.0</span>
          </div>
        </section>
      </div>
      {toast ? <div className="aj-toast">{toast}</div> : null}
    </div>
  );
}
