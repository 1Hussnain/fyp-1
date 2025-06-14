
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BudgetNotification {
  id: string;
  type: 'budget_warning' | 'budget_exceeded' | 'spending_pattern' | 'goal_progress';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
}

export const useNotificationSystem = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<BudgetNotification[]>([]);

  const addNotification = useCallback((notification: Omit<BudgetNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: BudgetNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for immediate feedback
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'budget_exceeded' ? 'destructive' : 'default',
    });

    return newNotification.id;
  }, [toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications
  };
};
