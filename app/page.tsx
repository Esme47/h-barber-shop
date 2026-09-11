'use client';

import { useState } from 'react';

export default function Home() {
  const [barbero, setBarbero] = useState({
    nombre: 'Harold',
    telefono: '3146967132',
    especialidad: 'Fade'
  });

  return (
    <main style={{padding:24}}>
      <h1>H Barber Shop</h1>

      <h2>Editar Barbero</h2>

      <input
        value={barbero.nombre}
        onChange={(e)=>setBarbero({...barbero,nombre:e.target.value})}
        placeholder="Nombre"
      />

      <input
        value={barbero.telefono}
        onChange={(e)=>setBarbero({...barbero,telefono:e.target.value})}
        placeholder="Teléfono"
      />

      <input
        value={barbero.especialidad}
        onChange={(e)=>setBarbero({...barbero,especialidad:e.target.value})}
        placeholder="Especialidad"
      />

      <button>Guardar cambios</button>
    </main>
  );
}
