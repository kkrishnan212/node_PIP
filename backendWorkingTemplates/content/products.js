var fs = require('fs')

module.exports = function (req, res) {
	/*var page = req.params.products;
	var id = req.params.product_id;
	console.log(page);
	if ('products' != page) return invalidURL(req, res);//to do change to include myshop
	
	if (id == "" || id == null) {*/
		console.log(req.path + " is the request path");
		var jsonObj = require("../products/products.json");
				res.writeHead(200, {"Content-Type": "application/json"});
				//res.end(JSON.stringify(jsonObj, null, 2));
				var output = { error: null, data: jsonObj };
				res.end(JSON.stringify(output) + "\n");
	//}
/*	else {
		
		var jsonObj = JSON.parse(fs.readFileSync("./products/products.json", 'utf8'));
		/*var data;
		console.log(jsonObj.product.length);
		for(var i = 0; i < jsonObj.product.length; ++i) {
			if (id == jsonObj.product[i].id) {
				console.log ("id present " + jsonObj.product[i]	);
				data = jsonObj.product[i];
				 break;
			}
		}
	//	    res.writeHead(200, {"Content-Type": "application/json"});
    //var output = { error: null, data: data };
    //res.end(JSON.stringify(output) + "\n");
		
		console.log("data is " + data);
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(JSON.stringify(data, null, 2));
	}*/
}


function invalidURL(req, res) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end("Invalid URL");	
}