import React, { useMemo, useState } from 'react';
import { rankMovies, coverColors } from '../movies.js';
import { contextOf } from '../questions.js';
import './movietip.css';

// Dica de filme no fim das respostas: combina com o sentimento e o assunto; "Outra dica" percorre a lista.
export default function MovieTip({ text, kind }) {
  const list = useMemo(() => {
    const cx = contextOf(text); let h = 0; for (const c of text || '') h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return rankMovies(kind, cx ? cx.topic.k : null, h % 11);
  }, [text, kind]);
  const [i, setI] = useState(0);
  const m = list[i % list.length];
  const [c1, c2, c3] = coverColors(m.title);
  return (
    <div className="glass cardin mv">
      <span className="mv-k">Uma dica de filme</span>
      <div className="mv-row" key={m.title} aria-live="polite">
        <div className="mv-cover" style={{ background: `radial-gradient(circle at 70% 25%, ${c3}, transparent 50%), linear-gradient(160deg, ${c1}, ${c2})` }} aria-hidden="true">
          <span className="mv-cover-y">{m.year}</span>
          <span className="mv-cover-t">{m.title}</span>
        </div>
        <div className="mv-txt">
          <span className="mv-t">{m.title}</span>
          <span className="mv-by">{m.year}, {m.by}</span>
          <p className="mv-why">{m.why}</p>
        </div>
      </div>
      <div className="mv-actions">
        <button className="mv-btn" onClick={() => setI(i + 1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v5h-5" /></svg>Outra dica</button>
        <a className="mv-btn mv-btn-main" href={`https://www.justwatch.com/br/busca?q=${encodeURIComponent(m.title)}`} target="_blank" rel="noreferrer">Onde assistir<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg></a>
      </div>
    </div>
  );
}
