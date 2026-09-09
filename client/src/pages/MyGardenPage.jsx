import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPlants, waterPlant } from "../api/plantApi";
import PlantCard from "../components/plants/PlantCard";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

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
            queryClient.invalidateQueries({
                queryKey: ["plants"],
            });
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
                healthFilter === "all" ||
                plant.healthStatus === healthFilter;

            return matchesSearch && matchesHealth;
        });
    }, [plants, search, healthFilter]);

    const healthyCount = plants.filter(
        (plant) => plant.healthStatus === "healthy"
    ).length;

    const attentionCount = plants.filter(
        (plant) => plant.healthStatus === "needs-attention"
    ).length;

    const sickCount = plants.filter(
        (plant) => plant.healthStatus === "sick"
    ).length;

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading your garden...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                Unable to load your plants. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Page Heading */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#829084]">
                        Your collection
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#26352a] sm:text-4xl">
                        My Garden
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#7b857d]">
                        Keep an eye on your plants, watering schedule, and overall health.
                    </p>
                </div>

                <Link
                    to="/plants/new"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#31553b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#27462f] hover:shadow-md"
                >
                    <FiPlus size={17} />
                    Add Plant
                </Link>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

                <SummaryCard
                    label="Total plants"
                    value={plants.length}
                    description="In your garden"
                    icon="🌿"
                />

                <SummaryCard
                    label="Healthy"
                    value={healthyCount}
                    description="Doing well"
                    icon="✓"
                />

                <SummaryCard
                    label="Needs attention"
                    value={attentionCount}
                    description="Requires care"
                    icon="!"
                />

                <SummaryCard
                    label="Sick"
                    value={sickCount}
                    description="Needs treatment"
                    icon="♥"
                />

            </div>

            {/* Search + Filters */}
            <div className="pt-3">

                <div className="mb-4 flex items-end justify-between">

                    <div>
                        <h2 className="text-xl font-semibold text-[#26352a]">
                            Your Plants
                        </h2>

                        <p className="mt-1 text-sm text-[#89928a]">
                            {filteredPlants.length} plants in your collection
                        </p>
                    </div>

                </div>

                {/* Search */}
                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#e3e8e0] bg-white p-3 sm:flex-row">

                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search plants..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl bg-[#f6f8f5] px-4 py-3 text-sm text-[#26352a] outline-none placeholder:text-[#9ba49d] focus:ring-2 focus:ring-[#b9cbb8]"
                        />
                    </div>

                    <select
                        value={healthFilter}
                        onChange={(e) => setHealthFilter(e.target.value)}
                        className="rounded-xl bg-[#f6f8f5] px-4 py-3 text-sm text-[#536057] outline-none focus:ring-2 focus:ring-[#b9cbb8]"
                    >
                        <option value="all">All health statuses</option>
                        <option value="healthy">Healthy</option>
                        <option value="needs-attention">Needs attention</option>
                        <option value="sick">Sick</option>
                        <option value="dormant">Dormant</option>
                    </select>

                </div>

            </div>

            {/* Plant Grid */}
            {filteredPlants.length === 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    <div className="mb-3 text-4xl">
                        🌱
                    </div>

                    <h2 className="text-xl font-semibold text-[#26352a]">
                        No plants found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {plants.length === 0
                            ? "Add your first plant to start your garden."
                            : "Try changing your search or filter."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPlants.map((plant) => (
                        <PlantCard
                            key={plant._id}
                            plant={plant}
                            onWater={(id) => waterMutation.mutate(id)}
                            isWatering={waterMutation.isPending}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

function SummaryCard({ label, value, icon, description }) {
    return (
        <div className="rounded-2xl border border-[#e3e8e0] bg-white p-5 shadow-[0_2px_12px_rgba(38,53,42,0.04)]">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm text-[#7c867e]">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight text-[#26352a]">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-[#9aa29b]">
                        {description}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ea] text-[#46634d]">
                    {icon}
                </div>

            </div>

        </div>
    );
}

export default MyGardenPage;