import { useEffect, useState } from "react";
import API from "../services/api.js";
import RoomCard from "../components/RoomCard";
import { useAuth } from "@clerk/clerk-react";

function Rooms() {
  const { getToken } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 loading

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await API.get("/rooms", config);
      const studentRes = await API.get("/students/me", config);

      const studentData = studentRes.data.data;
      setStudent(studentData);

      if (studentData.role === "admin") {
        setRooms(res.data.data);
      } else {
        if (studentData.room) {
          setRooms([studentData.room]);
        } else {
          setRooms([]);
        }
      }

    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        {student?.role === "admin" ? "All Rooms" : "My Room"}
      </h1>

      {/* 🔄 LOADING STATE */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-[#0f172a] animate-pulse border border-white/10"
            />
          ))}
        </div>
      )}

      {/* 👨‍💼 ADMIN VIEW */}
      {!loading && student?.role === "admin" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))
          ) : (
            <p className="text-gray-400">No rooms found</p>
          )}
        </div>
      )}

      {/* 👨‍🎓 STUDENT VIEW */}
      {!loading && student?.role === "student" && (
        <div className="max-w-md">

          {student?.room ? (
            <div className="bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">

              <h2 className="text-2xl font-semibold mb-3 text-white">
                Room {student.room.roomNumber}
              </h2>

              <div className="text-gray-400 space-y-1 text-sm">
                <p>Floor: {student.room.floor}</p>
                <p>Capacity: {student.room.capacity}</p>
              </div>

              <span className="inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full 
                bg-green-500/20 text-green-400 border border-green-500/30">
                Assigned
              </span>

            </div>
          ) : (
            <div className="text-gray-400 bg-[#0f172a] border border-white/10 p-6 rounded-xl">
              No room assigned
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Rooms;