import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiFeather } from "react-icons/fi";
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
        <main className="min-h-screen flex items-stretch overflow-hidden bg-gradient-to-br from-emerald-50 via-stone-50 to-green-50">
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
                                Join thousands of plant parents who keep their plants happy and healthy with smart AI-powered care guidance.
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
                            Welcome back
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight text-forest-800">
                            Sign in to your <span className="gradient-text">garden</span>
                        </h1>
                        <p className="text-forest-500 mt-2">
                            Continue caring for your plants and watch them thrive 🌿
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
                                <a
                                    href="#"
                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Forgot password?
                                </a>
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
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">or continue with</span>
                        <div className="flex-1 h-px bg-stone-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 bg-white px-4 py-3 font-medium text-forest-700 transition-all hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-sm">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 bg-white px-4 py-3 font-medium text-forest-700 transition-all hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-sm">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <div className="text-center rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-green-50/60 p-5">
                        <p className="text-sm text-forest-600">
                            New to GreenGuru?{" "}
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition-colors hover:underline underline-offset-4"
                            >
                                Create an account
                                <FiArrowRight className="h-4 w-4" />
                            </Link>
                        </p>
                        <p className="text-xs text-forest-400 mt-2">
                            It's free! Start growing your plant collection today 🌱
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default LoginPage;