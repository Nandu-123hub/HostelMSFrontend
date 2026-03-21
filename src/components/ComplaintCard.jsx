function ComplaintCard({ complaint }) {

  const statusStyles = {
    Pending: "bg-red-500/20 text-red-400 border border-red-500/30",
    "In Progress": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Resolved: "bg-green-500/20 text-green-400 border border-green-500/30"
  };

  return (
    <div className="bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-5 shadow-lg 
                    hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-white mb-2">
        {complaint.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {complaint.description}
      </p>

      {/* STATUS */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[complaint.status]}`}
      >
        {complaint.status}
      </span>

    </div>
  );
}

export default ComplaintCard;