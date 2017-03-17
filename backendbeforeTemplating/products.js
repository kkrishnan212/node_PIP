var fs = require('fs')

module.exports = function (req, res) {
	var page = req.params.products;
	var id = req.params.product_id;
	console.log(page);
	if ('products' != page) return invalidURL(req, res);
	
	if (id == "" || id == null) {
		console.log(req.path + " is the request path");
		var jsonObj = require("./products/products.json");
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(JSON.stringify(jsonObj, null, 2));
	}
	else {		
		var jsonObj = JSON.parse(fs.readFileSync("./products/" + page + ".json", 'utf8'));
		var data;
		console.log(jsonObj.product.length);
		for(var i = 0; i < jsonObj.product.length; ++i) {
			if (id == jsonObj.product[i].id) {
				console.log ("id present " + jsonObj.product[i]	);
				data = jsonObj.product[i];
				 break;
			}
		}
		
		console.log("data is " + data);
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(JSON.stringify(data, null, 2));
	}
}


function invalidURL(req, res) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end("Invalid URL");	
}