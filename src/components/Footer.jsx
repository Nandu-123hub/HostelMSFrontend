function Footer() {
  return (
    <footer className="bg-[#020617] backdrop-blur-lg border-t border-white/10 text-white mt-16">

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* 🔹 BRAND */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            HostelMS
          </h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Smart Hostel Management System  for students managed by me(Admin).
          </p>
        </div>

        {/* 🔹 LINKS */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            {["Home", "Dashboard", "Rooms", "Complaints", "Fees"].map((item) => (
              <li
                key={item}
                className="hover:text-purple-400 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 CONTACT */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Contact</h3>
          <p className="text-gray-400 text-sm mb-2 hover:text-purple-400 transition">
            📧 nandurajiv76@gmail.com
          </p>
          <p className="text-gray-400 text-sm hover:text-purple-400 transition">
            📞 +91 8249146570
          </p>
        </div>

      </div>

      {/* 🔻 BOTTOM */}
      <div className="border-t border-white/10 text-center py-4 text-gray-500 text-sm">
      
        <span className="text-purple-400 font-medium"> HostelMS</span>. By Nandu Rajiv U
      </div>

    </footer>
  );
}

export default Footer;