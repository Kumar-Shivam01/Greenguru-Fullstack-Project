import { Link } from "react-router-dom";

function getHealthClasses(status) {
    switch (status) {
        case "healthy":
            return "bg-green-100 text-green-700";

        case "needs-attention":
            return "bg-yellow-100 text-yellow-700";

        case "sick":
            return "bg-red-100 text-red-700";

        case "dormant":
            return "bg-gray-100 text-gray-700";

        default:
            return "bg-gray-100 text-gray-600";
    }
}

function formatHealthStatus(status) {
    if (!status) return "Unknown";

    return status
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function PlantCard({ plant, onWater }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#e1e5df] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            {/* Plant Image */}
            <div className="relative h-52 overflow-hidden bg-[#edf2eb]">
                <img
                    src={plant.imageUrl}
                    alt={plant.commonName || "Plant"}
                    onError={(e)=>{
                        e.currentTarget.style.display = 'none'
                    }}
                    className="h-full w-full object-cover"
                />

                {/* Health Badge */}
                <div
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${getHealthClasses(
                        plant.healthStatus
                    )}`}
                >
                    {formatHealthStatus(plant.healthStatus)}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5">

                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[#26352a]">
                        {plant.nickname || plant.commonName || "My Plant"}
                    </h3>

                    {plant.commonName && plant.nickname && (
                        <p className="mt-1 text-sm text-gray-500">
                            {plant.commonName}
                        </p>
                    )}

                    {plant.scientificName && (
                        <p className="mt-1 text-xs italic text-gray-400">
                            {plant.scientificName}
                        </p>
                    )}
                </div>

                {/* AI Confidence */}
                {plant.aiConfidence !== undefined && (
                    <div className="mb-4">
                        <div className="mb-1 flex justify-between text-xs">
                            <span className="text-gray-500">
                                AI confidence
                            </span>

                            <span className="font-medium text-[#506b54]">
                                {plant.aiConfidence * 100}%
                            </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-[#6f8b72]"
                                style={{
                                    width: `${Math.min(
                                        Math.max(plant.aiConfidence, 0),
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Watering */}
                <div className="mb-4 rounded-xl bg-[#f5f7f2] p-3">
                    <p className="text-xs text-gray-500">
                        Watering
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#354439]">
                        Every {plant.careInfo?.waterIntervalDays || "—"} days
                    </p>
                </div>

                <div className="flex gap-2">

                    <button
                        onClick={() => onWater(plant._id)}
                        className="flex-1 rounded-xl bg-[#354b39] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#293c2d]"
                    >
                        💧 Watered
                    </button>

                    <Link
                        to={`/plants/${plant._id}`}
                        className="rounded-xl border border-[#d8dfd5] px-4 py-2.5 text-sm font-medium text-[#354439] transition hover:bg-[#f5f7f2]"
                    >
                        View
                    </Link>

                </div>
            </div>
        </article>
    );
}

export default PlantCard;