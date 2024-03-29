﻿let express  = require('express'); 
let app = express();

let path = require('path');
let bodyParser = require('body-parser');  

let port = process.env.PORT || 8080;

// подключение модулей для обработки запросов 
let displayHandler = require('./js/displayhandler'); 
let insertHandler = require('./js/inserthandler'); 
let editHandler = require('./js/edithandler'); 

// установка генератора шаблонов 
app.set('views', path.join(__dirname, 'pages')); 
app.set('view engine', 'ejs');

// подгрузка статических файлов из папки pages 
app.use('/static', express.static(path.join(__dirname, 'public')));

// middleware для обработки данных в формате JSON 
let jsonParser = bodyParser.json();
let textParser = bodyParser.text(); 

app.use(jsonParser); 
app.use(textParser); 

// загрузить таблицу с элементами 
app.get('/', displayHandler.displayItems);

// загрузка страницы для создания нового элемента 
app.get('/add', insertHandler.loadAddPage); 
// добавить новый элемент 
app.post('/add/newItem', insertHandler.addRow); 

// отобразить элементы в режиме редактирования 
app.get('/edit', displayHandler.displayItems); 

// загрузка страницы для редактирования элементов 
app.get('/edit/:id', editHandler.loadEditPage);

// редактирование элемента в бд 
app.put('/edit/:id', editHandler.changeItem);

// удаление элемента из бд 
app.delete('/edit/:id', editHandler.removeItem);

// обработка ошибок 
app.use(function(err, req, res, next) {
	if (err) console.log(err.stack); 

	res.status(500).send('oops...something went wrong'); 
}); 

app.listen(port, function() { 

	console.log('app listening on port ' + port); 

});  
