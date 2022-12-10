var express = require('express');
var router = express.Router();
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

var beginQuery = `
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbc: <http://dbpedia.org/resource/Category:>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?cheese ?name
WHERE {
  ?cheese ?a dbo:Cheese;`

var endQuery = `    
  rdfs:label ?name
  FILTER langMatches(lang(?name),"en")
} LIMIT 20`

router.get('/:querytype', async function (req, res, next) {
  console.log(req.params.querytype)
  if (req.params.querytype == "goatlover") {
    bindingsStream = await myEngine.queryBindings(
      beginQuery + "dct:subject <http://dbpedia.org/resource/Category:Goat's-milk_cheeses>;" + endQuery, {
      sources: ['http://fragments.dbpedia.org/2015/en'],
    });
  } else if (req.params.querytype == "frenchlover") {
    bindingsStream = await myEngine.queryBindings(
      beginQuery + "dct:subject <http://dbpedia.org/resource/Category:French_cheeses>;" + endQuery, {
      sources: ['http://fragments.dbpedia.org/2015/en'],
    });
  } else {
    bindingsStream = await myEngine.queryBindings(
      beginQuery + "dct:subject <http://dbpedia.org/resource/Category:Cow's-milk_cheeses>;" +
      "dct:subject <http://dbpedia.org/resource/Category:French_cheeses>;" + endQuery, {
      sources: ['http://fragments.dbpedia.org/2015/en'],
    });
  }
  const bindings = await bindingsStream.toArray();
  res.send(bindings.flatMap(
    value => value.get("name").value))
});

module.exports = router;
