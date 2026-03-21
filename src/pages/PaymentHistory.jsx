import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api.js";
import jsPDF from "jspdf";

function PaymentHistory() {
  const { getToken } = useAuth();
  const [payments, setPayments] = useState([]);

  const fetchHistory = async () => {
    const token = await getToken();

    const res = await API.get("/fees/history", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setPayments(res.data.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const numberToWords = (num) => {
    return `${num} Rupees Only`;
  };

 const downloadReceipt = (payment) => {
  const doc = new jsPDF();
  doc.setFillColor(2, 6, 23);
  doc.rect(0, 0, 210, 297, "F");

  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 28, "F");


  doc.setFont("helvetica", "bold"); 
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("PAYMENT RECEIPT", 105, 16, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Hostel Management System", 105, 23, { align: "center" });

  // 💰 AMOUNT BOX
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(10, 35, 190, 22, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Amount Paid: Rs.${payment.amount}`, 15, 48);

  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.text(
    `Amount in words: ${numberToWords(payment.amount)}`,
    15,
    55
  );

  const sectionHeader = (title, y) => {
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(10, y, 190, 8, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(title, 15, y + 6);
  };

  // 📄 TRANSACTION
  sectionHeader("Transaction Details", 65);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 220);
  doc.setFontSize(10);

  doc.text(`Status: SUCCESSFUL`, 15, 78);
  doc.text(
    `Date: ${new Date(payment.paidAt).toLocaleString()}`,
    15,
    85
  );
  doc.text(`Transaction ID: ${payment.paymentId}`, 15, 92);

  // 👤 STUDENT
  sectionHeader("Student Details", 100);

  doc.setFont("helvetica", "normal");

  doc.text(`Name: ${payment.student?.name || "-"}`, 15, 113);
  doc.text(`Course: ${payment.student?.course || "-"}`, 15, 120);
  doc.text(`Year: ${payment.student?.year || "-"}`, 15, 127);
  doc.text(`Roll No: ${payment.student?.rollNumber || "-"}`, 15, 134);

  // 📊 SUMMARY
  sectionHeader("Payment Summary", 142);

  doc.setFont("helvetica", "bold");

  doc.text(`Total: Rs.${payment.amount}`, 15, 155);
  doc.text(`Net Total: Rs.${payment.amount}`, 15, 162);

  // ✨ FOOTER
  doc.setDrawColor(80);
  doc.line(10, 175, 200, 175);

  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);

  doc.text("This is a computer-generated receipt.", 15, 183);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    15,
    189
  );

  doc.save("Receipt.pdf");
};
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">

      <h1 className="text-3xl font-bold mb-8 text-white">
        Payment History
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {payments.map((p) => (
          <div
            key={p._id}
            className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 hover:scale-[1.03] hover:border-indigo-400/40 transition duration-300"
          >

            <p className="text-2xl font-bold text-green-400 mb-2">
              ₹{p.amount}
            </p>

            <p className="text-sm text-gray-300 mb-1">
              🧾 {p.paymentId}
            </p>

            <p className="text-sm text-gray-400 mb-4">
              📅 {new Date(p.paidAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => downloadReceipt(p)}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2 rounded-lg shadow-lg hover:scale-[1.02] hover:opacity-95 transition"
            >
              Download Receipt
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default PaymentHistory;