import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import taskService from '../services/api/taskService'
import { toast } from 'react-toastify'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      try {
        const result = await taskService.getAll()
        setTasks(result || [])
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [...prev, newTask])
      toast.success('Task created successfully!')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates)
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === 'all' || task?.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task?.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task?.status === status) || []
  }

  const getTaskCountByStatus = (status) => {
    return getTasksByStatus(status).length
  }

  const getTotalTasks = () => {
    return filteredTasks.length
  }

  const getCompletedTasks = () => {
    return getTasksByStatus('done').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading your tasks...</p>
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
                <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-surface-900">FlowFocus</h1>
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
                  className="px-3 py-2 text-sm font-medium text-surface-700 hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </a>
              </nav>
              
              <div className="hidden md:flex items-center space-x-2 bg-surface-100 rounded-lg px-3 py-2">
                <ApperIcon name="Search" className="h-4 w-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm placeholder-surface-500 w-48"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-surface-600 hidden sm:block">
                  {getCompletedTasks()}/{getTotalTasks()} completed
                </span>
                <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-secondary-light transition-all duration-300"
                    style={{ width: `${getTotalTasks() > 0 ? (getCompletedTasks() / getTotalTasks()) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2 bg-surface-100 rounded-lg px-3 py-2">
          <ApperIcon name="Search" className="h-4 w-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm placeholder-surface-500 flex-1"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="flex items-center text-sm text-surface-600">
              <span>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <MainFeature
            tasks={filteredTasks}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            getTasksByStatus={getTasksByStatus}
            getTaskCountByStatus={getTaskCountByStatus}
          />
        </div>
      </div>
    </div>
  )
}

export default Home