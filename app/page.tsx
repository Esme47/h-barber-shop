'use client';

import { useState } from 'react';

export default function Home() {
  const [barbero, setBarbero] = useState({
    nombre: 'Hernán',
    telefono: '3146967132',
    especialidad: 'Fade',
  });

  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Corte clásico', precio: 25000 },
    { id: 2, nombre: 'Corte Fade', precio: 28000 },
    { id: 3, nombre: 'Barba', precio: 15000 },
  ]);

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">

        <div className="text-center py-4">
          <img
            src="/logo.png"
            className="w-24 h-24 rounded-full mx-auto border-2 border-red-600"
          />
          <h1 className="text-2xl font-bold mt-3">H BARBER SHOP</h1>
          <p className="text-gray-400 text-sm">Agenda & Recordatorios</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4 mb-4">
          <h2 className="font-semibold text-red-500 mb-3">
            BARBERO ACTIVO
          </h2>

          <input
            className="w-full bg-zinc-800 rounded p-2 mb-2"
            value={barbero.nombre}
            onChange={(e)=>setBarbero({...barbero,nombre:e.target.value})}
          />

          <input
            className="w-full bg-zinc-800 rounded p-2 mb-2"
            value={barbero.telefono}
            onChange={(e)=>setBarbero({...barbero,telefono:e.target.value})}
          />

          <input
            className="w-full bg-zinc-800 rounded p-2"
            value={barbero.especialidad}
            onChange={(e)=>setBarbero({...barbero,especialidad:e.target.value})}
          />
        </div>

        <div className="bg-zinc-900 rounded-xl p-4">
          <h2 className="font-semibold text-red-500 mb-3">SERVICIOS</h2>

          {servicios.map((s,i)=>(
            <div key={s.id} className="mb-3 border-b border-zinc-700 pb-3">
              <input
                className="w-full bg-zinc-800 rounded p-2 mb-2"
                value={s.nombre}
                onChange={(e)=>{
                  const copia=[...servicios];
                  copia[i].nombre=e.target.value;
                  setServicios(copia);
                }}
              />

              <input
                type="number"
                className="w-full bg-zinc-800 rounded p-2"
                value={s.precio}
                onChange={(e)=>{
                  const copia=[...servicios];
                  copia[i].precio=Number(e.target.value);
                  setServicios(copia);
                }}
              />
            </div>
          ))}

          <button
            className="w-full bg-red-600 py-3 rounded-lg font-bold mt-2"
            onClick={()=>alert('Siguiente paso: guardar en Neon')}
          >
            Guardar cambios
          </button>
        </div>

      </div>
    </main>
  );
}
