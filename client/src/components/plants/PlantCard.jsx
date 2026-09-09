import { Link } from "react-router-dom";
import { FiArrowUpRight, FiDroplet } from "react-icons/fi";
import WaterCountdownBadge from "./WaterCountdownBadge";

function getHealthStyles(status) {
    switch (status) {
        case "healthy":
            return {
                badge: "bg-[#e9f4e8] text-[#3e6948]",
                dot: "bg-[#5b8b65]",
            };

        case "needs-attention":
            return {
                badge: "bg-[#fff4dc] text-[#916c25]",
                dot: "bg-[#d69c32]",
            };

        case "sick":
            return {
                badge: "bg-[#fdeaea] text-[#a34b4b]",
                dot: "bg-[#c96161]",
            };

        case "dormant":
            return {
                badge: "bg-[#eef0f0] text-[#66706b]",
                dot: "bg-[#87918b]",
            };

        default:
            return {
                badge: "bg-gray-100 text-gray-600",
                dot: "bg-gray-400",
            };
    }
}

function formatHealthStatus(status) {
    if (!status) return "Unknown";

    return status
        .split("-")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

function getConfidence(confidence) {
    if (confidence === undefined || confidence === null) {
        return null;
    }

    const value = Number(confidence);

    if (Number.isNaN(value)) {
        return null;
    }

    return Math.round(Math.min(Math.max(value, 0), 100));
}

function PlantCard({ plant, onWater, isWatering }) {
    const healthStyles = getHealthStyles(
        plant.healthStatus
    );

    const confidence = getConfidence(
        plant.aiConfidence
    );

    const intervalDays =
        plant.careInfo?.waterIntervalDays;

    return (
        <article className="group overflow-hidden rounded-2xl border border-[#e2e7df] bg-white shadow-[0_3px_15px_rgba(38,53,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(38,53,42,0.09)]">

            {/* Image */}
            <Link
                to={`/plants/${plant._id}`}
                className="relative block h-56 overflow-hidden bg-[#edf2eb]"
            >
                {plant.imageUrl ? (
                    <img
                        src={plant.imageUrl}
                        alt={
                            plant.commonName ||
                            "Plant"
                        }
                        onError={(event) => {
                            event.currentTarget.style.display =
                                "none";
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                        🌱
                    </div>
                )}

                {/* Gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

                {/* Health */}
                <div
                    className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${healthStyles.badge}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${healthStyles.dot}`}
                    />

                    {formatHealthStatus(
                        plant.healthStatus
                    )}
                </div>

                {/* Open icon */}
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#3b5141] opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100">
                    <FiArrowUpRight size={17} />
                </div>
            </Link>

            {/* Content */}
            <div className="p-5">

                {/* Plant name */}
                <div className="min-h-[68px]">

                    <h3 className="truncate text-xl font-semibold tracking-tight text-[#26352a]">
                        {plant.nickname ||
                            plant.commonName ||
                            "My Plant"}
                    </h3>

                    {plant.nickname &&
                        plant.commonName && (
                            <p className="mt-1 truncate text-sm text-[#758078]">
                                {plant.commonName}
                            </p>
                        )}

                    {plant.scientificName && (
                        <p className="mt-1 truncate text-xs italic text-[#9aa39c]">
                            {plant.scientificName}
                        </p>
                    )}

                </div>

                {/* AI confidence */}
                {confidence !== null && (
                    <div className="mt-4">

                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-[#8a938c]">
                                AI identification
                            </span>

                            <span className="text-xs font-semibold text-[#4d6954]">
                                {confidence}%
                            </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-[#edf0ec]">
                            <div
                                className="h-full rounded-full bg-[#6d8b72] transition-all"
                                style={{
                                    width: `${Math.round(confidence, 100)}%`,
                                }}
                            />
                        </div>

                    </div>
                )}

                {/* Watering */}
                <div className="mt-5 rounded-xl bg-[#f7f9f6] p-3.5">

                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e7f0e5] text-[#4d7055]">
                            <FiDroplet size={14} />
                        </div>

                        <span className="text-xs font-medium text-[#7d877f]">
                            Watering
                        </span>
                    </div>

                    <WaterCountdownBadge
                        lastWatered={
                            plant.lastWatered
                        }
                        intervalDays={
                            intervalDays
                        }
                    />

                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">

                    <Link
                        to={`/plants/${plant._id}`}
                        className="flex-1 rounded-xl border border-[#dce3da] px-4 py-2.5 text-center text-sm font-semibold text-[#3c5141] transition hover:bg-[#f5f7f3]"
                    >
                        View plant
                    </Link>

                    <button
                        type="button"
                        onClick={() =>
                            onWater(plant._id)
                        }
                        disabled={
                            isWatering
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#31553b] text-white transition hover:bg-[#27462f] disabled:cursor-not-allowed disabled:opacity-50" 
                        title="Mark as watered"
                    >
                        <FiDroplet size={17} />
                    </button>

                </div>

            </div>
        </article>
    );
}

export default PlantCard;