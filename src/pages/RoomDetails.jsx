import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api.js";
import {useAuth} from '@clerk/clerk-react'
function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const {getToken}=useAuth()
  const fetchRoom = async () => {
    try {
      const token=await getToken()
      const config={
        headers:{
           Authorization: `Bearer ${token}`
        }
      }
      const res = await API.get(`/rooms/${id}`,config);
      setRoom(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRemove = async (studentId) => {
  try {
    const token=await getToken()
      const config={
        headers:{
           Authorization: `Bearer ${token}`
        }
      }
    await API.post("/students/remove-room", { studentId },config);

    alert("Student removed");

    fetchRoom(); // refresh UI

  } catch (error) {
    console.error(error);
    alert("Error removing student");
  }
};

  useEffect(() => {
    fetchRoom();
  }, []);


  if (!room) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        Room {room.roomNumber}
      </h1>

      <p className="text-gray-600">Floor: {room.floor}</p>
      <p className="text-gray-600">Capacity: {room.capacity}</p>

      <h2 className="text-xl mt-6 mb-2 font-semibold">
        Occupants
      </h2>

      {room.occupants?.length === 0 ? (
        <p>No students assigned</p>
      ) : (
       <ul className="list-disc ml-6">
  {room.occupants.map((student) => (
    <li key={student._id} className="flex justify-between items-center mb-2">

      <span>
        {student.name} ({student.email})
      </span>

      <button
        onClick={() => handleRemove(student._id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Remove
      </button>

    </li>
  ))}
</ul>
      )}

    </div>
  );
}

export default RoomDetails;