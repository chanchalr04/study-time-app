import React, { useState } from 'react'
import StatsDashboard from '../components/StatsDashboard'
import TaskList from '../components/TaskList'
import GoalCard from '../components/GoalCard'
import { Plus } from 'lucide-react'

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Math assignment', priority: 'high', status: 'todo', dueDate: '2024-12-20' },
    { id: 2, title: 'Read Physics chapter 5', priority: 'medium', status: 'todo', dueDate: '2024-12-22' },
    { id: 3, title: 'Chemistry lab report', priority: 'high', status: 'completed', dueDate: '2024-12-18' },
    { id: 4, title: 'Programming project', priority: 'low', status: 'todo' },
  ])

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
      milestones: [{ completed: true }, { completed: true }, { completed: false }],
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
      tags: ['react', 'javascript', 'frontend']
    },
  ])

  const stats = {
    todayTime: 45,
    weekTime: 320,
    goalProgress: 75,
    streak: 5,
    completedTasks: 1,
    totalTasks: 4
  }

  const weeklyData = [
    { day: 'Mon', time: 45 },
    { day: 'Tue', time: 60 },
    { day: 'Wed', time: 30 },
    { day: 'Thu', time: 75 },
    { day: 'Fri', time: 90 },
    { day: 'Sat', time: 45 },
    { day: 'Sun', time: 60 },
  ]

  const handleAddTask = (task) => {
    const newTask = { ...task, id: Date.now() }
    setTasks([...tasks, newTask])
  }

  const handleUpdateTask = (taskId, updates) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updates } : task))
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to your study dashboard</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Session
        </button>
      </div>

      {/* Stats Dashboard */}
      <StatsDashboard stats={stats} weeklyData={weeklyData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Goals Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Goals</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => console.log('Edit goal:', goal)}
                onDelete={(id) => setGoals(goals.filter(g => g.id !== id))}
                onViewDetails={() => console.log('View goal details:', goal)}
              />
            ))}
            
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex flex-col items-center justify-center gap-2">
              <Plus size={24} />
              <span>Add New Goal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard