'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [barbero, setBarbero] = useState({
    nombre: '',
    telefono: '',
    especialidad: '',
  });

  useEffect(() => {
    fetch('/api/barbers')
      .then(r => r.json())
      .then(data => {
        if (data.length) setBarbero(data[0]);
      });
  }, []);

  const guardar = async () => {
    await fetch('/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(barbero),
    });

    alert('Barbero actualizado');
  };

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          H BARBER SHOP
        </h1>

        <div className="card">
          <h2 className="text-red-500 mb-3">BARBERO</h2>

          <input
            value={barbero.nombre}
            placeholder="Nombre"
            onChange={(e)=>setBarbero({...barbero,nombre:e.target.value})}
          />

          <div style={{height:10}}/>

          <input
            value={barbero.telefono}
            placeholder="Teléfono"
            onChange={(e)=>setBarbero({...barbero,telefono:e.target.value})}
          />

          <div style={{height:10}}/>

          <input
            value={barbero.especialidad}
            placeholder="Especialidad"
            onChange={(e)=>setBarbero({...barbero,especialidad:e.target.value})}
          />

          <div style={{height:16}}/>

          <button onClick={guardar}>
            Guardar cambios
          </button>
        </div>
      </div>
    </main>
  );
}
