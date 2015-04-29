var storage = require('node-persist'),
    path = require('path');

storage.initSync({
    dir : path.resolve(__dirname, '../../data'),
});

module.exports = {
    get : storage.getItemSync,
    set : storage.setItemSync
};