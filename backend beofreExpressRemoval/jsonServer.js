var express = require('express');
var app = express();

//var page_hdlr = require('./content/products.js');

var http = require('http'),
    async = require('async'),
    path = require("path"),
    fs = require('fs'),
    url = require('url');
   
function get_page_name(req) {
    var core_url = req.path;
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

        // replace page name, and then dump to output.
        contents = contents.replace('{{PAGE_NAME}}', page);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(contents);
    });
}

function page_handler(req, res) {
var jsonObj = require("./products/products.json");
				res.writeHead(200, {"Content-Type": "application/json"});
				//res.end(JSON.stringify(jsonObj, null, 2));
				var output = { error: null, data: jsonObj };
				res.end(JSON.stringify(output) + "\n");
}

app.get('/pages/:products', serve_page);
app.get('/content/', serve_static);
app.get('/templates/', serve_static);
app.get('/products.json', page_handler);
/*app.get('/pages/:products', serve_page);
app.get('/pages/:products', serve_page);
if (core_url.substring(0, 7) == '/pages/') {
        serve_page(req, res);
 } else if (core_url.substring(0, 11) == '/templates/') {
        serve_static_file("templates/" + core_url.substring(11), res);
    } else if (core_url.substring(0, 9) == '/content/') {
        serve_static_file("content/" + core_url.substring(9), res);
    } else if (core_url == '/products.json') {
        //handle_list_albums(req, res);
    } else if (core_url.substr(0, 7) == '/albums'
               && core_url.substr(core_url.length - 5) == '.json') {
        handle_get_album(req, res);
    } else {
        send_failure(res, 404, invalid_resource());
    }
	
*/
//app.get('/content/:products/:product_id', page_hdlr);

//app.get('/myshop/:products', page_hdlr);

app.listen(8080);

