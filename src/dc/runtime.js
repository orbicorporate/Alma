import React from 'react';

// Base das telas: um React.Component comum. As telas definem renderVals() e o render gerado usa os valores.
export class DCLogic extends React.Component {}

// Converte uma string de estilo inline ("a: b; c: d") em objeto de estilo do React, com cache.
const cache = new Map();
export function css(str) {
  if (!str) return undefined;
  const hit = cache.get(str);
  if (hit) return hit;
  const out = {};
  let depth = 0, start = 0;
  const decls = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) { decls.push(str.slice(start, i)); start = i + 1; }
  }
  decls.push(str.slice(start));
  for (const d of decls) {
    const k = d.indexOf(':');
    if (k < 0) continue;
    const prop = d.slice(0, k).trim();
    const val = d.slice(k + 1).trim();
    if (!prop || val === '') continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/^-(webkit|moz|ms)-/, (m, p) => p.charAt(0).toUpperCase() + p.slice(1) + '-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = val;
  }
  if (cache.size > 4000) cache.clear();
  cache.set(str, out);
  return out;
}
