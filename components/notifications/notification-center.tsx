"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Paiement en retard",
      message: "Marie Nkomo - Villa Yaoundé (450K FCFA)",
      type: "warning",
      timestamp: "Il y a 2h",
      read: false,
    },
    {
      id: 2,
      title: "Contrat expirant",
      message: "Jean Kamdem - Contrat expire en 7 jours",
      type: "info",
      timestamp: "Il y a 1j",
      read: false,
    },
    {
      id: 3,
      title: "Paiement reçu",
      message: "Pierre Diouf a payé 450K FCFA",
      type: "success",
      timestamp: "Il y a 3j",
      read: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColors = {
    info: "bg-blue-50 text-accent",
    warning: "bg-amber-50 text-warning",
    error: "bg-red-50 text-alert",
    success: "bg-green-50 text-success",
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={20} className="text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-alert text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-primary">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notif.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeColors[notif.type]}`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-primary">{notif.title}</p>
                      <p className="text-xs text-muted mt-1">{notif.message}</p>
                      <p className="text-xs text-faint mt-2">{notif.timestamp}</p>
                    </div>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-muted hover:text-primary"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-accent hover:underline mt-2"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted">
                <p className="text-sm">Aucune notification</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
