import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import ProgressCharts from '../components/dashboard/ProgressCharts'
import DashboardStats from '../components/dashboard/DashboardStats'
import taskService from '../services/api/taskService'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('week') // week, month, year

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      try {
        const result = await taskService.getAll()
        setTasks(result || [])
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  const calculateTaskStats = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const inProgressTasks = tasks.filter(task => task.status === 'inprogress').length
    const todoTasks = tasks.filter(task => task.status === 'todo').length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false
      return new Date(task.dueDate) < new Date()
    }).length

    const priorityBreakdown = {
      urgent: tasks.filter(task => task.priority === 'urgent').length,
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    }

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
      overdueTasks,
      priorityBreakdown
    }
  }

  const stats = calculateTaskStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="h-12 w-12 text-error mx-auto mb-4" />
          <p className="text-error">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-surface-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-surface-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden lg:flex items-center space-x-1">
                <a
                  href="/"
                  className="px-3 py-2 text-sm font-medium text-surface-700 hover:text-primary transition-colors duration-200"
                >
                  Tasks
                </a>
                <a
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg transition-colors duration-200"
                >
                  Dashboard
                </a>
              </nav>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dashboard Stats */}
          <DashboardStats stats={stats} />

          {/* Progress Charts */}
          <ProgressCharts tasks={tasks} stats={stats} timeRange={timeRange} />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard