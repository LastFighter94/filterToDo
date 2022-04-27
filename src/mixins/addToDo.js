export default {
  data () {
    return {
      todoText: ''
    }
  },
  methods: {
    addTodoText (state) {
      if (!this.todoText.length) {
        this.notify_show('Пожалуйста - добавьте текст пункта', 'ERROR:', 'error')
      }

      if (this.checkCoincidence(state, this.todoText, 'todoText')) {
        this.notify_show('Такой пункт уже есть в задании', 'ERROR:', 'error')
      }

      if (!this.checkCoincidence(state, this.todoText, 'todoText') && this.todoText.length) {
        state.push({todoText: this.todoText, done: false, id: this.randomId(this.todoText), editState: false})
        this.todoText = ''
      } 
    }
  }
}