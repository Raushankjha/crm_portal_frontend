import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../../context/SocketContext.jsx'

function NotificationBell() {
  const { socket } = useSocket()
  const [unread, setUnread] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) return

    const handleNotification = () => {
      setUnread((prev) => prev + 1)
    }

    socket.on('notification', handleNotification)

    return () => {
      socket.off('notification', handleNotification)
    }
  }, [socket])

  const handleClick = () => {
    setUnread(0)
    navigate('/notifications')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn btn-ghost"
      style={{ position: 'relative', paddingInline: '0.85rem' }}
    >
      🔔
      {unread > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: 2,
            minWidth: 18,
            height: 18,
            borderRadius: '9999px',
            background: '#ef4444',
            color: '#f9fafb',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingInline: 4,
          }}
        >
          {unread}
        </span>
      )}
    </button>
  )
}

export default NotificationBell

