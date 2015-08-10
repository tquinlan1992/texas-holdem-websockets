var mongojs = require('mongojs');


// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/database", function(err, db) {
  if(err) { return console.dir(err); }

       var collection = db.collection('documents');  


// Register a new user
module.exports.add = function(object, callback) {
    
  
    
    var objectToInsert = object;
    collection.insert(objectToInsert,
                   function(err){
                    console.log(objectToInsert._id);
                        callback(objectToInsert._id);
    });
    
    



    };

});