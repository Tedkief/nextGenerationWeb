var express = require('express');
var router = express.Router();
const fs = require('fs')
const $rdf = require('rdflib')

// Get users
const turtleString = fs.readFileSync('users.rdf').toString()
const store = $rdf.graph()

$rdf.parse(
    turtleString,
    store,
    "http://nextgenerationweb.com/owl/users",
    "application/rdf+xml"
)

const stringQuery = `
	SELECT
		?id
		?name
        ?animal_milk
		?country_residence
	WHERE {
		?user a <http://nextgenerationweb.com/owl/users#User> .
		?user <http://nextgenerationweb.com/owl/users#id> ?id .
		?user <http://nextgenerationweb.com/owl/users#name> ?name .
        ?user <http://nextgenerationweb.com/owl/users#animal_milk> ?animal_milk .
		?user <http://nextgenerationweb.com/owl/users#country_residence> ?country_residence .
	}
`
const query = $rdf.SPARQLToQuery(stringQuery, false, store)
const usersRDF = store.querySync(query).map(
    res => {
        return {
            id: res['?id'].value,
            name: res['?name'].value,
            animal_milk: res['?animal_milk'].value,
            country_residence: res['?country_residence'].value
        }
    }
)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('profiles', { title: 'Express', profiles: usersRDF });
});

module.exports = router;
