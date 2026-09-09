export default function StudentDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Mis Cuestionarios</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
        <p>No hay cuestionarios disponibles en este momento.</p>
        <p className="mt-2">Tu docente pronto asignará actividades.</p>
      </div>
    </div>
  );
}
