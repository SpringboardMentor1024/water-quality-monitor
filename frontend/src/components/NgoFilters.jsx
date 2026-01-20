export default function NgoFilters({ selectedNgo, onChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="font-semibold mb-2 text-blue-900">
        NGO Filters
      </h2>

      <select
        value={selectedNgo}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="Clean Rivers">Clean Rivers</option>
        <option value="AquaGuard">AquaGuard</option>
      </select>
    </div>
  );
}