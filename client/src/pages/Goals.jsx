import React, { useState } from 'react'
import GoalCard from '../components/GoalCard'
import { Target, TrendingUp, Calendar, Plus } from 'lucide-react'

const Goals = () => {
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      title: 'Complete Calculus Course', 
      category: 'Mathematics',
      progress: 65,
      currentTime: 1300,
      targetTime: 2000,
      priority: 'high',
      status: 'in-progress',
      deadline: '2024-12-31',
      description: 'Complete all chapters and exercises from the Calculus textbook',
      milestones: [
        { title: 'Chapter 1-3', completed: true },
        { title: 'Chapter 4-6', completed: true },
        { title: 'Chapter 7-10', completed: false }
      ],
      tags: ['math', 'calculus', 'study']
    },
    { 
      id: 2, 
      title: 'Learn React Advanced', 
      category: 'Programming',
      progress: 30,
      currentTime: 600,
      targetTime: 2000,
      priority: 'medium',
      status: 'in-progress',
      deadline: '2024-12-25',
      description: 'Master advanced React concepts and build 3 projects',
      tags: ['react', 'javascript', 'frontend']
    },
    { 
      id: 3, 
      title: 'Improve Physics Concepts', 
      category: 'Physics',
      progress: 100,
      currentTime: 1500,
      targetTime: 1500,
      priority: 'medium',
      status: 'completed',
      deadline: '2024-11-30',
      description: 'Complete Mechanics and Thermodynamics sections',
      tags: ['physics', 'mechanics', 'thermodynamics']
    },
  ])

  const stats = {
    total: goals.length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    completed: goals.filter(g => g.status === 'completed').length,
    totalTime: goals.reduce((sum, goal) => sum + goal.currentTime, 0),
    targetTime: goals.reduce((sum, goal) => sum + goal.targetTime, 0),
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    return hours > 0 ? `${hours} hours` : `${minutes} minutes`
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Goals</h1>
        <p className="text-gray-600">Track your study goals and milestones</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Target className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round((stats.totalTime / stats.targetTime) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-2">Time Spent</h3>
          <div className="text-3xl font-bold text-primary-600">
            {formatTime(stats.totalTime)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Total time dedicated to all goals
          </p>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-800 mb-2">Time Remaining</h3>
          <div className="text-3xl font-bold text-secondary-600">
            {formatTime(stats.targetTime - stats.totalTime)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Time needed to complete all goals
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Goals</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Add New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={() => console.log('Edit goal:', goal)}
            onDelete={(id) => setGoals(goals.filter(g => g.id !== id))}
            onViewDetails={() => console.log('View goal details:', goal)}
          />
        ))}

        {/* Add New Goal Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="text-primary-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Create New Goal
          </h3>
          <p className="text-gray-600">
            Set a new study goal to track your progress
          </p>
        </div>
      </div>
    </div>
  )
}

export default Goals