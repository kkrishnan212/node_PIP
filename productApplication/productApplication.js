var http = require('http');
    path = require("path"),
    fs = require('fs'),
    url = require('url');
   
function get_page_name(req) {
    var core_url = req.parsed_url.pathname;
	console.log(core_url);
    var parts = core_url.split("/");
    return parts[2];
}

function serve_static(file, res) {
    var rs = fs.createReadStream(file);
    rs.on('error', (e) => {
        res.writeHead(404, { "Content-Type" : "application/json" });
        var out = { error: "not_found",
                    message: "'" + file + "' not found" };
        res.end(JSON.stringify(out) + "\n");
        return;
    });

    var ct = content_type_for_file(file);
    res.writeHead(200, { "Content-Type" : ct });
    rs.pipe(res);
}

function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        default: return 'text/plain';
    }
}

function serve_page(req, res) {
    var page = get_page_name(req);
	console.log(page);

    fs.readFile('basic.html', (err, contents) => {
        if (err) {
            send_failure(res, 500, err);
            return;
        }

        contents = contents.toString('utf8');
        contents = contents.replace('{{PAGE_NAME}}', page);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(contents);
    });
}


function serve_product(req, res) {
    var name = get_page_name(req);
	console.log(name);
	var jsonObj = require("./products/products.json");
	
	for(var i = 0; i < jsonObj.product.length; ++i) {
			if (name == jsonObj.product[i].name) {
				console.log ("name present " + jsonObj.product[i]	);
				data = jsonObj.product[i];
				 break;
			}
	}
	
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data, null, 2));
	//I can't seem to find a way to get data across to product.js
	//I could in theory write this product to a file and read it as page name
	//and also have files for each product
	//possibly cannot use module.exports either as file on content server and this is the base file?.
}


function page_handler(req, res) {
	var jsonObj = require("./products/products.json");
	var output = { error: null, data: jsonObj };
	
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(output) + "\n");
}

function handle_incoming_request(req, res) {
    // parse the query params into an object and get the path
    // without them. (2nd param true = parse the params).
    req.parsed_url = url.parse(req.url, true);
    var core_url = req.parsed_url.pathname;
	//console.log(core_url);
    // test this fixed url to see what they're asking for
    if (core_url.substring(0, 7) == '/pages/') {
        serve_page(req, res);
    } else if (core_url.substring(0, 10) == '/products/') {
        serve_product(req, res);
	 } else if (core_url.substring(0, 11) == '/templates/') {
        serve_static("templates/" + core_url.substring(11), res);
    } else if (core_url == '/products.json') {
		page_handler(req, res);
    } 
    else { 
		console.log("failure - invalid url");
    }
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);
