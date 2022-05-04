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

+ Избавиться от Duplicated Keys в TaskItem (возможная ошибка) (в редакции задания preview && task эта ошибка исключена)
- Будет ли ошибка при одинаковых ключах todo при рендере всех заданий на TaskListPage? (не знаю)
- Ошибка при удалении задачи из состояния редактирования EditTaskPage Task (все отображается корректно)
- Ошибка (скрин "Ошибка!") при обновлении страницы EditTaskPage Task (все отображается корректно)
+ Ошибка (скрин "Ошибка!") при обновлении страницы EditTaskPage Preview (отображается некорректно)
- Если скопировать ссылку на редактирование задания из task состояния и вставить ее в новый браузер, то вновь возникает указанная выше ошибка 

Очевидные косяки ***[mistakes]***

+ EditTaskPage Реализовать проверку на совпадение TaskName в общей базе за исключением того Task внутри которого мы находимся
+ EditTaskPage Исправить ошибку с невозможностью оставить то же имя задания в состоянии его редакции
+ EditTaskPage Реализовать проверку на совпадение в todos редактируемого todo (вначале решить ошибку с duplicated keys)
+ Если удалить все todo пункты и добавить пустой пункт, почему-то задание пометиться как выполненное (обнаружил случайно этот косяк
+ (оставляю момент без проработки так как есть пункт "сделать логичнее AddTaskForm" ***[last thing to do]*** где он будет затронут автоматически) в превью состоянии, если добавлять todo до того как добавляешь имя задания, нет возможности редактировать задание целиком (и отменить редакцию тоже нельзя): надо проработать этот момент

Верстка ***[design]***

+ Текст в nav-bar адаптировать к media-query
+ TaskListPage полностью отсутствует мобильная верстка
+ Notifications сделать правильное отображение при маленьком экране (адаптировать стили)
+ Notifications сделать так чтобы в зависимости от media менялось значение пропса width
+ ModalWindow сделать правильное отображение при маленьком экране (адаптировать стили)
+ Transitions переходы
+ Transitions на добавление задания (в main.scss стили для task-list-page, add-task-form, app - используются transitions)
+ Сделать notifications стили отдельным файлом - импортировать его в main.scss (также сделал и с другими файлами)
+ Transition на появление AddTaskForm


Мелочи ***[perfect things]***

- при состоянии "в редакции" имени задания или его пункта делать красивый стиль на эту надпись
- максимальная длина символов в input(ах) «имени задания» и «текста пункта»
- максимальная длина слова «имени задания» и «текста пункта» (function helper или mixin)
- сделать input(ы) добавления пункта и имени задания по всей ширине div, в котором они находятся (убрать эти изменения при мобильной верстке соответственно)
- сделать так чтобы при изменении имени_задания/текста_пункта_задания на одинаковое(ый) имя задания/текст пункта было уведомление "вы ничего не изменили"
- сделать так чтобы при добавлении имени_задания/текста_пункта между словами было не больше одного пробела и не было пробела в конце, после чего уже проводить проверку на совпадения данных
- сделать так чтобы редактируемые имя_задания/текст_пункта не пропадали при переходе по роуту, если еще не отредактировали до конца
- добавить события на enter

На потом ***[later]***

- Сделать логику кнопки с текстом "сохранить задание" или "отправить задание" в EditToolBar: примечание в коде компонента)
- Оптимизировать насколько это возможно все что связано с localForage
- Оптимизировать насколько это возможно модальное окно, а также сделать "отмену всех действий", имеется ввиду редакции задания в состоянии preview_task или task (примечание в коде компонента EditTaskPage)

Еще далеко до этого ***[last thing to do]***

- Отмена действий - действие "вперед" и "назад"!
- Фильтрация заданий на "выполненные" и "нет"
- Сделать компонент "тег", сделать возможность добавлять его к заданию и возможность поиска по этому "тегу"
- Опубликовать проект на Git Hub pages = или в web
- сделать логичнее AddTaskForm
