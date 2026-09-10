import { FiBell, FiSearch, FiSun, FiCalendar, FiFeather } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Header() {
    const { user } = useAuth();

    const firstName = user?.name?.split(" ")[0] || "there";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="relative h-28 border-b border-stone-200/60 bg-white/70 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute top-0 left-1/3 w-48 h-48 bg-gradient-to-br from-green-100/40 to-transparent rounded-full -translate-y-1/2 blur-2xl" />

            <div className="relative z-10 h-full flex items-center justify-between px-6 sm:px-10">

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 ring-1 ring-emerald-100">
                            <FiCalendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                Today
                            </p>
                            <p className="text-sm font-bold text-forest-800">
                                {today}
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-500 ring-1 ring-amber-100">
                            <FiSun className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                Lighting
                            </p>
                            <p className="text-sm font-bold text-forest-800">
                                Bright & Sunny ☀️
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">

                    <div className="hidden xl:flex items-center gap-3 rounded-2xl bg-stone-100/60 ring-1 ring-stone-200/60 px-4 py-2.5 w-72 hover:ring-emerald-200 hover:bg-white transition-all">
                        <FiSearch className="h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search plants, tips..."
                            className="bg-transparent text-sm font-medium text-forest-800 placeholder:text-stone-400 w-full outline-none"
                        />
                        <kbd className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white ring-1 ring-stone-200 text-stone-400">
                            ⌘K
                        </kbd>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 ring-1 ring-emerald-100/60 px-4 py-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-xl gradient-hero text-white">
                            <FiFeather className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                Garden Score
                            </p>
                            <p className="text-sm font-bold text-emerald-800 leading-none">
                                87<span className="text-emerald-500 text-xs">/100</span>
                            </p>
                        </div>
                    </div>

                    <button className="relative group flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-stone-200/60 text-stone-500 hover:ring-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700 transition-all">
                        <FiBell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                    </button>

                    <div className="hidden h-9 w-px bg-stone-200 sm:block" />

                    <div className="flex items-center gap-3 pl-1">
                        <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-hero text-sm font-bold text-white shadow-lg shadow-emerald-900/20 ring-2 ring-white">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                                <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                        </div>

                        <div className="hidden md:block pr-2">
                            <p className="text-sm font-bold text-forest-800 leading-tight">
                                {user?.name || firstName}
                            </p>

                            <p className="text-xs font-medium text-stone-500 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Plant Keeper
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;