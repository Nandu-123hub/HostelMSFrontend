import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom"; // ✅ added
import API from "../services/api.js";

function Profile() {

  const { getToken } = useAuth();
  const navigate = useNavigate(); // ✅ added

  const [rollNumber, setRollNumber] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [user, setUser] = useState(null);

  // 🔥 FETCH USER
  const fetchUser = async () => {
    const token = await getToken();

    const res = await API.get("/students/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = res.data.data;

    setUser(data);
    setRollNumber(data.rollNumber || "");
    setCourse(data.course || "");
    setYear(data.year || "");
    setPreview(data.profileImage || null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔥 IMAGE PREVIEW
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 🔥 IMAGE UPLOAD
  const uploadImage = async () => {
    if (!file) return alert("Select image first");

    const token = await getToken();

    const formData = new FormData();
    formData.append("image", file);

    await API.post("/students/upload-image", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Image Uploaded ✅");

    // 🔥 IMPORTANT: trigger navbar refresh
    navigate("/");
  };

  // 🔥 UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();

    await API.put(
      "/students/profile",
      { rollNumber, course, year },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Profile updated ✅");

    // 🔥 IMPORTANT: trigger navbar refresh
    navigate("/");
  };

  if (!user) return null;

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-6 text-white">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Profile
      </h1>

      {/* PROFILE IMAGE */}
      <div className="flex flex-col items-center mb-6">

        <img
          src={preview || "https://via.placeholder.com/120"}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-indigo-400 shadow-lg"
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="mt-3 text-sm text-gray-300"
        />

        <button
          onClick={uploadImage}
          className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition"
        >
          Upload Image
        </button>

      </div>

      {/* STUDENT FORM */}
      {user.role === "student" && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="bg-white/10 border border-white/20 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="bg-white/10 border border-white/20 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white/10 border border-white/20 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 rounded-lg hover:opacity-90 transition">
            Save Profile
          </button>

        </form>
      )}

      {user.role === "admin" && (
        <p className="text-center text-gray-300">
          Admin Profile
        </p>
      )}

    </div>
  </div>
);
}

export default Profile;