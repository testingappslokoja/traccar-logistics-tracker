"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Order, LineItem } from '@repo/shared-types';
import DynamicMap from './DynamicMap';

import { useParams } from 'next/navigation';

export default function OrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = params.id as string;
      if (!orderId) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        alert('Could not fetch order details.');
      } else {
        setOrder(data as Order);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return <div className="p-24">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-24">Order not found.</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Track Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        <div className="md:col-span-1 bg-white p-8 rounded-lg shadow-md">
          <p><span className="font-semibold">Order ID:</span> {order.id}</p>
          <p><span className="font-semibold">Status:</span> {order.status}</p>
          <p><span className="font-semibold">Total:</span> ${(order.total / 100).toFixed(2)}</p>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Items:</h2>
            <ul>
              {order.lineItems && order.lineItems.map((item: LineItem, index: number) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.price / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-2 h-[600px] rounded-lg shadow-md">
          <DynamicMap deviceIds={[16279, 16136]} />
        </div>
      </div>
    </main>
  );
}
