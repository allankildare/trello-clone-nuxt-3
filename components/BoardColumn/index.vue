<script setup>
import { useBoardStore } from '~/stores/boardStore'

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },

  columnIndex: {
    type: Number,
    required: true,
  }
})

const boardStore = useBoardStore()
const router = useRouter()
const isEdittingName = ref(false)
const newTaskName = ref('')

function handleColumnNameEdit() {
  isEdittingName.value = !isEdittingName.value
}

function handleColumnNameDelete(columnIndex) {
  boardStore.deleteColumn(columnIndex)
}

function goToTask(taskId) {
  router.push(`/tasks/${taskId}`)
}

function addTask() {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex
  })
  newTaskName.value = ''
}

function pickUpTask(dragEvent, { fromColumnIndex, fromTaskIndex }) {
  dragEvent.dataTransfer.effectAllowed = 'move'
  dragEvent.dataTransfer.dropEffect = 'move'
  dragEvent.dataTransfer.setData('from-column-index', fromColumnIndex)
  dragEvent.dataTransfer.setData('from-task-index', fromTaskIndex)
}

function dropTask(dropEvent, toColumnIndex) {
  const fromColumnIndex = dropEvent.dataTransfer.getData('from-column-index')
  const fromTaskIndex = dropEvent.dataTransfer.getData('from-task-index')

  console.log({fromColumnIndex, fromTaskIndex})
  boardStore.moveTask({
    taskIndex: fromTaskIndex,
    fromColumnIndex,
    toColumnIndex,
  })
}
</script>

<template>
  <UContainer class="column" @dragenter.prevent @dragover.prevent @drop.stop="dropTask($event, columnIndex)">
    <div class="column-header mb-4">
      <div>
        <h2 v-if="!isEdittingName" class="uppercase">{{ column.name }}</h2>
        <UInput v-else type="text" v-model="column.name" />
      </div>
      <div>
        <UButton icon="i-heroicons-pencil-square" @click="handleColumnNameEdit" />
        <UButton icon="i-heroicons-trash" color="red" @click="handleColumnNameDelete(index)" />
      </div>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard class="mb-4" @click="goToTask(task.id)" draggable="true" @dragstart="pickUpTask($event, { fromTaskIndex: taskIndex, fromColumnIndex: columnIndex})">
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput v-model="newTaskName" type="text" placeholder="Create new task" icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addTask" />
  </UContainer>
</template>