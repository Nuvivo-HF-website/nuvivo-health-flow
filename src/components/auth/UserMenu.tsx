import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { toast } from '@/hooks/use-toast'
import { User, Settings, LogOut, FileText, Calendar, CreditCard, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Unified (no section headers, minimal separators)
export function UserMenu() {
  const { user, userProfile, signOut, hasRole } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      })
      navigate('/')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  const initials = userProfile?.full_name
    ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U'

  const userType = userProfile?.user_type // 'patient' | 'healthcare_professional' | 'doctor' | 'admin' | etc.
  const isPatient = userType === 'patient'
  const isDoctor = userType === 'doctor' || hasRole('doctor')
  const isClinicStaff = hasRole('clinic_staff')
  const isAdmin  = userType === 'admin' || hasRole('admin')

  // Debug logging to help troubleshoot
  console.log('UserMenu Debug:', {
    userType,
    isPatient,
    isDoctor,
    isClinicStaff,
    isAdmin,
    userRoles: user ? 'logged in' : 'not logged in'
  })

  // Build one flat list of menu items (no headings), deduped by route
  const menuItems: Array<{ to: string; label: string; icon: React.ReactNode }> = [
    { to: '/profile', label: 'My Profile', icon: <User className="mr-2 h-4 w-4" /> },
  ]

  if (isPatient) {
    menuItems.push(
      { to: '/my-bookings',       label: 'My Appointments', icon: <Calendar className="mr-2 h-4 w-4" /> },
      { to: '/results',           label: 'Test Results',    icon: <FileText className="mr-2 h-4 w-4" /> },
      { to: '/my-files',          label: 'My Documents',    icon: <FileText className="mr-2 h-4 w-4" /> },
      { to: '/payment-dashboard', label: 'Payments',        icon: <CreditCard className="mr-2 h-4 w-4" /> },
    )
  }

  if (isClinicStaff) {
    menuItems.push(
      { to: '/clinic-dashboard',  label: 'Appointments',       icon: <FileText className="mr-2 h-4 w-4" /> },
      { to: '/manage-staff',      label: 'Manage Staff',       icon: <Settings className="mr-2 h-4 w-4" /> },     
      { to: '/payment-dashboard', label: 'Payments',           icon: <CreditCard className="mr-2 h-4 w-4" /> },
    )
  }

  if (isDoctor) {
    menuItems.push(
      { to: '/staff-dashboard',   label: 'Appointments', icon: <AlertTriangle className="mr-2 h-4 w-4" /> },
      { to: '/payment-dashboard', label: 'Payments',        icon: <CreditCard className="mr-2 h-4 w-4" /> },
    )
  }

  if (isAdmin) {
    menuItems.push(
      { to: '/staff-dashboard',   label: 'Staff Dashboard', icon: <AlertTriangle className="mr-2 h-4 w-4" /> },
    )
  }

  // Deduplicate by route while preserving order
  const seen = new Set<string>()
  const flatItems = menuItems.filter(i => (seen.has(i.to) ? false : (seen.add(i.to), true)))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Compact header (kept), no role label below */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Unified list */}
        {flatItems.map(item => (
          <DropdownMenuItem key={item.to} onClick={() => navigate(item.to)}>
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}

        {/* Single separator before sign out */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
