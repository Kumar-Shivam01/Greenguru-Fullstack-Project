import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiPlus,
    FiUser,
    FiLogOut,
    FiFeather,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const { logout, user } = useAuth();

    const linkClasses = ({ isActive }) =>
        `group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
            isActive
                ? "bg-gradient-to-r from-emerald-100/80 to-green-50 text-emerald-800 shadow-sm ring-1 ring-emerald-200/60"
                : "text-stone-600 hover:bg-stone-100/70 hover:text-emerald-800 hover:pl-5"
        }`;

    return (
        <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col border-r border-stone-200/60 bg-gradient-to-b from-white via-stone-50/50 to-emerald-50/30">

            {/* Logo */}
            <div className="flex h-24 items-center gap-4 border-b border-stone-200/60 px-7">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl gradient-hero text-white shadow-lg shadow-emerald-900/20">
                    <FiFeather className="h-6 w-6" />
                    <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                </div>

                <div>
                    <h1 className="text-xl font-bold tracking-tight text-forest-800">
                        GreenGuru
                    </h1>

                    <p className="text-[11px] font-medium text-stone-500">
                        Plant care assistant
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-5 py-8 space-y-7 overflow-y-auto">

                <div className="space-y-2">
                    <p className="px-4 mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        🌿 Garden
                    </p>

                    <NavLink to="/garden" className={linkClasses}>
                        {({ isActive }) => (
                            <>
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                                    isActive ? "gradient-hero text-white shadow-md" : "bg-stone-100 text-stone-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                                }`}>
                                    <FiHome size={18} />
                                </span>
                                <span>My Garden</span>
                                {isActive && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                                )}
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/plants/new" className={linkClasses}>
                        {({ isActive }) => (
                            <>
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                                    isActive ? "gradient-hero text-white shadow-md" : "bg-stone-100 text-stone-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                                }`}>
                                    <FiPlus size={18} />
                                </span>
                                <span>Add Plant</span>
                                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200">NEW</span>
                            </>
                        )}
                    </NavLink>
                </div>

                <div className="space-y-2">
                    <p className="px-4 mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        👤 Account
                    </p>

                    <NavLink to="/profile" className={linkClasses}>
                        {({ isActive }) => (
                            <>
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                                    isActive ? "gradient-hero text-white shadow-md" : "bg-stone-100 text-stone-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                                }`}>
                                    <FiUser size={18} />
                                </span>
                                <span>Profile</span>
                                {isActive && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                                )}
                            </>
                        )}
                    </NavLink>
                </div>

                <div className="mx-2 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 p-5 text-white shadow-xl shadow-emerald-900/20 overflow-hidden relative">
                    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10 blur-lg" />
                    <div className="relative z-10">
                        <div className="text-3xl mb-3 animate-float-slow">🌱</div>
                        <p className="text-base font-bold mb-1 leading-tight">Unlock Pro Tips</p>
                        <p className="text-xs text-emerald-100/90 mb-4 leading-relaxed">
                            Get advanced AI diagnostics and expert care plans.
                        </p>
                        <button className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-white transition-all hover:shadow-md">
                            Upgrade Soon
                        </button>
                    </div>
                </div>
            </nav>

            {/* Bottom - User + Sign out */}
            <div className="border-t border-stone-200/60 p-5">

                {user && (
                    <div className="flex items-center gap-3 mb-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-stone-200/50 p-3.5 hover:bg-white transition-all">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-hero text-white font-bold shadow-md shadow-emerald-900/15">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-forest-800 truncate">
                                {user?.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={logout}
                    className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-stone-500 transition-all hover:bg-red-50 hover:text-red-600 hover:pl-5 hover:ring-1 hover:ring-red-100"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-stone-500 group-hover:bg-red-100 group-hover:text-red-600 transition-all">
                        <FiLogOut size={18} />
                    </span>
                    Sign out
                </button>

            </div>
        </aside>
    );
}

export default Sidebar;