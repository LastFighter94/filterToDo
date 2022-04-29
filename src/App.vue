<template>
  <div>
    <NavBar/>

    <router-view/>

      <notifications position="top right" classes="my-notification" :width="150"/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar
  },
}
</script>

<style lang="scss">
@import "assets/main.scss"

</style>
