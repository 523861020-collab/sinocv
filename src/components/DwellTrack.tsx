'use client';
import { useEffect } from 'react';

// 轻量"停留时长"统计:把会话(标签页级)累计的可见时长,静默上报到公司自己的服务器。
// 仅用于每日早报中的"平均停留时长";不采集任何个人信息,不设置 Cookie。
export default function DwellTrack() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (!('sendBeacon' in navigator)) return;
    const ENDPOINT = 'https://img.sinocv.com/api/v1/site/visit';

    let sid = '';
    let carry = 0;
    try {
      sid = sessionStorage.getItem('scv_sid') || '';
      if (!sid) {
        sid = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
        sessionStorage.setItem('scv_sid', sid);
      }
      carry = parseInt(sessionStorage.getItem('scv_t') || '0', 10) || 0;
    } catch {
      return; // 隐私模式等场景直接放弃
    }

    let activeMs = carry;
    let t0: number | null = document.visibilityState === 'visible' ? Date.now() : null;

    const current = () => activeMs + (t0 ? Date.now() - t0 : 0);

    const fire = () => {
      const secs = Math.min(3600, Math.round(current() / 1000));
      try {
        sessionStorage.setItem('scv_t', String(current()));
      } catch {
        /* 配额/隐私限制:忽略 */
      }
      try {
        navigator.sendBeacon(
          ENDPOINT,
          JSON.stringify({ v: 1, sid, s: secs, p: location.pathname })
        );
      } catch {
        /* 静默失败,不影响页面 */
      }
    };

    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        if (t0) { activeMs += Date.now() - t0; t0 = null; }
        fire();
      } else if (!t0) {
        t0 = Date.now();
      }
    };

    const onHide = () => {
      if (t0) { activeMs += Date.now() - t0; t0 = null; }
      fire();
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onHide);
    // 保底心跳:每 60 秒上报一次累计值,防止直接退出浏览器时丢数据
    const iv = window.setInterval(() => { if (t0) fire(); }, 60000);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onHide);
      window.clearInterval(iv);
    };
  }, []);

  return null;
}
