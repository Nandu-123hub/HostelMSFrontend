import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="h-screen w-64 bg-slate-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-8">HostelMS</h2>

      <ul className="space-y-4">

        <li>
          <Link 
            to="/dashboard"
            className="block p-2 rounded hover:bg-slate-700"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link 
            to="/rooms"
            className="block p-2 rounded hover:bg-slate-700"
          >
            Rooms
          </Link>
        </li>

        <li>
          <Link 
            to="/complaints"
            className="block p-2 rounded hover:bg-slate-700"
          >
            Complaints
          </Link>
        </li>

        <li>
          <Link 
            to="/fees"
            className="block p-2 rounded hover:bg-slate-700"
          >
            Fees
          </Link>
        </li>

        <li>
          <Link 
            to="/admin"
            className="block p-2 rounded hover:bg-slate-700"
          >
            Admin Panel
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;