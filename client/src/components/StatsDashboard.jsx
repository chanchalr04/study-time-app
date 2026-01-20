import React from 'react'
import { 
  Clock, Target, TrendingUp, Trophy, 
  Calendar, Brain, Zap, BarChart
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const StatsDashboard = ({ stats, weeklyData }) => {
  const statCards = [
    {
      title: 'Today',
      value: `${stats.todayTime} min`,
      subtitle: 'Study time',
      icon: <Clock className="text-blue-600" size={24} />,
      color: 'bg-blue-50',
      trend: '+12%',
    },
    {
      title: 'Weekly Goal',
      value: `${stats.goalProgress}%`,
      subtitle: 'Progress',
      icon: <Target className="text-green-600" size={24} />,
      color: 'bg-green-50',
    },
    {
      title: 'Streak',
      value: `${stats.streak} days`,
      subtitle: 'Current streak',
      icon: <Trophy className="text-yellow-600" size={24} />,
      color: 'bg-yellow-50',
      trend: '+5',
    },
    {
      title: 'Productivity',
      value: '85%',
      subtitle: 'Focus score',
      icon: <Brain className="text-purple-600" size={24} />,
      color: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="text-sm font-medium text-green-600">
                  {stat.trend}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-gray-600">
              {stat.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Weekly Progress</h3>
              <p className="text-sm text-gray-600">Total: {stats.weekTime} minutes</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp size={20} />
              <span className="ml-2 font-medium">+18% from last week</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Daily Overview</h3>
              <p className="text-sm text-gray-600">Today's performance</p>
            </div>
            <BarChart className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Daily Goal Progress</span>
                <span className="font-medium">{stats.goalProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{ width: `${stats.goalProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.todayTime} / 120 minutes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">4</div>
                <p className="text-sm text-gray-600">Sessions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">27</div>
                <p className="text-sm text-gray-600">Avg. Minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Zap className="mx-auto text-yellow-500" size={24} />
                <p className="text-sm text-gray-600 mt-1">Focus Time</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="mx-auto text-blue-500" size={24} />
                <p className="text-sm text-gray-600 mt-1">Consistency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsDashboard