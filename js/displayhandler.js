const queries = require('./queries-pg');

module.exports = {
  displayItems: function (req, res) {

    queries.getAllItems(req, res, (rows) => {
      console.log('displayhandler rows: ', rows.length);
      if (req.url === '/') {
        res.render('index', { rows, edit: false });
      } else {
        res.render('index', { rows, edit: true });
      }
    });
  }
}