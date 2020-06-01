const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://diandria:admin@crudnode-ulwza.mongodb.net/test?retryWrites=true&w=majority', {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose