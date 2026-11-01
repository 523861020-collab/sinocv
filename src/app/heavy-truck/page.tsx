import { redirect } from 'next/navigation';

// 2026-11-01: this route was a full duplicate of /[locale]/heavy-truck (same content,
// no locale context). It caused duplicate content for Google and broke the
// build once the body copy became locale-aware. Redirect only; the real page
// lives in src/app/[locale]/heavy-truck.
export default function Page() {
  redirect('/en/heavy-truck');
}
