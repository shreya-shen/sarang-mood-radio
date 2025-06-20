
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabaseService } from '@/services/supabase'

type DataSource = 'mock' | 'supabase' | 'external'

interface AppContextType {
  dataSource: DataSource
  setDataSource: (source: DataSource) => void
  user: any
  isAuthenticated: boolean
  spotifyLinked: boolean
  setSpotifyLinked: (linked: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataSource, setDataSource] = useState<DataSource>('mock')
  const [spotifyLinked, setSpotifyLinked] = useState(false)
  const { user: clerkUser } = useUser()
  const [supabaseUser, setSupabaseUser] = useState(null)

  useEffect(() => {
    // Check for Supabase user
    supabaseService.getCurrentUser().then(user => {
      if (user) setSupabaseUser(user)
    })
  }, [])

  const user = clerkUser || supabaseUser
  const isAuthenticated = !!user

  return (
    <AppContext.Provider value={{
      dataSource,
      setDataSource,
      user,
      isAuthenticated,
      spotifyLinked,
      setSpotifyLinked
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
