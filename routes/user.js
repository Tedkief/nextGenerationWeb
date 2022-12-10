var express = require('express');
var router = express.Router();
const ParsingClient = require('sparql-http-client/ParsingClient')

const client = new ParsingClient({
  endpointUrl: 'https://dbpedia.org/sparql'
})

router.get('/:querytype', async function (req, res, next) {
  var query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbc: <http://dbpedia.org/resource/Category:>
  PREFIX dct: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?cheese ?name
  WHERE {
    ?cheese ?a dbo:Cheese;`

  if (req.params.querytype == "goat_lover") {
    query = query + `
      dct:subject <http://dbpedia.org/resource/Category:Goat's-milk_cheeses>;
      `
  } else if (req.params.querytype == "french_lover") {
    query = query + `
      dct:subject <http://dbpedia.org/resource/Category:French_cheeses>;
      `
  } else {
    query = query + `
      dct:subject <http://dbpedia.org/resource/Category:Cow's-milk_cheeses>;
      dct:subject <http://dbpedia.org/resource/Category:French_cheeses>;
      `
  }
  query += `
    rdfs:label ?name
    FILTER langMatches(lang(?name),"en")
    } LIMIT 20
  `
  var names = []
  var cheeses = []

  client.query.select(query).then(rows => {
    // console.log(rows)

    rows.forEach(row => {
      names.push(row.name.value)
      cheeses.push(row.cheese.value)
    })
    res.send(names)

  }).catch(error => {
    console.log(error)
  })

});

module.exports = router;
