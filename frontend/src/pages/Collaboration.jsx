import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Collaboration() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/collaborations")
      .then((res) => res.json())
      .then((data) => {
        setCollaborations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading collaborations...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        NGO Collaborations
      </h2>

      <p className="text-gray-600">
        Manage collaborations between NGOs, projects, and assigned water stations.
      </p>

      {collaborations.length === 0 && (
        <p className="text-gray-500">No collaborations found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collaborations.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <h3 className="font-semibold text-[#4FA3B5]">
              {c.ngo}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              Project: {c.project}
            </p>

            <ul className="list-disc list-inside text-sm text-gray-700 mt-3">
              {c.stations.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
              {c.status}
            </span>

            {/* VIEW DETAILS */}
            <button
              onClick={() =>
                navigate(`/collaboration/project/${c.project_id}`)
              }
              className="mt-4 w-full bg-[#4FA3B5] hover:bg-[#3D91A3] text-white px-3 py-2 rounded text-sm"
            >
              View Project Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
