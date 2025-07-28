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
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { User, Settings, LogOut, FileText, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function UserMenu() {
  const { user, userProfile, signOut } = useAuth()
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
        
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        
        {userProfile?.user_type === 'patient' && (
          <>
            <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>My Appointments</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/results')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Test Results</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/my-files')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>My Documents</span>
            </DropdownMenuItem>
          </>
        )}
        
        {userProfile?.user_type === 'healthcare_professional' && (
          <DropdownMenuItem onClick={() => navigate('/clinic-dashboard')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}