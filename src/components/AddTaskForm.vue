<template>
<div>
  <div
    class="add-bar"
  >
    <button
      @click="toggleAddTaskForm"
    >
      <span
        v-text="this.addTaskFormState ?
        (previewTask.taskName || previewTask.todos.length ? 'Продолжить добавление задания' : 'Добавить задание') :
        'Закрыть панель'"
      >
      </span>
    </button>
  </div>

  <transition
      name="fade"
  >
  <div
    class="add-container"
    v-if="showForm"
  >
    <div
      class="add-container__task-form"
    >
    <form
      @submit.prevent="submit_task"
    >
      <button
        v-if="previewTask.taskName && previewTask.todos.length && !previewTask.editState && !previewTask.taskNameEditState"
        type="submit"
        class="add-container__task-form__btn"
      >
        Отправить задание
      </button>

      <p>
      <input
        v-model="taskName"
        type="text"
        placeholder="Имя Задания"
      >

      <button
        class="add-container__task-form__btn"
        @click.prevent="addTaskName"
      >
        <span
          v-text="previewTask.taskName ? 'Редактировать имя' : 'Добавить имя'"
        >
        </span>
      </button>
      </p>

      <input
        v-model="todoText"
        type="text"
        placeholder="Пункт задания"
      >

      <button
        class="add-container__task-form__btn"
        @click.prevent="addTodoText(previewTask.todos), savePreviewToDb()"
      >
        <span
          v-text="previewTask.todos.length ? 'Добавать еще пункт' : 'Добавить пункт'"
        >
        </span>
      </button>
    </form>
    </div>

    <transition
        name="fade"
    >
    <TaskItem
      v-if="previewTask.taskName || previewTask.todos.length"
      :task="previewTask"
      :preview="true"
    />
    </transition>
  </div>
  </transition>
</div>
</template>

<script>
import {mapActions} from 'vuex'

import TaskItem from '@/components/TaskItem.vue'

import addToDo from '../mixins/addToDo'
import checkCoincidence from '../mixins/checkCoincidence'
import notifyShow from '../mixins/notifyShow'
import randomNumMixin from '../mixins/randomNumMixin'

import localforage from 'localforage'

const tasksLocalForage = localforage.createInstance({
  name: 'DraftDB',
  storeName: 'tasksDraft'
})

export default {
  data () {
    return {
      taskName: '',
      errorText: [],
      addTaskFormState: true,
      showForm: false
    }
  },
  mixins: [
      addToDo,
      checkCoincidence,
      notifyShow,
      randomNumMixin
  ],
  components: {
    TaskItem
  },
  computed: {
    previewTask () {
      return this.$store.getters.preview_task_getter
    },
    tasks () {
      return this.$store.getters.tasks_getter
    }
  },
  methods: {
    saveDataToDb () {
      tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
        .catch(err => console.error(err))
    },
    savePreviewToDb () {
      tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
        .catch(err => console.error(err))
    },
    toggleAddTaskForm () {
      this.addTaskFormState = !this.addTaskFormState
      this.showForm = !this.showForm
    },
    cleanPreview () {
      this.previewTask.taskName = null,
      this.previewTask.taskId = '',
      this.previewTask.todos = [],
      this.previewTask.done = false
      this.previewTask.editState = false,
      this.previewTask.taskNameEditState = false
    },
    randomId (key) {
      return String(this.randomNumMixin(1,100)) + key.toUpperCase().slice(0,30) + String(this.randomNumMixin(1,100))
    },
    submit_task () {
      this.addTask(
        {
          taskName: this.previewTask.taskName,
          taskId: this.previewTask.taskId,
          todos: this.previewTask.todos,
          done: this.previewTask.done,
          editState: this.previewTask.editState,
          taskNameEditState: this.previewTask.taskNameEditState
        }
      )

      this.notify_show('Пункт добавлен!', 'SUCCESS:', 'success')
      this.cleanPreview()
      this.saveDataToDb()
      this.savePreviewToDb()

      this.toggleAddTaskForm()
    },
    addTaskName () {
      if (!this.taskName.length) {
        this.notify_show('Пожалуйста - добавьте текст к полю "имя задания"', 'ERROR:', 'error')
      }

      if (this.checkCoincidence(this.tasks, this.taskName, 'taskName')) {
        this.notify_show('Задание с таким именем уже существует!', 'ERROR:', 'error')
      }

      if (!this.checkCoincidence(this.tasks, this.taskName, 'taskName') && this.taskName.length) {
        this.previewTask.taskName = this.taskName
        this.previewTask.taskId = this.randomId(this.taskName)
        tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
          .catch(err => console.error(err))
        this.taskName = ''
      }
    },
    ...mapActions([
      'addTask'
    ])
  }
}
</script>

<style lang="scss" scoped>
.add-bar {
  text-align: center;
  background-color: rgb(127, 163, 255);
  padding: 10px;
  margin: 10px;
}

button, input[type=text] {
  padding: 5px;
  min-width: 160px;
  border: 1px solid transparent;
  margin: 2px;
}

.add-container {
  display: flex;
  flex-direction: column;

  &__task-form {
    background-color: rgb(127, 163, 255);
    text-align: center;
    padding: 10px;
    margin: 10px;

    &__btn {
      transition: all 0.5s;
    }

    &__btn:hover {
      background-color: transparent;
      border: 1px solid black;
    }
  }
}

</style>
