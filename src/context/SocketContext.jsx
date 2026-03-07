import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../utils/storage.js'

const SocketContext = createContext(null)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const instance = io(SOCKET_URL, {
      auth: {
        token,
      },
    })

    setSocket(instance)

    return () => {
      instance.disconnect()
    }
  }, [])

  const value = useMemo(
    () => ({
      socket,
    }),
    [socket],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return ctx
}

