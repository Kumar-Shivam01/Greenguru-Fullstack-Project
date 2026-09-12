import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../api/userApi";

const AccountPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn: getUserData
    })
    const user = data?.data
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center ">
                <p className="text-sm text-[#6f7d72]">Loading your Account...</p>
            </div>
        )
    }
    if (isError) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-red-600">
                    Unable to load your account information.
                </p>
            </div>
        )
    }
    return (
        <div className="space-y-8">
            {/* Page heading */}
            <div>
                <p className="text-sm font-medium text-[#78917c]">
                    Your GreenGuru profile
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#26352a]">
                    Account
                </h1>

                <p className="mt-2 text-sm text-[#718077]">
                    Manage your account information and security.
                </p>
            </div>

            {/* Profile card */}
            <section className="rounded-2xl border border-[#e3e6df] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dfe9df] text-xl font-semibold text-[#47634d]">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[#26352a]">
                            {user?.name || "User"}
                        </h2>

                        <p className="mt-1 text-sm text-[#718077]">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </section>

            {/* Account information */}
            <section className="rounded-2xl border border-[#e3e6df] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#26352a]">
                    Account information
                </h2>

                <div className="mt-6 space-y-5">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#8a968d]">
                            Name
                        </p>
                        <p className="mt-1 text-sm text-[#344238]">
                            {user?.name || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#8a968d]">
                            Email
                        </p>
                        <p className="mt-1 text-sm text-[#344238]">
                            {user?.email || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#8a968d]">
                            Account status
                        </p>

                        <div className="mt-2">
                            {user?.isAccountVerified ? (
                                <span className="inline-flex rounded-full bg-[#e5f1e6] px-3 py-1 text-xs font-medium text-[#47704d]">
                                    Verified
                                </span>
                            ) : (
                                <span className="inline-flex rounded-full bg-[#f8eee0] px-3 py-1 text-xs font-medium text-[#9a6a32]">
                                    Not verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-[#e3e6df] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#26352a]">
                    Security
                </h2>

                <p className="mt-2 text-sm text-[#718077]">
                    Keep your GreenGuru account secure.
                </p>

                <button
                    type="button"
                    className="mt-5 rounded-xl border border-[#cfd8cf] px-4 py-2.5 text-sm font-medium text-[#405247] transition hover:bg-[#f5f7f3]"
                >
                    Change password
                </button>
            </section>
        </div>
    )
}
export default AccountPage