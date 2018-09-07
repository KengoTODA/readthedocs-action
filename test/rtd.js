require('dotenv').config()

const assert = require('assert');
const assuming = require('mocha-assume').assuming;
const bunyan = require('bunyan');
const RTD = require('../lib/rtd.js').default;

const timeout = 15 * 1000;

describe('rtd', function() {
  this.timeout(timeout);

  describe('#enableBuild()', () => {
    const configured = !!process.env.RTD_USERNAME && !!process.env.RTD_PASSWORD;
    assuming(configured).it('should return true if branch is already activated', done => {
      const rtd = new RTD(bunyan.createLogger({name: "test"}));
      rtd.enableBuild('your-read-the-docs-project', 'master')
         .then(enabled => {
           assert.ok(!enabled);
           done();
         })
         .catch(done);
    });
  });
});
