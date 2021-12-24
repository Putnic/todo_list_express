const queries = require('./queries-pg');

module.exports = {
  loadAddPage: function (req, res) {
    console.log('insert params: ', req.params);
    res.render('add_edit_item_page', {
      title: 'Add item!',
      href: '/',
      id: null,
      name: null,
      description: null,
      completed: null
    });
  },
  addRow: function (req, res) {
    // подключение к бд 
    queries.insertItem(req, res);
  }
}