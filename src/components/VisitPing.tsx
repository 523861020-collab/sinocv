'use client';

// 停留时长上报（2026-11-01）
// 目的：解决「统计里停留普遍 5 秒内」——原来只在页面卸载时发一次，手机端经常丢。
// 现在：15 秒心跳 + pagehide/visibilitychange 用 sendBeacon 兜底，服务端取最大值。
import { useEffect } from 'react';

export default function VisitPing() {
  useEffect(() => {
    const start = Date.now();
    let last = 0;
    const send = (beacon: boolean) => {
      const ms = Date.now() - start;
      if (ms < 1500 || ms - last < 3000) return;
      last = ms;
      const payload = JSON.stringify({
        path: location.pathname,
        ms,
        ref: document.referrer || '',
      });
      try {
        if (beacon && navigator.sendBeacon) {
          navigator.sendBeacon('/api/site-visit', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch('/api/site-visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        /* 统计失败不影响客户 */
      }
    };

    const timer = setInterval(() => send(false), 15000);
    const onHide = () => send(true);
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onHide();
    });
    return () => {
      clearInterval(timer);
      window.removeEventListener('pagehide', onHide);
    };
  }, []);

  return null;
}
