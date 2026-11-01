/**
 * 官网停留时长上报（2026-11-01 新增）
 * 背景：香港 img.sinocv.com 的接口被 Cloudflare 挡住（回源 443 走 Xray、脚本路径 404），
 * 跨域写数据库这条路走不通。所以改成：官网自己的 Vercel 函数接收，写进 Vercel 日志，
 * 手机端再加「超时/关闭页面时 navigator.sendBeacon」兜底，解决原来统计到的停留普遍偏短(5秒内)的问题。
 *
 * 前端用法（VisitPing 组件）：
 *   POST /api/site-visit  {"path":"/en","ms":12345,"ref":document.referrer,"dpr":1}
 *   每 15 秒心跳一次 + 离开时 sendBeacon 一次，服务端取最大值。
 */
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({} as any));
    const path = String(b.path || '').slice(0, 120);
    const ms = Math.min(Number(b.ms) || 0, 6 * 3600 * 1000);
    const ua = request.headers.get('user-agent') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const lang = request.headers.get('accept-language') || '';
    const ref = String(b.ref || '').slice(0, 200);
    // 结构化一行，方便在 Vercel 日志里 grep 'SITEPING'
    console.log(
      `SITEPING ${JSON.stringify({ path, sec: Math.round(ms / 1000), country, ref, ua: ua.slice(0, 80), lang: lang.slice(0, 20) })}`
    );
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 204 });
  }
}

export async function GET() {
  return Response.json({ ok: true });
}
