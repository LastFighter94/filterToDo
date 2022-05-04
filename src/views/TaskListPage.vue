<template>
  <div class="wrapper">
    <AddTaskForm/>

    <transition-group
        name="fade"
        mode="out-in"
    >
    <div
      v-for="task in tasks"
      :key="task.taskId"
    >
    <TaskItem
      :task="task"
    />
    </div>
    </transition-group>
  </div>
</template>

<script>
import AddTaskForm from '@/components/AddTaskForm.vue'
import TaskItem from '@/components/TaskItem.vue'

import localforage from 'localforage'

const tasksLocalForage = localforage.createInstance({
  name: 'DraftDB',
  storeName: 'tasksDraft'
})

export default {
  name: 'TaskListPage',
  components: {
    AddTaskForm,
    TaskItem
  },
  computed: {
    tasks () {
      return this.$store.getters.tasks_getter
    }
  },
  created () {
    this.getDataFromDb()
  },
  methods: {
    getDataFromDb () {
      tasksLocalForage.getItem('tasksLocalForage')
      .then(res => {
        if (!res) {
          return
        } else {
          this.$store.state.tasks = res
        }
        return res
      })
      .catch(err => console.log(err))

      tasksLocalForage.getItem('previewTaskLocalForage')
      .then(res => {
        if (!res) {
          return
        } else {
          this.$store.state.previewTask = res
        }
        return res
      })
      .catch(err => console.log(err))
    },
    saveDataToDb () {
      tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
        .catch(err => console.error(err))
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 220px;
}

</style>

