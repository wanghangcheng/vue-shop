'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/', function (req, res) {
    res.end('<h1>Hello, itLike!</h1>');
});

app.listen(3000, function () {
    console.log('服务器已经启动');
});