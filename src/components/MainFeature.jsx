import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ 
  tasks, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete, 
  getTasksByStatus, 
  getTaskCountByStatus 
}) => {
  const [draggedTask, setDraggedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [showQuickAdd, setShowQuickAdd] = useState('')
  const dragCounterRef = useRef(0)

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-surface-100', textColor: 'text-surface-700' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-accent/10', textColor: 'text-accent' },
    { id: 'done', title: 'Done', color: 'bg-secondary/10', textColor: 'text-secondary' }
  ]

  const priorityConfig = {
    urgent: { color: 'priority-urgent', text: 'text-white', icon: 'AlertTriangle' },
    high: { color: 'priority-high', text: 'text-white', icon: 'ArrowUp' },
    medium: { color: 'priority-medium', text: 'text-white', icon: 'Minus' },
    low: { color: 'priority-low', text: 'text-white', icon: 'ArrowDown' }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = parseISO(dateString)
      if (isToday(date)) return 'Today'
      if (isTomorrow(date)) return 'Tomorrow'
      return format(date, 'MMM d')
    } catch {
      return ''
    }
  }

  const isDueDateOverdue = (dateString) => {
    if (!dateString) return false
    try {
      return isPast(parseISO(dateString)) && !isToday(parseISO(dateString))
    } catch {
      return false
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.target.style.opacity = '0.8'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedTask(null)
    setDragOverColumn(null)
    dragCounterRef.current = 0
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e, columnId) => {
    e.preventDefault()
    dragCounterRef.current++
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(null)
    dragCounterRef.current = 0
    
    if (draggedTask && draggedTask.status !== columnId) {
      onTaskUpdate(draggedTask.id, { status: columnId })
    }
  }

  const handleTaskComplete = (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    onTaskUpdate(task.id, { status: newStatus })
  }

  const handleQuickAdd = async (columnId, title) => {
    if (!title.trim()) return
    
    const newTask = {
      title: title.trim(),
      description: '',
      status: columnId,
      priority: 'medium',
      dueDate: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await onTaskCreate(newTask)
    setShowQuickAdd('')
  }

  return (
    <div className="w-full">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            layout
            className={`
              bg-white/60 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-surface-200/50 shadow-soft
              ${dragOverColumn === column.id ? 'ring-2 ring-primary/50 bg-primary/5' : ''}
              transition-all duration-200
            `}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h2 className={`font-semibold text-lg ${column.textColor}`}>
                  {column.title}
                </h2>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${column.color} ${column.textColor}
                `}>
                  {getTaskCountByStatus(column.id)}
                </span>
              </div>
              
              <button
                onClick={() => setShowQuickAdd(column.id)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
                title="Add task"
              >
                <ApperIcon name="Plus" className="h-4 w-4 text-surface-500" />
              </button>
            </div>

            {/* Quick Add Form */}
            <AnimatePresence>
              {showQuickAdd === column.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const title = e.target.title.value
                      handleQuickAdd(column.id, title)
                      e.target.reset()
                    }}
                    className="flex gap-2"
                  >
                    <input
                      name="title"
                      type="text"
                      placeholder="Add a task..."
                      className="flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                    >
                      <ApperIcon name="Check" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQuickAdd('')}
                      className="px-3 py-2 bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors duration-200"
                    >
                      <ApperIcon name="X" className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task Cards */}
            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence>
                {getTasksByStatus(column.id).map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="task-card-hover bg-white rounded-xl p-4 border border-surface-200/50 shadow-card cursor-grab active:cursor-grabbing group"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTaskComplete(task)
                        }}
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                          ${task.status === 'done' 
                            ? 'bg-secondary border-secondary' 
                            : 'border-surface-300 hover:border-secondary'
                          }
                        `}
                      >
                        {task.status === 'done' && (
                          <ApperIcon name="Check" className="h-3 w-3 text-white" />
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        {task.priority && (
                          <div className={`
                            px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1
                            ${priorityConfig[task.priority]?.color} ${priorityConfig[task.priority]?.text}
                          `}>
                            <ApperIcon 
                              name={priorityConfig[task.priority]?.icon || 'Minus'} 
                              className="h-3 w-3" 
                            />
                          </div>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTaskDelete(task.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 rounded transition-all duration-200"
                        >
                          <ApperIcon name="Trash2" className="h-3 w-3 text-error" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className={`
                      font-medium text-surface-900 mb-2 line-clamp-2
                      ${task.status === 'done' ? 'line-through text-surface-500' : ''}
                    `}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="text-sm text-surface-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {task.dueDate && (
                          <span className={`
                            text-xs px-2 py-1 rounded-md
                            ${isDueDateOverdue(task.dueDate) 
                              ? 'bg-error/10 text-error' 
                              : 'bg-surface-100 text-surface-600'
                            }
                          `}>
                            <ApperIcon name="Calendar" className="h-3 w-3 inline mr-1" />
                            {formatDueDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-xs text-surface-500">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-surface-400">
                  <ApperIcon name="Plus" className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No tasks yet</p>
                  <button
                    onClick={() => setShowQuickAdd(column.id)}
                    className="text-xs text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    Add your first task
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">Task Details</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-surface-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedTask.title}
                    onChange={(e) => setSelectedTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={selectedTask.description || ''}
                    onChange={(e) => setSelectedTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={selectedTask.priority}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : ''}
                    onChange={(e) => setSelectedTask(prev => ({ 
                      ...prev, 
                      dueDate: e.target.value ? `${e.target.value}T00:00:00.000Z` : '' 
                    }))}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={selectedTask.tags?.join(', ') || ''}
                    onChange={(e) => setSelectedTask(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    placeholder="design, urgent, meeting"
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-200">
                <button
                  onClick={() => {
                    onTaskDelete(selectedTask.id)
                    setSelectedTask(null)
                  }}
                  className="px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onTaskUpdate(selectedTask.id, selectedTask)
                      setSelectedTask(null)
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature