import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPlantById, waterPlant,checkPlantHealth } from "../api/plantApi";
import { useState } from "react";
import {
    FiArrowLeft,
    FiCheck,
    FiDroplet,
    FiSun,
    FiThermometer,
    FiWind,
    FiMapPin,
    FiCamera,
    FiX,
    FiUploadCloud,
    FiStar,
    FiActivity,
    FiEdit,
    FiTrash,
    FiClock,
    FiTarget,
    FiAperture,
} from "react-icons/fi";

function getHealthStyles(status) {
    switch (status) {
        case "healthy":
            return {
                badge: "bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 ring-1 ring-green-200/70",
                dot: "bg-gradient-to-br from-green-500 to-emerald-500 shadow-md shadow-green-500/30",
                glow: "from-green-500/20 to-emerald-500/20",
                cardBg: "from-green-50/50 to-emerald-50/50",
                iconBg: "bg-gradient-to-br from-green-400/20 to-emerald-500/20 text-emerald-700 ring-green-200/60",
                textPrimary: "text-emerald-700",
            };
        case "needs-attention":
            return {
                badge: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 ring-1 ring-amber-200/70",
                dot: "bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/30",
                glow: "from-amber-500/20 to-orange-500/20",
                cardBg: "from-amber-50/50 to-orange-50/50",
                iconBg: "bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-700 ring-amber-200/60",
                textPrimary: "text-amber-700",
            };
        case "sick":
            return {
                badge: "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 ring-1 ring-rose-200/70",
                dot: "bg-gradient-to-br from-rose-500 to-red-500 shadow-md shadow-rose-500/30",
                glow: "from-rose-500/20 to-red-500/20",
                cardBg: "from-rose-50/50 to-red-50/50",
                iconBg: "bg-gradient-to-br from-rose-400/20 to-red-500/20 text-rose-700 ring-rose-200/60",
                textPrimary: "text-rose-700",
            };
        case "dormant":
            return {
                badge: "bg-gradient-to-r from-stone-100 to-slate-100 text-stone-700 ring-1 ring-stone-200/70",
                dot: "bg-gradient-to-br from-stone-400 to-slate-500 shadow-md shadow-stone-500/30",
                glow: "from-stone-400/20 to-slate-500/20",
                cardBg: "from-stone-50/50 to-slate-50/50",
                iconBg: "bg-gradient-to-br from-stone-400/20 to-slate-500/20 text-stone-700 ring-stone-200/60",
                textPrimary: "text-stone-700",
            };
        default:
            return {
                badge: "bg-stone-100 text-stone-600 ring-1 ring-stone-200",
                dot: "bg-stone-400",
                glow: "from-stone-400/20 to-slate-500/20",
                cardBg: "from-stone-50/50 to-slate-50/50",
                iconBg: "bg-stone-100 text-stone-600 ring-stone-200",
                textPrimary: "text-stone-600",
            };
    }
}

function formatStatus(status) {
    if (!status) return "Unknown";
    return status
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatDate(date) {
    if (!date) return "Not watered yet";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Not available";
    return parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function InfoItem({ icon, label, value, gradient = "from-stone-50 to-slate-50", textColor = "text-stone-700" }) {
    return (
        <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} ring-1 ring-stone-200/60 p-5 hover:shadow-lg hover:shadow-stone-900/5 hover:-translate-y-1 transition-all duration-300`}>
            <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 bg-white/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${textColor} shadow-sm`}>
                    {icon}
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 mb-1.5">
                    {label}
                </p>
                <p className="text-sm font-bold text-forest-800 leading-snug">
                    {value || "Not specified"}
                </p>
            </div>
        </div>
    );
}

