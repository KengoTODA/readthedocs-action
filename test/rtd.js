require('dotenv').config()

const assert = require('assert');
const assuming = require('mocha-assume').assuming;
const rtd = require('../src/rtd.js');
const timeout = 15 * 1000;

describe('rtd', function() {
  this.timeout(timeout);

  describe('#enableBuild()', () => {
    const configured = !!process.env.RTD_USERNAME && !!process.env.RTD_PASSWORD;
    assuming(configured).it('should return true if branch is already activated', done => {
      rtd.enableBuild('your-read-the-docs-project', 'master', console)
         .then(enabled => assert.ok(!enabled))
         .then(done)
         .catch(e => assert.fail(e));
    });
  });
});
