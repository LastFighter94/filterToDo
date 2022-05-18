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

Зашлушки на ошибки ***[errors]***

1. заглушка в EditTaskPage (hideWarns): при обновлении страницы в состоянии taskView = task идет редирект на TaskListPage, хотя по сути пользователь должен оставаться там же
2. если скопировать ссылку на редактирование задания из task состояния и вставить ее в новое окно, то сработает редирект (иначе ошибка возникнет)

Мелочи ***[perfect things]***

1. максимальная длина слова при добавлении пункта или имени задания (максимальная длина слова.txt)
2. сделать: при изменении имени_задания/текста_пункта_задания на одинаковое(ый) имя задания/текст пункта было уведомление "вы ничего не изменили"

Оптимизация ***[optimization]***

1. миксин getItemLf почему-то не срабатывает правильно (метод getDataFromDb компонента EditTaskPage)
2. оптимизация localForage кода в проекте.txt (есть один нерешенный момент)

### END

Труд над проектом закончен 18/05/22

***[Review]***

- проект перегружен кодом, но полноценно рабочий: 
- есть важный нереализованный момент (пункт 2 errors)
- есть два некритичных моментов в оптимизации и пара мелочей
