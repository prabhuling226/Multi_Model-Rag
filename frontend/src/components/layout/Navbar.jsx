import { FiBell, FiSearch } from "react-icons/fi";

function Navbar() {
    return (
        <header className="bg-white h-20 px-8 border-b border-[#E8DDD0] flex items-center justify-between">

            <div className="relative w-96">

                <FiSearch className="absolute left-4 top-4 text-gray-400" />

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E8DDD0] outline-none"
                />

            </div>

            <div className="flex items-center gap-6">

                <FiBell size={22} />

                <div className="w-10 h-10 rounded-full bg-[#25211E] text-white flex items-center justify-center">

                    P

                </div>

            </div>

        </header>
    );
}

export default Navbar;