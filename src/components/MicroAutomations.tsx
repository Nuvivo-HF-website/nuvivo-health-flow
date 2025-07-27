import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  Settings,
  Award,
  RefreshCw
} from "lucide-react";

interface Notification {
  id: string;
  type: "warning" | "success" | "info" | "action";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface MicroAutomationsProps {
  completedBookings: number;
  profileComplete: boolean;
  hasAvailability: boolean;
}

export default function MicroAutomations({ 
  completedBookings, 
  profileComplete, 
  hasAvailability 
}: MicroAutomationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Profile incomplete
    if (!profileComplete) {
      newNotifications.push({
        id: "profile-incomplete",
        type: "warning",
        title: "Complete your profile to go live",
        message: "Add your bio, services, and availability to start receiving bookings",
        action: {
          label: "Complete Profile",
          onClick: () => console.log("Navigate to profile")
        }
      });
    }

    // No availability set
    if (!hasAvailability) {
      newNotifications.push({
        id: "no-availability",
        type: "action",
        title: "Add your first time slots",
        message: "Patients can't book if they don't know when you're available",
        action: {
          label: "Set Availability",
          onClick: () => console.log("Open availability modal")
        }
      });
    }

    // Achievement notifications
    if (completedBookings === 5) {
      newNotifications.push({
        id: "silver-achievement",
        type: "success",
        title: "You're now Silver! 🎉",
        message: "£100 away from Gold status. Keep up the great work!",
        dismissible: true
      });
    }

    if (completedBookings === 10) {
      newNotifications.push({
        id: "gold-achievement", 
        type: "success",
        title: "Gold Partner Unlocked! ✨",
        message: "You now have access to premium features and priority support",
        dismissible: true
      });
    }

    // Missed appointment automation
    if (completedBookings > 0) {
      newNotifications.push({
        id: "missed-appointment",
        type: "info",
        title: "Patient missed appointment?",
        message: "Auto-resend booking link for easy rescheduling",
        action: {
          label: "Send Link",
          onClick: () => console.log("Auto-resend booking")
        },
        dismissible: true
      });
    }

    setNotifications(newNotifications);
  }, [completedBookings, profileComplete, hasAvailability]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info": return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "action": return <Calendar className="h-4 w-4 text-primary" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className={`border-l-4 ${
            notification.type === "warning" ? "border-l-yellow-400" :
            notification.type === "success" ? "border-l-green-400" :
            notification.type === "info" ? "border-l-blue-400" :
            "border-l-primary"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  {notification.action && (
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
              {notification.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => dismissNotification(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}