import { redirect } from 'next/navigation';

// 2026-11-01：原来 src/app/page.tsx 是首页的一份完整副本（没有语言上下文），
// 造成两个问题：① 接入三语文案后 useLocale() 找不到 Provider，整站构建失败；
// ② / 与 /en 渲染同一份内容，谷歌会判为重复内容。
// 现在只保留一个跳转，真正的首页只有 src/app/[locale]/page.tsx 一份。
export default function RootPage() {
  redirect('/en');
}
