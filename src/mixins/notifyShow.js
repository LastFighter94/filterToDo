export default {
  methods: {
    notify_show (notify_text, title_text, show_type) {
      this.$notify({
      title: title_text,
      text: notify_text,
      duration: 3000,
      type: show_type
    })
    },
  }
}
