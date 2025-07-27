import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Home,
  Building,
  CheckCircle,
  RotateCcw,
  XCircle,
  Plus,
  Eye
} from "lucide-react";

// Today's appointments mock data
const todaysBookings = [
  {
    id: "1",
    patient_name: "John Smith",
    service_name: "Energy Panel",
    date_time: "2024-01-15T10:30:00",
    duration: 30,
    status: "confirmed",
    location_type: "video"
  },
  {
    id: "2", 
    patient_name: "Sarah Wilson",
    service_name: "Blood Pressure Check",
    date_time: "2024-01-15T14:00:00", 
    duration: 20,
    status: "pending",
    location_type: "home"
  },
  {
    id: "3",
    patient_name: "Mike Johnson", 
    service_name: "General Consultation",
    date_time: "2024-01-15T16:30:00",
    duration: 45,
    status: "confirmed",
    location_type: "clinic"
  }
];

interface SimplifiedBookingCalendarProps {
  isSimpleMode?: boolean;
}

export default function SimplifiedBookingCalendar({ isSimpleMode = false }: SimplifiedBookingCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<"today" | "week">("today");

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmed": return "#22c55e";
      case "pending": return "#eab308"; 
      case "cancelled": return "#ef4444";
      case "completed": return "#6b7280";
      default: return "#3b82f6";
    }
  }

  function getLocationIcon(locationType: string) {
    switch (locationType) {
      case "video": return <Video className="h-4 w-4" />;
      case "home": return <Home className="h-4 w-4" />;
      case "clinic": return <Building className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  }

  const handleQuickAction = (bookingId: string, action: string) => {
    console.log(`${action} booking ${bookingId}`);
    setIsDialogOpen(false);
  };

  if (view === "today") {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <h3 className="text-lg font-medium">Today's Schedule</h3>
            <Badge variant="secondary">{todaysBookings.length} appointments</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView("week")}>
              <Eye className="mr-2 h-4 w-4" />
              View Week
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Booking
            </Button>
          </div>
        </div>

        {/* Today's Appointments - Simple Cards */}
        <div className="space-y-3">
          {todaysBookings.map((booking) => (
            <Card 
              key={booking.id} 
              className="hover:shadow-md transition-shadow cursor-pointer hover-scale"
              onClick={() => {
                setSelectedBooking(booking);
                setIsDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    />
                    <div>
                      <div className="font-medium">
                        {booking.patient_name} – {booking.service_name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(booking.date_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })} ({booking.duration} min)
                        {getLocationIcon(booking.location_type)}
                        <span className="capitalize">{booking.location_type}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="capitalize"
                    style={{ 
                      backgroundColor: booking.status === "pending" ? "#fef3c7" : "transparent",
                      color: booking.status === "pending" ? "#92400e" : "inherit"
                    }}
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Dialog - Minimal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedBooking && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    {selectedBooking.patient_name}
                  </DialogTitle>
                  <div className="text-center text-sm text-muted-foreground">
                    {selectedBooking.service_name} • {new Date(selectedBooking.date_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </DialogHeader>
                
                <div className="grid grid-cols-1 gap-3 pt-4">
                  <Button 
                    className="h-12 text-base"
                    onClick={() => handleQuickAction(selectedBooking.id, "complete")}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Mark Complete
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 text-base"
                    onClick={() => handleQuickAction(selectedBooking.id, "reschedule")}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reschedule
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="h-12 text-base"
                    onClick={() => handleQuickAction(selectedBooking.id, "cancel")}
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Week view fallback to full calendar for expert mode
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h3 className="text-lg font-medium">Weekly Schedule</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => setView("today")}>
          Back to Today
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            initialView="timeGridWeek"
            events={todaysBookings.map(booking => ({
              id: booking.id,
              title: `${booking.patient_name} - ${booking.service_name}`,
              start: booking.date_time,
              end: new Date(new Date(booking.date_time).getTime() + booking.duration * 60000),
              backgroundColor: getStatusColor(booking.status),
              borderColor: getStatusColor(booking.status),
              textColor: booking.status === "pending" ? "#000" : "#fff"
            }))}
            eventClick={(clickInfo) => {
              const booking = todaysBookings.find(b => b.id === clickInfo.event.id);
              setSelectedBooking(booking);
              setIsDialogOpen(true);
            }}
            height="500px"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
          />
        </CardContent>
      </Card>

      {/* Same dialog as above */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {selectedBooking.patient_name}
                </DialogTitle>
                <div className="text-center text-sm text-muted-foreground">
                  {selectedBooking.service_name} • {new Date(selectedBooking.date_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 gap-3 pt-4">
                <Button 
                  className="h-12 text-base"
                  onClick={() => handleQuickAction(selectedBooking.id, "complete")}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Mark Complete
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 text-base"
                  onClick={() => handleQuickAction(selectedBooking.id, "reschedule")}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reschedule
                </Button>
                <Button 
                  variant="destructive" 
                  className="h-12 text-base"
                  onClick={() => handleQuickAction(selectedBooking.id, "cancel")}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}