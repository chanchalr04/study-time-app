import React, { useState } from 'react'
import { Check, Clock, Flag, Edit2, Trash2, Plus } from 'lucide-react'

const TaskList = ({ tasks = [], onAddTask, onUpdateTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const priorities = {
    high: { color: 'bg-red-100 text-red-800', icon: <Flag size={14} /> },
    medium: { color: 'bg-yellow-100 text-yellow-800', icon: <Flag size={14} /> },
    low: { color: 'bg-blue-100 text-blue-800', icon: <Flag size={14} /> },
  }

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask({
        title: newTask.trim(),
        priority: 'medium',
        status: 'todo',
        createdAt: new Date().toISOString(),
      })
      setNewTask('')
    }
  }

  const handleToggleComplete = (task) => {
    onUpdateTask(task.id, {
      ...task,
      status: task.status === 'completed' ? 'todo' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date().toISOString(),
    })
  }

  const handleStartEdit = (task) => {
    setEditingId(task.id)
    setEditText(task.title)
  }

  const handleSaveEdit = (task) => {
    if (editText.trim()) {
      onUpdateTask(task.id, { ...task, title: editText.trim() })
      setEditingId(null)
      setEditText('')
    }
  }

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(taskId)
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
        <span className="text-sm text-gray-600">
          {tasks.filter(t => t.status === 'completed').length}/{tasks.length} completed
        </span>
      </div>

      {/* Add Task Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add a new task..."
          className="input-field flex-1"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks yet. Add your first task above!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                task.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {task.status === 'completed' && <Check size={14} />}
                </button>

                <div className="flex-1">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => handleSaveEdit(task)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(task)}
                      className="input-field"
                      autoFocus
                    />
                  ) : (
                    <>
                      <h3 className={`font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                          priorities[task.priority]?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {priorities[task.priority]?.icon}
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingId !== task.id && (
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="p-2 text-gray-500 hover:text-blue-600"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskList