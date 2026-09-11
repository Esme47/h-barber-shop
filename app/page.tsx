'use client';

import { useEffect, useState } from 'react';

interface Barbero {
  nombre: string;
  telefono: string;
  especialidad: string;
}

interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  duracion: number;
}

export default function Home() {
  const [barbero, setBarbero] = useState<Barbero>({
    nombre: '',
    telefono: '',
    especialidad: '',
  });

  const [servicios, setServicios] = useState<Servicio[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const b = await fetch('/api/barbers').then(r => r.json());
      if (b.length) setBarbero(b[0]);

      const s = await fetch('/api/services').then(r => r.json());
      setServicios(s);
    };

    cargarDatos();
  }, []);

  const guardarBarbero = async () => {
    await fetch('/api/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(barbero),
    });

    alert('Barbero guardado');
  };

  const guardarServicio = async (servicio: Servicio) => {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicio),
    });

    alert('Servicio actualizado');
  };

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto space-y-4">

        <div className="card">
          <h2 className="text-red-500 mb-3">BARBERO</h2>

          <input
            value={barbero.nombre}
            placeholder="Nombre"
            onChange={e =>
              setBarbero({ ...barbero, nombre: e.target.value })
            }
          />

          <div className="h-2" />

          <input
            value={barbero.telefono}
            placeholder="Teléfono"
            onChange={e =>
              setBarbero({ ...barbero, telefono: e.target.value })
            }
          />

          <div className="h-2" />

          <input
            value={barbero.especialidad}
            placeholder="Especialidad"
            onChange={e =>
              setBarbero({ ...barbero, especialidad: e.target.value })
            }
          />

          <div className="h-4" />

          <button onClick={guardarBarbero}>
            Guardar Barbero
          </button>
        </div>

        <div className="card">
          <h2 className="text-red-500 mb-3">SERVICIOS</h2>

          {servicios.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No hay servicios registrados.
            </p>
          ) : (
            servicios.map((s) => (
              <div key={s.id} className="mb-4 border-b border-zinc-700 pb-3">

                <input
                  value={s.nombre}
                  placeholder="Nombre del servicio"
                  onChange={e =>
                    setServicios(
                      servicios.map(x =>
                        x.id === s.id
                          ? { ...x, nombre: e.target.value }
                          : x
                      )
                    )
                  }
                />

                <div className="h-2" />

                <input
                  type="number"
                  value={s.precio}
                  placeholder="Precio"
                  onChange={e =>
                    setServicios(
                      servicios.map(x =>
                        x.id === s.id
                          ? { ...x, precio: Number(e.target.value) }
                          : x
                      )
                    )
                  }
                />

                <div className="h-2" />

                <input
                  type="number"
                  value={s.duracion}
                  placeholder="Duración (min)"
                  onChange={e =>
                    setServicios(
                      servicios.map(x =>
                        x.id === s.id
                          ? { ...x, duracion: Number(e.target.value) }
                          : x
                      )
                    )
                  }
                />

                <div className="h-3" />

                <button onClick={() => guardarServicio(s)}>
                  Guardar Servicio
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
