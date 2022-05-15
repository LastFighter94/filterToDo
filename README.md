# filtertodo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

Возможные и существующие ошибки ***[errors]***

- (скрин "Ошибка!") Если скопировать ссылку на редактирование задания из task состояния и вставить ее в новый браузер, то вновь возникает ошибка
- (скрин "Ошибка!") Ошибка при удалении задачи из состояния редактирования EditTaskPage Task (все отображается корректно)
- (скрин "Ошибка!") Ошибка при обновлении страницы EditTaskPage Task (все отображается корректно)
- Разобраться с router ошибками (router-mistake - в коде)

Мелочи ***[perfect things]***

- максимальная длина слова при добавлении пункта или имени задания (максимальная длина слова.txt)
- сделать: при изменении имени_задания/текста_пункта_задания на одинаковое(ый) имя задания/текст пункта было уведомление "вы ничего не изменили"

Оптимизация ***[optimization]***

- миксин getItemLf почему-то не срабатывает правильно (метод getDataFromDb компонента EditTaskPage)
- оптимизация localForage кода в проекте.txt (есть один нерешенный момент)
