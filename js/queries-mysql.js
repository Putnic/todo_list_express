const connection = require('../db/config-mysql'); 

module.exports = {

	// выбор всех элементов и отображение в виде таблицы 
	getAllItems: function (req, res, cb) {
		let rows = [];

		connection.getConnection((err, connect) => {
			if (err) throw error;
			let query = connect.query("SELECT * FROM items");
			query
			.on('error', function(err) {
				console.log(err);
				throw err;
			})
			.on('result', function(row) {
				rows.push(row);
			})
			.on('end', function() {
				console.log('getAllItems:', rows.length);
				cb(rows);
			});
			
		});
	},
	
	// добавить элемент в бд
	insertItem: function (req, res) {
		let inserts = {
			name: req.body.name, 
			description: req.body.description, 
			completed: parseInt(req.body.completed)
		}

		connection.getConnection(function(err, connection) {
			let sql = "INSERT INTO items SET ?";
			connection.query(sql, inserts, function (error, results, fields) {
				if (error) throw error;
				console.log('add item: ', results);
				connection.release();
			});
		});
	}, 
	
	// загрузить элемент из бд по id 
	loadItemById: function(req, res, cb) {		

		let inserts = {
			id: parseInt(req.params.id) 
		};
		
		connection.getConnection(function(err, connection) {
			if (err) throw err;
			let sql = "SELECT * FROM items WHERE id = ?";
			connection.query(sql, inserts.id, function (error, result, fields) {
				if (error) throw error;
				console.log('get item by id: ', result);
				connection.release();
				// console.log('Fields: ', fields);
				cb(result[0]);
			});
		});
	},
	
	// обновить элемент 
	updateItem: function(req, res) { 

		let inserts = {
			id: parseInt(req.body.id), 
			name: req.body.name, 
			description: req.body.description, 
			completed: parseInt(req.body.completed)
		};

		connection.getConnection(function(err, connection) {
			if (err) throw err;
			let sql = "UPDATE items SET name = ?, description = ?, completed = ? WHERE id = ?";
			
			connection.query(sql, 
				[inserts.name, inserts.description, inserts.completed, inserts.id], 
				function (error, results, fields) {
					console.log('updateItem by id: ', results);
					connection.release();
			
					if (error) throw error;
			});
		});
	},

	// добавить элемент в бд
	deleteItem: function (req, res) {
		let inserts = {
			id: parseInt(req.params.id)
		}

		connection.getConnection(function(err, connection) {
			if (err) throw err;
			let sql = "DELETE FROM items WHERE id=?";
			connection.query(sql, inserts.id, function (error, result, fields) {
				if (error) throw error;
				console.log('item deleted: ', result);
				res.send('OK');
				
				connection.release();
			});
		});
	}
}