import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api.js";

function RoomRequests() {
  const { getToken } = useAuth();

  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    try {
      const token = await getToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const reqRes = await API.get("/requests", config);
      const payRes = await API.get("/fees/fees", config);
      setRequests(reqRes.data.data);
      setPayments(payRes.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPaymentStatus = (studentId) => {
    
    const payment = payments.find(
      (p) => p.student._id === studentId && p.status === "Paid"
    );
    return payment ? "Paid" : "Pending";
  };

  const handleApprove = async (requestId) => {
  try {
    const token = await getToken();

    await API.put(
      `/requests/approve/${requestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Request Approved ✅");
    fetchData();

  } catch (error) {
    console.error(error);
  }
};

const handleReject = async (requestId) => {
  try {
    const token = await getToken();

    await API.put(
      `/requests/reject/${requestId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Request Rejected ❌");
    fetchData();

  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Room Requests
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {requests.map((req) => {
          const paymentStatus = getPaymentStatus(req.student._id);
          return (
            <div
              key={req._id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition duration-300"
            >
              {/* 👤 STUDENT INFO */}
              <h2 className="text-xl font-semibold mb-2 text-white">
                {req.student.name}
              </h2>

              <p className="text-gray-400 text-sm">
                Roll No: {req.student.rollNumber || "N/A"}
              </p>

              <p className="text-gray-400 text-sm">
                Email: {req.student.email}
              </p>

              {/* 💰 PAYMENT STATUS */}
              <p className="mt-4 text-sm">
                Payment:{" "}
                <span
                  className={`ml-1 font-semibold ${
                    paymentStatus === "Paid"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {paymentStatus}
                </span>
              </p>

              {/* 📌 REQUEST STATUS */}
              <p className="text-xs text-gray-500 mt-1">
                Request: {req.status}
              </p>

              {/* 🔘 ACTION BUTTONS */}
              <div className="mt-5 flex gap-3">

              <button
  onClick={() => handleApprove(req._id)}
  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
    paymentStatus === "Paid" && req.status === "Pending"
      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
      : "bg-gray-600 cursor-not-allowed"
  }`}
  disabled={
    paymentStatus !== "Paid" || req.status !== "Pending"
  }
>
  {req.status === "Approved" ? "Approved" : "Approve"}
</button>

<button
  onClick={() => handleReject(req._id)}
  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
    req.status === "Pending"
      ? "bg-red-500/80 hover:bg-red-600"
      : "bg-gray-600 cursor-not-allowed"
  }`}
  disabled={req.status !== "Pending"}
>
  {req.status === "Rejected" ? "Rejected" : "Reject"}
</button>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default RoomRequests;