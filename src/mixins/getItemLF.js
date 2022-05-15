import localforage from "localforage";

const tasksLocalForage = localforage.createInstance({
    name: 'DraftDB',
    storeName: 'tasksDraft'
})

export default {
    methods: {
        getItemLf (item, itemData) {
            tasksLocalForage.getItem(item)
                .then(res => {
                    if (!res) {
                        return
                    } else {
                        res = itemData
                    }
                    return res
                })
                .catch(err => console.log(err))
        }
    }
}

// не срабатываем правильно - оставлю код, вдруг узнаю в чем дело и оптимизирую дублирующуюся логику в компоненте EditTaskPage
