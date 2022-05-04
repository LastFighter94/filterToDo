<template>
  <div>
    <NavBar/>

    <transition
        name="fade"
        mode="out-in"
    >
      <router-view/>
    </transition>

      <notifications position="top right" classes="my-notification" :width="this.notifyWidth"/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  data () {
    return {
      notifyWidth: 300
    }
  },
  components: {
    NavBar
  },
  mounted () {
    window.addEventListener('resize', this.changeNotifyWidth)
  },
  methods: {
    changeNotifyWidth () {
        if (window.innerWidth > 1000) {
          this.notifyWidth = 420;
          return this.notifyWidth
        } else if (window.innerWidth > 500) {
          this.notifyWidth = 300;
          return this.notifyWidth
        } else {
          this.notifyWidth = 150;
          return this.notifyWidth
        }
    }
  }
}
</script>

<style lang="scss">
@import "assets/_main";

</style>
