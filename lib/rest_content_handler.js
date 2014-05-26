var _ = require("underscore"),
    default_content_handler = require("punch").ContentHandler,
    module_utils = require("punch").Utils.Module,
    markdown = require("./markdown"),
    request = require("request").defaults( process.env.http_proxy ? { 'proxy': process.env.http_proxy } : {});

var path = require("path");
var jf = require('jsonfile');
var fs = require('fs');

module.exports = {

    parsers: {},

    endpoint: "http://api.bitbucket.org/1.0/repositories/azhdanov/lambda-plugin/wiki/",

    username: "admin",

    password: "password",

    _config: {},

    outputDir: null,

    contentsFile: null,

    setup: function(config) {

        var self = this;

        _.each(config.plugins.parsers, function(value, key){
            self.parsers[key] = module_utils.requireAndSetup(value, config);
        });

        // setup default parser
        self._parser = self.parsers['.markdown'];

        // setup default content handler
        default_content_handler.setup(config);

        // return setup if there's no specific settings
        if (config.resr) {
            self.endpoint = config.rest.endpoint || self.endpoint;

            self.username = config.rest.username || self.username;

            self.password = config.rest.password || self.password;
        }

        self._config = {};
        self._config.auth = {
          username: self.username,
          password: self.password
        };

        // check if endpoint exists
        request.get({url: self.endpoint, json: true}, function (err, response, body) {
          if (err) {
            console.log("error", err);
          } else if (body) {
            //console.log('the force is with you.', body);
            return self;
          } else {
            console.log("error", "Endpoint does not exist.");
          }
        });

        // contents

        self.outputDir = config.output_dir;
        self.contentsFile = path.join(self.outputDir, 'contents.json');

        try {
            fs.statSync(self.outputDir);
        } catch (err) {
            fs.mkdirSync(self.outputDir);

        }

        jf.writeFileSync(self.contentsFile, {contents: []});
    },

    isSection: function(request_path) {
        // site just has a flat structure
        return false;
    },

    getContent: function(path, callback) {
        var self = this;

        var r = /^wiki\//;

        if (!path.match(r)) {
			return callback('Does not match content pattern', null, null);
        }

		var page = path.replace(r, '');
		markdown.g_wiki_page = page; // for markdown.js#atxHeader
		var title = page.replace(/_/g, ' ');
        var content_output = {};

        request.get({url: self.endpoint + '/' + page, json: true}, function (err, response, body) {
            if (!err && response.statusCode == 200) {

                var contents = jf.readFileSync(self.contentsFile);  
                contents.contents.push({title: title, href: page, text: body.data});
                jf.writeFileSync(self.contentsFile, contents);

		        var parsed_output = markdown.toHTML(body.data);
		        var modified_date = Date.parse(response.headers['last-modified']);
		        var collected_contents = {site_title: 'Lambda Plugin', title: title, contents: parsed_output, wiki: true};
		        collected_contents[page] = true;
		        callback(null, collected_contents, modified_date);
            } else {
				//console.log("Error", err || body);
				callback(err || body, null, null);
			}
        });
    },

    negotiateContent: function(request_path, file_extension, request_options, callback) {
        var self = this;
        var error = null;
        var collected_contents = {};
        var content_options = {};
        var last_modified = new Date().getTime();

        var path = request_path.substr(1);

        // fetch content
        self.getContent(path, function(err, contents, modified_date) {
            if (!err) {
                collected_contents = _.extend(collected_contents, contents);

                // fetch and mix shared content
                default_content_handler.getSharedContent(function(err, shared_content, shared_modified_date) {
                    if (!err) {
                        collected_contents = _.extend(collected_contents, shared_content);
                        if (shared_modified_date > last_modified) {
                            last_modified = shared_modified_date;
                        }
                    }        
                });
                return callback(error, collected_contents, content_options, last_modified);
            } else {
                // falback: default content_handler
                default_content_handler.negotiateContent(request_path, file_extension, request_options, callback);
            }
        });

    },
    
    getSections: function(callback) {
        default_content_handler.getSections(callback);
    },

    getContentPaths: function(basepath, callback) {
        default_content_handler.getContentPaths(basepath, function(dummy, collected_paths) {
	      if (basepath.match(/^\/$/)) {
            collected_paths.push('/wiki/Examples');
   	      }
          callback (null, collected_paths);
        });
  }
};