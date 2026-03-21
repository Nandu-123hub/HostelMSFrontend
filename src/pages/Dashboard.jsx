import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const { getToken } = useAuth();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({ students: 0, rooms: 0, complaints: 0, pending: 0 });
  const [chartData, setChartData] = useState([]);

  const fetchStats = async () => {
    try {
      const token = await getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const studentRes = await API.get("/students/me", config);
      const studentData = studentRes.data.data;
      setStudent(studentData);

      if (studentData.role === "admin") {
        const studentsRes = await API.get("/students", config);
        const roomsRes = await API.get("/rooms", config);
        const complaintsRes = await API.get("/complaints", config);

        const students = studentsRes.data.data.length - 1;
        const rooms = roomsRes.data.data.length;
        const complaints = complaintsRes.data.data.length;

        const pending = complaintsRes.data.data.filter(c => c.status === "Pending").length;
        const resolved = complaints - pending;

        setStats({ students, rooms, complaints, pending });

        setChartData([
          { name: "Pending", value: pending },
          { name: "Resolved", value: resolved }
        ]);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!student) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

      {student.role !== "admin" && (
        <div>
          <h1 className="text-3xl font-bold mb-8">
            Welcome {student.name}
          </h1>

          <div className="bg-[#0f172a]/70 border border-white/10 rounded-xl p-6 w-80">

            <p className="text-gray-400">Your Room</p>

            <p className="text-3xl font-bold mt-2">
              {student?.room ? student.room.roomNumber : "Not Assigned"}
            </p>

          </div>
        </div>
      )}

      {student.role === "admin" && (
        <div>

          <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            {[
              { label: "Students", value: stats.students },
              { label: "Rooms", value: stats.rooms },
              { label: "Complaints", value: stats.complaints },
              { label: "Pending", value: stats.pending }
            ].map((card, i) => (
              <div key={i} className="bg-[#0f172a]/70 border border-white/10 p-6 rounded-xl">
                <p className="text-gray-400">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}

          </div>

          <div className="bg-[#0f172a]/70 border border-white/10 rounded-xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Complaint Analytics
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;