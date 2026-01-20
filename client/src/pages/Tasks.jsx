import React, { useState } from 'react'
import TaskList from '../components/TaskList'
import { Filter, Plus } from 'lucide-react'

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Math assignment', priority: 'high', status: 'todo', dueDate: '2024-12-20' },
    { id: 2, title: 'Read Physics chapter 5', priority: 'medium', status: 'todo', dueDate: '2024-12-22' },
    { id: 3, title: 'Chemistry lab report', priority: 'high', status: 'completed', dueDate: '2024-12-18' },
    { id: 4, title: 'Programming project', priority: 'low', status: 'todo' },
    { id: 5, title: 'Prepare for English presentation', priority: 'medium', status: 'todo', dueDate: '2024-12-25' },
  ])

  const [filter, setFilter] = useState('all')

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'pending') return task.status === 'todo'
    if (filter === 'high') return task.priority === 'high'
    return task.priority === filter
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'todo').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  }

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
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tasks</h1>
        <p className="text-gray-600">Manage your study tasks and assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="font-medium text-gray-700">Filter by:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'completed', 'high', 'medium', 'low'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === filterType
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}

export default Tasks