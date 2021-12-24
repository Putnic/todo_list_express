const pool = require('../db/config-pg'); 

module.exports = {

	// выбор всех элементов и отображение в виде таблицы 
	getAllItems: function (req, res, cb) {
		const query = {
			name: 'get-all-items',
			text: 'SELECT * FROM todos ORDER BY created_at ASC',
			values: ''
		};
		pool.query(query)
			.then(result => {
				console.log('getAllItems rows:', result.rows.length);
				// console.log(result.rows);
				cb(result.rows);
			})
			.catch(e => console.error(e.stack));
	},
	
	// добавить элемент в бд
	insertItem: function (req, res) {
		const query = {
			name: 'insert-item',
			text: 'INSERT INTO todos(name, description, completed) VALUES($1, $2, $3)',
			values: [req.body.name, req.body.description, parseInt(req.body.completed)]
		}

		pool.query(query)
			.then(result => {
				console.log('insertItem: ', result);
			})
			.catch(e => console.error(e.stack));
	}, 
	
	// загрузить элемент из бд по id 
	loadItemById: function(req, res, cb) {
		const query = {
			name: 'load-item-byId',
			text: 'SELECT * FROM todos WHERE id = $1',
			values: [parseInt(req.params.id)]
		}

		pool.query(query)
			.then(result => {
				console.log('loadItemById: ', result);
				cb(result.rows[0]);
			})
			.catch(e => console.error(e.stack));
	},
	
	// обновить элемент 
	updateItem: function(req, res) { 
		const query = {
			name: 'update-item',
			text: 'update todos set name=$1, description=$2, completed=$3 where id=$4 returning *',
			values: [req.body.name, req.body.description, parseInt(req.body.completed), parseInt(req.body.id)]
		}

		pool.query(query)
			.then(result => {
				console.log('updateItem: ', result);
			})
			.catch(e => console.error(e.stack));
	},

	// удалить элемент из бд
	deleteItem: function (req, res) {
		const query = {
			name: 'delete-item',
			text: 'DELETE FROM todos WHERE id = $1',
			values: [parseInt(req.params.id)]
		}

		pool.query(query)
			.then(result => {
				console.log('deleteItem: ', result);
				res.send('OK');
			})
			.catch(e => console.error(e.stack));
	}
}