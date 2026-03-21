import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api.js";

function Complaints() {
  const { getToken } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [student, setStudent] = useState(null);

  const fetchData = async () => {
    try {
      const token = await getToken();

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const complaintsRes = await API.get("/complaints", config);
      const studentRes = await API.get("/students/me", config);

      setComplaints(complaintsRes.data.data);
      setStudent(studentRes.data.data);

    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = await getToken();

      await API.put(`/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchData();

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        Complaints
      </h1>

      <div className="grid gap-6">

        {complaints.map((c) => (
          <div key={c._id} className="bg-[#0f172a]/70 border border-white/10 rounded-xl p-5 shadow-lg">

            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-gray-400 text-sm mt-1">{c.description}</p>

            <p className="mt-3 text-sm">
              Status:{" "}
              <span className={
                c.status === "Pending"
                  ? "text-red-400"
                  : c.status === "In Progress"
                  ? "text-yellow-400"
                  : "text-green-400"
              }>
                {c.status}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {c.student?.name} • Room {c.student?.room?.roomNumber || "-"}
            </p>

           {student?.role === "admin" && (
  <div className="mt-4 flex gap-2">

    <button
      onClick={() => updateStatus(c._id, "Resolved")}
      disabled={c.status === "Resolved"}
      className={`px-3 py-1 rounded border 
        ${c.status === "Resolved"
          ? "bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed"
          : "bg-green-500/20 text-green-400 border-green-500/30"
        }`}
    >
      Resolve
    </button>

    <button
      onClick={() => updateStatus(c._id, "Pending")}
      disabled={c.status === "Resolved"}
      className={`px-3 py-1 rounded border 
        ${c.status === "Resolved"
          ? "bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed"
          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        }`}
    >
      Pending
    </button>

  </div>
)}

          </div>
        ))}

      </div>
    </div>
  );
}

export default Complaints;