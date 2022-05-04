<template>
<div>
  <div
    class="task-list"
  >
    <div
      :class="this.preview ? 'task-list__task-item preview-mode' : 'task-list__task-item done-mode'"
    >
      <div
        class="task-list__task-item__actions"
        v-if="this.task.taskId"
      >
        <div>
          <h3>
            <p>
              <input
                v-model="this.isTaskDone"
                type="checkbox"
                disabled
              >
              {{!this.task.taskNameEditState ? this.task.taskName : 'в редакции'}}
            </p>
          </h3>
        </div>

        <div
            class="task-list__task-item__actions__icons"
        >
          <router-link
            :to="{name: 'EditTaskPage', params: {taskId: this.task.taskId, taskView: this.preview ? 'preview' : 'task'}}"
          >
            <i
              class="fa-solid fa-pen"
            >
            </i>
          </router-link>

          <i
            :class="!this.preview ? 'fa-solid fa-trash' : 'fa-solid fa-ban'"
            @click="changeModalState"
          >
          </i>
        </div>
      </div>

    <ul>
      <li
        v-for="todo in this.task.todos"
        :key="todo.id"
      >
      <!-- duplicated keys - вполне возможно! -->
        <input
          type="checkbox"
          disabled
          v-model="todo.done"
        >
          <span
            class="todoText"
          >
            {{!todo.editState ? todo.todoText : 'в редакции'}}
          </span>
      </li>
    </ul>

    </div>
  </div>

  <ModalWindow
    v-if="this.showModalState"
    :text="this.$store.state.modalText"
    @close="changeModalState"
    @confirm="deleteTask"
  />
</div>
</template>

<script>
import ModalWindow from '@/components/ModalWindow.vue'

import localforage from 'localforage'

const tasksLocalForage = localforage.createInstance({
  name: 'DraftDB',
  storeName: 'tasksDraft'
})

export default {
  data () {
    return {
      taskView: this.$route.params.taskView,
      showModalState: false,
    }
  },
  components: {
    ModalWindow
  },
  props: {
    preview: {
      default: false,
      type: Boolean
    },
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    // здесь сильно дублируется логика - надо было заранее продумать этот момент в плане проекта - можно избежать дублирующуюся логику, но тогда будет частично затронута общая пользовательская логика - в общем - либо переделывать все заново, либо оставить дублирующуюся логику (this.preview передается из AddTaskForm)
    changeModalState(){
      if (!this.preview) {
        this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ УДАЛИТЬ ЗАДАНИЕ?!'
      } else {
        this.$store.state.modalText = 'УВЕРЕНЫ ЧТО ХОТИТЕ УДАЛИТЬ ПРЕВЬЮ?!'
      }
      this.showModalState = !this.showModalState
    },
    // здесь частично дублирующаяся логика (этот рабочий момент в концепции похож на тот что сверху в примечании)
    deleteTask () {
      if (!this.preview) {

        const index = this.tasks.findIndex(t => t === this.task);
        this.tasks.splice(index, 1);

        tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
          .catch(err => console.error(err))
      } else {
        this.previewTask.taskName = null
        this.previewTask.taskId = ''
        this.previewTask.todos = []
        this.previewTask.done = false
        this.previewTask.editState = false
        this.previewTask.taskNameEditState = false

        tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
          .catch(err => console.error(err))
      }
    }
  },
  computed: {
    previewTask () {
      return this.$store.getters.preview_task_getter
    },
    tasks () {
      return this.$store.getters.tasks_getter
    },
    isTaskDone () {
      return this.task.done
    }
  }
}
</script>

<style lang="scss" scoped>
li:first-child {
  margin-top: 5px;
}

li {
  list-style: none;
  word-break: break-all;
}

a, i {
    color: rgba(0, 0, 0, 0.5);
}

a, i:hover {
    color: rgb(0, 0, 0);
}

.task-list {
  display: flex;
  flex-direction: column;

  &__task-item {
    padding: 10px;
    margin: 10px;

    &__actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid black;
      padding: 10px;

      i {
        margin: 5px;
      }

      &__icons {
        min-width: 50px;
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

@media (max-width: 500px) {
  .task-list {
    &__task-item {
      &__actions {
        h3 {
          font-size: 16px;
        }
      }
    }
  }

  .todoText {
    font-size: 12px;
  }
}

p {
  word-break: break-all;
}

</style>
