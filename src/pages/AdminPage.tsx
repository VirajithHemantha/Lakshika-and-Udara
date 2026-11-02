import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Link2, Copy, MessageSquareHeart, Heart } from 'lucide-react';
import { PREFIXES, PrefixKey, buildDisplayName, buildInviteLink, buildInviteMessage } from '../lib/guest';
import { COUPLE_NAMES } from '../config/wedding';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for older mobile browsers / non-secure contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

export default function AdminPage() {
  const [prefix, setPrefix] = useState<PrefixKey>('mr');
  const [guestName, setGuestName] = useState('');
  const [result, setResult] = useState<{ link: string; displayName: string; message: string } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name.');
      return;
    }
    const link = buildInviteLink(window.location.origin, prefix, guestName);
    setResult({ link, displayName, message: buildInviteMessage(displayName, link) });
  };

  const copy = async (text: string, label: string) => {
    await copyText(text);
    toast.success(label);
  };

  const inputClass =
    'w-full bg-white px-5 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold outline-none text-brand-mocha';
  const btnClass =
    'flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-champagne font-sans text-brand-mocha px-4 py-10 sm:py-16">
      <Toaster position="top-center" />
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-8">
          <Heart className="w-6 h-6 mx-auto mb-3 text-brand-gold fill-brand-gold/20" />
          <h1 className="font-display text-3xl sm:text-4xl">{COUPLE_NAMES}</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-sand mt-2">Invitation Link Generator</p>
        </header>

        <form onSubmit={handleGenerate} className="bg-white/80 rounded-2xl border border-brand-gold/30 shadow-sm p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="prefix" className="block text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">
              Select Prefix
            </label>
            <select id="prefix" className={inputClass} value={prefix} onChange={(e) => setPrefix(e.target.value as PrefixKey)}>
              {PREFIXES.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="guestName" className="block text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">
              Guest Name
            </label>
            <input
              id="guestName"
              type="text"
              placeholder="e.g. Sanjaya"
              className={inputClass}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <button type="submit" className={`${btnClass} w-full bg-brand-mocha text-brand-champagne hover:bg-brand-sand`}>
            <Link2 className="w-4 h-4" /> Generate Link
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={!result}
              onClick={() => result && copy(result.link, 'Link copied!')}
              className={`${btnClass} border border-brand-gold/50 text-brand-mocha hover:bg-brand-gold/10`}
            >
              <Copy className="w-4 h-4" /> Copy Link Only
            </button>
            <button
              type="button"
              disabled={!result}
              onClick={() => result && copy(result.message, 'Message copied!')}
              className={`${btnClass} bg-brand-gold text-white hover:bg-brand-gold/90`}
            >
              <MessageSquareHeart className="w-4 h-4" /> Copy Full Message
            </button>
          </div>
        </form>

        {result && (
          <section className="mt-6 bg-white/80 rounded-2xl border border-brand-gold/30 shadow-sm p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Generated Link</p>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all bg-brand-champagne rounded-xl px-4 py-3 text-sm text-brand-sand underline underline-offset-2"
              >
                {result.link}
              </a>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Message Preview</p>
              <pre className="whitespace-pre-wrap break-words bg-brand-champagne rounded-xl px-4 py-4 text-sm leading-relaxed font-sans">
                {result.message}
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
