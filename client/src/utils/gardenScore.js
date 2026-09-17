/**
 * Calculates a dynamic Garden Score from 0 to 100 based on:
 * 1. Plant Health (0 - 50 points)
 * 2. Watering Discipline (0 - 30 points)
 * 3. Care Engagement & Verification (0 - 20 points)
 */
export function calculateGardenScore(plants = [], user = {}) {
    if (!plants || plants.length === 0) {
        return user?.isAccountVerified ? 100 : 85;
    }

    const now = new Date();

    // ── 1. Plant Health Score (Max 50 pts) ──────────────────────
    const healthWeights = {
        healthy: 1.0,
        dormant: 0.9,
        "needs-attention": 0.5,
        sick: 0.1,
    };

    const totalHealthScore = plants.reduce((sum, plant) => {
        const weight = healthWeights[plant.healthStatus] ?? 0.8;
        return sum + weight;
    }, 0);

    const healthPoints = (totalHealthScore / plants.length) * 50;

    // ── 2. Watering Discipline Score (Max 30 pts) ───────────────
    const totalWaterScore = plants.reduce((sum, plant) => {
        const interval = plant.careInfo?.waterIntervalDays || 7;
        const lastWateredDate = plant.lastWatered
            ? new Date(plant.lastWatered)
            : new Date(plant.createdAt || now);

        const daysSinceWatered = Math.floor(
            (now - lastWateredDate) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceWatered <= interval) {
            return sum + 1.0; // On schedule
        } else if (daysSinceWatered <= interval + 2) {
            return sum + 0.6; // 1-2 days overdue
        } else {
            return sum + 0.2; // Significantly overdue
        }
    }, 0);

    const wateringPoints = (totalWaterScore / plants.length) * 30;

    // ── 3. Care Engagement & Profile (Max 20 pts) ───────────────
    let engagementPoints = 0;

    // +10 pts if any plant has at least one health check-in photo logged
    const hasAnyCheckins = plants.some(
        (p) => p.healthTimeline && p.healthTimeline.length > 0
    );
    if (hasAnyCheckins) engagementPoints += 10;

    // +5 pts for verified email account
    if (user?.isAccountVerified) engagementPoints += 5;

    // +5 pts for having 2 or more plants in collection
    if (plants.length >= 2) engagementPoints += 5;

    // ── Total Final Score (0 - 100) ─────────────────────────────
    const finalScore = Math.round(healthPoints + wateringPoints + engagementPoints);
    return Math.min(100, Math.max(0, finalScore));
}

/**
 * Returns descriptive status and styling for a given score tier
 */
export function getScoreTier(score) {
    if (score >= 90) {
        return {
            label: "Master Botanist",
            badgeBg: "bg-emerald-100 text-emerald-800",
            glow: "text-emerald-500",
            bgGradient: "from-emerald-50 to-green-50 ring-emerald-100/60",
            textColor: "text-emerald-800",
            subColor: "text-emerald-700",
        };
    }
    if (score >= 75) {
        return {
            label: "Thriving",
            badgeBg: "bg-emerald-50 text-emerald-700",
            glow: "text-emerald-500",
            bgGradient: "from-emerald-50 to-green-50 ring-emerald-100/60",
            textColor: "text-emerald-800",
            subColor: "text-emerald-700",
        };
    }
    if (score >= 50) {
        return {
            label: "Needs Care",
            badgeBg: "bg-amber-100 text-amber-800",
            glow: "text-amber-500",
            bgGradient: "from-amber-50 to-yellow-50 ring-amber-100/60",
            textColor: "text-amber-800",
            subColor: "text-amber-700",
        };
    }
    return {
        label: "Critical",
        badgeBg: "bg-rose-100 text-rose-800",
        glow: "text-rose-500",
        bgGradient: "from-rose-50 to-red-50 ring-rose-100/60",
        textColor: "text-rose-800",
        subColor: "text-rose-700",
    };
}
