<template>
    <div
        class="modal"
    >
      <div
          class="modal__content"
      >
        <span
          class="modal__content__close-modal-window"
          @click="close"
        >
        ×
        </span>

        <span
          class="modal__content__modal-text"
        >
          {{this.text}}
        </span>

        <p>
          <span
            class="modal__content__answer"
            @click="confirm">
          ДА
          </span>

          <span
            class="modal__content__answer"
            @click="close"
          >
          НЕТ
          </span>
        </p>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    }
  },
  methods: {
    close(){
      this.$emit('close')
    },
    confirm(){
      this.close()
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>

.modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.65);

    &__content {
      margin: 30% auto;
      padding: 20px;
      width: 80%;
      z-index: 99999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 16px 20px rgba(0,0,0,0.4);
      background: #ffffff;

      &__close-modal-window {
        color: rgb(228, 49, 17);
        float: right;
        font-weight: bold;
        cursor: pointer;
      }

      &__modal-text {
        color: black;
      }

      &__answer {
        padding-top: 10px;
        display: block;
        width: 50px;
      }

      &__answer:hover {
        color: #fc0000;
      }
    }
}

@media (max-width: 500px) {
  .modal {
    &__content {
      &__modal-text {
        font-size: 14px;
      }

      &__answer {
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 200px) {
  .modal {
    &__content {
      padding: 10px;

      &__modal-text {
        font-size: 10px;
      }

      &__answer {
        font-size: 10px;
      }

      &__close-modal-window {

      }
    }
  }
}

</style>
