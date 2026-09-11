'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function Home() {
  const [barbero, setBarbero] = useState({
    nombre: 'Harold',
    telefono: '3146967132',
    especialidad: 'Fade'
  });

  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Corte', precio: 30000, duracion: 45 },
    { id: 2, nombre: 'Barba', precio: 15000, duracion: 20 }
  ]);

  const editar = (id:number, campo:string, valor:any)=>{
    setServicios(servicios.map(s =>
      s.id===id ? {...s,[campo]:valor} : s
    ));
  };
const guardar = async () => {
  await supabase.from('barbers').upsert(barbero);

  for (const s of servicios) {
    await supabase.from('services').upsert(s);
  }

  alert('Cambios guardados');
};
  return (
    <main style={{padding:20}}>
      <h1>H Barber Shop</h1>

      <h2>Barbero</h2>
      <input value={barbero.nombre}
        onChange={e=>setBarbero({...barbero,nombre:e.target.value})}/>
      <input value={barbero.telefono}
        onChange={e=>setBarbero({...barbero,telefono:e.target.value})}/>
      <input value={barbero.especialidad}
        onChange={e=>setBarbero({...barbero,especialidad:e.target.value})}/>

      <h2>Servicios</h2>

      {servicios.map(s=>(
        <div key={s.id}>
          <input value={s.nombre}
            onChange={e=>editar(s.id,'nombre',e.target.value)}/>
          <input value={s.precio}
            onChange={e=>editar(s.id,'precio',Number(e.target.value))}/>
          <input value={s.duracion}
            onChange={e=>editar(s.id,'duracion',Number(e.target.value))}/>
        </div>
      ))}

      <button onClick={guardar}>
  Guardar cambios
</button>
    </main>
  );
}
