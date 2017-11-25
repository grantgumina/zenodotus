var pg = require('pg').native
, connectionString = process.env.DATABASE_URL
, client
, query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE tags(id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE);');
query.on('end', function() { client.end(); });
