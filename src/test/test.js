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


const MatcherResolver = require('../services/matchResolver');


describe('MatchSelector', function(){
  
  const matchResolver = MatcherResolver.build(`<?xml version="1.0" encoding="UTF-8"?>
  <env:Envelope xmlns:env="http://www.w3.org/2001/12/soap-envelope">
      <env:Body>
          <getPetByIdRequest xmlns="urn:com:example:petstore">
              <id>2</id>
          </getPetByIdRequest>
      </env:Body>
  </env:Envelope>
  `, {
    "env": "http://www.w3.org/2001/12/soap-envelope",
    "pets": "urn:com:example:petstore" 
  });


  describe('match', function(){

    it('should return matched dispatch', function() {

      const matcher = {
        "xpath": "/env:Envelope/env:Body/pets:getPetByIdRequest/pets:id/text()",
        "dispatch": {
          "1": "response-ABC.xml",
          "2": "response-XYZ.xml"
        }
      };
  
      assert.equal(matchResolver.resolve(matcher), 'response-XYZ.xml')
    });


    // naming the response file exactly as the matched string. see the folder samples/pet-store
    it('should return matched text', function() {

      const matcher = {
        "xpath": "/env:Envelope/env:Body/pets:getPetByIdRequest/pets:id/text()"
      };
  
      assert.equal(matchResolver.resolve(matcher), '2')
    });



    it('should return match if xpath exist', function() {

      const matcher = {
        "xpath": "boolean(/env:Envelope/env:Body/pets:getPetByIdRequest/pets:id)",
        "dispatch": {
          "true": "response-if-exists.xml"
        }
      };
  
      assert.equal(matchResolver.resolve(matcher), 'response-if-exists.xml')
    });


    it('should return <undefined> if xpath does not exist', function() {

      const matcher = {
        "xpath": "boolean(/env:Envelope/env:Body/pets:foobar)",
        "dispatch": {
          "true": "response-if-exists.xml"
        }
      };
  
      assert.ok(matchResolver.resolve(matcher) === undefined)
    });

  });

});