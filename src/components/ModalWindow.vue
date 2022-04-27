<template>
    <div class="modal">
      <div class="modal_content">
        <span 
          class="close_modal_window"
          @click="close"
        >
        ×
        </span>

        {{this.text}}

        <p>
          <span 
            class="answer"
            @click="confirm">
          ДА
          </span>

          <span 
            class="answer"
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
  }

.modal_content {
    margin: 30% auto;
    padding: 20px;
    width: 80%;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 16px 20px rgba(0,0,0,0.4);
    background: #ffffff;
  }

.close_modal_window {
    color: rgb(228, 49, 17);
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

.answer {
  padding-top: 10px;
  display: block;
  width: 50px;
}

.answer:hover {
  color: #fc0000;
}

</style>