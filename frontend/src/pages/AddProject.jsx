import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NgoDashboard() {
  const BACKEND_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();
  const ngoId = localStorage.getItem("ngo_id"); // your NGO id

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/ngo/projects?ngo_id=${ngoId}`);
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>

      <button
        onClick={() => navigate("/add-project")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Project
      </button>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((proj) => (
            <li key={proj.id} className="border p-3 rounded">
              <h2 className="font-semibold">{proj.name}</h2>
              <p>{proj.description}</p>
              <p className="text-sm text-gray-500">Due: {proj.due_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
