function getWateringStatus(lastWatered, intervalDays) {
    if (!intervalDays) {
        return {
            label: "Watering schedule unavailable",
            className: "bg-gray-100 text-gray-600",
        };
    }

    if (!lastWatered) {
        return {
            label: "Watering needed",
            className: "bg-amber-50 text-amber-700",
        };
    }

    const lastDate = new Date(lastWatered);

    if (Number.isNaN(lastDate.getTime())) {
        return {
            label: "Watering schedule unavailable",
            className: "bg-gray-100 text-gray-600",
        };
    }

    const nextWatering = new Date(lastDate);
    nextWatering.setDate(
        nextWatering.getDate() + Number(intervalDays)
    );

    const today = new Date();

    // Remove time component
    today.setHours(0, 0, 0, 0);
    nextWatering.setHours(0, 0, 0, 0);

    const difference =
        nextWatering.getTime() - today.getTime();

    const daysRemaining = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) {
        return {
            label: `Overdue by ${Math.abs(daysRemaining)} ${
                Math.abs(daysRemaining) === 1 ? "day" : "days"
            }`,
            className: "bg-red-50 text-red-700",
        };
    }

    if (daysRemaining === 0) {
        return {
            label: "Water today",
            className: "bg-amber-50 text-amber-700",
        };
    }

    if (daysRemaining === 1) {
        return {
            label: "Water tomorrow",
            className: "bg-amber-50 text-amber-700",
        };
    }

    return {
        label: `Water in ${daysRemaining} days`,
        className: "bg-[#edf4eb] text-[#416148]",
    };
}

function WaterCountdownBadge({ lastWatered, intervalDays }) {
    const status = getWateringStatus(
        lastWatered,
        intervalDays
    );

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
        >
            💧 {status.label}
        </span>
    );
}

export default WaterCountdownBadge;