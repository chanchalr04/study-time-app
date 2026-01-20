import React, { useState } from 'react'
import PomodoroTimer from '../components/PomodoroTimer'
import SessionForm from '../components/SessionForm'
import { Plus } from 'lucide-react'

const Timer = () => {
  const [sessions, setSessions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState(null)

  const handleSessionComplete = (sessionData) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      createdAt: new Date().toISOString(),
    }
    setSessions([newSession, ...sessions])
    setShowForm(false)
  }

  const handleSubmitSession = (formData) => {
    if (editingSession) {
      // Update existing session
      setSessions(sessions.map(s => 
        s.id === editingSession.id ? { ...s, ...formData } : s
      ))
      setEditingSession(null)
    } else {
      // Add new session
      const newSession = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      setSessions([newSession, ...sessions])
    }
    setShowForm(false)
  }

  const handleEditSession = (session) => {
    setEditingSession(session)
    setShowForm(true)
  }

  const handleDeleteSession = (sessionId) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pomodoro Timer</h1>
        <p className="text-gray-600">Stay focused and productive with timed sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Sessions</h2>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2 py-2"
              >
                <Plus size={18} />
                <span>Log Session</span>
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No sessions logged yet.</p>
                <p className="text-sm mt-2">Start a timer or log a session manually.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{session.title}</h3>
                        <p className="text-sm text-gray-600">{session.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{session.duration} min</div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {session.mode || 'pomodoro'}
                        </span>
                        {session.productivityRating && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            {session.productivityRating}/5
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSession(session)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <SessionForm
              onSubmit={handleSubmitSession}
              initialData={editingSession || {}}
              onCancel={() => {
                setShowForm(false)
                setEditingSession(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Timer