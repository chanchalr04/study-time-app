import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Target, Calendar, Settings, LogOut } from 'lucide-react'

const Profile = () => {
  const { user, logout, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dailyGoal: user?.dailyGoal || 120,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await updateProfile(formData)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const stats = [
    { label: 'Total Study Time', value: '45h 30m', icon: <Calendar size={20} /> },
    { label: 'Current Streak', value: '5 days', icon: <Target size={20} /> },
    { label: 'Tasks Completed', value: '128', icon: <Settings size={20} /> },
    { label: 'Goals Achieved', value: '12', icon: <Target size={20} /> },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="text-primary-600" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail size={16} />
                  {user?.email}
                </p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Study Goal (minutes)
                  </label>
                  <input
                    type="number"
                    name="dailyGoal"
                    value={formData.dailyGoal}
                    onChange={handleChange}
                    className="input-field"
                    min="1"
                    max="480"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">November 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Daily Goal</p>
                    <p className="font-medium">{user?.dailyGoal} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium">Free</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Theme</p>
                    <p className="font-medium">Light</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                Notification Settings
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                Privacy Settings
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                Data Export
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50">
                Change Password
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border border-red-200">
            <h3 className="font-bold text-gray-800 mb-4 text-red-600">Danger Zone</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600">
                Delete Account
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile