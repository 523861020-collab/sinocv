// 询价弹窗的统一入口（QuickLead 监听这个事件）
// 页面任何地方都能用 openLead('pricelist') 打开「2026 报价清单」，
// 不用再把大块留资表单直接摆在页面上。
export type LeadMode = 'quote' | 'pricelist';

export const OPEN_LEAD_EVENT = 'open-quicklead';

export function openLead(mode: LeadMode = 'quote') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<LeadMode>(OPEN_LEAD_EVENT, { detail: mode }));
}
