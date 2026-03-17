'use client';
// src/components/tools/JWTDecoder.tsx
import { useState } from 'react';

function decodeBase64Url(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  try { return decodeURIComponent(escape(atob(str))); } catch { return atob(str); }
}

function parseJWT(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('JWT must have 3 parts (header.payload.signature)');
  const header = JSON.parse(decodeBase64Url(parts[0]));
  const payload = JSON.parse(decodeBase64Url(parts[1]));
  return { header, payload, signature: parts[2] };
}

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<{ header: object; payload: Record<string, unknown>; signature: string } | null>(null);
  const [error, setError] = useState('');

  const decode = () => {
    if (!token.trim()) return;
    try { setResult(parseJWT(token)); setError(''); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Invalid JWT'); setResult(null); }
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = result?.payload?.exp as number | undefined;
  const isExpired = exp ? exp < now : null;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">JWT Token</label>
        <textarea className="tool-textarea font-mono text-xs" value={token} onChange={e => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          style={{ minHeight: 100 }} />
        <button onClick={decode} disabled={!token.trim()} className={`btn-primary ${!token.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>🔑 Decode JWT</button>
      </div>
      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">⚠ {error}</div>}
      {result && (
        <div className="space-y-4">
          {isExpired !== null && (
            <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${isExpired ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              {isExpired ? '⚠ Token is EXPIRED' : '✓ Token is valid (not expired)'}
              {exp && <span className="font-normal ml-2 opacity-70">Expires: {new Date(exp * 1000).toLocaleString()}</span>}
            </div>
          )}
          {[{ label: 'Header', data: result.header, color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { label: 'Payload', data: result.payload, color: 'text-brand-600 bg-brand-50 border-brand-100' }].map(({ label, data, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${color}`}>
              <h3 className="font-semibold text-sm mb-2 uppercase tracking-wider">{label}</h3>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono bg-white bg-opacity-60 rounded-lg p-3">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="font-semibold text-sm text-slate-600 mb-2 uppercase tracking-wider">Signature (Base64Url)</h3>
            <p className="text-xs font-mono text-slate-500 break-all">{result.signature}</p>
          </div>
        </div>
      )}
    </div>
  );
}
