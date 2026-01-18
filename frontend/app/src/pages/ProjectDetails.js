import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ngoService from "../services/ngoService";
import NGOMap from "../components/NGOMap";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        // ✅ 1. Fetch project + NGO (REQUIRED)
        const projectRes = await ngoService.getProjectDetails(projectId);
        setProject(projectRes.project);
        setNgo(projectRes.ngo);

        // ✅ 2. Fetch stations (OPTIONAL – should not crash page)
        try {
          const stationsRes = await ngoService.getAssignedStations(projectId);
          setStations(stationsRes || []);
        } catch (stationErr) {
          console.warn("Stations not loaded:", stationErr);
          setStations([]);
        }
      } catch (err) {
  console.error("Project API failed:", err);
  alert("Unable to load project. Please login again.");
}
finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-red-500">
        Project not found
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-slate-50 min-h-screen text-gray-800">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-8 shadow">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="opacity-90">{project.description}</p>

        <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(-1);   // 👈 GO BACK IN HISTORY
  }}
  className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
>
  ← Back to NGO Dashboard
</button>



      </div>

      {/* NGO DETAILS */}
      {ngo && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">NGO Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">NGO Name</p>
              <p className="font-medium">{ngo.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{ngo.location}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{ngo.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT TIMELINE */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Project Timeline</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">
              {project.start_date
                ? new Date(project.start_date).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium">
              {project.end_date
                ? new Date(project.end_date).toLocaleDateString()
                : "Ongoing"}
            </p>
          </div>
        </div>
      </div>

      {/* ASSIGNED WATER STATIONS */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Assigned Water Stations
        </h2>

        {/* MAP ALWAYS RENDERS */}
        <div className="h-[400px] rounded-lg overflow-hidden border mb-4">
          <NGOMap stations={stations} />
        </div>

        {stations.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No water stations assigned to this project.
          </p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Station Name</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Managed By</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {stations.map(station => (
                <tr key={station.id} className="border-t">
                  <td className="p-2">{station.name}</td>
                  <td className="p-2">{station.location}</td>
                  <td className="p-2">{station.managed_by}</td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        navigate(`/ngo/water-stations/${station.id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
