function getWateringStatus(lastWatered, intervalDays) {
    if (!intervalDays) {
        return {
            label: "Schedule TBD",
            className: "bg-gradient-to-r from-stone-100 to-slate-100 text-stone-600 ring-1 ring-stone-200/60",
            iconColor: "text-stone-500",
            icon: "⏳",
        };
    }

    if (!lastWatered) {
        return {
            label: "Watering needed",
            className: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 ring-1 ring-amber-200/60",
            iconColor: "text-amber-600",
            icon: "💧",
        };
    }

    const lastDate = new Date(lastWatered);
    if (Number.isNaN(lastDate.getTime())) {
        return {
            label: "Schedule TBD",
            className: "bg-gradient-to-r from-stone-100 to-slate-100 text-stone-600 ring-1 ring-stone-200/60",
            iconColor: "text-stone-500",
            icon: "⏳",
        };
    }

    const nextWatering = new Date(lastDate);
    nextWatering.setDate(nextWatering.getDate() + Number(intervalDays));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextWatering.setHours(0, 0, 0, 0);

    const difference = nextWatering.getTime() - today.getTime();
    const daysRemaining = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
        return {
            label: `Overdue ${Math.abs(daysRemaining)}d`,
            className: "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 ring-1 ring-rose-200/60",
            iconColor: "text-rose-600",
            icon: "⚠️",
        };
    }
    if (daysRemaining === 0) {
        return {
            label: "Water today",
            className: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 ring-1 ring-amber-200/60",
            iconColor: "text-amber-600",
            icon: "💧",
        };
    }
    if (daysRemaining === 1) {
        return {
            label: "Tomorrow",
            className: "bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-700 ring-1 ring-amber-200/50",
            iconColor: "text-amber-500",
            icon: "💧",
        };
    }
    return {
        label: `In ${daysRemaining} days`,
        className: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 ring-1 ring-green-200/60",
        iconColor: "text-emerald-600",
        icon: "💧",
    };
}

function WaterCountdownBadge({ lastWatered, intervalDays }) {
    const status = getWateringStatus(lastWatered, intervalDays);

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold shadow-sm ${status.className}`}
        >
            <span className="text-sm leading-none">{status.icon}</span>
            {status.label}
        </span>
    );
}

export default WaterCountdownBadge;