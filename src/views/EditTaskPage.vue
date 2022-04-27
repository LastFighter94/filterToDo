<template>
<div>
  <div class="wrapper">
    <div 
      class="edit-tool-bar"
    >
      <EditToolBar
        @changeModalState="changeModalState"
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
                    disabled
                    v-model="taskEdit.done"
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
                @click="changeModalState"
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
                    @change="checkIsAllDone"
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
              v-model="todo.todoText"
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
    @confirm="deleteTask" 
  />

  <!-- 
    Костыль модального окна на "отмену всех действий" - еще одна модалка - рабочий вариант, однако костыльный
    1) при нажатии на "отмена всех действий" - передаем в v-if data отображения "костыля" true
    2) на emit "закрытие" окна вешаем тот тот же метод

    3) на emit "подтверждение" вешаем "отмена всех действий"



    *** Вариант "без костыля" *** - пора заканчивать этот проект, он итак отнимает достаточно много времени

    1) при нажатии на "отмена всех действий" - передаем в v-if data отображения "костыля" true
    2) а также передаем в data true/false состояний методов, которые мы будем выполнять по "подтверждению действия"
    Модальное окно принимает в себя
    - текст модального окна
    - эмит на закрытие модального окна
    - подтверждение действия ("отмена всех действий" или "удалить task || preview_task")

    -- в подтверждение действия мы можем вернуть метод, который, в зависимости от data будет возвращать подтверждение действия cancelTaskEditing() или deleteTask()
    -- после чего будет возвращать переданные data true/false состояния методов в первоночальное состояние/сбрасывать его, как будет удобно и логично



    !!! отмену действий можно реализовать следующим образом - это понятно и легко - заметка остается
    - при входе в данный компонент, неважно - редакция "preview" или "task" 
    - сразу копируем данное задание в LocalForage, ключ в DB назовем, например, "task_before_edit"
    - создаем метод, который будет возвращать этот объект - cancelTaskEditing()
  -->

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
      showModalState: false
    }
  },
  mixins: [
      addToDo,
      checkCoincidence,
      notifyShow, 
      randomNumMixin
  ],
  created () {
    this.getDataFromDb()
  },
  computed: {
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
      } else {
        return this.tasks.find(task => task.taskId === this.taskId)
      }
    }
  },
  methods: {
    changeModalState(){
      if (this.taskView !== 'preview') {
        this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ УДАЛИТЬ ЗАДАНИЕ?!'
      } else {
        this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ УДАЛИТЬ ПРЕВЬЮ?!'
      }
      this.showModalState = !this.showModalState
    },
    deleteTask () {
      if (this.taskView !== 'preview') {
        console.log('Are you sure?')
        console.log('delete task')

        const index = this.tasks.findIndex(t => t === this.taskEdit);
        this.tasks.splice(index, 1);

        tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
          .then(res => {
            this.$router.push({ name: 'TaskListPage' })
            return res
            })
          .catch(err => console.error(err))
      } else {
        console.log('Are you sure?')
        console.log('delete preview')

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
    },
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
      this.taskEdit.editState = this.someEdit
      this.saveDataToDb()
    },
    randomId (key) {
      return String(this.randomNumMixin(1,100)) + key.toUpperCase().slice(0,30) + String(this.randomNumMixin(1,100))
    },
    editTaskNameState (task) {
      task.taskNameEditState = !task.taskNameEditState
      this.saveDataToDb()
    },
    saveTaskNameChanges (task) {
      // Если нажимаем редактировать имя задания и ничего не изменяем - не выводить ошибку "задание с таким именем уже существует!" - делать проверку на все задания кроме того, внутри которого мы находимся - таким образом можно будет сохранить схему с v-model, которая была до этого
      if (!this.newTaskName.length) {
        this.notify_show('Добавьте текст задания', 'ERROR:', 'error')
      }

      if (this.checkCoincidence(this.tasks, this.newTaskName, 'taskName')) {
        this.notify_show('Задание с таким именем уже существует!', 'ERROR:', 'error')
      } 

      if (!this.checkCoincidence(this.tasks, this.newTaskName, 'taskName') && this.newTaskName.length) {
        task.taskNameEditState = !task.taskNameEditState
        task.taskName = this.newTaskName
        this.saveDataToDb()
        this.notify_show('Имя задания отредактировано!', 'SUCCESS:', 'success')
      } 
    },
    // Сделать проверку на совпадение текста todo в данном задании! - с сохранением v-model
    editToDoState (todo) {
        todo.editState = !todo.editState
        this.checkIsSomeEdit()
    },
    saveToDoChanges (todo) {
      if (!todo.todoText.length) {
        this.notify_show('Пожалуйста - добавьте текст пункта', 'ERROR:', 'error')
      } else {
        todo.editState = !todo.editState
        this.checkIsSomeEdit()
        this.notify_show('Пункт отредактирован!', 'SUCCESS:', 'success')
      }
    },
    deleteToDo (todo) {
      const index = this.taskEdit.todos.findIndex(td => td === todo);
      this.taskEdit.todos.splice(index, 1);

      // Вопрос в том - какое состояние задавать Task - если у него совершенно не остается Todos
      // Сейчас при удалении всех Todos - Task будет считать себя done = true если оставить this.checkIsAllDone() и done = false не прописывать checkIsAllDone()

      // this.checkIsAllDone()

      this.saveDataToDb()
      console.log('Delete ToDo', todo)
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


