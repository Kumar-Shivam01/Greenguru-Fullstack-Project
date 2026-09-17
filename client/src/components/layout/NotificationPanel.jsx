import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from "../../api/notificationApi";
import {
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiTrash2,
    FiDroplet,
    FiAlertTriangle,
    FiShield,
    FiFeather,
    FiZap,
    FiX
} from "react-icons/fi";

// Helper for relative timestamps
function formatTimeAgo(dateString) {
    if (!dateString) return "";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Icon and color mappings by notification type
const typeConfig = {
    watering: {
        icon: FiDroplet,
        bg: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
        badge: "Watering",
        badgeColor: "bg-blue-100 text-blue-700"
    },
    health: {
        icon: FiAlertTriangle,
        bg: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
        badge: "Health Alert",
        badgeColor: "bg-rose-100 text-rose-700"
    },
    account: {
        icon: FiShield,
        bg: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
        badge: "Account",
        badgeColor: "bg-amber-100 text-amber-700"
    },
    "plant-activity": {
        icon: FiFeather,
        bg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
        badge: "Garden",
        badgeColor: "bg-emerald-100 text-emerald-700"
    },
    "ai-insight": {
        icon: FiZap,
        bg: "bg-purple-50 text-purple-600 ring-1 ring-purple-100",
        badge: "AI Insight",
        badgeColor: "bg-purple-100 text-purple-700"
    }
};

function NotificationPanel({ isOpen, onClose }) {
    const [filter, setFilter] = useState("all"); // 'all' | 'unread'
    const panelRef = useRef(null);
    const queryClient = useQueryClient();

    // 1. Fetch notifications
    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        enabled: isOpen,
        refetchInterval: isOpen ? 30000 : false // Poll every 30s when open
    });

    const notifications = data?.data || [];
    const unreadCount = data?.unreadCount || 0;

    // 2. Mutations
    const markReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                // If clicked element is the bell toggle button, let Header handle it
                if (e.target.closest("[data-notification-trigger]")) return;
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Filter displayed list
    const filteredNotifications = filter === "unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications;

    return (
        <div
            ref={panelRef}
            className="absolute top-20 right-6 sm:right-10 z-50 w-[92vw] max-w-[420px] rounded-3xl bg-white/95 backdrop-blur-xl border border-stone-200/80 shadow-2xl shadow-forest-900/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
            {/* Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <FiBell className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-forest-800 text-base leading-tight">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                            Plant care alerts & updates
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllReadMutation.mutate()}
                            disabled={markAllReadMutation.isPending}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-stone-100 bg-white text-xs">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        filter === "all"
                            ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
                            : "text-stone-500 hover:bg-stone-100"
                    }`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        filter === "unread"
                            ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
                            : "text-stone-500 hover:bg-stone-100"
                    }`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-stone-100">
                {isLoading ? (
                    <div className="p-8 text-center text-stone-400 space-y-3">
                        <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                        <p className="text-xs font-medium">Checking for updates...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="py-12 px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 mx-auto mb-3">
                            <FiCheckCircle className="h-7 w-7" />
                        </div>
                        <p className="font-bold text-sm text-forest-800">
                            {filter === "unread" ? "No unread alerts" : "All caught up!"}
                        </p>
                        <p className="text-xs text-stone-400 mt-1 max-w-[240px] mx-auto">
                            {filter === "unread"
                                ? "You have reviewed all your alerts."
                                : "Your garden is happy and there are no alerts at this moment."}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => {
                        const config = typeConfig[notification.type] || typeConfig["plant-activity"];
                        const IconComponent = config.icon;

                        return (
                            <div
                                key={notification._id}
                                onClick={() => {
                                    if (!notification.isRead) {
                                        markReadMutation.mutate(notification._id);
                                    }
                                }}
                                className={`group relative p-4 flex items-start gap-3.5 transition-all cursor-pointer ${
                                    notification.isRead
                                        ? "bg-white hover:bg-stone-50/70"
                                        : "bg-emerald-50/30 hover:bg-emerald-50/50"
                                }`}
                            >
                                {/* Type Icon */}
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.bg}`}>
                                    <IconComponent className="h-5 w-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${config.badgeColor}`}>
                                            {config.badge}
                                        </span>
                                        <span className="text-[11px] text-stone-400">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>
                                        {!notification.isRead && (
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 ml-auto" />
                                        )}
                                    </div>

                                    <h4 className={`text-sm tracking-tight leading-snug ${
                                        notification.isRead ? "font-semibold text-stone-700" : "font-bold text-forest-900"
                                    }`}>
                                        {notification.title}
                                    </h4>

                                    <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>

                                {/* Hover Action Controls */}
                                <div className="absolute top-4 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notification.isRead && (
                                        <button
                                            title="Mark as read"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markReadMutation.mutate(notification._id);
                                            }}
                                            className="p-1 rounded-lg hover:bg-white text-emerald-600 hover:text-emerald-700 transition-colors shadow-xs"
                                        >
                                            <FiCheck className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        title="Delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteMutation.mutate(notification._id);
                                        }}
                                        className="p-1 rounded-lg hover:bg-white text-stone-400 hover:text-rose-600 transition-colors shadow-xs"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer summary */}
            {notifications.length > 0 && (
                <div className="p-3 bg-stone-50/80 border-t border-stone-100 text-center text-[11px] text-stone-400 font-medium">
                    Auto-refreshes every 30 seconds
                </div>
            )}
        </div>
    );
}

export default NotificationPanel;
