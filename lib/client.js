// Generated by CoffeeScript 1.6.3
var Client, Collection, MongoClient, utils;

utils = require('./utils');

MongoClient = require('mongodb').MongoClient;

Collection = require('./collection');

Client = (function() {
  Client.prototype.url = null;

  function Client(server, options) {
    this.options = options != null ? options : {};
    if (!utils.is.obj(server) && !utils.is.str(server)) {
      throw new Error('Connection url to mongo must be specified');
    }
    if (utils.is.str(server)) {
      this.url = server;
    } else {
      if (!server.dbname) {
        throw new Error('The db name must be configured (server.dbname)');
      }
      if (!server.host) {
        server.host = '127.0.0.1';
      }
      if (!server.port) {
        server.port = '27017';
      }
      this.url = "mongodb://" + server.host + ":" + server.port + "/" + server.dbname;
    }
  }

  Client.prototype.collection = function(name) {
    return new Collection(this, name);
  };

  Client.prototype.open = function(name, fn) {
    var _this = this;
    if (!utils.is.fun(fn)) {
      fn = function() {};
    }
    if (this.db && this.db.state && this.db.state === 'connected') {
      fn(null, this.db.collection(name));
    } else {
      MongoClient.connect(this.url, this.options, function(error, db) {
        if (error) {
          fn(error, null);
          return;
        }
        _this.db = db;
        fn(null, db.collection(name));
      });
    }
  };

  Client.prototype.close = function() {
    if (!this.db) {
      return false;
    }
    this.db.close();
    this.db = null;
    return true;
  };

  return Client;

})();

module.exports = Client;
