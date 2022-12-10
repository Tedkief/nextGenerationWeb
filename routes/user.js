var express = require('express');
var router = express.Router();
const ParsingClient = require('sparql-http-client/ParsingClient')

const client = new ParsingClient({
  endpointUrl: 'https://dbpedia.org/sparql'
})

router.get('/:milk-:country', async function (req, res, next) {
  var query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbc: <http://dbpedia.org/resource/Category:>
  PREFIX dct: <http://purl.org/dc/terms/>
  SELECT DISTINCT ?cheese ?name ?picture
  WHERE {
    ?cheese ?a dbo:Cheese;
    dbo:thumbnail ?picture;
    dct:subject <http://dbpedia.org/resource/Category:${req.params.milk}'s-milk_cheeses>;
    dct:subject <http://dbpedia.org/resource/Category:${req.params.country}_cheeses>;
    rdfs:label ?name
    FILTER langMatches(lang(?name),"en")
    } LIMIT 20
  `
  var suggestions = []

  client.query.select(query).then(rows => {
    // console.log(rows)

    rows.forEach(row => {
      suggestions.push({
        name: row.name.value,
        cheese: row.cheese.value,
        picture: row.picture.value
      })
    })
    console.log(suggestions)
    res.render('User', { title: 'User', suggestions: suggestions });

  }).catch(error => {
    console.log(error)
  })

});

module.exports = router;
