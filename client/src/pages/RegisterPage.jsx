import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiFeather, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
    const navigate = useNavigate();
    const {signup } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

        if (!formData.name || !formData.email || !formData.password) {
            setError("Please enter your name email and password.");
            return;
        }

        try {
            setLoading(true);

            await signup(formData);

            navigate("/garden");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to signup. Please check your credentials.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-stretch overflow-hidden bg-linear-to-br from-emerald-50 via-stone-50 to-green-50">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-16 w-72 h-72 rounded-full bg-emerald-400 blur-3xl" />
                    <div className="absolute bottom-32 right-12 w-96 h-96 rounded-full bg-green-300 blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-teal-400 blur-3xl opacity-50" />
                </div>

                <div className="relative z-10 flex flex-col justify-between w-full p-14 text-white">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
                            <FiFeather className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">GreenGuru</h1>
                            <p className="text-sm text-white/70">Plant care assistant</p>
                        </div>
                    </div>

                    <div className="space-y-8 max-w-md">
                        <div className="animate-float">
                            <div className="text-8xl mb-6">🪴</div>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold leading-tight mb-4">
                                Nurture your
                                <span className="block text-emerald-300">green paradise</span>
                            </h2>
                            <p className="text-lg text-white/75 leading-relaxed">
                                Join plant parents who keep their plants happy and healthy with smart AI-powered care guidance.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: "🌿", text: "AI plant identification & health diagnosis" },
                                { icon: "💧", text: "Smart watering reminders & schedules" },
                                { icon: "📋", text: "Personalized care guides for every plant" },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 p-4 transition hover:bg-white/12"
                                >
                                    <div className="text-2xl">{feature.icon}</div>
                                    <p className="text-white/85 font-medium">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-white/50">
                        © 2025 GreenGuru. Made with 💚 for plant lovers everywhere.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 xl:p-14">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-10 text-center">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-hero text-white">
                                <FiFeather className="h-7 w-7" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-forest-700">GreenGuru</h1>
                                <p className="text-xs text-forest-400">Plant care assistant</p>
                            </div>
                        </div>
                        <div className="text-6xl mb-4 animate-float">🌱</div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                            Welcome 
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight text-forest-800">
                            Sign up for your own <span className="gradient-text">garden</span>
                        </h1>
                        <p className="text-forest-500 mt-2">
                            Start caring for your plants and watch them thrive 🌿
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/80 p-4 flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-semibold text-sm">
                                !
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-red-800">
                                    Unable to sign in
                                </p>
                                <p className="text-sm text-red-600/80 mt-0.5">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                       <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-semibold text-forest-700"
                            >
                                Your name
                            </label>
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-forest-400 group-focus-within:text-emerald-600 transition-colors">
                                    <FiUser className="h-5 w-5" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-2xl border-2 border-stone-200 bg-white pl-12 pr-4 py-4 text-forest-800 placeholder:text-stone-400 transition-all duration-200 hover:border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-forest-700"
                            >
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-forest-400 group-focus-within:text-emerald-600 transition-colors">
                                    <FiMail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-2xl border-2 border-stone-200 bg-white pl-12 pr-4 py-4 text-forest-800 placeholder:text-stone-400 transition-all duration-200 hover:border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-forest-700"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-forest-400 group-focus-within:text-emerald-600 transition-colors">
                                    <FiLock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-2xl border-2 border-stone-200 bg-white pl-12 pr-12 py-4 text-forest-800 placeholder:text-stone-400 transition-all duration-200 hover:border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-forest-400 hover:text-emerald-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5" />
                                    ) : (
                                        <FiEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full rounded-2xl gradient-hero px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/25 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing up...
                                    </>
                                ) : (
                                    <>
                                        Sign up
                                        <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider"></span>
                        <div className="flex-1 h-px bg-stone-200" />
                    </div>


                    <div className="text-center rounded-2xl border border-emerald-100 bg-linear-to-r from-emerald-50/60 to-green-50/60 p-5">
                        <p className="text-xs text-forest-400 mt-2">
                            It's free! Start growing your plant collection today 🌱
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RegisterPage;