import { FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Header() {
    const { user } = useAuth();

    const firstName = user?.name?.split(" ")[0] || "there";

    return (
        <header className="flex h-20 items-center justify-between border-b border-[#e5e9e2] bg-[#fbfcfa] px-6 sm:px-8">

            <div>
                <p className="text-sm text-[#879188]">
                    Your garden
                </p>

                <h2 className="text-xl font-semibold text-[#26352a]">
                    Welcome back, {firstName} 🌿
                </h2>
            </div>

            <div className="flex items-center gap-4">

                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e7df] bg-white text-[#657068] hover:bg-[#f3f6f1]">
                    <FiBell size={18} />
                </button>

                <div className="hidden h-9 w-px bg-[#e5e9e2] sm:block" />

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dce9d9] text-sm font-semibold text-[#31553b]">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-[#26352a]">
                            {user?.name}
                        </p>

                        <p className="text-xs text-[#929b94]">
                            Plant keeper
                        </p>
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Header;