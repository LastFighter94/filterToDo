<template>
<div>
  <div class="wrapper">
    <div
      class="edit-tool-bar"
    >
      <EditToolBar
        @changeModalState="changeModalState"
        :taskToSend="this.taskEdit"
        :canCancelEditing="this.canCancelEditing"
      />
    </div>

    <div
      class="edit-bar"
    >

      <div
        class="edit-bar__task-name"
      >
        <div>

          <div
            :class="this.taskView === 'preview' ? 'edit-bar__task-name__actions preview-mode' : 'edit-bar__task-name__actions done-mode'"
          >
            <div
              class="edit-bar__task-name__actions__text"
            >
              <h3>
                <p>
                  <input
                    type="checkbox"
                    :disabled="this.taskEdit.todos.length ? true : false"
                    v-model="taskEdit.done"
                    @change="saveDataToDb(), writeHistory('change task-done')"
                  >
                  {{this.taskEdit.taskName}}
                </p>
              </h3>
            </div>

            <div
              class="edit-bar__task-name__actions__icons"
            >
              <i
                :class="taskEdit.taskNameEditState ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-pen'"
                @click="taskEdit.taskNameEditState ? saveTaskNameChanges(taskEdit) : editTaskNameState(taskEdit)"
              >
              </i>

              <i
                :class="this.taskView === 'task' ? 'fa-solid fa-trash' : 'fa-solid fa-ban'"
                @click="changeModalState('delete')"
              >
              </i>
            </div>
          </div>

          <div
            :style="taskEdit.taskNameEditState ? 'display:flex' : 'display: none'"
            class="editBar"
          >
            <textarea
              v-model="newTaskName"
            >
            </textarea>
          </div>
        </div>
      </div>

      <div
        :class="this.taskView === 'preview' ? 'edit-bar__task-todo preview-mode' : 'edit-bar__task-todo done-mode'"
      >
        <div
          v-for="todo in taskEdit.todos"
          :key="todo.id"
        >
          <div
            class="edit-bar__task-todo__actions"
          >
            <div
              class="edit-bar__task-todo__actions__text"
            >
              <h4>
                <p>
                  <input
                    v-model="todo.done"
                    type="checkbox"
                    @change="checkIsAllDone, writeHistory('change todo-done')"
                  >
                  {{todo.todoText}}
                </p>
              </h4>
            </div>

            <div
              class="edit-bar__task-todo__actions__icons"
            >
              <i
                :class="todo.editState ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-pen'"
                @click="todo.editState ? saveToDoChanges(todo) : editToDoState(todo)"
              >
              </i>

              <i
                class="fa-solid fa-trash"
                @click="deleteToDo(todo)"
              >
              </i>
            </div>
          </div>

          <div
            class="editBar"
            :style="todo.editState ? 'display:flex' : 'display: none'"
          >
            <textarea
              v-model="newTodoText"
            >
            </textarea>
          </div>
        </div>
      </div>
    </div>

    <div
      class="add-todo"
    >
      <div>
        <input
          type="text"
          placeholder="Добавить еще пункт"
          v-model="todoText"
          @keyup.enter="addTodoText(taskEdit.todos), checkIsAllDone(), writeHistory('add todo')"
          >
      </div>

      <div>
        <button
          content="Добавить еще подпункт"
          v-tippy="{ placement : 'bottom' }"
          @click.prevent="addTodoText(taskEdit.todos), checkIsAllDone(), writeHistory('add todo')"
        >
            <i
              class="fa-solid fa-plus"
            >
            </i>
        </button>
      </div>
    </div>
  </div>

  <ModalWindow
    v-if="this.showModalState"
    :text="this.$store.state.modalText"
    @close="changeModalState"
    @confirm="changeTask"
  />

</div>
</template>

