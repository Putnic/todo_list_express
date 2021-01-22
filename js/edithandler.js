const queries = require('./queries-pg'); 

module.exports = {
	loadEditPage: function(req, res) {
		console.log('edit params: ', req.params);
		queries.loadItemById(req, res, (row) => {
			res.render('add_edit_item_page', {
				title: 'Edit item!',
				href: '/edit',
				id: row.id,
				name: row.name,
				description: row.description,
				completed: row.completed
			});
		}); 
	}, 
	changeItem: function(req, res) {
		queries.updateItem(req, res); 
	},
	removeItem: function(req, res) {
		queries.deleteItem(req, res); 
	}
}

