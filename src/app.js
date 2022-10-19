const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userService = require('./service/userServices');
const jwt = require('jsonwebtoken');

const Secret = 'sweater_weather%the-neighbourhood.mp3';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
	.connect('mongodb://localhost:27017/imgpics')
	.then(() => {})
	.catch(err => {
		console.log(err);
	});

app.get('/', (req, res) => {
	res.json({});
});

app.post('/user', async (req, res) => {
	let { name, email, password } = req.body;
	let status = await userService.Create(name, email, password)

	if(status) {
		res.json({ email: email });
	} else {
		res.sendStatus(400)
	}
});

app.post('/AutH', async (req, res) => {
	let { email, password } = req.body;
	await userService
		.Authentik(email, password)
		.then(user => {
			if (user == undefined) {
				res.statusCode = 403;
				res.json({ errors: { email: 'User not registered!' } });
				return;
			}

			if (user == false) {
				res.statusCode = 400;
				res.json({ errors: { password: 'Password invalid!' } });
				return;
			}

			let token = jwt.sign({ email }, Secret, { expiresIn: '12hr' });
			res.json({ token });
		})
		.catch(err => {
			console.log(err);
		});
});

app.delete('/user/:email', async (req, res) => {
	let status = await userService.Delete(req.params.email);

	if (status) {
		res.sendStatus(200);
	} else {
		res.sendStatus(500);
	}
});

module.exports = app;
