import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiPlus,
    FiUser,
    FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const { logout } = useAuth();

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            isActive
                ? "bg-[#e8f0e6] text-[#2f5138]"
                : "text-[#647066] hover:bg-[#f1f4ef] hover:text-[#2f5138]"
        }`;

    return (
        <aside className="hidden w-64 shrink-0 border-r border-[#e5e9e2] bg-[#fbfcfa] lg:flex lg:flex-col">

            {/* Logo */}
            <div className="flex h-20 items-center gap-3 border-b border-[#e5e9e2] px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#31553b] text-xl text-white">
                </div>

                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-[#26352a]">
                        GreenGuru
                    </h1>

                    <p className="text-[11px] text-[#879188]">
                        Plant care assistant
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-7">

                <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aa39b]">
                    Garden
                </p>

                <div className="space-y-1">
                    <NavLink to="/garden" className={linkClasses}>
                        <FiHome size={18} />
                        My Garden
                    </NavLink>

                    <NavLink to="/plants/new" className={linkClasses}>
                        <FiPlus size={18} />
                        Add Plant
                    </NavLink>
                </div>

                <p className="mb-3 mt-9 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aa39b]">
                    Account
                </p>

                <NavLink to="/profile" className={linkClasses}>
                    <FiUser size={18} />
                    Profile
                </NavLink>

            </nav>

            {/* Bottom */}
            <div className="border-t border-[#e5e9e2] p-4">

                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#788178] transition hover:bg-red-50 hover:text-red-600"
                >
                    <FiLogOut size={18} />
                    Sign out
                </button>

            </div>
        </aside>
    );
}

export default Sidebar;