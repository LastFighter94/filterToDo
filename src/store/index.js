import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // modalText: '',
    previewTask: {
      taskName: null,
      taskId: '',
      todos: [],
      done: false,
      editState: false,
      taskNameEditState: false
      // костыль
    },
    tasks: [

    ],
    taskBeforeEdit: null,
    history: []
  },
  mutations: {
    addTask: (state, payload) => {
      state.tasks.push(payload)
    }
  },
  actions: {
    addTask: (context, payload) => {
      context.commit('addTask', payload)
    }
  },
  modules: {
  },
  getters: {
    tasks_getter: state => {
      return state.tasks
    },
    preview_task_getter: state => {
      return state.previewTask
    },
    history_getter: state => {
      return state.history
    },
  },
})
