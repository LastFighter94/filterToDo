import localforage from "localforage";
import {mapActions} from "vuex";

const tasksLocalForage = localforage.createInstance({
    name: 'DraftDB',
    storeName: 'tasksDraft'
})

export default {
    computed: {
        previewTask() {
            return this.$store.getters.preview_task_getter
        }
    },
    methods: {
        addTaskToDb (task) {
            this.addTask(
                {
                    taskName: task.taskName,
                    taskId: task.taskId,
                    todos: task.todos,
                    done: task.done,
                    editState: task.editState,
                    taskNameEditState: task.taskNameEditState
                }
            )

            this.notify_show('Задание отправлено!', 'SUCCESS:', 'success')
            this.cleanPreview()
            this.saveDataToDb()
            this.savePreviewToDb()
        },
        cleanPreview () {
            this.previewTask.taskName = null,
            this.previewTask.taskId = '',
            this.previewTask.todos = [],
            this.previewTask.done = false
            this.previewTask.editState = false,
            this.previewTask.taskNameEditState = false
        },
        saveDataToDb () {
            tasksLocalForage.setItem('tasksLocalForage', this.$store.getters.tasks_getter)
                .catch(err => console.error(err))
        },
        savePreviewToDb () {
            tasksLocalForage.setItem('previewTaskLocalForage', this.$store.getters.preview_task_getter)
                .catch(err => console.error(err))
        },
        ...mapActions([
            'addTask'
        ])
    }
}
