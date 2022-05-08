<template>
  <div class="toolbar">
    <div>
      <button
        content="Вернуться назад"
        v-tippy
      >
        <i
          class="fa-solid fa-arrow-left"
          @click="goBack"
        >
        </i>
      </button>
    </div>

    <div>
      <button
        :content="this.$route.params.taskView !== 'preview' ? 'Удалить задание' : 'Отмена редактирования'"
        v-tippy
      >
        <i
          :class="this.$route.params.taskView !== 'preview' ? 'fa-solid fa-trash' : 'fa-solid fa-ban'"
          @click="$emit('changeModalState')"
        >
        </i>
      </button>

      <button
        :content="this.$route.params.taskView !== 'preview' ? 'Сохранить задание' : 'Отправить задание'"
        v-tippy
      >
        <i
          class="fa-solid fa-floppy-disk"
          @click="sendTask"
        >
        </i>
      </button>

      <button
        v-if="this.$route.params.taskView !== 'preview'"
        content="Отменить все"
        :disabled="!this.canCancelEditing"
        v-tippy
      >
        <i
          class="fa-solid fa-xmark"
          @click="$emit('changeModalState', 'cancel-editing')"
        >
        </i>
      </button>

      <button
        content="Действие назад"
        v-tippy
      >
        <i
          class="fa-solid fa-rotate-left"
        >
        </i>
      </button>

      <button
        content="Действие вперед"
        v-tippy
      >
        <i
          class="fa-solid fa-rotate-right"
        >
        </i>
      </button>
    </div>
  </div>
</template>

<script>
import notifyShow from "@/mixins/notifyShow"
import addTaskToDb from "@/mixins/addTaskToDb"

export default {
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    sendTask () {
      if (this.$route.params.taskView !== 'preview') {
        this.notify_show('Задание сохранено', 'SUCCESS:', 'success')
        this.goBack()
      } else {
        this.addTaskToDb(this.taskToSend)
        this.goBack()
      }
    }
  },
  mixins: [
    notifyShow,
    addTaskToDb
  ],
  props: {
    taskToSend: {
      type: Object
    },
    canCancelEditing: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
// По-хорошему надо установить новую версию vue-tool-tip и прописать кастомный адаптивный к @media стиль
// Потому что при сжатии экрана - tool-tip остается соразмерным изначальной версии и не сжимается

.toolbar {
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

button:disabled,
button[disabled],
button:disabled:hover,
button[disabled]:hover{
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}

button:hover {
  background-color: transparent;
  border: 1px solid black;
}

@media (max-width: 500px) {
  button {
    min-width: 20px;
    min-height: 20px;
    font-size: 8px;
  }
}

@media (max-width: 300px) {
  button {
    min-width: 17px;
    min-height: 17px;
    font-size: 7px;
    margin: 2px;
  }
}

@media (max-width: 300px) {
  .toolbar {
    display: block;
  }
}

</style>
