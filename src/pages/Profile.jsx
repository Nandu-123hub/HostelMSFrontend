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
          src={preview || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEX///+8vLz09PS4uLj39/e9vb3AwMD6+vri4uLy8vLq6uru7u7Gxsbn5+f5+fnV1dXa2trNzc3e3t7KysoltUdvAAAGyElEQVR4nO2d27qrKgyFKwePVWp9/3fdntpZW1QGNWDXzn+xrtanjiYkAQLzcmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYJjyNqMo6H6jLSmSxP+dIsiI3XSqfJNO/aWfy4veFitwM2hIrg9DU5Cr2R/pTDup6Jdou8KkzNWXsT/WhbJMV09lUJu2PiSwMIO9hSiNif7Yz9RWVN4u81rE/3Yk89dM3akzz2J+/Sw675wt6GJHn1lh/Yb+nHfV5fbXox992ZnDUeC1iS7FjvrffU6OJLcZCeZi8UWJyuvxojnHQF43nMqM4IMJ8kJ6oAsgJ9PXI0ySOA0PMm8RzeGrmWaM5SbzGVtfTpGT6BtImtsCCzoATMnK8qY5OEu/oRFaRBdITU2IQgTGtSD4GH8hIlbgKpG8gSkTNaEPMkjTGwuo1oMAkiZD6yUo1O+ELOKJie0Ni4DJchBYYvLihLUbtpCEFBh6EMwGHYpBa5pOAtU0UfQOhBJpYAkOljGDlqEVimAI1bDGzJEhpU8czYW/EEHsavgW3Hjfuk7lPwZcASTGXfhJl0t7qqhBKiKq+IVvgy8fQF2/4Rw3G06ZUjfhDqdJoP5HUAnOPb5JpPpjuDSV8dos1uRF9CtJcfeobNTa5h8cTj0Q8kMrWLm+2I17hEodTPBfmzbrAngZ3e9KcCJczutqw4GTGCvVU0sIGrUjTHXkT4NgmrU5BgdpJIC6RTmAJOmnhqLACFdLt8bfYh9SOAoUCQ3RLphATaLaj6EKiwWpBKoGYk6Z7UfQVbJ+VzE0Nslfo7qMjmJ9SRVPod+7cfXT00w55OFHlBq0CyxISKAQyBDTR6jC0kH9FRuFoRKAgpJpgALlCJ3dY4R35AWkGIjIMpWuyfwFRSDIQM8hJsTgzGhGZt0iKHdMKSco31El7bohCigV+ZCIHJsMJJCWShBpk5uQzDLGBSBFqoJTsI1AgL+gIFCKhFKpJHyjoDQQKSfP9QAMtAh0vEEsWXjaMnC6gOECukKIyhXa2Uzzhg3NEgoQITX+1lw2RaT7BJBibonoIxPIhwco3NHeSlYdAaBwQFDVYmxc8eQKnTxQzREzh1nbMmkJsrTK2Qo9QAwWa+ArhZRqhsLVKAi9Fl6XhVQx0Qf1wheieBWrDAns8QT5Eu/XAWb66Yc8nqGngnllSE1L000JziwED7Vuge68US1HgJ2DhFB3lJNtPcJ8JkhPhrhOKOT60TjPivDkDZorx2QQKPTpfHPdIG4+2cYq1No+WPXlzkdiAiWKEYr3UpzVYOmRFHwvSrHnD6WL8kt3qTbVezyU56eV3iiSttjxVVenePVL2p1II9G3Rl2alNfHRuOfTkUuzf+h7mMveXjo2mHo20VJ1Civv7myZ3oo3QypV3Lwv06Dax//qOJe83krRqBlR3r66iYGqi/bLszJSpl1rerr0m8ukBqj6afDy+JVHQDnguAZd657Px8idWxcc7h38hEog2Js4XRYotq7fk4kRNV520/Umgsth2hTNmPTmoLmwlJ5DbP8fCvDoBWF/KeKmMrk/sqBSdauXJ4F659Vt/cggStwToK4n7BEGoqk0iyyvVHVvr3q+o1Vf23u1SJDQsQTKPm/X5SjZFR9VjFKNEkVVDWefGssRmqJzfTjpoW7HbdqdQxZWlOvRC9oziC4r37KzlqEOGkXnUIhTH0Hcr9zk3WeLe8Jluk99AnF/glH7GXA24+7lhPQHEPd+4c8Qg0ksdrxEUwvcMaJXm8kbm9EsxAUgG7+x7A4QuNXUroNcjrERTg8ROEhcfUWQs9zrOfEggX1IXbGiDnTV0Fph49H5vMZaA1ioO2rsh5Tczhq6Yh3t4a5Ssr7dqy14FfuOaSiBth1vWR41CGcsc9GQd++9z6K0ywYFxufGftjrvt6HiUcP1K7EZUANkwr/eIunrgd+MZbxLPRFpvnrEpr8qtpeZVFbhL82+XXVoT0uE77SvKzCxbg0+S8p0/jowJ/AKFcmp7OfypzER3vUcyIT5e7LSzO//ogZ0wrPIxiRboQWQ7TRXh3Prky1Raw7aOfahijMTIydNpGvSj64Hn2nkJGvuy4kqQmHjBFXYG9FylE4UEUW2EOsMLa8gX9e4OVCmA9jS3tAFWxO9NcRs39d4IXCU0/3hx+PNuO5DDhxpBlPZ8CJ7DCNZzTgxDFB9bz6Br4fjqfJgat8Z8fz6xvIlO+M6tz++YpXzFG/o28EHJC/Jm/C2ZLNT8qbyCz9Xe/G+2F5D9ZkNr9sOytZljXZROxPYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYZj/Kf8BOmBwd1q6aqUAAAAASUVORK5CYII="}
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