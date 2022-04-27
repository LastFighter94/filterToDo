export default {
  methods: {
    checkCoincidence (state, value, checkingKey) {
      const coincidence = state.findIndex(s => s[checkingKey] === value)

      if (coincidence === -1){
        return false
      } else {
        return true
      }
    },
  }
}