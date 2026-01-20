import React from 'react'
import { Target, Calendar, Flag, TrendingUp, MoreVertical } from 'lucide-react'

const GoalCard = ({ goal, onEdit, onDelete, onViewDetails }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Target className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{goal.title}</h3>
            <p className="text-sm text-gray-600">{goal.category}</p>
          </div>
        </div>
        
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical size={20} className="text-gray-500" />
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {goal.description || 'No description provided'}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{goal.progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(goal.currentTime)} spent</span>
          <span>{formatTime(goal.targetTime)} target</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
          {goal.priority}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
          {goal.status}
        </span>
        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium flex items-center gap-1">
          <Calendar size={12} />
          {daysLeft}d left
        </span>
        {goal.milestones && goal.milestones.length > 0 && (
          <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-medium flex items-center gap-1">
            <Flag size={12} />
            {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}
          </span>
        )}
      </div>

      {/* Tags */}
      {goal.tags && goal.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {goal.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails && onViewDetails(goal)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit && onEdit(goal)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(goal.id)}
            className="px-3 py-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoalCard