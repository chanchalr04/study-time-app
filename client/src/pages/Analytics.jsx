import React from 'react'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, Clock, Target, Calendar, 
  Brain, Award, TrendingDown 
} from 'lucide-react'

const Analytics = () => {
  const dailyData = [
    { day: 'Mon', time: 45, sessions: 3, focus: 85 },
    { day: 'Tue', time: 60, sessions: 4, focus: 90 },
    { day: 'Wed', time: 30, sessions: 2, focus: 70 },
    { day: 'Thu', time: 75, sessions: 5, focus: 88 },
    { day: 'Fri', time: 90, sessions: 6, focus: 92 },
    { day: 'Sat', time: 45, sessions: 3, focus: 80 },
    { day: 'Sun', time: 60, sessions: 4, focus: 85 },
  ]

  const subjectData = [
    { subject: 'Math', time: 320, color: '#3b82f6' },
    { subject: 'Physics', time: 280, color: '#10b981' },
    { subject: 'Chemistry', time: 190, color: '#8b5cf6' },
    { subject: 'Programming', time: 150, color: '#f59e0b' },
    { subject: 'English', time: 90, color: '#ef4444' },
  ]

  const weeklyStats = {
    totalTime: 405,
    avgSession: 27,
    bestDay: 'Friday',
    consistency: 85,
    productivity: 88,
    streak: 5,
  }

  const StatCard = ({ icon, title, value, subtitle, trend }) => (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${icon.props.className.includes('text-green') ? 'bg-green-50' : 'bg-blue-50'}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mt-4">{value}</h3>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your study patterns</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<Clock className="text-blue-600" size={24} />}
          title="Total Time"
          value="6h 45m"
          subtitle="This week"
          trend={12}
        />
        <StatCard
          icon={<Target className="text-green-600" size={24} />}
          title="Sessions"
          value="15"
          subtitle="Completed"
          trend={8}
        />
        <StatCard
          icon={<Brain className="text-purple-600" size={24} />}
          title="Focus Score"
          value="88%"
          subtitle="Average"
          trend={5}
        />
        <StatCard
          icon={<Award className="text-yellow-600" size={24} />}
          title="Streak"
          value="5 days"
          subtitle="Current"
        />
        <StatCard
          icon={<TrendingUp className="text-blue-600" size={24} />}
          title="Consistency"
          value="85%"
          subtitle="Weekly"
          trend={3}
        />
        <StatCard
          icon={<Calendar className="text-red-600" size={24} />}
          title="Best Day"
          value="Friday"
          subtitle="Most productive"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Time */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Study Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="time" 
                  name="Study Time (min)" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="sessions" 
                  name="Sessions" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Subject Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="time"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} minutes`, 'Study Time']}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {subjectData.map((subject, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-sm text-gray-700">{subject.subject}</span>
                <span className="text-sm font-semibold ml-auto">{subject.time}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Trends */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Focus Score Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="focus" 
                name="Focus Score (%)" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#8b5cf6' }}
                activeDot={{ r: 6, fill: '#7c3aed' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Average Session Duration</span>
              <span className="font-bold text-gray-800">{weeklyStats.avgSession} min</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Most Productive Time</span>
              <span className="font-bold text-gray-800">2 PM - 5 PM</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Consistency Rate</span>
              <span className="font-bold text-gray-800">{weeklyStats.consistency}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Sessions</span>
              <span className="font-bold text-gray-800">27</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Increase Math Study Time</h4>
              <p className="text-sm text-blue-600">Math shows the most improvement when studied consistently.</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Maintain Current Schedule</h4>
              <p className="text-sm text-green-600">Your 2 PM - 5 PM study slot is most effective.</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-1">Try Pomodoro Technique</h4>
              <p className="text-sm text-yellow-600">25-minute focused sessions could boost productivity by 15%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics