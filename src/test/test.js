const assert = require('assert');

const Generators = require('../services/generators');

describe('Generators', function () {
  describe('process', function () {

    it('should return same data when the no generators are present', function () {
      assert.equal(Generators.process('foobar'), 'foobar');
    });

    // it('should return generated value', function () {
    //     assert.notEqual(Generators.process('${generate:integer}'), '${generate:integer}');
    // });


    it('should return generated value', function () {
        assert.notEqual(Generators.process('${generate:integer}SAMPLE${generate:integer}'), '${generate:integer}SAMPLE${generate:integer}');
    });


  });
});