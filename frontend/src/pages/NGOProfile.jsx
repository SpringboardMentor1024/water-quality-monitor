export default function NGOProfile() {
  return (
    <div className="max-w-3xl space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#C4E1E6] flex items-center justify-center text-xl font-semibold text-gray-700">
          N
        </div>
        <div>
          <h1 className="text-xl font-semibold">NGO User</h1>
          <span className="inline-block mt-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
            NGO
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Regional water quality monitoring partner
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p><span className="font-medium">Email:</span> user@example.com</p>
        <p><span className="font-medium">Organization:</span> Environmental NGO</p>
        <p><span className="font-medium">Region:</span> Chennai</p>
      </div>

      {/* RESPONSIBILITY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Role Responsibility</h2>
        <p className="text-gray-600">
          Responsible for monitoring water quality trends and reviewing reports
          for assigned regions.
        </p>
      </div>

    </div>
  );
}
