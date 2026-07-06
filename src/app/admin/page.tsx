'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inquiry')
      .then(r => r.json())
      .then(d => setInquiries(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">客户留言</h1>
        <p className="text-gray-400 mb-8">共 {inquiries.length} 条</p>

        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-gray-500">暂无留言</p>
        ) : (
          <div className="space-y-4">
            {inquiries.reverse().map((inq: any) => (
              <div key={inq.id} className="rounded-xl bg-gray-900 border border-gray-800 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-amber-500 text-xs">{inq.id}</span>
                    <h3 className="text-white font-semibold text-lg">{inq.name}</h3>
                  </div>
                  <span className="text-gray-500 text-xs">{new Date(inq.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div><span className="text-gray-500">邮箱：</span><span className="text-gray-300">{inq.email || '-'}</span></div>
                  <div><span className="text-gray-500">电话：</span><span className="text-gray-300">{inq.phone || '-'}</span></div>
                  <div><span className="text-gray-500">公司：</span><span className="text-gray-300">{inq.company || '-'}</span></div>
                  <div><span className="text-gray-500">国家：</span><span className="text-gray-300">{inq.country || '-'}</span></div>
                </div>
                {inq.product && <p className="text-gray-500 text-sm mb-2">意向产品：{inq.product}</p>}
                {inq.message && <p className="text-gray-400 bg-gray-800 rounded-lg p-3 text-sm">{inq.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
