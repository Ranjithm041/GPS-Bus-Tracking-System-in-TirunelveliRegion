import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface NotificationContextType {
  subscribe: (busId: string, stopName: string) => void;
  unsubscribe: (busId: string, stopName: string) => void;
  hasSubscription: (busId: string, stopName: string) => boolean;
  subscriptions: Subscription[];
  requestNotificationPermission: () => Promise<boolean>;
  notificationsEnabled: boolean;
}

interface Subscription {
  busId: string;
  stopName: string;
}

export const NotificationContext = createContext<NotificationContextType>({
  subscribe: () => {},
  unsubscribe: () => {},
  hasSubscription: () => false,
  subscriptions: [],
  requestNotificationPermission: async () => false,
  notificationsEnabled: false,
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Check if notifications are already permitted
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    // Load subscriptions from localStorage
    const savedSubscriptions = localStorage.getItem('busSubscriptions');
    if (savedSubscriptions) {
      try {
        setSubscriptions(JSON.parse(savedSubscriptions));
      } catch (e) {
        console.error('Failed to parse saved subscriptions', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save subscriptions to localStorage whenever they change
    localStorage.setItem('busSubscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const requestNotificationPermission = async (): Promise<boolean> => {
    try {
      const permission = await Notification.requestPermission();
      const enabled = permission === 'granted';
      setNotificationsEnabled(enabled);
      
      if (enabled) {
        toast.success("Notifications enabled successfully!");
      } else {
        toast.error("You need to allow notifications to receive alerts");
      }
      
      return enabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error("Failed to enable notifications. Please try again.");
      return false;
    }
  };

  const subscribe = (busId: string, stopName: string) => {
    if (!notificationsEnabled) {
      requestNotificationPermission();
      return;
    }

    if (!hasSubscription(busId, stopName)) {
      setSubscriptions(prev => [...prev, { busId, stopName }]);
      toast.success(`You'll be notified when bus ${busId} reaches ${stopName}`);
    }
  };

  const unsubscribe = (busId: string, stopName: string) => {
    setSubscriptions(prev => 
      prev.filter(sub => !(sub.busId === busId && sub.stopName === stopName))
    );
    toast.info(`Notification for bus ${busId} at ${stopName} removed`);
  };

  const hasSubscription = (busId: string, stopName: string): boolean => {
    return subscriptions.some(sub => sub.busId === busId && sub.stopName === stopName);
  };

  return (
    <NotificationContext.Provider
      value={{
        subscribe,
        unsubscribe,
        hasSubscription,
        subscriptions,
        requestNotificationPermission,
        notificationsEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};