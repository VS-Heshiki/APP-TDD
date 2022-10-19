const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

jest.setTimeout(10000);

let userData = {
	name: 'Victor',
	email: 'victor_heshiki@hotmail.com',
	password: '123123123',
};

beforeAll(async () => {
	try {
		await request
			.post('/user')
			.send(userData);
	} catch (err) {
		console.log(err);
	}
});

afterAll(async () => {
	try {
		await request
			.delete(`/user/${userData.email}`);
	} catch (err) {
		console.log(err);
	}
});

describe('register users', () => {
	it('sign up', async () => {
		let email = `${Date.now()}@gmail.com`;
		let user = { name: 'Victor', email, password: 'qweqweuyiu' };

		try {
			const res = await request
				.post('/user')
				.send(user);
			expect(res.statusCode).toEqual(200);
			expect(res.body.email).toEqual(email);
		} catch (err) {
			throw new Error(err);
		}
	});

	it('must prevent empty fields from being accepted', async () => {
		let user = { name: '', email: '', password: '' };

		try {
			const res = await request
				.post('/user')
				.send(user);
			expect(res.statusCode).toEqual(400);
		} catch (err) {
			throw new Error(err);
		}
	});

	it('must prevent email duplicated', async () => {
		let email = `${Date.now()}@gmail.com`;
		let user = { name: 'Victor', email, password: 'qweqweuyiu' };

		try {
			const res = await request
				.post('/user')
				.send(user);
			expect(res.statusCode).toEqual(200);
			expect(res.body.email).toEqual(email);
			try {
				const res = await request
					.post('/user')
					.send(user);
				expect(res.statusCode).toEqual(400);
			} catch (err) {
				throw new Error(err);
			}
		} catch (err) {
			throw new Error(err);
		}
	});
});

describe('auth user', () => {
	it('must authenticate a user when login', async () => {
		try {
			const res = await request
				.post('/AutH')
				.send({ email: userData.email, password: userData.password });
			expect(res.statusCode).toEqual(200);
			expect(res.body.token).toBeDefined();
		} catch (err) {
			throw new Error(err);
		}
	});

	it('must prevent login when user is not registered', async () => {
		try {
			const res = await request
				.post('/AutH')
				.send({ email: 'only@test.com', password: '1q2w3e4r' });
			expect(res.statusCode).toEqual(403);
			expect(res.body.errors.email).toEqual('User not registered!');
		} catch (err) {
			throw new Error(err);
		}
	});

	it('must prevent login when password is incorrect', async () => {
		try {
			const res = await request
				.post('/AutH')
				.send({ email: userData.email, password: '1q2w3e4r' });
			expect(res.statusCode).toEqual(400);
			expect(res.body.errors.password).toEqual('Password invalid!');
		} catch (err) {
			throw new Error(err);
		}
	});
});