<script>
import EditToolBar from '@/components/EditToolBar.vue'
import ModalWindow from '@/components/ModalWindow.vue'

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
  name: 'EditTaskPage',
  components: {
    EditToolBar,
    ModalWindow
  },
  data() {
    return {
      taskId: this.$route.params.taskId,
      taskView: this.$route.params.taskView,
      newTaskName: '',
      newTodoText: '',
      showModalState: false,
      wantCancelEditing: false
    }
  },
  mixins: [
      addToDo,
      checkCoincidence,
      notifyShow,
      randomNumMixin
  ],
  created () {
    // проверка на наличие taskId - если такового нет, то redirect на NotFound
    let checkId = this.tasks.find(t => t.taskId === this.taskId)

    if (checkId === undefined) {
      this.routerPush({ name: 'NotFound' })
    }

    tasksLocalForage.setItem('taskBeforeEdit', this.taskEdit)
        .then(this.getDataFromDb)
        .then(this.setHistory)
        .catch(err => console.error(err))
  },
  computed: {
    history () {
      return this.$store.getters.history_getter
    },
    canCancelEditing () {
      // два объекта не равны друг другу даже если их свойства полностью одинаковы
      // поэтому прибегаем к такому методу сравнения
      if ((JSON.stringify(this.taskBeforeEdit) == JSON.stringify(this.taskEdit))) {
        return false
      } else {
        return true
      }
    },
    allDone () {
      if (this.taskEdit.todos.some(td => td.done === false)) {
        return false
      } else {
        return true
      }
    },
    someEdit () {
      if (this.taskEdit.todos.every(td => td.editState === false)) {
        return false
      } else {
        return true
      }
    },
    previewTask () {
      return this.$store.getters.preview_task_getter
    },
    tasks () {
      return this.$store.getters.tasks_getter
    },
    taskEdit () {
      if (this.taskView === 'preview') {
        return this.previewTask
      } else if (this.taskView === 'task') {
        return this.tasks.find(task => task.taskId === this.taskId)
      } else {
        return this.routerPush({ name: 'NotFound' })
      }
    },
    taskBeforeEdit () {
      return this.$store.state.taskBeforeEdit
    }
  },
  methods: {
    setHistory () {
      tasksLocalForage.setItem('history', this.history)
          .catch(err => console.error(err))
    },
    routerPush (data) {
      this.$router.push({ ...data })
    },
    changeModalState(howToChangeTask){
      if (!howToChangeTask || howToChangeTask === 'delete') {
        if (this.taskView !== 'preview') {
          this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ УДАЛИТЬ ЗАДАНИЕ?!'
        } else {
          this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ УДАЛИТЬ ПРЕВЬЮ?!'
        }
        this.wantCancelEditing = false
      } else if (howToChangeTask === 'cancel-editing') {
        this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ ОТМЕНИТЬ ВСЕ ДЕЙСТВИЯ С РЕДАКЦИЕЙ ЭТОГО ЗАДАНИЯ?!'
        this.wantCancelEditing = true
      }

      this.showModalState = !this.showModalState
    },
    cancelEditing () {
      console.log('вы отменили все редактирование')

      this.taskEdit.taskNameEditState = this.taskBeforeEdit.taskNameEditState
      this.taskEdit.editState = this.taskBeforeEdit.editState
      this.taskEdit.taskName = this.taskBeforeEdit.taskName
      this.taskEdit.done = this.taskBeforeEdit.done

      this.taskEdit.todos = JSON.parse(JSON.stringify(this.taskBeforeEdit.todos))

      this.saveDataToDb()
    },
    changeTask () {
      // delete && cancel editing task

      if (this.wantCancelEditing) {
        this.cancelEditing()
      } else {
        // delete task
        if (this.taskView !== 'preview') {
          const index = this.tasks.findIndex(t => t === this.taskEdit);
          this.tasks.splice(index, 1);

          tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
              .then(res => {
                this.$router.push({ name: 'TaskListPage' })
                return res
              })
              .catch(err => console.error(err))
        } else {
          this.$store.state.previewTask.taskName = null
          this.$store.state.previewTask.taskId = ''
          this.$store.state.previewTask.todos = []
          this.$store.state.previewTask.done = false
          this.$store.state.previewTask.editState = false
          this.$store.state.previewTask.taskNameEditState = false

          tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
              .then(res => {
                this.$router.push({ name: 'TaskListPage' })
                return res
              })
              .catch(err => console.error(err))
        }
      }
    },
    getDataFromDb () {
      tasksLocalForage.getItem('taskBeforeEdit')
      .then(res => {
        if (!res) {
          return
        } else {
          this.$store.state.taskBeforeEdit = res
        }
        return res
      })
      .catch(err => console.log(err))

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
      if (this.taskView !== 'preview') {
        tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
          .catch(err => console.error(err))
      } else {
        tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
          .catch(err => console.error(err))
      }
    },
    checkIsAllDone () {
      this.taskEdit.done = this.allDone
      this.saveDataToDb()
    },
    checkIsSomeEdit () {
      if (this.taskEdit.todos.length) {
        this.taskEdit.editState = this.someEdit
        this.saveDataToDb()
      }
    },
    randomId (key) {
      return String(this.randomNumMixin(1,100)) + key.toUpperCase().slice(0,30) + String(this.randomNumMixin(1,100))
    },
    editTaskNameState (task) {
      task.taskNameEditState = !task.taskNameEditState
      this.saveDataToDb()
      this.writeHistory('edit task name')
    },
    saveTaskNameChanges (task) {
      if (!this.newTaskName.length) {
        this.notify_show('Добавьте текст задания', 'ERROR:', 'error')
      }

      const index = this.tasks.findIndex(taskExist => taskExist === task);

      let existingTasks = this.tasks.slice(0)
      existingTasks.splice(index, 1);

      if (this.checkCoincidence(existingTasks, this.newTaskName, 'taskName')) {
        this.notify_show('Задание с таким именем уже существует!', 'ERROR:', 'error')
      }

      if (!this.checkCoincidence(existingTasks, this.newTaskName, 'taskName') && this.newTaskName.length) {
        task.taskNameEditState = !task.taskNameEditState
        task.taskName = this.newTaskName
        this.saveDataToDb()
        this.notify_show('Имя задания отредактировано!', 'SUCCESS:', 'success')

        this.writeHistory('save new task-name')
      }
    },
    editToDoState (todo) {
        todo.editState = !todo.editState
        this.checkIsSomeEdit()

        this.writeHistory('edit todo')
    },
    saveToDoChanges (todo) {
      if (!this.newTodoText.length) {
        this.notify_show('Пожалуйста - добавьте текст пункта', 'ERROR:', 'error')
      }

      const index = this.taskEdit.todos.findIndex(todoExist => todoExist === todo);

      let existingTodos = this.taskEdit.todos.slice(0)
      existingTodos.splice(index, 1);

      if (this.checkCoincidence(existingTodos, this.newTodoText, 'todoText')) {
        this.notify_show('Пункт с таким именем уже существует!', 'ERROR:', 'error')
      }

      if (!this.checkCoincidence(existingTodos, this.newTodoText, 'todoText') && this.newTodoText.length) {
      todo.editState = !todo.editState
      todo.todoText = this.newTodoText
      this.checkIsSomeEdit()
      this.notify_show('Пункт отредактирован!', 'SUCCESS:', 'success')

      this.writeHistory('save todo')
      }
    },
    deleteToDo (todo) {
      const index = this.taskEdit.todos.findIndex(td => td === todo);
      this.taskEdit.todos.splice(index, 1);

      this.writeHistory('delete todo')

      this.checkIsAllDone()

      this.saveDataToDb()

      console.log('Delete ToDo', todo)
    },
    writeHistory (action) {
      this.history.push([JSON.parse(JSON.stringify(this.taskEdit)), action])
      this.setHistory()
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
}

p {
  word-break: break-all;
}

i {
  margin: 5px;
}

.wrapper {
  min-width: 160px;
}

.edit-tool-bar, .add-todo {
  margin: 0 10px 10px 10px;
  background-color: rgb(0, 213, 255);
}

.edit-bar {
  display: flex;
  flex-direction: column;

  &__task-name, &__task-todo {
    margin: 0 10px 10px 10px;

    &__actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid black;
      padding: 10px;

      &__icons {
        min-width: 50px;

        i {
          color: rgba(0, 0, 0, 0.5);
        }

        i:hover {
          color: rgb(0, 0, 0);
        }
      }
    }
  }
}

