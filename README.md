# Решебники, Рандомизатор билетов и составитель КИМов

## Описание
Проект представляет собой [программу](#https://drive.google.com/open?id=1X4BeZIURP5ct0fStl0IhFwdRDqiwkeir9AewiyqDYU8), которая составляет рандомизированные тесты. 

## Оглавление
* [Описание](#Описание)
* [Оглавление](#Оглавление)
* [Начало работы](#Начало-работы)
    * [Google Account](#Google-Account)
* [Эксплуатация](#Эксплуатация)
    * [Google Spreadsheet](#Google-Spreadsheet)
    * [Config](#Config)
    * [Google Classroom](#Google-Classroom)
    * [Google Forms](#Google-Forms)

## Начало работы
### Google Account
1. Для начала требуется вход в аккаунт в домене miem.hse.ru и открыть Диск
2. Затем нужно скопировать таблицу по указанной ссылке на Диск

## Эксплуатация
### Google Spreadsheet
Скриптам внутри таблицы соответствует ssheet-scripts из этого репозитория

1. Просмотр кода: Меню -> Инструменты -> Редактор скриптов
2. Лист Map содержит данные, которые преобразовываются в JSON. 
Нельзя заполнять лишние ячейки!
3. Просмотр ошибок выполнения скрипта: Меню -> Вид -> Выполнения

Таблица содержит следующие листы:
1. Вопросы
На этом листе вопросы нужно указывать в соответствии с шаблоном
2. Формы
Данный лист заполняется в ходе выполнения программы
3. Ответы
На этом листе можно просмотреть, у какого студента в каком вопросе ошибки, и увидеть итоговую оценку
4. СтудентыTEST
Сюда записываются почты студентов в домене miem.hse.ru
Студент должен быть учащимся на курсе в Classroom, иначе он не получит форму
5. [Config](#Config)
6. Types
Здесь записаны типы вопросов для выпадающего списка на листе Вопросы


### Config
Таблица содержит конфиг-лист, на котором требуется указать:
- Количество вопросов в тесте
- Папку Диска, в которую сохранять формы

Так же требуется предоставить следующие разрешения:
- https://www.googleapis.com/auth/classroom.courses
- https://www.googleapis.com/auth/classroom.coursework.students
- https://www.googleapis.com/auth/classroom.profile.emails
- https://www.googleapis.com/auth/classroom.profile.photos
- https://www.googleapis.com/auth/classroom.rosters
- https://www.googleapis.com/auth/drive
- https://www.googleapis.com/auth/forms
- https://www.googleapis.com/auth/script.scriptapp
- https://www.googleapis.com/auth/spreadsheets

### Google Classroom
Пользователь, который планирует проводить тесты, должен создать курс в Classroom и пригласить студентов в роли учащихся на данный курс.

### Google Forms
С помощью скрипта генерируются формы в указанную папку. Каждая форма уникальна для любого из студентов