import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#f5f6f2] text-[#26352a]">

            <div className="flex min-h-screen">

                <Sidebar />

                <div className="min-w-0 flex-1">

                    <Header />

                    <main className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
                        <Outlet />
                    </main>

                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;