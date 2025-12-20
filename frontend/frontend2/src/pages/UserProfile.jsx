export default function UserProfile() {
  return (
    <div className="max-w-3xl space-y-6">

      {/* PROFILE HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#C4E1E6] flex items-center justify-center text-xl font-semibold text-gray-700">
          U
        </div>
        <div>
          <h1 className="text-xl font-semibold">User</h1>
          <span className="inline-block mt-1 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full">
            Read-Only Access
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Local water quality information viewer
          </p>
        </div>
      </div>

      {/* ACCOUNT DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p><span className="font-medium">Email:</span> user@example.com</p>
        <p><span className="font-medium">Region:</span> Assigned Area</p>
      </div>

      {/* RESPONSIBILITY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Role Responsibility</h2>
        <p className="text-gray-600">
          Can view water quality status and reports for the assigned region.
        </p>
      </div>

    </div>
  );
}
