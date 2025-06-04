import taskService from './api/taskService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export {
  taskService,
  delay
}

export default {
  taskService,
  delay
}