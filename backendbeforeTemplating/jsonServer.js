var express = require('express');
var app = express();

var page_hdlr = require('./products.js');

app.get('/:products', page_hdlr);

app.get('/:products/:product_id', page_hdlr);

app.listen(8080);