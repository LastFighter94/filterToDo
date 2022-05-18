<template>
<div
    v-if="!hideWarns"
>
<!-- заглушка на warns при обновлении страницы в том же роуте (ибо итак происходит редирект) -->
  <div class="wrapper">
    <div
      class="edit-tool-bar"
    >
      <EditToolBar
        :canCancelEditing="this.canCancelEditing"
        :historyLength="historyLength"
        :historyCurrentIndex="historyCurrentIndex"
        :taskToSend="this.taskEdit"
        @changeModalState="changeModalState"
        @cleanHistoryAndGoBack="cleanHistoryAndGoBack"
        @historyBack="historyBack"
        @historyForward="historyForward"
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
                    :disabled="!!this.taskEdit.todos.length"
                    v-model="taskEdit.done"
                    @change="saveDataToDb() && writeHistory('change task-done')"
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
                @click="taskEdit.taskNameEditState ? saveTaskNameChanges(taskEdit) : startEditTaskName(taskEdit)"
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
              v-model="taskEdit.taskName"
              @keypress.enter.prevent="saveTaskNameChanges(taskEdit)"
              @input="debounceSaveDataToDb"
              :maxlength="nameMaxLength"
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
                    @change="checkIsAllDone(), writeHistory('change todo-done')"
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
                @click="todo.editState ? saveToDoChanges(todo) : startEditToDo(todo)"
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
              v-model="todo.todoText"
              @keypress.enter.prevent="saveToDoChanges(todo)"
              @input="debounceSaveDataToDb"
              :maxlength="todoMaxLength"
            >
            </textarea>
          </div>
        </div>
      </div>
    </div>

    <div
      class="add-todo"
    >
      <div
        class="add-todo__left-side"
      >
        <input
          type="text"
          placeholder="Добавить еще пункт"
          v-model="todoText"
          @keypress.enter="addTodoText(taskEdit.todos), checkIsAllDone()"
          @input="debounceSaveDataToDb"
          :maxlength="todoMaxLength"
          >
      </div>

      <div>
        <button
          content="Добавить еще подпункт"
          v-tippy="{ placement : 'bottom' }"
          @click.prevent="addTodoText(taskEdit.todos), checkIsAllDone()"
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
import debounce from 'lodash/debounce'

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
      showModalState: false,
      wantCancelEditing: false,
      moveBack: 0,
      moveForward: 0,
      hideWarns: false
    }
  },
  mixins: [
      addToDo,
      checkCoincidence,
      notifyShow,
      randomNumMixin
  ],
  beforeDestroy() {
    this.cleanHistoryAndGoBack()
  },
  created () {
    // проверка на наличие taskId - если такового нет, то redirect
    let checkIdTask = this.tasks.find(t => t.taskId === this.taskId)

    if (checkIdTask === undefined && this.taskView === 'task') {
      this.routerPush({ name: 'TaskListPage' })

      this.hideWarns = true
    //  косяк в том, что при обновлении страницы в состоянии taskView === 'task' есть redirect
    //  хотя это должно работать только в случае если пользователь специально введет
    //  несуществующий id в адресе и нажмет enter
    }

    if (!this.hideWarns) {
      tasksLocalForage.setItem('taskBeforeEdit', this.taskEdit)
          .then(this.getDataFromDb)
          .then(this.setHistory)
          .catch(err => console.error(err))
    }
  },
  computed: {
    history () {
      return this.$store.getters.history_getter
    },
    historyLength () {
      return +this.$store.state.history.length
    },
    historyCurrentIndex () {
      let result = this.historyLength - this.moveBack + this.moveForward - 1
      if (result < 0) {
        result = 0
      }
      return result
    },
    canCancelEditing () {
      // два объекта не равны друг другу даже если их свойства полностью одинаковы
      // поэтому прибегаем к такому методу сравнения
      return (JSON.stringify(this.taskBeforeEdit) != JSON.stringify(this.taskEdit));
    },
    isAllDone () {
      return !this.taskEdit.todos.some(td => td.done === false);
    },
    isSomeEdit () {
      return !this.taskEdit.todos.every(td => td.editState === false);
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
    },
    todoMaxLength () {
      return this.$store.getters.todoMaxLength_getter
    },
    nameMaxLength () {
      return this.$store.getters.nameMaxLength_getter
    }
  },
  methods: {
    debounceSaveDataToDb () {
      this.debounceSaveToDoToDb()
    },
    debounce,
    debounceSaveToDoToDb:
        debounce(function () {
            this.saveDataToDb()
        }, 500),
    historyBack () {
      if (this.historyCurrentIndex === 0) {
        console.log('уже некуда move back Але')
      } else {
        console.log('move back')
        this.moveBack += 1
        this.showHistory()
      }
    },
    historyForward () {
      if (this.historyCurrentIndex === this.historyLength - 1) {
        console.log('уже некуда move forward Але')
      } else {
        console.log('move forward')
        this.moveForward += 1
        this.showHistory()
      }
    },
    showHistory () {
      this.taskEdit.taskNameEditState = this.history[this.historyCurrentIndex][0].taskNameEditState
      this.taskEdit.editState = this.history[this.historyCurrentIndex][0].editState
      this.taskEdit.taskName = this.history[this.historyCurrentIndex][0].taskName
      this.taskEdit.done = this.history[this.historyCurrentIndex][0].done

      this.taskEdit.todos = JSON.parse(JSON.stringify(this.history[this.historyCurrentIndex][0].todos))

      this.saveDataToDb()
    },
    recordHistory () {
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

      this.beforeEdit()
      this.saveDataToDb()
      this.cleanHistoryButStay()
    },
    beforeEdit () {
      this.taskEdit.taskNameEditState = this.taskBeforeEdit.taskNameEditState
      this.taskEdit.editState = this.taskBeforeEdit.editState
      this.taskEdit.taskName = this.taskBeforeEdit.taskName
      this.taskEdit.done = this.taskBeforeEdit.done

      this.taskEdit.todos = JSON.parse(JSON.stringify(this.taskBeforeEdit.todos))
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

          this.cleanHistoryAndGoBack()
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

          this.cleanHistoryAndGoBack()
        }
      }
    },
    getDataFromDb () {
      // миксин getItemLf почему-то не срабатываем правильно
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

      tasksLocalForage.getItem('todoText')
      .then(res => {
        if (!res) {
          return
        } else {
          this.todoText = res
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
      tasksLocalForage.setItem('todoText', this.todoText)
          .catch(err => console.error(err))

      if (this.taskView !== 'preview') {
        tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
          .catch(err => console.error(err))
      } else {
        tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
          .catch(err => console.error(err))
      }
    },
    checkIsAllDone () {
      this.taskEdit.done = this.isAllDone
      this.saveDataToDb()
    },
    checkIsSomeEdit () {
      if (this.taskEdit.todos.length) {
        this.taskEdit.editState = this.isSomeEdit
        this.saveDataToDb()
      }
    },
    randomId (key) {
      return String(this.randomNumMixin(1,100)) + key.toUpperCase().slice(0,30) + String(this.randomNumMixin(1,100))
    },
    startEditTaskName (task) {
      task.taskNameEditState = !task.taskNameEditState
      this.saveDataToDb()
      this.writeHistory('edit task name')
    },
    saveTaskNameChanges (task) {
      if (!task.taskName.length) {
        this.notify_show('Добавьте текст задания', 'ERROR:', 'error')
      }

      const index = this.tasks.findIndex(taskExist => taskExist === task);

      let existingTasks = this.tasks.slice(0)
      existingTasks.splice(index, 1);

      if (this.checkCoincidence(existingTasks, task.taskName, 'taskName')) {
        this.notify_show('Задание с таким именем уже существует!', 'ERROR:', 'error')
      }

      if (!this.checkCoincidence(existingTasks, task.taskName, 'taskName') && task.taskName.length) {
        task.taskNameEditState = !task.taskNameEditState

        this.saveDataToDb()
        this.notify_show('Имя задания отредактировано!', 'SUCCESS:', 'success')

        this.writeHistory('save new task-name')
      }
    },
    startEditToDo (todo) {
        todo.editState = !todo.editState

        this.checkIsSomeEdit()
        this.writeHistory('edit todo')
    },
    saveToDoChanges (todo) {
      if (todo.todoText.length === 0) {
        this.notify_show('Пожалуйста - добавьте текст пункта', 'ERROR:', 'error')
      }

      const index = this.taskEdit.todos.findIndex(todoExist => todoExist === todo);

      let existingTodos = this.taskEdit.todos.slice(0)
      existingTodos.splice(index, 1);

      if (this.checkCoincidence(existingTodos, todo.todoText, 'todoText')) {
        this.notify_show('Пункт с таким именем уже существует!', 'ERROR:', 'error')
      }

      if (!this.checkCoincidence(existingTodos, todo.todoText, 'todoText') && todo.todoText.length > 0) {
      todo.editState = !todo.editState
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
    setHistory () {
      if (!this.history.length) {
        this.history.push([JSON.parse(JSON.stringify(this.taskEdit)), 'set-history'])
        this.recordHistory()
      } else {
        console.error('ERROR! EditTaskPage - setHistory')
      }
    },
    writeHistory (action) {
      this.history.push([JSON.parse(JSON.stringify(this.taskEdit)), action])
      this.recordHistory()
    },
    cleanHistoryButStay() {
      // срабатываем при отмене всех действий
      this.$store.state.history.splice(1)
      this.recordHistory()
    },
    cleanHistoryAndGoBack () {
      this.hideWarns = true
      // срабатывает при удалении задания - костыль небольшой - так как по-хорошему лучше объединить в два метода
      this.$store.state.history = []
      this.recordHistory()
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
  width: 100%;
  min-height: 30px;
  border: 1px solid transparent;
}

.add-todo {
  justify-content: space-between;
  text-align: center;
  display: flex;
  padding: 5px;

  &__left-side {
    width: 100%;
  }
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
    min-width: 200px;
  }
}

@media (min-width: 250px) and (max-width: 300px) {
  input[type=text] {
    min-width: 200px;
  }
}

@media (max-width: 300px) {
  input[type=text] {
    min-width: 200px;
    width: auto;
  }

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