.preview-mode {
  background-color: antiquewhite;
}

.done-mode {
  background-color: aquamarine;
}

.editBar {
  background-color: rgb(255, 255, 255);
  padding-bottom: 20px;
  padding-top: 10px;
}

input[type=text] {
  margin: 5px;
  padding: 2px;
  min-width: 200px;
  min-height: 30px;
  border: 1px solid transparent;
}

.add-todo {
  justify-content: space-between;
  text-align: center;
  display: flex;
  padding: 5px;
}

button {
  min-width: 30px;
  min-height: 30px;
  margin: 5px;
  padding: 2px;
  transition: all 0.5s;
  border: 1px solid transparent;
}

button:hover {
  background-color: transparent;
  border: 1px solid black;
}

@media (max-width: 500px) {
  .edit-bar {
    &__task-name, &__task-todo {
      &__actions {
        padding: 5px;

        &__text {
          font-size: 10px;
        }

        &__icons {
          font-size: 10px;
          min-width: 40px;
        }
      }
    }
  }

  button {
    min-width: 20px;
    min-height: 25px;
    font-size: 8px;
  }

  input[type=text] {
    min-height: 25px;
    text-align: center;
  }
}

@media (max-width: 300px) {
  .add-todo {
    display: block;
  }

  button {
    min-width: 200px;
  }
}

@media (max-width: 250px) {
  input[type=text], button {
    min-width: 116px;
    margin-bottom: 2px;
  }

  input[type=text] {
    font-size: 8px;
  }
}

</style>


