'use client'
import React, { createContext, useContext, useState } from 'react'

interface ScheduleItem {
  day: string
  time: string
  course: string
  room: string
  batch: string
}

interface ScheduleContextType {
  schedule: ScheduleItem[]
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export const useSchedule = () => {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}