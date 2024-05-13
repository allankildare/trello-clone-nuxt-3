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

  function moveTask({ taskIndex, fromColumnIndex, toColumnIndex }: { taskIndex: number, fromColumnIndex: number, toColumnIndex: number }) {
    const task = board.value.columns[fromColumnIndex].tasks.splice(taskIndex, 1)[0]

    board.value.columns[toColumnIndex].tasks.push(task)
  }

  function moveColumn({ fromColumnIndex, toColumnIndex }: { fromColumnIndex: number, toColumnIndex: number }) {
    const column = board.value.columns.splice(fromColumnIndex, 1)[0]
    board.value.columns.splice(toColumnIndex, 0, column)
    return
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
    deleteTask,
    moveTask,
    moveColumn
  }
})