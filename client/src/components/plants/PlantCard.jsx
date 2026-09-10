import { Link } from "react-router-dom";
import { FiArrowUpRight, FiDroplet, FiStar, FiEye } from "react-icons/fi";
import WaterCountdownBadge from "./WaterCountdownBadge";

function getHealthStyles(status) {
    switch (status) {
        case "healthy":
            return {
                badge: "bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 ring-1 ring-green-200/60",
                dot: "bg-gradient-to-br from-green-500 to-emerald-500",
                accent: "from-green-500/10 to-emerald-500/10",
            };
        case "needs-attention":
            return {
                badge: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 ring-1 ring-amber-200/60",
                dot: "bg-gradient-to-br from-amber-500 to-orange-500",
                accent: "from-amber-500/10 to-orange-500/10",
            };
        case "sick":
            return {
                badge: "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 ring-1 ring-rose-200/60",
                dot: "bg-gradient-to-br from-rose-500 to-red-500",
                accent: "from-rose-500/10 to-red-500/10",
            };
        case "dormant":
            return {
                badge: "bg-gradient-to-r from-stone-100 to-slate-100 text-stone-700 ring-1 ring-stone-200/60",
                dot: "bg-gradient-to-br from-stone-400 to-slate-500",
                accent: "from-stone-400/10 to-slate-500/10",
            };
        default:
            return {
                badge: "bg-stone-100 text-stone-600 ring-1 ring-stone-200",
                dot: "bg-stone-400",
                accent: "from-stone-400/10 to-slate-500/10",
            };
    }
}

function formatHealthStatus(status) {
    if (!status) return "Unknown";
    return status
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getConfidence(confidence) {
    if (confidence === undefined || confidence === null) return null;
    const value = Number(confidence);
    if (Number.isNaN(value)) return null;
    return Math.round(Math.min(Math.max(value, 0), 100));
}

function PlantCard({ plant, onWater, isWatering }) {
    const healthStyles = getHealthStyles(plant.healthStatus);
    const confidence = getConfidence(plant.aiConfidence);
    const intervalDays = plant.careInfo?.waterIntervalDays;

    return (
        <article className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/60 shadow-xl shadow-stone-900/5 hover-lift">

            <div className={`pointer-events-none absolute inset-x-0 -top-20 h-40 bg-gradient-to-b ${healthStyles.accent} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

            <Link
                to={`/plants/${plant._id}`}
                className="relative block h-60 overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50"
            >
                {plant.imageUrl ? (
                    <img
                        src={plant.imageUrl}
                        alt={plant.commonName || "Plant"}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-7xl animate-float-slow">
                        🌱
                    </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-3xl" />

                <div className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold shadow-md backdrop-blur-md ${healthStyles.badge}`}>
                    <span className={`relative flex h-2 w-2`}>
                        <span className={`absolute inline-flex h-full w-full rounded-full ${healthStyles.dot} opacity-40 animate-ping`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${healthStyles.dot}`} />
                    </span>
                    {formatHealthStatus(plant.healthStatus)}
                </div>

                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-forest-800 opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3">
                    <FiArrowUpRight className="h-5 w-5" />
                </div>

                {confidence !== null && (
                    <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 shadow-lg ring-1 ring-white/20">
                        <FiStar className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[11px] font-bold text-forest-800">{confidence}% match</span>
                    </div>
                )}
            </Link>

            <div className="relative z-10 p-6 space-y-5">

                <div className="min-h-[72px]">
                    <h3 className="text-xl font-bold tracking-tight text-forest-800 truncate group-hover:text-emerald-700 transition-colors">
                        {plant.nickname || plant.commonName || "My Plant"}
                    </h3>
                    {plant.nickname && plant.commonName && (
                        <p className="mt-1 text-sm font-medium text-stone-500 truncate">
                            {plant.commonName}
                        </p>
                    )}
                    {plant.scientificName && (
                        <p className="mt-1 text-xs italic text-stone-400 truncate font-medium">
                            {plant.scientificName}
                        </p>
                    )}
                </div>

                {confidence !== null && (
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <FiStar className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">AI Confidence</span>
                            </div>
                            <span className={`text-sm font-bold ${
                                confidence >= 90 ? "text-emerald-600" : confidence >= 70 ? "text-amber-600" : "text-rose-600"
                            }`}>
                                {confidence}%
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    confidence >= 90
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                        : confidence >= 70
                                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                        : "bg-gradient-to-r from-rose-400 to-red-500"
                                }`}
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className={`rounded-2xl bg-gradient-to-br ${healthStyles.accent} p-4 ring-1 ring-stone-200/50`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-500/20 text-sky-600 ring-1 ring-sky-200/50">
                                <FiDroplet className="h-4.5 w-4.5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Watering</p>
                                <p className="text-xs font-semibold text-forest-700">
                                    {intervalDays ? `Every ${intervalDays} days` : "Schedule TBD"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <WaterCountdownBadge lastWatered={plant.lastWatered} intervalDays={intervalDays} />
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        to={`/plants/${plant._id}`}
                        className="group/btn flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-stone-100 to-stone-50 ring-1 ring-stone-200/60 px-4 py-3 text-sm font-bold text-forest-800 transition-all duration-200 hover:from-emerald-100 hover:to-green-50 hover:ring-emerald-200 hover:text-emerald-800 hover:shadow-md"
                    >
                        <FiEye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        View Details
                    </Link>

                    <button
                        type="button"
                        onClick={() => onWater(plant._id)}
                        disabled={isWatering}
                        className="group/btn relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        title="Mark as watered"
                    >
                        {isWatering ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <FiDroplet className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5 transition-all duration-200" />
                        )}
                        <span className="pointer-events-none absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-sky-400 ring-2 ring-white animate-pulse" />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default PlantCard;