require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Data = require('./data.json');
const TOKEN = process.env.API_TOKEN;


const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(authorize);

function authorize (req, res, next) {
	const header = req.get('Authorization') || '';
	const token = header.split(' ')[1];
	if (token === TOKEN) return next();

	res.status(401).end();
}

app.get('/movie', (req,res) => {
	const { genre, country, avg_vote } = req.query;
	let body = Data;

	if (genre) {
		body = body.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
	}

	if (country) {
		body = body.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
	}

	if (avg_vote) {
		body = body.filter(movie => movie.avg_vote >= Number(avg_vote));
	}

	res.json(body);
});

app.listen(8000, () => 'Server listening at http://localhost:8000.');
