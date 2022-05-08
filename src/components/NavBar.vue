<template>
    <div
      class="nav-bar"
    >
      <h2>
        <span
          v-if="this.$route.name !== 'EditTaskPage'"
        >
          {{this.$route.name}}
        </span>

        <span
          v-if="this.$route.name === 'EditTaskPage'"
        >
          Edit {{this.$route.params.taskView}}
        </span>
      </h2>
    </div>
</template>

<script>
export default {
  methods: {
    toggleAddTaskForm () {
      this.$emit('toggleAddTaskForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  background-color: rgb(127, 163, 255);
  padding: 10px;
  margin-bottom: 20px;
  min-width: 160px;
}

@media (max-width: 500px) {
  .nav-bar {
    h2 {
      font-size: 20px;
    }
  }
}

@media (max-width: 300px) {
  .nav-bar {
    h2 {
      font-size: 15px;
    }
  }
}

</style>
