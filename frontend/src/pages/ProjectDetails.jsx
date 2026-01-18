import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#F4FBFD] p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Details</h1>
      <p className="text-gray-600 mb-4">Details for project ID: {id}</p>

      <div className="bg-white p-6 rounded-xl shadow border max-w-3xl space-y-4">
        <div>
          <h2 className="font-semibold text-gray-800">Project Name</h2>
          <p className="text-gray-600">Clean River Drive</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600">Monitoring Yamuna River water quality</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Due Date</h2>
          <p className="text-gray-600">2026-03-01</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Stations Assigned</h2>
          <ul className="text-gray-600 list-disc list-inside">
            <li>Station Alpha - Chennai River</li>
            <li>Station Beta - Bangalore Lake</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
