var express = require('express');
var router = express.Router();
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

var queryFR = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbc: <http://dbpedia.org/resource/Category:>
  PREFIX dct: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?cheese ?name
  WHERE {
    ?cheese ?a dbo:Cheese;
    dct:subject dbc:French_cheeses;
    rdfs:label ?name
    FILTER langMatches(lang(?name),"en")
  } LIMIT 20
`;

var queryGoat = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbc: <http://dbpedia.org/resource/Category:>
  PREFIX dct: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?cheese ?name
  WHERE {
    ?cheese ?a dbo:Cheese;
    dct:subject <http://dbpedia.org/resource/Category:Cow's-milk_cheeses>;
    rdfs:label ?name
    FILTER langMatches(lang(?name),"en")
  } LIMIT 20
`;

var queryFrGoat = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbc: <http://dbpedia.org/resource/Category:>
  PREFIX dct: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?cheese ?name
  WHERE {
    ?cheese ?a dbo:Cheese;
    dct:subject dbc:French_cheeses;
    dct:subject <http://dbpedia.org/resource/Category:Cow's-milk_cheeses>;
    rdfs:label ?name;
    FILTER langMatches(lang(?name),"en")
  } LIMIT 20
`;

router.get('/', async function (req, res, next) {
  const bindingsStream = await myEngine.queryBindings(queryFrGoat, {
    sources: ['http://fragments.dbpedia.org/2015/en'],
  });
  const bindings = await bindingsStream.toArray();
  res.send(bindings.flatMap(
    value => value.get("name").value))
});

module.exports = router;
