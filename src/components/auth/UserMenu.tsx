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

type MenuItem = {
  to: string
  label: string
  icon: React.ReactNode
}

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

  // Normalize account types / roles
  const userType = userProfile?.user_type // 'patient' | 'healthcare_professional' | 'doctor' | 'admin' | etc.
  const isPatient = userType === 'patient'
  const isHCP = userType === 'healthcare_professional'
  const isDoctor = userType === 'doctor' || hasRole('doctor')
  const isAdmin  = userType === 'admin' || hasRole('admin')

  // Define distinct menu sections per account type.
  // If a section already exists in your original app, we reproduce it verbatim (per your “ignore if already created” note).
  const patientItems: MenuItem[] = isPatient ? [
    { to: '/my-bookings',        label: 'My Appointments', icon: <Calendar className="mr-2 h-4 w-4" /> },
    { to: '/results',            label: 'Test Results',    icon: <FileText className="mr-2 h-4 w-4" /> },
    { to: '/my-files',           label: 'My Documents',    icon: <FileText className="mr-2 h-4 w-4" /> },
    { to: '/payment-dashboard',  label: 'Payments',        icon: <CreditCard className="mr-2 h-4 w-4" /> },
  ] : []

  const hcpItems: MenuItem[] = isHCP ? [
    { to: '/clinic-dashboard',   label: 'Dashboard',       icon: <Settings className="mr-2 h-4 w-4" /> },
    { to: '/testing',            label: 'System Testing',  icon: <Settings className="mr-2 h-4 w-4" /> },
  ] : []

  // Doctor-specific section (if you already have doctor routes, add them here).
  // For now, this uses the shared Staff Dashboard you already surface for doctors.
  const doctorItems: MenuItem[] = isDoctor ? [
    { to: '/staff-dashboard',    label: 'Staff Dashboard', icon: <AlertTriangle className="mr-2 h-4 w-4" /> },
  ] : []

  // Admin-specific section (keeps your existing Staff Dashboard entry).
  const adminItems: MenuItem[] = isAdmin ? [
    { to: '/staff-dashboard',    label: 'Staff Dashboard', icon: <AlertTriangle className="mr-2 h-4 w-4" /> },
  ] : []

  // Helper to render a section with optional heading and de-duplicate by route
  const renderedRoutes = new Set<string>()
  const renderSection = (title: string, items: MenuItem[]) => {
    const filtered = items.filter(it => {
      if (renderedRoutes.has(it.to)) return false
      renderedRoutes.add(it.to)
      return true
    })
    if (filtered.length === 0) return null
    return (
      <>
        <DropdownMenuLabel className="text-xs text-muted-foreground">{title}</DropdownMenuLabel>
        {filtered.map((it) => (
          <DropdownMenuItem key={`${title}-${it.to}`} onClick={() => navigate(it.to)}>
            {it.icon}
            <span>{it.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
      </>
    )
  }

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
        {/* Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {userProfile?.user_type && (
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {userProfile.user_type.replace('_', ' ')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Common */}
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Segmented sections */}
        {renderSection('Patient', patientItems)}
        {renderSection('Doctor', doctorItems)}
        {renderSection('Admin', adminItems)}
        {renderSection('Healthcare professional', hcpItems)}

        {/* Sign out */}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
