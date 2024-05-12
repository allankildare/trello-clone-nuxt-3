import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import boardData from '~/data/board.json'
import { v4 as uuid } from 'uuid'

interface AddTask {
  columnIndex: number
  taskName: string
}

export const useBoardStore = defineStore('boardStore', () => {
  const board = useStorage('board', boardData)

  const getTask = computed(() => {
    return (taskId: string) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId)
        if (task) return task
      }
    }
  })

  function addColumn(columnName: string) {
    board.value.columns.push({
      id: uuid(),
      name: columnName,
      tasks: []
    })
  }

  function addTask({ columnIndex, taskName }: AddTask) {
    board.value.columns[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: ''
    })
  }

  function deleteTask(taskId: string) {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex(task => task.id === taskId)

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
        return
      }
    }
  }

  function deleteColumn(columnIndex: number) {
    board.value.columns.splice(columnIndex, 1)
  }

  return {
    // State
    board,
    //Getters
    getTask,
    // Actions
    addColumn,
    deleteColumn,
    addTask,
    deleteTask
  }
})