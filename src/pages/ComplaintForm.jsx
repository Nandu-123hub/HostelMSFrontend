import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api.js";

function ComplaintForm() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      await API.post("/complaints", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setForm({ title: "", description: "" });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-semibold mb-6 text-white">
          Raise Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-transparent border border-white/10 p-3 rounded focus:outline-none focus:border-purple-500 text-white"
            required
          />

          <textarea
            name="description"
            placeholder="Describe your issue..."
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-transparent border border-white/10 p-3 rounded focus:outline-none focus:border-purple-500 text-white"
            required
          />

          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-2 rounded-lg font-medium hover:opacity-90 transition">
            Submit Complaint
          </button>

        </form>

      </div>
    </div>
  );
}

export default ComplaintForm;