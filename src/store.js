import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key) : null;

const LOCAL = 'alma:data';
const readLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL) || '{}'); } catch (e) { return {}; } };
const writeLocal = (d) => { try { localStorage.setItem(LOCAL, JSON.stringify(d)); } catch (e) { /* armazenamento indisponível */ } };

let session = null;
const listeners = new Set();
const dataListeners = new Set();
const emit = () => listeners.forEach((f) => f(getAuth()));

export function getAuth() {
  return { enabled: !!supabase, email: session?.user?.email || '', loggedIn: !!session };
}
export function onAuth(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function onData(fn) { dataListeners.add(fn); return () => dataListeners.delete(fn); }

async function pullRemote() {
  if (!supabase || !session) return;
  const { data, error } = await supabase.from('alma_user_data').select('entries, profile, journal, postits, readings').eq('user_id', session.user.id).maybeSingle();
  if (error) { console.warn('Alma: erro ao carregar dados', error.message); return; }
  const local = readLocal();
  if (!data) {
    // Primeiro login: leva para a nuvem o que já estava no aparelho.
    await supabase.from('alma_user_data').upsert({ user_id: session.user.id, entries: local.entries || [], profile: local.profile || null, journal: local.journal || [], postits: local.postits || [], readings: local.readings || [], updated_at: new Date().toISOString() });
    return;
  }
  const merged = { entries: data.entries || [], profile: data.profile || local.profile || null, journal: data.journal || [], postits: data.postits || [], readings: data.readings || [] };
  writeLocal(merged);
  dataListeners.forEach((f) => f(merged));
}

if (supabase) {
  supabase.auth.getSession().then(({ data }) => { session = data.session; emit(); pullRemote(); });
  supabase.auth.onAuthStateChange((event, s) => {
    const was = !!session; session = s; emit();
    if (s && !was) pullRemote();
  });
}

export function load() { return readLocal(); }

let timer = null;
let pending = {};
export function save(patch) {
  const next = Object.assign(readLocal(), patch);
  writeLocal(next);
  if (!supabase || !session) return;
  Object.assign(pending, patch);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const body = Object.assign({ user_id: session.user.id, updated_at: new Date().toISOString() }, pending);
    pending = {};
    const { error } = await supabase.from('alma_user_data').upsert(body);
    if (error) console.warn('Alma: erro ao salvar', error.message);
  }, 600);
}

export async function sendMagicLink(email) {
  if (!supabase) return { error: 'O login ainda não está configurado neste ambiente.' };
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  return { error: error ? error.message : null };
}
export async function signInWithGoogle() {
  if (!supabase) return { error: 'O login ainda não está configurado neste ambiente.' };
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error && /not enabled|Unsupported provider/i.test(error.message)) return { error: 'O login com Google ainda está sendo ativado. Use o e-mail por enquanto.' };
  return { error: error ? error.message : null };
}
export async function signOut() { if (supabase) await supabase.auth.signOut(); }
