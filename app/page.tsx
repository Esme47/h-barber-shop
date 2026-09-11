'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [barbero, setBarbero] = useState({
    nombre: '', telefono: '', especialidad: ''
  });

  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch('/api/barbers')
      .then(r => r.json())
      .then(d => d.length && setBarbero(d[0]));

    fetch('/api/services')
      .then(r => r.json())
      .then(setServicios);
  }, []);

  const guardarBarbero = async () => {
    await fetch('/api/barbers', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(barbero)
    });
    alert('Barbero guardado');
  };

  const guardarServicio = async (s:any) => {
    await fetch('/api/services', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(s)
    });
  };

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto space-y-4">

        <div className="card">
          <h2 className="text-red-500 mb-3">BARBERO</h2>

          <input value={barbero.nombre}
            onChange={e=>setBarbero({...barbero,nombre:e.target.value})}/>
          <div className="h-2"/>
          <input value={barbero.telefono}
            onChange={e=>setBarbero({...barbero,telefono:e.target.value})}/>
          <div className="h-2"/>
          <input value={barbero.especialidad}
            onChange={e=>setBarbero({...barbero,especialidad:e.target.value})}/>
          <div className="h-4"/>
          <button onClick={guardarBarbero}>Guardar Barbero</button>
        </div>

        <div className="card">
          <h2 className="text-red-500 mb-3">SERVICIOS</h2>

          {servicios.map((s:any)=>(
            <div key={s.id} className="mb-4">
              <input
                value={s.nombre}
                onChange={e=>{
                  setServicios(servicios.map((x:any)=>
                    x.id===s.id?{...x,nombre:e.target.value}:x));
                }}
              />
              <div className="h-2"/>
              <input
                type="number"
                value={s.precio}
                onChange={e=>{
                  setServicios(servicios.map((x:any)=>
                    x.id===s.id?{...x,precio:Number(e.target.value)}:x));
                }}
              />
              <div className="h-2"/>
              <button onClick={()=>guardarServicio(s)}>
                Guardar Servicio
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
