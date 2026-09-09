import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCheck,
    FiDroplet,
    FiSun,
    FiThermometer,
    FiWind,
    FiMapPin,
} from "react-icons/fi";

import { getPlantById, waterPlant } from "../api/plantApi";

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

function formatStatus(status) {
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

function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="rounded-xl border border-[#e5eae3] bg-[#fafbf9] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#718076]">
                {icon}

                <span className="text-xs font-medium">
                    {label}
                </span>
            </div>

            <p className="text-sm font-semibold text-[#314236]">
                {value || "Not specified"}
            </p>
        </div>
    );
}

function PlantInfoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["plant", id],
        queryFn: () => getPlantById(id),
        enabled: Boolean(id),
    });

    const waterMutation = useMutation({
        mutationFn: () => waterPlant(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["plant", id],
            });

            queryClient.invalidateQueries({
                queryKey: ["plants"],
            });
        },
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-sm text-[#758078]">
                    Loading plant...
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-4 text-5xl">🌱</div>

                <h1 className="text-xl font-semibold text-[#26352a]">
                    Plant not found
                </h1>

                <p className="mt-2 text-sm text-[#7c867e]">
                    We couldn't load this plant.
                </p>

                <Link
                    to="/garden"
                    className="mt-5 rounded-xl bg-[#31553b] px-5 py-2.5 text-sm font-semibold text-white"
                >
                    Back to garden
                </Link>
            </div>
        );
    }

    const plant = data;

    const healthStyles = getHealthStyles(
        plant.healthStatus
    );

    const confidence =
    plant.aiConfidence !== undefined &&
    plant.aiConfidence !== null
        ? Math.round(
              Math.min(
                  Math.max(Number(plant.aiConfidence), 0),
                  1
              ) * 100
          )
        : null;

    return (
        <div className="space-y-7">

            {/* Back */}
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#68746b] transition hover:text-[#31553b]"
            >
                <FiArrowLeft size={17} />
                Back
            </button>

            {/* Hero */}
            <section className="overflow-hidden rounded-3xl border border-[#e2e8df] bg-white shadow-[0_4px_20px_rgba(38,53,42,0.05)]">

                <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">

                    {/* Image */}
                    <div className="relative min-h-[320px] bg-[#edf2eb] lg:min-h-[500px]">

                        {plant.imageUrl ? (
                            <img
                                src={plant.imageUrl}
                                alt={
                                    plant.commonName ||
                                    "Plant"
                                }
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";
                                }}
                            />
                        ) : (
                            <div className="flex h-full min-h-[320px] items-center justify-center text-7xl">
                                🌱
                            </div>
                        )}

                        <div
                            className={`absolute left-6 top-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm ${healthStyles.badge}`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${healthStyles.dot}`}
                            />

                            {formatStatus(
                                plant.healthStatus
                            )}
                        </div>

                    </div>

                    {/* Identity */}
                    <div className="flex flex-col justify-between p-7 sm:p-9">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#87928a]">
                                Plant profile
                            </p>

                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#26352a] sm:text-4xl">
                                {plant.nickname ||
                                    plant.commonName ||
                                    "My Plant"}
                            </h1>

                            {plant.nickname &&
                                plant.commonName && (
                                    <p className="mt-2 text-lg text-[#68746b]">
                                        {plant.commonName}
                                    </p>
                                )}

                            {plant.scientificName && (
                                <p className="mt-1 text-sm italic text-[#9aa39c]">
                                    {plant.scientificName}
                                </p>
                            )}

                            {plant.family && (
                                <p className="mt-4 text-sm text-[#7d877f]">
                                    Family:{" "}
                                    <span className="font-medium text-[#536057]">
                                        {plant.family}
                                    </span>
                                </p>
                            )}

                            {/* Location */}
                            {plant.location && (
                                <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f5f7f3] px-3 py-2 text-sm text-[#657168]">
                                    <FiMapPin size={15} />
                                    {plant.location}
                                </div>
                            )}

                        </div>

                        {/* Confidence */}
                        {confidence !== null && (
                            <div className="mt-8 rounded-2xl bg-[#f5f8f3] p-5">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-[#59665c]">
                                            AI identification
                                        </p>

                                        <p className="mt-1 text-xs text-[#8b958d]">
                                            Confidence score
                                        </p>
                                    </div>

                                    <span className="text-2xl font-semibold text-[#3d6046]">
                                        {confidence}%
                                    </span>

                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dfe7dd]">
                                    <div
                                        className="h-full rounded-full bg-[#64836a]"
                                        style={{
                                            width: `${confidence}%`,
                                        }}
                                    />
                                </div>

                            </div>
                        )}

                    </div>

                </div>
            </section>

            {/* Health */}
            <section className="grid gap-5 lg:grid-cols-2">

                <div className="rounded-2xl border border-[#e2e8df] bg-white p-6">

                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a958d]">
                            AI health assessment
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-[#26352a]">
                            What GreenGuru sees
                        </h2>
                    </div>

                    <div className="rounded-xl bg-[#f6f8f5] p-5">

                        <p className="text-sm leading-7 text-[#5f6b62]">
                            {plant.aiObservation ||
                                "No health observation is available yet."}
                        </p>

                    </div>

                </div>

                <div className="rounded-2xl border border-[#e2e8df] bg-white p-6">

                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a958d]">
                            Recommended action
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-[#26352a]">
                            What you should do
                        </h2>
                    </div>

                    <div className="rounded-xl border border-[#e6eadf] bg-[#f8faf6] p-5">

                        <div className="flex gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f0e3] text-[#4c7054]">
                                <FiCheck size={17} />
                            </div>

                            <p className="text-sm leading-7 text-[#5f6b62]">
                                {plant.actionableFix ||
                                    "No specific action is required right now."}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* Care */}
            <section className="rounded-2xl border border-[#e2e8df] bg-white p-6">

                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a958d]">
                        Care guide
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#26352a]">
                        Everything your plant needs
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <InfoItem
                        icon={<FiDroplet size={16} />}
                        label="Watering"
                        value={
                            plant.careInfo?.waterFrequency
                        }
                    />

                    <InfoItem
                        icon={<FiDroplet size={16} />}
                        label="Water interval"
                        value={
                            plant.careInfo?.waterIntervalDays
                                ? `Every ${plant.careInfo.waterIntervalDays} days`
                                : null
                        }
                    />

                    <InfoItem
                        icon={<FiSun size={16} />}
                        label="Sunlight"
                        value={
                            plant.careInfo?.sunlight
                        }
                    />

                    <InfoItem
                        icon={<FiWind size={16} />}
                        label="Soil"
                        value={
                            plant.careInfo?.soilType
                        }
                    />

                    <InfoItem
                        icon={<FiThermometer size={16} />}
                        label="Temperature"
                        value={
                            plant.careInfo?.temperature
                        }
                    />

                    <InfoItem
                        icon={<FiWind size={16} />}
                        label="Humidity"
                        value={
                            plant.careInfo?.humidity
                        }
                    />

                    <InfoItem
                        icon={<FiCheck size={16} />}
                        label="Difficulty"
                        value={
                            plant.careInfo?.difficulty
                        }
                    />

                    <InfoItem
                        icon={<FiMapPin size={16} />}
                        label="Toxicity"
                        value={
                            plant.careInfo?.toxicity
                        }
                    />

                </div>

            </section>

            {/* Watering */}
            <section className="rounded-2xl border border-[#e2e8df] bg-[#31553b] p-6 text-white sm:p-7">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <FiDroplet size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-white/60">
                                    Last watered
                                </p>

                                <p className="mt-0.5 text-lg font-semibold">
                                    {formatDate(
                                        plant.lastWatered
                                    )}
                                </p>
                            </div>
                        </div>

                    </div>

                    <button
                        type="button"
                        disabled={
                            waterMutation.isPending
                        }
                        onClick={() =>
                            waterMutation.mutate()
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#31553b] transition hover:bg-[#f1f5ef] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FiDroplet size={17} />

                        {waterMutation.isPending
                            ? "Updating..."
                            : "Mark as watered"}
                    </button>

                </div>

            </section>

            {/* Timeline */}
            <section className="rounded-2xl border border-[#e2e8df] bg-white p-6 sm:p-7">

                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a958d]">
                        Plant history
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#26352a]">
                        Health timeline
                    </h2>

                    <p className="mt-1 text-sm text-[#879188]">
                        See how your plant's health has changed over time.
                    </p>
                </div>

                {!plant.healthTimeline?.length ? (
                    <div className="rounded-xl bg-[#f7f9f6] p-6 text-center text-sm text-[#7c867e]">
                        No health checks recorded yet.
                    </div>
                ) : (
                    <div className="relative ml-3 border-l border-[#dfe6dd]">

                        {plant.healthTimeline
                            .slice()
                            .reverse()
                            .map((entry, index) => {

                                const styles =
                                    getHealthStyles(
                                        entry.healthStatus
                                    );

                                return (
                                    <div
                                        key={
                                            entry._id ||
                                            `${entry.recordedAt}-${index}`
                                        }
                                        className="relative pb-8 pl-8 last:pb-0"
                                    >

                                        {/* Timeline dot */}
                                        <div
                                            className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-4 border-white ${styles.dot}`}
                                        />

                                        <div className="rounded-xl border border-[#e5eae3] bg-[#fafbf9] p-4">

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                <div>

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
                                                        >
                                                            {formatStatus(
                                                                entry.healthStatus
                                                            )}
                                                        </span>

                                                        <span className="text-xs text-[#929b94]">
                                                            {formatDate(
                                                                entry.recordedAt
                                                            )}
                                                        </span>

                                                    </div>

                                                    {entry.aiObservation && (
                                                        <p className="mt-3 text-sm leading-6 text-[#626d65]">
                                                            {
                                                                entry.aiObservation
                                                            }
                                                        </p>
                                                    )}

                                                    {entry.actionableFix && (
                                                        <p className="mt-2 text-xs font-medium text-[#53665a]">
                                                            Action:{" "}
                                                            {
                                                                entry.actionableFix
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                                {entry.imageUrl && (
                                                    <img
                                                        src={
                                                            entry.imageUrl
                                                        }
                                                        alt="Plant health check"
                                                        className="h-20 w-20 rounded-xl object-cover"
                                                    />
                                                )}

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                    </div>
                )}

            </section>

        </div>
    );
}

export default PlantInfoPage;