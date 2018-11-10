const app = require('express')();

const bodyParser = require('body-parser');

require('./config/config');
require('./db/mongoose');

const port = process.env.PORT;

app.use(bodyParser.json());

require('./routes/todoRoutes')(app);
require('./routes/userRoutes')(app);

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };