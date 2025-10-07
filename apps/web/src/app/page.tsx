"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@repo/shared-types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    const mockProducts: Product[] = [
      { id: 'prod_1', name: 'Premium Widget', price: 1999, imageUrl: 'https://i.imgur.com/LdrAhJI.jpeg' },
      { id: 'prod_2', name: 'Deluxe Gadget', price: 2999, imageUrl: 'https://i.imgur.com/p3wHnxA.jpeg' },
      { id: 'prod_3', name: 'Basic Gizmo', price: 999, imageUrl: 'https://i.ibb.co/bX244Vv/edge-drive-hotel.jpg' },
    ];
    setProducts(mockProducts);
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(`Login failed: ${error.message}`);
    } else {
      alert('Login successful!');
    }
  };

  const handleCreateOrder = async () => {
    const lineItems = [{ productId: 'prod_1', quantity: 2, name: 'Premium Widget', price: 1999 }];
    const startCoords = [7.81334, 6.69838]; // Confluence Stadium
    const destinationCoords = [7.7935662111756665, 6.731518881826145]; // Specialist Hospital

    const { data, error } = await supabase.functions.invoke('create-order', {
      body: { lineItems, startCoords, destinationCoords },
    });

    if (error) {
      alert(`Error creating order: ${error.message}`);
    } else {
      const newOrder = data[0];
      window.location.href = `/order/${newOrder.id}`;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Logistics Tracker</h1>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <div className="mb-8 flex flex-col gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-4 py-2" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border px-4 py-2" />
          <button onClick={handleLogin} className="rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700">
            Login
          </button>
        </div>
        <button
          onClick={handleCreateOrder}
          className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Create Test Order
        </button>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">{product.name}</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              ${(product.price / 100).toFixed(2)}
            </p>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="mt-4 w-full h-48 object-cover" />}
          </div>
        ))}
      </div>
    </main>
  );
}