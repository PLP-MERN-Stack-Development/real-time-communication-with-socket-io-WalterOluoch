import { useEffect, useMemo, useRef, useState } from 'react'
import { useSocket } from './socket/socket'
import { socket } from './socket/socket'

function formatTime(iso) {
  try { return new Date(iso).toLocaleTimeString() } catch { return '' }
}

export default function App() {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    connectionError,
  } = useSocket()

  const [username, setUsername] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [text, setText] = useState('')
  const [activePeerId, setActivePeerId] = useState(null)
  const [unreadByPeer, setUnreadByPeer] = useState({})
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const typingTimer = useRef(null)
  const listRef = useRef(null)

  // Derived room label
  const activeRoomLabel = useMemo(() => {
    if (!activePeerId) return 'Global Chat'
    const peer = users.find(u => u.id === activePeerId)
    return peer ? `Private with ${peer.username}` : 'Private'
  }, [activePeerId, users])

  useEffect(() => {
    if (!loggedIn) return
    // Auto-scroll to bottom on new messages
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loggedIn])

  useEffect(() => {
    if (notifyEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [notifyEnabled])

  // Unread counts for private threads
  useEffect(() => {
    if (!loggedIn) return
    const last = messages[messages.length - 1]
    if (!last) return
    if (!last.isPrivate) return
    const isFromPeer = last.senderId === activePeerId
    const isMine = users.find(u => u.id === last.senderId)?.username === username
    if (!isMine && isFromPeer === false) {
      setUnreadByPeer(prev => ({ ...prev, [last.senderId]: (prev[last.senderId] || 0) + 1 }))
      if (notifyEnabled) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${last.sender}`, { body: last.message })
        }
        const audio = new Audio('/notify.mp3')
        audio.play().catch(() => {})
      }
    }
  }, [messages, activePeerId, notifyEnabled, users, username, loggedIn])

  const handleLogin = () => {
    if (!username.trim()) return
    connect(username.trim())
    setLoggedIn(true)
  }

  const handleSend = () => {
    if (!text.trim()) return
    if (activePeerId) {
      sendPrivateMessage(activePeerId, text.trim())
      // Clear unread for this peer when we reply
      setUnreadByPeer(prev => ({ ...prev, [activePeerId]: 0 }))
    } else {
      sendMessage(text.trim())
    }
    setText('')
    setTyping(false)
  }

  const handleTyping = (value) => {
    setText(value)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    setTyping(true)
    typingTimer.current = setTimeout(() => setTyping(false), 1200)
  }

  const openPrivate = (peerId) => {
    setActivePeerId(peerId)
    setUnreadByPeer(prev => ({ ...prev, [peerId]: 0 }))
  }

  if (!loggedIn) {
    return (
      <div className="login">
        <h2>Gyming Buddies</h2>
        <input placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={handleLogin}>Enter Chat</button>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <input type="checkbox" checked={notifyEnabled} onChange={e => setNotifyEnabled(e.target.checked)} /> Enable notifications
        </label>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Gyming Buddies</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge">{isConnected ? 'Online' : 'Offline'}</span>
          <button onClick={() => { disconnect(); setLoggedIn(false) }}>Logout</button>
        </div>
      </div>
      {connectionError ? (
        <div style={{ marginBottom: 8, color: '#fca5a5' }}>Connection error: {connectionError}</div>
      ) : null}

      <div className="container">
        <aside className="sidebar">
          <div className="section-title">Rooms</div>
          <div className="user" onClick={() => setActivePeerId(null)}>
            <span className="name"># Global</span>
          </div>
          <div className="section-title" style={{ marginTop: 12 }}>Users</div>
          {users.map(u => (
            <div key={u.id} className="user" onClick={() => openPrivate(u.id)}>
              <span className="name">{u.username}</span>
              <span className="status">
                {unreadByPeer[u.id] ? <span className="badge">{unreadByPeer[u.id]}</span> : 'online'}
              </span>
            </div>
          ))}
          <div className="section-title" style={{ marginTop: 12 }}>Typing</div>
          <div className="typing">{typingUsers.length ? `${typingUsers.join(', ')} typing...` : '—'}</div>
        </aside>

        <main className="main">
          <div style={{ padding: 12, borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between' }}>
            <div>{activeRoomLabel}</div>
          </div>
          <div className="messages" ref={listRef}>
            {messages
              .filter(m => {
                if (!activePeerId) return !m.isPrivate
                if (!m.isPrivate) return false
                // show if from peer or from me in this thread
                return m.senderId === activePeerId || m.senderId === socket.id
              })
              .map(m => (
                <div key={m.id} className={`message ${m.system ? 'system' : ''}`}>
                  {!m.system && (
                    <div className="meta">
                      <span>{m.sender || 'System'}</span>
                      <span>•</span>
                      <span>{formatTime(m.timestamp)}</span>
                      {m.isPrivate ? <span className="badge">Private</span> : null}
                    </div>
                  )}
                  <div>{m.message}</div>
                </div>
              ))}
          </div>
          <div className="input">
            <input
              placeholder={activePeerId ? 'Message privately...' : 'Message #global...'}
              value={text}
              onChange={e => handleTyping(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
            />
            <button onClick={handleSend} disabled={!text.trim() || !isConnected}>Send</button>
          </div>
        </main>
      </div>
    </div>
  )
}
