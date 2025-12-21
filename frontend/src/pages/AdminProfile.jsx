export default function AdminProfile() {
  return (
    <div className="max-w-3xl space-y-6">

      {/* PROFILE HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#C4E1E6] flex items-center justify-center text-xl font-semibold text-gray-700">
          A
        </div>
        <div>
          <h1 className="text-xl font-semibold">Admin</h1>
          <span className="inline-block mt-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
            Administrator
          </span>
          <p className="text-sm text-gray-500 mt-1">
            System administrator for water quality monitoring
          </p>
        </div>
      </div>

      {/* ACCOUNT DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p><span className="font-medium">Email:</span> admin@example.com</p>
        <p><span className="font-medium">Organization:</span> Water Quality Monitoring Authority</p>
        <p><span className="font-medium">Region:</span> All Regions</p>
      </div>

      {/* RESPONSIBILITY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Role Responsibility</h2>
        <p className="text-gray-600">
          Responsible for managing users, monitoring stations, and overall
          system configuration.
        </p>
      </div>

    </div>
  );
}
