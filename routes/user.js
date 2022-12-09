var express = require('express');
var router = express.Router();
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

var query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbc: <http://dbpedia.org/resource/Category:>
  PREFIX dct: <http://purl.org/dc/terms/>
  SELECT distinct ?name
  WHERE {
    ?cheese ?a dbo:Cheese;
    dct:subject ?French_cheeses;
    rdfs:label ?name
  } LIMIT 10
`;

router.get('/', async function (req, res, next) {
  const bindingsStream = await myEngine.queryBindings(query, {
    sources: ['http://fragments.dbpedia.org/2015/en'],
  });
  const bindings = await bindingsStream.toArray();
  res.send(bindings[0].get("name").value);
});

module.exports = router;
