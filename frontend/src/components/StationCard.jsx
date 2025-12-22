export default function StationCard({ station }) {
  return (
    <div className="bg-white shadow-md border border-blue-100 rounded-xl p-5 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-blue-700">{station.name}</h3>
      <p className="text-gray-600 mt-2">
        <strong>Location:</strong> {station.location}
      </p>
      <p className="text-gray-600">
        <strong>Latitude:</strong> {station.latitude}
      </p>
      <p className="text-gray-600">
        <strong>Longitude:</strong> {station.longitude}
      </p>
      <p className="text-gray-600">
        <strong>Managed By:</strong> {station.managed_by}
      </p>
    </div>
  );
}
