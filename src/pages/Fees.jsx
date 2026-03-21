import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api";

function Fees() {
  const { getToken } = useAuth();
  const [fees, setFees] = useState([]);
  const [user, setUser] = useState(null);

  const fetchFees = async () => {
    const token = await getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const res = await API.get("/fees/fees", config);
    const userRes = await API.get("/students/me", config);

    setFees(res.data.data);
    setUser(userRes.data.data);
  };

  const payFee = async (feeId) => {
    const token = await getToken();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const { data } = await API.post(
      "/fees/create-order",
      { feeId },
      config
    );

    const { order } = data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "HostelMS",
      description: "Hostel Fee Payment",
      order_id: order.id,

      handler: async function (response) {
        await API.post(
          "/fees/verify",
          {
            ...response,
            feeId
          },
          config
        );

        alert("Payment Successful ✅");
        fetchFees();
      },

      theme: {
        color: "#6366f1"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">

      <h1 className="text-3xl font-bold mb-8 text-white">
        Fees
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {fees.map((f) => (
          <div
            key={f._id}
            className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:scale-[1.03] hover:border-indigo-400/40 transition duration-300"
          >

            {user?.role === "admin" && (
              <p className="text-sm text-gray-300 mb-2">
                👤 {f.student?.name}
              </p>
            )}

            <p className="text-3xl font-bold text-white mb-2">
              ₹ {f.amount}
            </p>

            <p className="mb-2 text-gray-300">
              Status:
              <span
                className={`ml-2 font-semibold ${
                  f.status === "Pending"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {f.status}
              </span>
            </p>

            <p className="text-sm text-gray-400 mb-4">
              Due: {new Date(f.dueDate).toLocaleDateString()}
            </p>

            {user?.role === "student" && f.status === "Pending" && (
              <button
                onClick={() => payFee(f._id)}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2 rounded-lg shadow-lg hover:scale-[1.02] hover:opacity-95 transition"
              >
                Pay Now
              </button>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}

export default Fees;