import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import ApperIcon from '../ApperIcon'

const ProgressCharts = ({ tasks, stats, timeRange }) => {
  const COLORS = {
    primary: '#6366F1',
    secondary: '#10B981',
    accent: '#F59E0B',
    error: '#EF4444',
    surface: {
      100: '#f1f5f9',
      300: '#cbd5e1',
      500: '#64748b'
    }
  }

  // Completion Rate Data
  const completionData = [
    { name: 'Completed', value: stats.completedTasks, color: COLORS.secondary },
    { name: 'In Progress', value: stats.inProgressTasks, color: COLORS.accent },
    { name: 'To Do', value: stats.todoTasks, color: COLORS.surface[300] }
  ]

  // Priority Distribution Data
  const priorityData = [
    { name: 'Urgent', value: stats.priorityBreakdown.urgent, color: COLORS.error },
    { name: 'High', value: stats.priorityBreakdown.high, color: COLORS.accent },
    { name: 'Medium', value: stats.priorityBreakdown.medium, color: COLORS.primary },
    { name: 'Low', value: stats.priorityBreakdown.low, color: COLORS.secondary }
  ]

  // Task Creation Trend (mock data for demo)
  const trendData = [
    { name: 'Mon', created: 4, completed: 3 },
    { name: 'Tue', created: 6, completed: 4 },
    { name: 'Wed', created: 5, completed: 6 },
    { name: 'Thu', created: 8, completed: 5 },
    { name: 'Fri', created: 7, completed: 8 },
    { name: 'Sat', created: 3, completed: 4 },
    { name: 'Sun', created: 2, completed: 3 }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-surface-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-surface-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Don't show labels for small slices
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Task Completion Rate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 shadow-soft"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Task Completion</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-sm text-surface-600">{stats.completionRate.toFixed(1)}% Complete</span>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-4">
          {completionData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-surface-600">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Priority Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 shadow-soft"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Priority Distribution</h3>
          <ApperIcon name="AlertTriangle" className="h-5 w-5 text-surface-500" />
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Productivity Trend */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 shadow-soft lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Productivity Trend</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-surface-600">Created</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-sm text-surface-600">Completed</span>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke={COLORS.secondary} 
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Task Types Analysis */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-surface-200/50 shadow-soft lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Quick Insights</h3>
          <ApperIcon name="TrendingUp" className="h-5 w-5 text-surface-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600">Most Productive Day</p>
                <p className="text-lg font-semibold text-surface-900">Friday</p>
              </div>
              <ApperIcon name="Calendar" className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600">Avg. Completion Time</p>
                <p className="text-lg font-semibold text-surface-900">2.3 days</p>
              </div>
              <ApperIcon name="Clock" className="h-8 w-8 text-secondary" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600">Tasks This Week</p>
                <p className="text-lg font-semibold text-surface-900">+{stats.totalTasks}</p>
              </div>
              <ApperIcon name="Target" className="h-8 w-8 text-accent" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProgressCharts