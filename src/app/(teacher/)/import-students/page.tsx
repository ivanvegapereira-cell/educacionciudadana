'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface StudentRow {
  email: string;
  nombre: string;
  curso?: string;
}

export default function ImportStudentsPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setError(null);
    setPreview([]);

    try {
      const text = await f.text();
      const lines = text.split('\n').filter((l) => l.trim());

      if (lines.length === 0) {
        setError('El archivo está vacío');
        return;
      }

      const rows: StudentRow[] = [];
      const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());

      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const row: StudentRow = {
          email: values[headers.indexOf('email')] || '',
          nombre: values[headers.indexOf('nombre')] || '',
          curso: values[headers.indexOf('curso')] || '',
        };

        if (row.email && row.nombre) {
          rows.push(row);
        }
      }

      setPreview(rows);
    } catch (err) {
      setError('Error al leer el archivo');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Selecciona un archivo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const text = await file.text();
      const lines = text.split('\n').filter((l) => l.trim());
      const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());

      let imported = 0;
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const email = values[headers.indexOf('email')]?.trim();
        const nombre = values[headers.indexOf('nombre')]?.trim();

        if (!email || !nombre) {
          errors.push(`Fila ${i + 1}: Email y nombre son requeridos`);
          continue;
        }

        try {
          // Registrar estudiante
          const res = await fetch('/api/import-students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              nombre,
              curso: values[headers.indexOf('curso')] || '',
              teacher_id: user?.id,
            }),
          });

          if (res.ok) {
            imported++;
          } else {
            const data = await res.json();
            errors.push(`Fila ${i + 1}: ${data.error || 'Error desconocido'}`);
          }
        } catch (err) {
          errors.push(`Fila ${i + 1}: Error procesando fila`);
        }
      }

      if (imported > 0) {
        setSuccess(`✓ ${imported} estudiantes importados exitosamente`);
      }

      if (errors.length > 0) {
        setError(`Errores: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`);
      }

      setFile(null);
      setPreview([]);
    } catch (err) {
      setError('Error al importar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Importar Estudiantes</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Formato CSV</CardTitle>
          <CardDescription>El archivo debe tener las siguientes columnas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <p>email,nombre,curso</p>
            <p className="text-gray-600">
              juan@ejemplo.com,Juan Pérez,3°A
            </p>
            <p className="text-gray-600">
              maria@ejemplo.com,María García,3°B
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Descarga un<a href="#" className="text-blue-600 hover:underline ml-1">
              archivo de ejemplo (CSV)
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Archivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || success) && (
            <div
              className={`rounded-lg p-4 ${
                error ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'
              }`}
            >
              {error || success}
            </div>
          )}

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />

          {preview.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Vista Previa (primeras 5 filas)</p>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Curso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="px-4 py-2">{row.email}</td>
                        <td className="px-4 py-2">{row.nombre}</td>
                        <td className="px-4 py-2">{row.curso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleImport} loading={loading} disabled={!file}>
              Importar Estudiantes
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setFile(null);
                setPreview([]);
              }}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
