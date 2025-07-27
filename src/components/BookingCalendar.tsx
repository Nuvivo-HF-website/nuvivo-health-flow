import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Video,
  Home,
  Building,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
} from "lucide-react";

// Mock booking data with proper structure
const mockBookings = [
  {
    id: "1",
    partner_id: "partner_1",
    patient_name: "Sarah Johnson",
    patient_email: "sarah.johnson@email.com",
    patient_phone: "+44 7123 456789",
    date_time: "2024-01-15T14:00:00",
    duration: 30,
    status: "confirmed",
    location_type: "video",
    service_name: "General Consultation",
    notes: "First-time consultation for general health check",
    payment_status: "paid"
  },
  {
    id: "2",
    partner_id: "partner_1",
    patient_name: "Michael Brown",
    patient_email: "michael.brown@email.com",
    patient_phone: "+44 7987 654321",
    date_time: "2024-01-16T10:30:00",
    duration: 20,
    status: "pending",
    location_type: "home",
    service_name: "Blood Pressure Check",
    notes: "Regular monitoring appointment",
    payment_status: "pending"
  },
  {
    id: "3",
    partner_id: "partner_1",
    patient_name: "Emma Wilson",
    patient_email: "emma.wilson@email.com",
    patient_phone: "+44 7555 123456",
    date_time: "2024-01-17T09:00:00",
    duration: 45,
    status: "confirmed",
    location_type: "clinic",
    service_name: "Physiotherapy Session",
    notes: "Follow-up session for knee injury",
    payment_status: "paid"
  },
  {
    id: "4",
    partner_id: "partner_1",
    patient_name: "James Smith",
    patient_email: "james.smith@email.com",
    patient_phone: "+44 7444 987654",
    date_time: "2024-01-18T15:30:00",
    duration: 30,
    status: "cancelled",
    location_type: "video",
    service_name: "Mental Health Consultation",
    notes: "Patient requested cancellation",
    payment_status: "refunded"
  },
  {
    id: "5",
    partner_id: "partner_1",
    patient_name: "Lisa Davis",
    patient_email: "lisa.davis@email.com",
    patient_phone: "+44 7333 555777",
    date_time: "2024-01-19T11:00:00",
    duration: 60,
    status: "completed",
    location_type: "clinic",
    service_name: "Nutritional Consultation",
    notes: "Diet plan consultation completed successfully",
    payment_status: "paid"
  }
];

interface BookingCalendarProps {
  className?: string;
}

export default function BookingCalendar({ className }: BookingCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Filter bookings based on search and filters
  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch = 
      booking.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesService = serviceFilter === "all" || booking.service_name === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  // Convert bookings to FullCalendar events
  const calendarEvents = filteredBookings.map((booking) => ({
    id: booking.id,
    title: `${booking.patient_name} - ${booking.service_name}`,
    start: booking.date_time,
    end: new Date(new Date(booking.date_time).getTime() + booking.duration * 60000).toISOString(),
    backgroundColor: getStatusColor(booking.status),
    borderColor: getStatusColor(booking.status),
    textColor: booking.status === "pending" ? "#000" : "#fff",
    extendedProps: booking,
  }));

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmed":
        return "#22c55e"; // green
      case "pending":
        return "#eab308"; // yellow
      case "cancelled":
        return "#ef4444"; // red
      case "completed":
        return "#6b7280"; // gray
      default:
        return "#3b82f6"; // blue
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  }

  function getLocationIcon(locationType: string) {
    switch (locationType) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "home":
        return <Home className="h-4 w-4" />;
      case "clinic":
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  }

  const handleEventClick = (clickInfo: any) => {
    setSelectedBooking(clickInfo.event.extendedProps);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
    setIsDialogOpen(false);
  };

  const uniqueServices = [...new Set(mockBookings.map(b => b.service_name))];

  return (
    <div className={className}>
      {/* Calendar Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Appointment Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Toggle */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={calendarView === "timeGridDay" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCalendarView("timeGridDay");
                calendarRef.current?.getApi().changeView("timeGridDay");
              }}
            >
              Day
            </Button>
            <Button
              variant={calendarView === "timeGridWeek" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCalendarView("timeGridWeek");
                calendarRef.current?.getApi().changeView("timeGridWeek");
              }}
            >
              Week
            </Button>
            <Button
              variant={calendarView === "dayGridMonth" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCalendarView("dayGridMonth");
                calendarRef.current?.getApi().changeView("dayGridMonth");
              }}
            >
              Month
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {uniqueServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Completed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            initialView={calendarView}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="600px"
            dayMaxEvents={3}
            moreLinkClick="popover"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: true,
            }}
          />
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Appointment Details
                </DialogTitle>
                <DialogDescription>
                  Manage this appointment and update status
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedBooking.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedBooking.patient_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedBooking.patient_phone}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Appointment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(selectedBooking.date_time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(selectedBooking.date_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} ({selectedBooking.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(selectedBooking.location_type)}
                        <span className="text-sm capitalize">{selectedBooking.location_type}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service & Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <span className="font-medium">{selectedBooking.service_name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      {getStatusIcon(selectedBooking.status)}
                      <Badge variant="outline" className="capitalize">
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    defaultValue={selectedBooking.notes}
                    placeholder="Add appointment notes..."
                    rows={3}
                  />
                </div>

                {/* Update Status */}
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select onValueChange={(value) => handleStatusUpdate(selectedBooking.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Mark as Confirmed</SelectItem>
                      <SelectItem value="completed">Mark as Completed</SelectItem>
                      <SelectItem value="cancelled">Mark as Cancelled</SelectItem>
                      <SelectItem value="pending">Mark as Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button variant="default" size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                  <Button variant="destructive" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Add Notes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}