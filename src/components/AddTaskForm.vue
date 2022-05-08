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
import TaskItem from '@/components/TaskItem.vue'

import addToDo from '../mixins/addToDo'
import checkCoincidence from '../mixins/checkCoincidence'
import notifyShow from '../mixins/notifyShow'
import randomNumMixin from '../mixins/randomNumMixin'
import addTaskToDb from "@/mixins/addTaskToDb"

// импортировали этот код два раза - почему-то он невидим черещ mixin addTaskToDb
import localforage from 'localforage'

const tasksLocalForage = localforage.createInstance({
  name: 'DraftDB',
  storeName: 'tasksDraft'
})
// конец примечания

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
      randomNumMixin,
      addTaskToDb
  ],
  components: {
    TaskItem
  },
  computed: {
    tasks () {
      return this.$store.getters.tasks_getter
    }
  },
  methods: {
    toggleAddTaskForm () {
      this.addTaskFormState = !this.addTaskFormState
      this.showForm = !this.showForm
    },
    randomId (key) {
      return String(this.randomNumMixin(1,100)) + key.toUpperCase().slice(0,30) + String(this.randomNumMixin(1,100))
    },
    submit_task () {
      this.addTaskToDb(this.previewTask)
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
    }
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

@media (max-width: 300px) {
  .add-bar {
    padding: 5px;
  }

  button, input[type=text] {
    min-width: 120px;
    font-size: 0.6em;
  }
}

</style>
