const app = require('../src/app');
const supertest = require('supertest');
const request = supertest(app);

it('must response in 8989 port',() => {
    return request.get('/').then(res => {
        let status = res.statusCode;
        expect(status).toEqual(200)
    }).catch(err => {
        throw new Error(err)
    })
})