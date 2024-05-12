<script setup>
import { useBoardStore } from '~/stores/boardStore'

const boardStore = useBoardStore()
const route = useRoute()
const router = useRouter()

const task = computed(() => {
  return boardStore.getTask(route.params.id)
})

function deleteTask() {
  boardStore.deleteTask(route.params.id)
  router.push('/')
}
</script>

<template>
  <div class="task-wrapper">
    <div v-if="task" class="task-view">
      <!-- <h1>{{ task.name }}</h1> -->
      <!-- <p>{{ task.description ? task.description : 'No description was provided' }}</p> -->
        <UFormGroup label="Name" class="w-full mb-4">
          <UInput type="text" v-model="task.name" />
        </UFormGroup>
        <UFormGroup label="Description" class="w-full">
          <UTextarea v-model="task.description" />
        </UFormGroup>
        <UButton icon="i-heroicons-trash" color="red" @click="deleteTask">Delete task</UButton>
      </div>
      <section v-else>
        Task not found
      </section>
  </div>
</template>