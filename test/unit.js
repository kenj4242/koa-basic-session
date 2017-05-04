require('babel-polyfill');
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert
const Koa = require('koa');
const Req = require('request')
const cookie = require('cookie')


const Session = require('../src/cookie-session')
//const Session = require('../dist/cookie-session')

// use the filestore module for testing
const Store = require('koa-cookie-session-filestore')


const testPort = 3000;
const testId = 'testing123';
const testData = { someval: 'I am someval' };
const storeOpts = {
	dir: '/tmp',
	pfx: 'session-',
	sfx: '.json',
	sidLength: 24,
	maxAge: 60,
	gcFrequency: 100,
};

// setup a Koa server with a dummy session store
const app = new Koa();


var sessionStore = new Store(storeOpts);
var session = Session({
	key: 'SESSID',
	store: sessionStore,
});


app.use(session);
app.use(ctx => {
	ctx.body = JSON.stringify(ctx.state.session);
});
app.listen(testPort);




describe('Basic', function() {

	it('Should start a new session', function(done) {

		Req({
			url: 'http://localhost:'+testPort+'/'
		}, (err, res, body) => {

			if (err) {
				assert.fail('http server error', '', err);
				done();
			}

			try {

				var bdata = JSON.parse(body);

				// check for the returned session values
				assert(bdata.sessionid)
				assert(bdata.session)

				// check for the file on the filesystem
				var fpath = storeOpts.dir + '/' + storeOpts.pfx + bdata.sessionid + storeOpts.sfx;
				try {
					fs.accessSync(fpath, 'r');
				} catch(e) {
					assert.fail('Session store file is not accessable on teh filesystem')
				}

			} catch(e) {
				assert.fail('bad return format', '', e);
			}

			done();
		});

	});













/*
	it('Should set a new session', function(done) {
		Req({
			url: 'http://localhost:'+testPort+'/',
			headers: {
				Cookie: cookie.serialize('SESSID', testId)
			}
		}, (err, res, body) => {

			if (err) {
				assert.fail('http server error', '', err);
				done();
			}

			try {

				console.log(body);

				var bdata = JSON.parse(body);
				console.log(bdata);


			} catch(e) {
				assert.fail('bad return format', '', e);
			}

			done();
		});

	});

*/

});





