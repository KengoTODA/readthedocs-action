require('dotenv').config()

const assert = require('assert');
const assuming = require('mocha-assume').assuming;
const RTD = require('../src/rtd').default;

const timeout = 15 * 1000;

describe('rtd', function() {
  const configured = !!process.env.RTD_TOKEN;
  this.timeout(timeout);

  describe('#enableBuild()', () => {
    assuming(configured).it('should return false if branch is already activated', async () => {
      const rtd = new RTD(process.env.RTD_TOKEN);
      return rtd.enableBuild('your-read-the-docs-project', 'master')
         .then(enabled => {
           assert.ok(!enabled);
         });
    });
  });

  describe('#disabledBuild()', () => {
    assuming(configured).it('should return false if branch is already disabled', async () => {
      const rtd = new RTD(process.env.RTD_TOKEN);
      return rtd.disableBuild('your-read-the-docs-project', 'v0.1.0')
         .then(enabled => {
           assert.ok(!enabled);
         });
    });
  });

  describe('#getProject()', () => {
    assuming(configured).it('returns correct ID', async () => {
      const rtd = new RTD(process.env.RTD_TOKEN);
      const result = await rtd.getProject('your-read-the-docs-project');
      assert.equal(result.id, 235403);
      assert.equal(result.language, 'en');
    });
    assuming(configured).it('returns rejected promise for not existing project', async () => {
      const rtd = new RTD(process.env.RTD_TOKEN);
      return rtd.getProject('not-existing').then(
        () => Promise.reject(new Error('Expected method to reject.')),
        err => assert(err instanceof Error)
      );
    });
  });

  describe('#getTranslates()', () => {
    assuming(configured).it('returns single translate', async () => {
      const rtd = new RTD(process.env.RTD_TOKEN);
      const result = await rtd.getTranslates({
        id: 235403,
        language: 'en',
        slug: 'your-read-the-docs-project'
      });
      assert.deepEqual(result, [{
        id: 235403,
        language: 'en',
        slug: 'your-read-the-docs-project'
      }]);
    });
    assuming(configured).it('returns multiple translates', async () => {
      const rtd = new RTD(process.env.RTD_TOKEN);
      const result = await rtd.getTranslates({
        id: 79934,
        language: 'en',
        slug: 'spotbugs-in-kengo-toda'
      });
      assert.deepEqual(result, [{
        id: 79934,
        language: 'en',
        slug: 'spotbugs-in-kengo-toda'
      },{
        id: 79941,
        language: 'ja',
        slug: 'spotbugs-in-kengo-toda-ja'
      }]);
    });
  });
});
