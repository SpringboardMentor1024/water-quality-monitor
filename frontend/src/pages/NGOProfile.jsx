import { useEffect, useState } from "react";

export default function NGOProfile() {
  const [ngo, setNgo] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/ngo/profile")
      .then(res => res.json())
      .then(data => setNgo(data));
  }, []);

  if (!ngo) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#C4E1E6] flex items-center justify-center text-xl font-semibold">
          {ngo.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{ngo.name}</h1>
          <span className="inline-block mt-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
            NGO
          </span>
          <p className="text-sm text-gray-500 mt-1">{ngo.description}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <p><b>Email:</b> {ngo.email}</p>
        <p><b>Region:</b> {ngo.region}</p>
      </div>
    </div>
  );
}
