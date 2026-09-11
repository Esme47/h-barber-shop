'use client';

import { useState } from 'react';

export default function Home() {
  const [barbero, setBarbero] = useState({
    nombre: 'Harold',
    telefono: '3146967132',
    especialidad: 'Fade',
  });

  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Corte clásico', precio: 25000 },
    { id: 2, nombre: 'Corte Fade', precio: 28000 },
    { id: 3, nombre: 'Barba', precio: 15000 },
  ]);

  const editarServicio = (
    id: number,
    campo: 'nombre' | 'precio',
    valor: string
  ) => {
    setServicios(
      servicios.map((s) =>
        s.id === id
          ? {
              ...s,
              [campo]: campo === 'precio' ? Number(valor) : valor,
            }
          : s
      )
    );
  };

  const guardar = async () => {
    console.log(barbero);
    console.log(servicios);
    alert('Cambios preparados');
  };

  return (
    <main style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>H Barber Shop</h1>
      <p>Panel del Barbero</p>

      <h2>Barbero</h2>

      <input
        placeholder="Nombre"
        value={barbero.nombre}
        onChange={(e) =>
          setBarbero({ ...barbero, nombre: e.target.value })
        }
      />

      <br />
      <br />

      <input
        placeholder="Teléfono"
        value={barbero.telefono}
        onChange={(e) =>
          setBarbero({ ...barbero, telefono: e.target.value })
        }
      />

      <br />
      <br />

      <input
        placeholder="Especialidad"
        value={barbero.especialidad}
        onChange={(e) =>
          setBarbero({ ...barbero, especialidad: e.target.value })
        }
      />

      <hr />

      <h2>Servicios</h2>

      {servicios.map((s) => (
        <div
          key={s.id}
          style={{
            border: '1px solid #ddd',
            padding: 10,
            marginBottom: 10,
          }}
        >
          <input
            value={s.nombre}
            onChange={(e) =>
              editarServicio(s.id, 'nombre', e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="number"
            value={s.precio}
            onChange={(e) =>
              editarServicio(s.id, 'precio', e.target.value)
            }
          />
        </div>
      ))}

      <button onClick={guardar}>Guardar cambios</button>
    </main>
  );
}
