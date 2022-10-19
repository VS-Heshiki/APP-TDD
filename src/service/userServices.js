const mongoose = require('mongoose');
const user = require('../model/User');
const validator = require('email-validator');
const bcrypt = require('bcrypt');

const User = mongoose.model('User', user);

class UserService {
	async Create(name, email, password) {
		if (name == null || name.length <= 2) {
			return;
		}

		if (validator.validate(email) == false) {
			return;
		}

		if (password == null || password.length <= 5) {
			return;
		}

		let userEmail = await User.findOne({ email: email });

		if (userEmail != undefined) {
			return;
		}

		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(password, salt);

		let newUser = new User({
			name,
			email,
			password: hash,
		});

		try {
			await newUser.save();
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async Delete(email) {
		try {
			await User.deleteOne({ email: email });
			return true;
		} catch (err) {
			return err;
		}
	}

	async Authentik(email, password) {
		let user = await User.findOne({ email: email });
		try {
			if (user == undefined) {
				return undefined;
			} return bcrypt.compare(password, user.password)
		} catch (err) {
			return err
		}
	}
}

module.exports = new UserService();
