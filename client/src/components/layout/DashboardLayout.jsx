import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/20 to-green-50/40 text-forest-800">

            <div className="flex min-h-screen">

                <Sidebar />

                <div className="min-w-0 flex-1 relative overflow-hidden">
                    <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                    <div className="pointer-events-none absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-green-100/30 to-transparent rounded-full blur-3xl translate-y-1/2" />

                    <Header />

                    <main className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
                        <Outlet />
                    </main>

                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;