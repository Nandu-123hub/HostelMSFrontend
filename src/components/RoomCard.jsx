import { useNavigate } from "react-router-dom";

function RoomCard({ room }) {
  const navigate = useNavigate();

  const occupied = room.occupants?.length || 0;
  const capacity = room.capacity;
  const isFull = occupied >= capacity;
  const percentage = capacity ? (occupied / capacity) * 100 : 0;

  return (
    <div className="bg-[#0f172a]/70 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg 
                    hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">

      {/* 🔝 HEADER */}
      <h2 className="text-xl font-semibold text-white mb-2">
        Room {room.roomNumber}
      </h2>

      {/* 📄 DETAILS */}
      <div className="text-gray-400 text-sm space-y-1">
        <p>Floor: {room.floor}</p>
        <p>Capacity: {capacity}</p>
      </div>

      {/* 📊 OCCUPANCY */}
      <p className="mt-4 text-sm text-gray-300 font-medium">
        Occupancy: {occupied} / {capacity}
      </p>

      {/* 🔥 PROGRESS BAR */}
      <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isFull
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-purple-500 to-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* 🟢 STATUS */}
      <span
        className={`inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full 
        ${
          isFull
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : "bg-green-500/20 text-green-400 border border-green-500/30"
        }`}
      >
        {isFull ? "Full" : "Available"}
      </span>

      {/* 🔘 BUTTON */}
      <div className="mt-5">
        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
                     text-white py-2 rounded-lg font-medium 
                     hover:opacity-90 transition shadow-md"
        >
          View Details
        </button>
      </div>

    </div>
  );
}

export default RoomCard;