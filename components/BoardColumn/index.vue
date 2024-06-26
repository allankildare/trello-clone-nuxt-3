<script setup lang="ts">
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

function handleColumnNameDelete() {
  boardStore.deleteColumn(props.columnIndex)
}

function goToTask(taskId: string) {
  router.push(`/tasks/${taskId}`)
}

function addTask() {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex
  })
  newTaskName.value = ''
}

function pickUpTask(dragEvent: DragEvent, { fromColumnIndex, fromTaskIndex }: { fromColumnIndex: number, fromTaskIndex: number }) {
  if (dragEvent.dataTransfer !== null) {
    dragEvent.dataTransfer.effectAllowed = 'move'
    dragEvent.dataTransfer.dropEffect = 'move'
    dragEvent.dataTransfer.setData('type', 'task')
    dragEvent.dataTransfer.setData('from-column-index', fromColumnIndex.toString())
    dragEvent.dataTransfer.setData('from-task-index', fromTaskIndex.toString())
  }
}

function pickUpColumn(dragEvent: DragEvent, fromColumnIndex: number) {
  if (dragEvent.dataTransfer !== null) {
    dragEvent.dataTransfer.effectAllowed = 'move'
    dragEvent.dataTransfer.dropEffect = 'move'
    dragEvent.dataTransfer.setData('type', 'column')
    dragEvent.dataTransfer.setData('from-column-index', fromColumnIndex.toString())
  }
}

function dropColumnOrTask(dropEvent: DragEvent, { toColumnIndex, toTaskIndex }: { toColumnIndex: number, toTaskIndex?: number }) {
  const type = dropEvent.dataTransfer?.getData('type')
  
  if (dropEvent.dataTransfer !== null) {
    const fromColumnIndex = Number(dropEvent.dataTransfer.getData('from-column-index'))
    
    if (type === 'task') {
      const fromTaskIndex = Number(dropEvent.dataTransfer.getData('from-task-index'))
      boardStore.moveTask({
        fromTaskIndex,
        toTaskIndex,
        fromColumnIndex,
        toColumnIndex,
      })
    } else if (type === 'column') {
      boardStore.moveColumn({
        fromColumnIndex,
        toColumnIndex
      })
    }
  }
}
</script>

<template>
  <UContainer
    class="column"
    draggable="true"
    @dragstart.self="pickUpColumn($event, columnIndex)"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop="dropColumnOrTask($event, { toColumnIndex: columnIndex })"
  >
    <div class="column-header mb-4">
      <div>
        <h2 v-if="!isEdittingName" class="uppercase">{{ column.name }}</h2>
        <UInput v-else type="text" v-model="column.name" />
      </div>
      <div>
        <UButton icon="i-heroicons-pencil-square" @click="handleColumnNameEdit" />
        <UButton class="ml-2" icon="i-heroicons-trash" color="red" @click="handleColumnNameDelete" />
      </div>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="mb-4"
          @click="goToTask(task.id)"
          draggable="true"
          @dragstart="pickUpTask($event, { fromTaskIndex: taskIndex, fromColumnIndex: columnIndex })"
          @drop.stop="dropColumnOrTask($event, { toColumnIndex: columnIndex, toTaskIndex: taskIndex })"
        >
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput v-model="newTaskName" type="text" placeholder="Create new task" icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addTask" />
  </UContainer>
</template>