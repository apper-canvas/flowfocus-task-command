import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: 'CheckSquare',
      color: 'bg-gradient-to-r from-primary to-primary-light',
      textColor: 'text-white',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: 'CheckCircle',
      color: 'bg-gradient-to-r from-secondary to-secondary-light',
      textColor: 'text-white',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: 'Clock',
      color: 'bg-gradient-to-r from-accent to-yellow-400',
      textColor: 'text-white',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: 'AlertTriangle',
      color: 'bg-gradient-to-r from-error to-red-500',
      textColor: 'text-white',
      change: '-3%',
      changeType: 'decrease'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative overflow-hidden"
        >
          <div className={`${card.color} rounded-2xl p-6 shadow-elevated`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${card.textColor} opacity-90`}>
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                  {card.value}
                </p>
                <div className="flex items-center mt-3">
                  <ApperIcon 
                    name={card.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                    className={`h-4 w-4 ${card.textColor} opacity-75 mr-1`} 
                  />
                  <span className={`text-sm ${card.textColor} opacity-90`}>
                    {card.change} vs last week
                  </span>
                </div>
              </div>
              <div className={`p-3 ${card.textColor} bg-white/20 rounded-xl`}>
                <ApperIcon name={card.icon} className="h-8 w-8" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/5 rounded-full"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default DashboardStats