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

      <!-- 
        При нажатии на кнопку - делать promise - вначале notify "успех"

        Если preview_task, тогда делаем отправку задания как в AddTaskForm (здесь по-хорошему использовать vuex, чтобы обойтись без всяких emit и так далее)
        Если task - тогда просто делаем redirect, потому что у нас итак данные сохраняются автоматически в LocalForage

        далее redirect

        Отложил задание на потом - логика его осуществления ясна и понятна
      -->

      <!-- <button
        :content="this.$route.params.taskView !== 'preview' ? 'Сохранить задание' : 'Отправить задание'" 
        v-tippy
      >
        <i 
          class="fa-solid fa-floppy-disk"
        >
        </i>
      </button> -->

      <!-- 
        Отложил задание на потом - логика его осуществления ясна и понятна 
      -->

      <!-- <button 
        content="Отменить все" 
        v-tippy
      >
        <i 
          class="fa-solid fa-xmark"
        >
        </i>
      </button> -->

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

export default {
  methods: {
    goBack () {
      this.$router.go(-1)
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
  .toolbar {
    display: block;
  }
}

</style>