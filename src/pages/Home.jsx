import hostelImage from "../assets/hostel.png";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api.js";

function Home() {
  const { isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(null);

  // 🔥 FETCH USER + REQUEST
  const fetchUser = async () => {
    try {
      const token = await getToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await API.get("/students/me", config);
      const reqRes = await API.get("/requests/my", config);

      setUser(res.data.data);
      setRequest(reqRes.data.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchUser();
  }, [isSignedIn]);

  // 🔔 ALERT WHEN APPROVED (ONLY ONCE)
  useEffect(() => {
    if (
      request?.status === "Approved" &&
      !localStorage.getItem("requestApprovedShown")
    ) {
      alert("🎉 Your request for room has been approved!");

      localStorage.setItem("requestApprovedShown", "true");
    }
  }, [request]);

  // 🔐 PROTECTED ROUTE
  const handleProtectedRoute = (path) => {
    if (!isSignedIn) {
      navigate("/sign-in");
    } else {
      navigate(path);
    }
  };

  // 🚀 REQUEST ROOM
  const handleRequestRoom = async () => {
    try {
      const token = await getToken();

      await API.post(
        "/requests",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Room Request Sent ✅");

      // 🔄 RESET ALERT FLAG
      localStorage.removeItem("requestApprovedShown");

      fetchUser(); // refresh

    } catch (error) {
      console.error(error);
      alert("Request failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">

      <img
        src={hostelImage}
        alt="Hostel"
        className="w-full max-h-[400px] object-cover rounded-lg shadow-md mb-8"
      />

      <h1 className="text-4xl font-bold mb-4 text-white">
        Hostel Management System
      </h1>

      <p className="text-gray-400 max-w-2xl mb-6">
        A modern platform to manage hostel rooms, students, complaints,
        and fees efficiently.
      </p>

      {/* 🔹 BUTTONS */}
      <div className="flex gap-4 flex-wrap justify-center">

        <button
          onClick={() => handleProtectedRoute("/dashboard")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg"
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => handleProtectedRoute("/rooms")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg"
        >
          View Rooms
        </button>

        {/* 🔥 REQUEST ROOM BUTTON */}
        {user?.role === "student" &&
  !user?.room &&
  (!request || request.status === "Rejected") && (
    <button
      onClick={handleRequestRoom}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
    >
      Request Room
    </button>
)}

      </div>

    </div>
  );
}

export default Home;