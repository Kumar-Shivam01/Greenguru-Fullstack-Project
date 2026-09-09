import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await login(formData);

            navigate("/garden");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to login. Please check your credentials.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f5ef] px-4 py-10">
            <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
                <div className="w-full rounded-3xl border border-[#dfe5dc] bg-white p-8 shadow-xl">
                    <div className="mb-8 text-center">
                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#6d806f]">
                            GreenGuru
                        </p>

                        <h1 className="text-3xl font-semibold text-[#26352a]">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue caring for your plants.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-[#354439]"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-[#d8dfd5] px-4 py-3 outline-none transition focus:border-[#6f8b72] focus:ring-2 focus:ring-[#6f8b72]/20"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-[#354439]"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-[#d8dfd5] px-4 py-3 outline-none transition focus:border-[#6f8b72] focus:ring-2 focus:ring-[#6f8b72]/20"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#354b39] px-4 py-3 font-medium text-white transition hover:bg-[#293c2d] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-[#506b54] hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default LoginPage;