import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPlants, waterPlant } from "../api/plantApi";
import PlantCard from "../components/plants/PlantCard";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter, FiDroplet, FiHeart, FiAlertTriangle, FiLayers, FiGrid } from "react-icons/fi";

function MyGardenPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [healthFilter, setHealthFilter] = useState("all");

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["plants"],
        queryFn: () => getMyPlants(),
    });

    const waterMutation = useMutation({
        mutationFn: (plantId) => waterPlant(plantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plants"] });
        },
    });

    const plants = data?.data?.plants || [];

    const filteredPlants = useMemo(() => {
        return plants.filter((plant) => {
            const searchValue = search.toLowerCase();
            const matchesSearch =
                !searchValue ||
                plant.nickname?.toLowerCase().includes(searchValue) ||
                plant.commonName?.toLowerCase().includes(searchValue) ||
                plant.scientificName?.toLowerCase().includes(searchValue);
            const matchesHealth =
                healthFilter === "all" || plant.healthStatus === healthFilter;
            return matchesSearch && matchesHealth;
        });
    }, [plants, search, healthFilter]);

    const healthyCount = plants.filter((p) => p.healthStatus === "healthy").length;
    const attentionCount = plants.filter((p) => p.healthStatus === "needs-attention").length;
    const sickCount = plants.filter((p) => p.healthStatus === "sick").length;

    const filterOptions = [
        { value: "all", label: "All", count: plants.length, color: "emerald" },
        { value: "healthy", label: "Healthy", count: healthyCount, color: "green" },
        { value: "needs-attention", label: "Needs Care", count: attentionCount, color: "amber" },
        { value: "sick", label: "Sick", count: sickCount, color: "rose" },
        { value: "dormant", label: "Dormant", count: plants.filter((p) => p.healthStatus === "dormant").length, color: "stone" },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-6xl animate-float">🌱</div>
                    <div className="flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-emerald-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-stone-500 font-medium">Preparing your garden...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-red-50/50 p-8 text-center">
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-xl font-bold text-rose-800 mb-2">Oops, something went wrong</h3>
                <p className="text-rose-600 mb-6">Unable to load your plants. Please refresh and try again.</p>
                <button className="rounded-2xl gradient-hero px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Hero Welcome */}
            <section className="relative overflow-hidden rounded-3xl gradient-hero p-8 sm:p-10 text-white shadow-2xl shadow-emerald-900/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-20 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl translate-y-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-5">
                            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Your Green Space</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
                            Welcome to your
                            <span className="block text-emerald-300">plant paradise 🌿</span>
                        </h1>
                        <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                            {plants.length === 0
                                ? "Ready to start your plant journey? Add your first plant and let's begin the green adventure!"
                                : `You're nurturing ${plants.length} beautiful plant${plants.length !== 1 ? "s" : ""}. Keep up the great work, plant parent! 🌱`}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                        <Link
                            to="/plants/new"
                            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-emerald-800 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-hero text-white">
                                <FiPlus className="h-5 w-5" />
                            </span>
                            <div className="text-left">
                                <p className="text-sm">Add New Plant</p>
                                <p className="text-[11px] font-medium text-stone-500">Start growing your collection</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <SummaryCard
                    label="Total Plants"
                    value={plants.length}
                    description="In your collection"
                    icon={<FiLayers className="h-5 w-5" />}
                    gradient="from-emerald-400 to-green-500"
                    bgLight="from-emerald-50 to-green-50"
                    ringColor="ring-emerald-100"
                    iconBg="bg-emerald-100 text-emerald-700"
                />

                <SummaryCard
                    label="Healthy"
                    value={healthyCount}
                    description="Thriving well"
                    icon={<FiHeart className="h-5 w-5" />}
                    gradient="from-green-400 to-emerald-500"
                    bgLight="from-green-50 to-emerald-50"
                    ringColor="ring-green-100"
                    iconBg="bg-green-100 text-green-700"
                />

                <SummaryCard
                    label="Needs Care"
                    value={attentionCount}
                    description="Time to tend"
                    icon={<FiAlertTriangle className="h-5 w-5" />}
                    gradient="from-amber-400 to-orange-500"
                    bgLight="from-amber-50 to-orange-50"
                    ringColor="ring-amber-100"
                    iconBg="bg-amber-100 text-amber-700"
                />

                <SummaryCard
                    label="Sick"
                    value={sickCount}
                    description="Needs treatment"
                    icon={<FiDroplet className="h-5 w-5" />}
                    gradient="from-rose-400 to-red-500"
                    bgLight="from-rose-50 to-red-50"
                    ringColor="ring-rose-100"
                    iconBg="bg-rose-100 text-rose-700"
                />
            </div>

            {/* Plants Section */}
            <section className="space-y-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-700 ring-1 ring-emerald-100">
                            <FiGrid className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-forest-800">
                                Your Plants
                            </h2>
                            <p className="text-sm text-stone-500 font-medium">
                                Showing <span className="text-emerald-700 font-bold">{filteredPlants.length}</span> of <span className="font-bold">{plants.length}</span> plants
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search + Filter chips */}
                <div className="space-y-4 rounded-3xl bg-white/80 backdrop-blur-md ring-1 ring-stone-200/60 p-4 sm:p-6 shadow-xl shadow-stone-900/5">

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-stone-400 group-focus-within:text-emerald-600 transition-colors">
                                <FiSearch className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, species, or nickname..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border-2 border-stone-200/60 bg-stone-50/50 pl-14 pr-5 py-4 text-sm font-medium text-forest-800 placeholder:text-stone-400 transition-all duration-200 hover:border-emerald-200 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-rose-500 transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="inline-flex items-center gap-3 rounded-2xl bg-stone-50/50 ring-1 ring-stone-200/60 px-4 py-2 sm:py-0">
                            <FiFilter className="h-4 w-4 text-stone-400 hidden sm:block" />
                            <div className="flex flex-wrap gap-2 py-2 sm:py-0">
                                {filterOptions.map((opt) => {
                                    const isActive = healthFilter === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setHealthFilter(opt.value)}
                                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                                                isActive
                                                    ? "gradient-hero text-white shadow-md shadow-emerald-900/20 scale-[1.02]"
                                                    : "text-stone-600 hover:bg-white hover:text-forest-800 hover:ring-1 hover:ring-stone-200"
                                            }`}
                                        >
                                            {opt.label}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                isActive ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                                            }`}>
                                                {opt.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plant Grid */}
                {filteredPlants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border-2 border-dashed border-stone-200 bg-white/50 backdrop-blur-sm text-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-3xl scale-150" />
                            <div className="relative text-8xl animate-float">
                                {plants.length === 0 ? "🌱" : "🔍"}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-forest-800 mb-3">
                            {plants.length === 0 ? "Your garden awaits!" : "No plants match your search"}
                        </h3>
                        <p className="text-stone-500 max-w-md mb-8 leading-relaxed">
                            {plants.length === 0
                                ? "Every great garden starts with a single plant. Click below to add your first green friend and begin your plant parent journey!"
                                : "Try clearing your search term or selecting a different filter to find what you're looking for."}
                        </p>
                        {plants.length === 0 ? (
                            <Link
                                to="/plants/new"
                                className="inline-flex items-center gap-3 rounded-2xl gradient-hero px-8 py-4 font-bold text-white shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
                            >
                                <FiPlus className="h-5 w-5" />
                                Add Your First Plant
                            </Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setSearch("")}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-stone-200 px-6 py-3 font-semibold text-forest-800 hover:ring-emerald-200 hover:shadow-md transition-all"
                                >
                                    Clear Search
                                </button>
                                <button
                                    onClick={() => setHealthFilter("all")}
                                    className="inline-flex items-center gap-2 rounded-2xl gradient-hero px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all"
                                >
                                    View All Plants
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {filteredPlants.map((plant, index) => (
                            <div
                                key={plant._id}
                                style={{ animationDelay: `${index * 60}ms` }}
                                className="animate-fade-in-up opacity-0"
                            >
                                <PlantCard
                                    plant={plant}
                                    onWater={(id) => waterMutation.mutate(id)}
                                    isWatering={waterMutation.isPending}
                                />
                            </div>
                        ))}
                    </div>
                )}

            </section>
        </div>
    );
}

function SummaryCard({ label, value, icon, description, gradient, bgLight, ringColor, iconBg }) {
    return (
        <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgLight} ring-1 ${ringColor} p-6 hover-lift`}>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.08] rounded-full blur-2xl group-hover:opacity-[0.15] transition-opacity`} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} ring-1 ring-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${gradient} shadow-sm`} />
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        {label}
                    </p>
                    <p className={`text-4xl font-bold tracking-tight bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                        {value}
                    </p>
                    <p className="text-sm font-medium text-stone-500">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MyGardenPage;