function PlantInfoPage() {
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["plant", id],
        queryFn: () => getPlantById(id),
        enabled: Boolean(id),
    });

    const waterMutation = useMutation({
        mutationFn: () => waterPlant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plant", id] });
            queryClient.invalidateQueries({ queryKey: ["plants"] });
        },
    });
    const checkinMutation = useMutation({
        mutationFn: (imageFile) =>
            checkPlantHealth(id, imageFile),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["plant", id],
            });

            queryClient.invalidateQueries({
                queryKey: ["plants"],
            });

            closeCheckinModal();
        },
        onError: (error) => {
            console.error("Check-in failed:", error);
        }
    });
    const handleImageSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Please choose an image smaller than 10 MB.");
            return;
        }
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };
    const closeCheckinModal = () => {
        setShowCheckinModal(false);
        setSelectedImage(null);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl("");
    };
    const handleCheckin = () => {
        console.log("ANALYZE BUTTON CLICKED");
        console.log("Selected image:", selectedImage);

        if (!selectedImage) {
            console.log("NO IMAGE SELECTED");
            return;
        }

        checkinMutation.mutate(selectedImage);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-300/30 rounded-full blur-2xl scale-150" />
                        <div className="relative text-7xl animate-float">🌿</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-emerald-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-stone-600 font-semibold">Loading plant profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-rose-300/30 rounded-full blur-2xl scale-150" />
                    <div className="relative text-7xl">😢</div>
                </div>
                <h1 className="text-2xl font-bold text-forest-800 mb-2">Plant not found</h1>
                <p className="text-stone-500 mb-8 max-w-md">We couldn't load this plant. It may have been removed or doesn't exist.</p>
                <Link
                    to="/garden"
                    className="inline-flex items-center gap-2 rounded-2xl gradient-hero px-8 py-4 font-bold text-white shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                    <FiArrowLeft /> Back to garden
                </Link>
            </div>
        );
    }

    const plant = data;
    const healthStyles = getHealthStyles(plant.healthStatus);
    const confidence = plant.aiConfidence !== undefined && plant.aiConfidence !== null
        ? Math.round(Math.min(Math.max(Number(plant.aiConfidence), 0), 1) * 100)
        : null;

    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-stone-200/60 px-5 py-3 text-sm font-bold text-stone-600 hover:ring-emerald-200 hover:text-emerald-800 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                    <FiArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to garden
                </button>

                <div className="flex items-center gap-2.5">
                    <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-stone-200/60 text-stone-500 hover:ring-amber-200 hover:text-amber-600 hover:bg-amber-50 transition-all">
                        <FiEdit className="h-4.5 w-4.5" />
                    </button>
                    <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-stone-200/60 text-stone-500 hover:ring-rose-200 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <FiTrash className="h-4.5 w-4.5" />
                    </button>
                </div>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-stone-200/60 shadow-2xl shadow-stone-900/5">
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b ${healthStyles.glow}`} />

                <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

                    {/* Image */}
                    <div className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[600px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50" />

                        {plant.imageUrl ? (
                            <img
                                src={plant.imageUrl}
                                alt={plant.commonName || "Plant"}
                                className="relative h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                        ) : (
                            <div className="relative flex h-full min-h-[340px] items-center justify-center">
                                <div className="text-[10rem] animate-float-slow">🌱</div>
                            </div>
                        )}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-tl-[2.5rem] lg:rounded-bl-[2.5rem]" />

                        <div className={`absolute left-6 top-6 inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-black shadow-2xl backdrop-blur-xl ${healthStyles.badge}`}>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`absolute inline-flex h-full w-full rounded-full ${healthStyles.dot} opacity-40 animate-ping`} />
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${healthStyles.dot}`} />
                            </span>
                            {formatStatus(plant.healthStatus)}
                        </div>

                        <div className="absolute left-6 bottom-6 right-6 lg:left-8 lg:bottom-8 lg:right-8 flex items-end justify-between text-white">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                                    <FiAperture className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">Plant ID</p>
                                    <p className="text-sm font-bold font-mono">#{plant._id?.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="relative z-10 flex flex-col justify-between p-8 sm:p-10 lg:p-12 space-y-8">

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 ring-1 ring-emerald-200/60 px-4 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-800">Plant Profile</span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-forest-800 leading-[1.05]">
                                    {plant.nickname || plant.commonName || "My Plant"}
                                </h1>

                                {plant.nickname && plant.commonName && (
                                    <p className="text-xl font-semibold text-stone-500">
                                        {plant.commonName}
                                    </p>
                                )}

                                {plant.scientificName && (
                                    <p className="text-base italic text-stone-400 font-medium">
                                        {plant.scientificName}
                                    </p>
                                )}
                            </div>

                            {plant.family && (
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Family</span>
                                    <span className="inline-flex items-center rounded-xl bg-stone-100 ring-1 ring-stone-200/60 px-4 py-1.5 text-sm font-bold text-stone-700">
                                        {plant.family}
                                    </span>
                                </div>
                            )}

                            {plant.location && (
                                <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 ring-1 ring-sky-200/60 px-4 py-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-500/20 text-sky-600 ring-1 ring-sky-200/60">
                                        <FiMapPin className="h-4.5 w-4.5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-sky-500">Location</p>
                                        <p className="text-sm font-bold text-forest-800">{plant.location}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {confidence !== null && (
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 ring-1 ring-emerald-200/60 p-6">
                                <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-hero text-white shadow-lg shadow-emerald-900/20">
                                                <FiStar className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-emerald-800">AI Identification</p>
                                                <p className="text-xs font-medium text-emerald-600/70">Confidence match score</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-4xl font-black tracking-tight ${confidence >= 90 ? "text-emerald-600" : confidence >= 70 ? "text-amber-600" : "text-rose-600"
                                                }`}>
                                                {confidence}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-white ring-1 ring-emerald-200/60">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${confidence >= 90
                                                ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
                                                : confidence >= 70
                                                    ? "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500"
                                                    : "bg-gradient-to-r from-rose-400 via-red-500 to-orange-500"
                                                }`}
                                            style={{ width: `${confidence}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between mt-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700/60">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Health Assessment */}
            <section className="grid gap-6 lg:grid-cols-2">
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${healthStyles.cardBg} ring-1 ring-stone-200/60 p-7 shadow-xl shadow-stone-900/5`}>
                    <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-white/60 to-transparent rounded-full blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${healthStyles.iconBg} ring-1 shadow-md`}>
                                <FiActivity className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">AI Health Assessment</p>
                                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a958d]">
                                            AI health assessment
                                        </p>

                                        <h2 className="mt-1 text-xl font-semibold text-[#26352a]">
                                            What GreenGuru sees
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckinModal(true)}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#31553b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#27452f]"
                                    >
                                        <FiCamera size={16} />
                                        Check plant health
                                    </button>

                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/70 backdrop-blur-sm ring-1 ring-stone-200/50 p-6">
                            <p className="text-base leading-8 text-stone-700 font-medium">
                                {plant.aiObservation || "No health observation available yet. Check back after your next plant scan!"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 ring-1 ring-emerald-200/60 p-7 shadow-xl shadow-emerald-900/5">
                    <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-emerald-300/30 to-transparent rounded-full blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-900/20">
                                <FiTarget className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700/70">Recommended Action</p>
                                <h2 className="text-2xl font-black tracking-tight text-forest-800">What you should do</h2>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-emerald-200/50 p-6">
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 text-emerald-700 ring-1 ring-emerald-200/60">
                                    <FiCheck className="h-5.5 w-5.5" />
                                </div>
                                <p className="text-base leading-8 text-stone-700 font-medium">
                                    {plant.actionableFix || "Keep up the great work! Your plant is doing well — continue with your current care routine."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Care Guide */}
            <section className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md ring-1 ring-stone-200/60 p-8 shadow-xl shadow-stone-900/5">
                <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-900/20">
                                <FiStar className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">Complete Care Guide</p>
                                <h2 className="text-3xl font-black tracking-tight text-forest-800">Everything your plant needs</h2>
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-stone-500 max-w-sm">
                            Follow these personalized tips to keep your {plant.commonName || "plant"} thriving and happy!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem
                            icon={<FiDroplet className="h-5.5 w-5.5" />}
                            label="Watering"
                            value={plant.careInfo?.waterFrequency}
                            gradient="from-sky-50 to-blue-50"
                            textColor="bg-gradient-to-br from-sky-400/20 to-blue-500/20 text-sky-700 ring-sky-200/60"
                        />
                        <InfoItem
                            icon={<FiClock className="h-5.5 w-5.5" />}
                            label="Water Interval"
                            value={plant.careInfo?.waterIntervalDays ? `Every ${plant.careInfo.waterIntervalDays} days` : null}
                            gradient="from-cyan-50 to-teal-50"
                            textColor="bg-gradient-to-br from-cyan-400/20 to-teal-500/20 text-cyan-700 ring-cyan-200/60"
                        />
                        <InfoItem
                            icon={<FiSun className="h-5.5 w-5.5" />}
                            label="Sunlight"
                            value={plant.careInfo?.sunlight}
                            gradient="from-amber-50 to-yellow-50"
                            textColor="bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-700 ring-amber-200/60"
                        />
                        <InfoItem
                            icon={<FiWind className="h-5.5 w-5.5" />}
                            label="Soil Type"
                            value={plant.careInfo?.soilType}
                            gradient="from-stone-50 to-amber-50"
                            textColor="bg-gradient-to-br from-stone-400/20 to-amber-500/20 text-stone-700 ring-stone-200/60"
                        />
                        <InfoItem
                            icon={<FiThermometer className="h-5.5 w-5.5" />}
                            label="Temperature"
                            value={plant.careInfo?.temperature}
                            gradient="from-rose-50 to-orange-50"
                            textColor="bg-gradient-to-br from-rose-400/20 to-orange-500/20 text-rose-700 ring-rose-200/60"
                        />
                        <InfoItem
                            icon={<FiWind className="h-5.5 w-5.5" />}
                            label="Humidity"
                            value={plant.careInfo?.humidity}
                            gradient="from-blue-50 to-indigo-50"
                            textColor="bg-gradient-to-br from-blue-400/20 to-indigo-500/20 text-blue-700 ring-blue-200/60"
                        />
                        <InfoItem
                            icon={<FiCheck className="h-5.5 w-5.5" />}
                            label="Difficulty"
                            value={plant.careInfo?.difficulty}
                            gradient="from-emerald-50 to-green-50"
                            textColor="bg-gradient-to-br from-emerald-400/20 to-green-500/20 text-emerald-700 ring-emerald-200/60"
                        />
                        <InfoItem
                            icon={<FiMapPin className="h-5.5 w-5.5" />}
                            label="Toxicity"
                            value={plant.careInfo?.toxicity}
                            gradient="from-fuchsia-50 to-pink-50"
                            textColor="bg-gradient-to-br from-fuchsia-400/20 to-pink-500/20 text-fuchsia-700 ring-fuchsia-200/60"
                        />
                    </div>
                </div>
            </section>

            {/* Watering CTA */}
            <section className="relative overflow-hidden rounded-[2.5rem] gradient-hero p-8 sm:p-10 text-white shadow-2xl shadow-emerald-900/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-20 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl translate-y-1/2" />

                <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-pulse" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl">
                                <FiDroplet className="h-8 w-8" />
                            </div>
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-3">
                                <FiClock className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-white/80">Last watered</span>
                            </div>
                            <p className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
                                {formatDate(plant.lastWatered)}
                            </p>
                            <p className="text-base text-white/70 font-medium max-w-md">
                                Remember to give your plant plenty of love and attention — consistency is key! 💧
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={waterMutation.isPending}
                        onClick={() => waterMutation.mutate()}
                        className="group relative inline-flex items-center justify-center gap-3 rounded-3xl bg-white px-8 py-5 font-black text-base text-forest-800 shadow-2xl transition-all duration-200 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                        {waterMutation.isPending ? (
                            <>
                                <svg className="animate-spin h-5.5 w-5.5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Updating...
                            </>
                        ) : (
                            <>
                                <FiDroplet className="h-5.5 w-5.5 group-hover:scale-110 transition-transform" />
                                Mark as watered
                                <FiCheck className="h-5 w-5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                            </>
                        )}
                    </button>
                </div>
            </section>

            {/* Timeline */}
            <section className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md ring-1 ring-stone-200/60 p-8 shadow-xl shadow-stone-900/5">
                <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100/40 to-transparent rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20">
                                <FiActivity className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">Plant History</p>
                                <h2 className="text-3xl font-black tracking-tight text-forest-800">Health Timeline</h2>
                                <p className="text-sm font-semibold text-stone-500 mt-1">
                                    See how your plant's health has evolved over time
                                </p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-stone-100 ring-1 ring-stone-200/60 px-4 py-2.5 text-xs font-bold text-stone-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {plant.healthTimeline?.length || 0} check{plant.healthTimeline?.length !== 1 ? "s" : ""} recorded
                        </div>
                    </div>

                    {!plant.healthTimeline?.length ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-3xl border-2 border-dashed border-stone-200 bg-gradient-to-br from-stone-50/80 to-white">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-2xl scale-150" />
                                <div className="relative text-6xl animate-float-slow">📋</div>
                            </div>
                            <h3 className="text-xl font-black text-forest-800 mb-2">No health checks yet</h3>
                            <p className="text-sm font-semibold text-stone-500 max-w-md text-center">
                                Each time you scan or assess your plant, a record will appear here to track its progress over time!
                            </p>
                        </div>
                    ) : (
                        <div className="relative ml-4 border-l-2 border-gradient-to-b from-emerald-200 via-purple-200 to-rose-200" style={{ borderImage: "linear-gradient(to bottom, #86efac, #c4b5fd, #fecdd3) 1" }}>
                            {plant.healthTimeline
                                .slice()
                                .reverse()
                                .map((entry, index) => {
                                    const styles = getHealthStyles(entry.healthStatus);
                                    return (
                                        <div
                                            key={entry._id || `${entry.recordedAt}-${index}`}
                                            className="relative pb-10 pl-8 last:pb-0 animate-fade-in-up"
                                            style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
                                        >
                                            <div className={`absolute -left-[11px] top-1.5 h-6 w-6 rounded-full border-4 border-white ${styles.dot} shadow-xl`} />

                                            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${styles.cardBg} ring-1 ring-stone-200/60 p-6 shadow-md shadow-stone-900/5 hover:shadow-xl transition-shadow`}>
                                                <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 bg-white/50 rounded-full blur-xl" />

                                                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <span className={`rounded-full px-4 py-1.5 text-[11px] font-black shadow-sm ${styles.badge}`}>
                                                                {formatStatus(entry.healthStatus)}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500">
                                                                <FiClock className="h-3.5 w-3.5" />
                                                                {formatDate(entry.recordedAt)}
                                                            </span>
                                                        </div>

                                                        {entry.aiObservation && (
                                                            <div className="rounded-2xl bg-white/70 backdrop-blur-sm ring-1 ring-stone-200/50 p-5">
                                                                <p className="text-sm leading-7 text-stone-700 font-medium">
                                                                    {entry.aiObservation}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {entry.actionableFix && (
                                                            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 ring-1 ring-emerald-200/50 p-4">
                                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 text-emerald-700 ring-1 ring-emerald-200/60">
                                                                    <FiCheck className="h-4 w-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-0.5">Action Taken</p>
                                                                    <p className="text-sm font-bold text-emerald-900/80 leading-snug">{entry.actionableFix}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {entry.imageUrl && (
                                                        <div className="relative shrink-0">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl pointer-events-none" />
                                                            <img
                                                                src={entry.imageUrl}
                                                                alt="Plant health check"
                                                                className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </section>
            {showCheckinModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d2c21]/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeCheckinModal();
                        }
                    }}
                >
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#dfe7dc] bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-[#e7ebe5] px-6 py-5">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#89948b]">
                                    AI health check
                                </p>

                                <h2 className="mt-1 text-xl font-semibold text-[#26352a]">
                                    How is your plant doing?
                                </h2>

                                <p className="mt-1 text-sm text-[#7a857d]">
                                    Upload a recent photo and GreenGuru will analyze it.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCheckinModal}
                                disabled={checkinMutation.isPending}
                                className="rounded-lg p-2 text-[#7d887f] transition hover:bg-[#f2f5f1] hover:text-[#35453a]"
                            >
                                <FiX size={20} />
                            </button>

                        </div>

                        {/* Body */}
                        <div className="p-6">

                            {!previewUrl ? (
                                <label className="group flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ccd8ca] bg-[#f8faf7] px-6 text-center transition hover:border-[#719079] hover:bg-[#f3f7f2]">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f0e5] text-[#52745a]">
                                        <FiUploadCloud size={25} />
                                    </div>

                                    <p className="mt-5 text-sm font-semibold text-[#405047]">
                                        Upload a plant photo
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-[#89938c]">
                                        Choose a clear photo showing the leaves,
                                        stems, and overall plant condition.
                                    </p>

                                    <span className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#4d6754] shadow-sm">
                                        Choose image
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                        disabled={checkinMutation.isPending}
                                    />

                                </label>
                            ) : (
                                <div>

                                    {/* Preview */}
                                    <div className="relative overflow-hidden rounded-2xl bg-[#edf2eb]">

                                        <img
                                            src={previewUrl}
                                            alt="Selected plant"
                                            className="max-h-[360px] w-full object-cover"
                                        />

                                        {!checkinMutation.isPending && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);

                                                    if (previewUrl) {
                                                        URL.revokeObjectURL(
                                                            previewUrl
                                                        );
                                                    }

                                                    setPreviewUrl("");
                                                }}
                                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        )}

                                    </div>

                                    {/* Selected file */}
                                    <div className="mt-4 rounded-xl bg-[#f6f8f5] px-4 py-3">

                                        <p className="truncate text-sm font-medium text-[#48564c]">
                                            {selectedImage?.name}
                                        </p>

                                        <p className="mt-1 text-xs text-[#89938c]">
                                            {selectedImage
                                                ? `${(
                                                    selectedImage.size /
                                                    (1024 * 1024)
                                                ).toFixed(2)} MB`
                                                : ""}
                                        </p>

                                    </div>

                                </div>
                            )}

                            {/* Error */}
                            {checkinMutation.isError && (
                                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                                    <p className="text-sm font-medium text-red-700">
                                        We couldn't analyze this photo.
                                    </p>

                                    <p className="mt-1 text-xs text-red-600">
                                        Please try another clear plant photo.
                                    </p>

                                </div>
                            )}

                            {/* Loading */}
                            {checkinMutation.isPending && (
                                <div className="mt-5 rounded-xl bg-[#f1f6ef] px-4 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#b9cbbb] border-t-[#31553b]" />

                                        <div>
                                            <p className="text-sm font-semibold text-[#405047]">
                                                GreenGuru is analyzing your plant...
                                            </p>

                                            <p className="mt-1 text-xs text-[#7e8a81]">
                                                This may take a few moments.
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-[#e7ebe5] bg-[#fafbf9] px-6 py-4 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={closeCheckinModal}
                                disabled={checkinMutation.isPending}
                                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#66736a] transition hover:bg-[#eef2ed] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleCheckin}
                                disabled={
                                    !selectedImage ||
                                    checkinMutation.isPending
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#31553b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#27452f] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiCamera size={16} />

                                {checkinMutation.isPending
                                    ? "Analyzing..."
                                    : "Analyze plant"}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default PlantInfoPage;