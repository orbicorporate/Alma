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
      <div className="mv-row" key={m.title}>
        <div className="mv-cover" style={{ background: `radial-gradient(circle at 70% 25%, ${c3}, transparent 50%), linear-gradient(160deg, ${c1}, ${c2})` }} aria-hidden="true">
          <span className="mv-cover-y">{m.year}</span>
          <span className="mv-cover-t">{m.title}</span>
        </div>
        <div className="mv-txt">
          <span className="mv-t">{m.title}</span>
          <span className="mv-by">{m.year} · {m.by}</span>
          <p className="mv-why">{m.why}</p>
        </div>
      </div>
      <div className="mv-actions">
        <button className="mv-btn" onClick={() => setI(i + 1)}>↻ Outra dica</button>
        <a className="mv-btn mv-btn-main" href={`https://www.justwatch.com/br/busca?q=${encodeURIComponent(m.title)}`} target="_blank" rel="noreferrer">Onde assistir</a>
      </div>
    </div>
  );
}
