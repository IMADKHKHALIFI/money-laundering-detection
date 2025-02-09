"use client"

import { useState, useEffect } from "react"

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null)
  const [is24HourFormat, setIs24HourFormat] = useState(true)

  useEffect(() => {
    setTime(new Date())
    
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toggleFormat = () => {
    setIs24HourFormat(!is24HourFormat)
  }

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24HourFormat,
      timeZone: "Africa/Casablanca",
    }
    return date.toLocaleTimeString("en-US", options)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  if (!time) {
    return null
  }

  return (
    <div className="clock-container" onClick={toggleFormat}>
      <div className="time">{formatTime(time)}</div>
      <div className="date">{formatDate(time)}</div>
      <div className="timezone">Casablanca Time (GMT+1)</div>
    </div>
  )
} 