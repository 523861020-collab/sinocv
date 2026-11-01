import { redirect } from 'next/navigation';

// 2026-11-01: this route was a full duplicate of /[locale]/6x6 (same content,
// no locale context). It caused duplicate content for Google and broke the
// build once the body copy became locale-aware. Redirect only; the real page
// lives in src/app/[locale]/6x6.
export default function Page() {
  redirect('/en/6x6');
}
