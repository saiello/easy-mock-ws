const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

exports.build = function(req_body, namespaces){

    var doc = new dom().parseFromString(req_body);
    //console.log("UsingNamespaces;", handlerConfiguration.namespaces);
    var select = xpath.useNamespaces(namespaces);

    return {
        resolve: function(matcher){
            
            var match = select(matcher.xpath, doc).toString();
            //	console.log("XPath:", matcher.xpath, " match to: ", match);
            var outcome;
            if(matcher.dispatch){
                outcome = matcher.dispatch[match];
            }else{
                outcome = match;
            }
        
            return outcome;
        }
    }

}