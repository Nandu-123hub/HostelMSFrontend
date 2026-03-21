import { useEffect, useState } from "react";
import API from "../services/api.js";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

function AdminPanel() {
  const { getToken } = useAuth();

  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setfloor] = useState("");
  const [capacity, setCapacity] = useState("");

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");

  const [feeStudentId, setFeeStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const studentsRes = await API.get("/students", config);
      const roomsRes = await API.get("/rooms", config);

      const onlyStudents = studentsRes.data.data.filter(
        (user) => user.role === "student"
      );

      setStudents(onlyStudents);
      setRooms(roomsRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();

      await API.post(
        "/rooms",
        { roomNumber, floor, capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRoomNumber("");
      setfloor("");
      setCapacity("");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const assignRoom = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();

      await API.post(
        "/students/assign-room",
        { studentId, roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudentId("");
      setRoomId("");
      alert("Room alloted Successfully")
    } catch (error) {
      console.error(error);
    }
  };

  const createFee = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();

      await API.post(
        "/fees/fees",
        { studentId: feeStudentId, amount, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeeStudentId("");
      setAmount("");
      setDueDate("");
      alert("Fee created Successsfully")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SignedIn>

        <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

          <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>

          {loading && (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 bg-[#0f172a] rounded-xl animate-pulse border border-white/10" />
              ))}
            </div>
          )}

          {!loading && (
            <div className="grid md:grid-cols-2 gap-8">

              <div className="bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-5">Add New Room</h2>

                <form onSubmit={createRoom} className="flex flex-col gap-4">

                  <input
                    type="text"
                    placeholder="Room Number"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="bg-transparent border border-white/10 p-2 rounded focus:outline-none focus:border-purple-500"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Floor"
                    value={floor}
                    onChange={(e) => setfloor(e.target.value)}
                    className="bg-transparent border border-white/10 p-2 rounded focus:outline-none focus:border-purple-500"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="bg-transparent border border-white/10 p-2 rounded focus:outline-none focus:border-purple-500"
                    required
                  />

                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 py-2 rounded-lg font-medium hover:opacity-90 transition">
                    Create Room
                  </button>

                </form>
              </div>

              <div className="bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-5">Assign Room</h2>

                <form onSubmit={assignRoom} className="flex flex-col gap-4">

                <select
  value={studentId}
  onChange={(e) => setStudentId(e.target.value)}
  className="w-full bg-[#0f172a] text-white border border-white/10 p-2 rounded-lg focus:outline-none focus:border-purple-500"
  required
>
  <option value="" className="bg-[#0f172a] text-gray-400">
    Select Student
  </option>

  {students.map((s) => (
    <option
      key={s._id}
      value={s._id}
      className="bg-[#0f172a] text-white"
    >
      {s.name} ({s.email})
    </option>
  ))}
</select>

<select
  value={roomId}
  onChange={(e) => setRoomId(e.target.value)}
  className="w-full bg-[#0f172a] text-white border border-white/10 p-2 rounded-lg focus:outline-none focus:border-purple-500"
  required
>
  <option value="" className="bg-[#0f172a] text-gray-400">
    Select Room
  </option>

  {rooms.map((r) => (
    <option
      key={r._id}
      value={r._id}
      className="bg-[#0f172a] text-white"
    >
      Room {r.roomNumber} (Floor {r.floor})
    </option>
  ))}
</select>

                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 py-2 rounded-lg font-medium hover:opacity-90 transition">
                    Assign Room
                  </button>

                </form>
              </div>

              <div className="bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg md:col-span-2">
                <h2 className="text-xl font-semibold mb-5">Add Fee</h2>

                <form onSubmit={createFee} className="grid md:grid-cols-3 gap-4">

                  <select
  value={feeStudentId}
  onChange={(e) => setFeeStudentId(e.target.value)}
  className="w-full bg-[#0f172a] text-white border border-white/10 p-2 rounded-lg focus:outline-none focus:border-purple-500"
  style={{ colorScheme: "dark" }}
  required
>
  <option value="" className="bg-[#0f172a] text-gray-400">
    Select Student
  </option>

  {students.map((s) => (
    <option
      key={s._id}
      value={s._id}
      className="bg-[#0f172a] text-white"
    >
      {s.name}
    </option>
  ))}
</select>

                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent border border-white/10 p-2 rounded focus:outline-none focus:border-purple-500"
                    required
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-transparent border border-white/10 p-2 rounded focus:outline-none focus:border-purple-500"
                    required
                  />

                  <button className="md:col-span-3 bg-gradient-to-r from-purple-600 to-blue-600 py-2 rounded-lg font-medium hover:opacity-90 transition">
                    Add Fee
                  </button>

                </form>
              </div>

            </div>
          )}

        </div>

      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default AdminPanel;