const { query } = require('express');
var express = require('express');
var router = express.Router();
const ParsingClient = require('sparql-http-client/ParsingClient')

const clientDBPedia = new ParsingClient({
  endpointUrl: 'https://dbpedia.org/sparql'
})
const clientWikidata = new ParsingClient({
  endpointUrl: 'https://query.wikidata.org/sparql'
})

router.get('/:milk-:country', async function (req, res, next) {
  var queryDbPedia = `
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
    } LIMIT 10
  `
  var tempMilk
  if (req.params.milk == "Cow") {
    tempMilk = "Q3088299"
  } else if (req.params.milk == "Goat") {
    tempMilk = "Q198815"
  }

  var queryWikidata = `
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  SELECT DISTINCT ?cheese ?name ?picture
  WHERE {
    ?cheese wdt:P279 wd:Q10943;
            wdt:P279 wd:${tempMilk};
            wdt:P18 ?picture;
            rdfs:label ?name
            FILTER langMatches(lang(?name),"en")
  } LIMIT 10
  `

  var suggestions = []
  clientDBPedia.query.select(queryDbPedia).then(rows => {
    rows.forEach(row => {
      suggestions.push({
        name: row.name.value,
        cheese: row.cheese.value,
        picture: row.picture.value
      })
    })

    clientWikidata.query.select(queryWikidata).then(rows => {
      rows.forEach(row => {
        suggestions.push({
          name: row.name.value,
          cheese: row.cheese.value,
          picture: row.picture.value
        })
      })
      // console.log(suggestions)
      res.render('User', { title: 'User', suggestions: suggestions });

    }).catch(error => {
      console.log(error)
    })
  }).catch(error => {
    console.log(error)
  })



});

module.exports = router;
