import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ngoService from "../services/ngoService";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await ngoService.getProjectDetails(projectId);
        setProject(data.project);
        setNgo(data.ngo);
        setReports(data.reports || []);
      } catch (e) {
        alert("Failed to load project details");
        navigate("/ngo/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId, navigate]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-6 text-red-500">Project not found</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-gray-800">

      {/* ===== HEADER (KEEP AS IS) ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-8 shadow">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="opacity-90">{project.description}</p>
        <button
          onClick={() => navigate("/ngo/dashboard")}
          className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
        >
          ← Back to NGO Dashboard
        </button>
      </div>

      {/* ===== NGO DETAILS ===== */}
      {ngo && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">NGO Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">NGO Name</p>
              <p className="font-medium text-gray-800">{ngo.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-800">{ngo.location}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{ngo.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== PROJECT DETAILS ===== */}
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

      {/* ===== REPORTS ===== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Reports</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm">No reports available</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">#{r.id}</td>
                  <td className="p-2">{r.description}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">
                    {new Date(r.created_at).toLocaleDateString()}
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
