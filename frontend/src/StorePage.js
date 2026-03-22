import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StorePage() {
  const [banner, setBanner] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get('https://ai-flow-ap.onrender.com/api/latest-message');
        setBanner(res.data.message);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch {
        setBanner('Welcome to our store!');
      }
    };

    fetchMessage();
    const interval = setInterval(fetchMessage, 3000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    { id: 1, name: 'Wireless Headphones', price: '$99',  original: '$199', emoji: '🎧' },
    { id: 2, name: 'Smart Watch',         price: '$149', original: '$299', emoji: '⌚' },
    { id: 3, name: 'Running Shoes',       price: '$59',  original: '$119', emoji: '👟' },
    { id: 4, name: 'Backpack',            price: '$39',  original: '$79',  emoji: '🎒' },
    { id: 5, name: 'Sunglasses',          price: '$45',  original: '$89',  emoji: '🕶️' },
    { id: 6, name: 'Water Bottle',        price: '$19',  original: '$39',  emoji: '🍶' },
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f3f4f6' }}>

      {/* Navbar */}
      <div style={{
        background: '#1a1a2e', color: 'white',
        padding: '14px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '0.5px' }}>
          🛍️ FutureBlink Store
        </h1>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', opacity: 0.85 }}>
          <span>Home</span>
          <span>Products</span>
          <span>Deals</span>
          <span>Contact</span>
        </div>
        <Link to="/" style={{
          background: '#4f46e5', color: 'white', padding: '8px 16px',
          borderRadius: '6px', textDecoration: 'none', fontSize: '13px'
        }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        color: 'white', textAlign: 'center',
        padding: '16px', fontSize: '20px', fontWeight: '700',
        letterSpacing: '0.5px', position: 'relative'
      }}>
        🔥 {banner}
        <span style={{
          position: 'absolute', right: '20px', top: '50%',
          transform: 'translateY(-50%)', fontSize: '11px',
          opacity: 0.7, fontWeight: '400'
        }}>
          Live • {lastUpdated}
        </span>
      </div>

     

      <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ color: '#111827', marginBottom: '24px', fontSize: '22px' }}>
          Featured Products
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: 'white', borderRadius: '12px',
              padding: '24px', textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
              transition: 'transform 0.2s',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{p.emoji}</div>
              <div style={{ fontWeight: '600', color: '#111827', fontSize: '15px', marginBottom: '6px' }}>
                {p.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#4f46e5', fontWeight: '700', fontSize: '20px' }}>
                  {p.price}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'line-through' }}>
                  {p.original}
                </span>
              </div>
              <div style={{
                background: '#dcfce7', color: '#166534',
                fontSize: '11px', fontWeight: '600',
                padding: '3px 8px', borderRadius: '20px',
                display: 'inline-block', margin: '8px 0'
              }}>
                50% OFF
              </div>
              <br />
              <button style={{
                marginTop: '8px', background: '#4f46e5', color: 'white',
                border: 'none', borderRadius: '6px', padding: '9px 20px',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500'
              }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: 'center', padding: '24px',
        color: '#9ca3af', fontSize: '13px',
        borderTop: '1px solid #e5e7eb', marginTop: '40px',
        background: 'white'
      }}>
        © 2026 FutureBlink Store — All rights reserved
      </div>

    </div>
  );
}

export default StorePage;