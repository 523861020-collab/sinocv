// @ts-nocheck
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get all contacts
    let totalCustomers = 0, todayChats = 0, todayPis = 0, totalOrders = 0;

    if (supabase) {
      // Total customers
      const { count: custCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
      totalCustomers = custCount || 0;

      // Today's communication (last_contacted = today)
      const { count: chatCount } = await supabase.from('contacts')
        .select('*', { count: 'exact', head: true })
        .gte('last_contacted', today);
      todayChats = chatCount || 0;

      // Count PIs from today across all contacts
      const { data: contacts } = await supabase.from('contacts').select('orders');
      if (contacts) {
        contacts.forEach((c: any) => {
          const orders = c.orders || [];
          orders.forEach((o: any) => {
            totalOrders++;
            const pis = o.pis || [];
            pis.forEach((p: any) => {
              if (p.date && p.date >= today) todayPis++;
            });
          });
        });
      }
    }

    return NextResponse.json({ todayChats, totalCustomers, todayPis, totalOrders });
  } catch (e) {
    return NextResponse.json({ todayChats: 0, totalCustomers: 0, todayPis: 0, totalOrders: 0 });
  }
}
