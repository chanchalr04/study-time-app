import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Target, Coffee } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const PomodoroTimer = ({ onSessionComplete }) => {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    let interval = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }
    
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const handleTimerComplete = () => {
    setIsActive(false)
    
    if (mode === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)
      toast.success(`Work session ${newSessions} completed!`)
      
      if (onSessionComplete) {
        onSessionComplete({
          duration: workDuration,
          mode: 'work',
          completedAt: new Date()
        })
      }
      
      setMode('break')
      setTimeLeft(breakDuration * 60)
    } else {
      toast.success('Break completed! Ready for work?')
      setMode('work')
      setTimeLeft(workDuration * 60)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (timeLeft / (mode === 'work' ? workDuration * 60 : breakDuration * 60)) * 100

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => {
              if (!isActive) {
                setMode('work')
                setTimeLeft(workDuration * 60)
              }
            }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'work' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Target size={20} />
            <span>Work</span>
          </button>
          <button
            onClick={() => {
              if (!isActive) {
                setMode('break')
                setTimeLeft(breakDuration * 60)
              }
            }}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'break' 
                ? 'bg-secondary-100 text-secondary-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Coffee size={20} />
            <span>Break</span>
          </button>
        </div>
        
        <div className="w-64 h-64 mx-auto mb-6">
          <CircularProgressbar
            value={progress}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textSize: '24px',
              pathColor: mode === 'work' ? '#3b82f6' : '#22c55e',
              textColor: '#1f2937',
              trailColor: '#e5e7eb',
            })}
          />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {mode === 'work' ? 'Focus Time' : 'Break Time'}
        </h3>
        <p className="text-gray-600">
          {mode === 'work' ? 'Stay focused and productive' : 'Take a well-deserved break'}
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
            isActive
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isActive ? (
            <>
              <Pause size={20} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Start</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            setIsActive(false)
            setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60)
          }}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center space-x-2"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Duration: {workDuration} minutes
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={workDuration}
            onChange={(e) => {
              if (!isActive) setWorkDuration(parseInt(e.target.value))
            }}
            disabled={isActive}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Break Duration: {breakDuration} minutes
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={breakDuration}
            onChange={(e) => {
              if (!isActive) setBreakDuration(parseInt(e.target.value))
            }}
            disabled={isActive}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-gray-600">Sessions completed today:</span>
          <span className="text-xl font-bold text-primary-600">{sessions}</span>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer