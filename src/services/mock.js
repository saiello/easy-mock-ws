
const xpath = require('xpath')
, dom = require('xmldom').DOMParser
, _ = require('lodash')
, path = require('path')
, fs = require('fs');



function serveResponse(responseFilePath, selected, res, timeout){

	function defaultResponseFile(){
		return responseFilePath('default');
	}

	if(selected){
		//console.log("Selected: ", selected);

		// Select responseFile according to the match
		var responseFile = undefined;
		if(selected){
			var selectedResponseFilePath = responseFilePath(selected);
			console.log(selectedResponseFilePath);
			if(fs.existsSync(selectedResponseFilePath)){
					responseFile = selectedResponseFilePath;
			}else{
					console.log("No responseFile found: ", responseFile);
			}
		}

		if(!responseFile && fs.existsSync(defaultResponseFile())){
			responseFile = defaultResponseFile();
		}

		//console.log("ResponseFile: ", responseFile);

		// Send responseFile back to the client
		if(responseFile){
			fs.readFile(responseFile, function(err,data){
				res.setHeader('Content-Type', 'application/xml');

				if(timeout){
					console.log('SendData With timeout', timeout);
					setTimeout(function(){
						res.send(data);
					}, timeout);
				}else{
					res.send(data);
				}
			});
		} else {
			console.log("No mock defined");
			res.send(404, "No mock response file selected:" + selected);
		}

	}else{
		console.log("No mock defined");
		res.send(404, "No mock defined");
	}
}





function selectMockResponse(handlerConfiguration, req_body, responseFilePath){

	var selected;

	if(handlerConfiguration){

		if(handlerConfiguration.matcher){

			var doc = new dom().parseFromString(req_body);
			//console.log("UsingNamespaces;", handlerConfiguration.namespaces);
			var select = xpath.useNamespaces(handlerConfiguration.namespaces);

			// Find the first matcher
			_.find(handlerConfiguration.matcher, function(matcher){
					var match = select(matcher.xpath, doc).toString();
				//	console.log("XPath:", matcher.xpath, " match to: ", match);
					var outcome;
					if(matcher.dispatch){
						outcome = matcher.dispatch[match];
					}else{
						outcome = match;
					}

					if(outcome && fs.existsSync(responseFilePath(outcome))){
							selected = outcome;
					}

					return !!selected;
			});

		}

		// If no match was found use default
		if(!selected && handlerConfiguration.default && fs.existsSync(responseFilePath(handlerConfiguration.default))){
			//console.log("Default for soapAction ");
			selected = handlerConfiguration.default;
		}

	}

	return selected;
}



exports.init = function(app){
	const baseMock = app.get('mock_path');
	console.log("Reading definition from: ", baseMock);
	
	const definitionPath = path.join(baseMock, 'definitions')
	const responsesPath = path.join(baseMock, 'responses');

	const definitionFiles = fs.readdirSync(definitionPath);

	_.each(definitionFiles, function(file){
		const definitionConfigFile = path.join(definitionPath, file);
		console.log('Load definition for ', definitionConfigFile);

		const definitions = JSON.parse(fs.readFileSync(definitionConfigFile));

		for (const [definitionName, definitionConfiguration] of Object.entries(definitions)) {
			console.log(`${definitionName}: `, definitionConfiguration);

			function responseFilePathBuilder(soapAction){
				return function(fileName){
					return path.join(responsesPath, soapAction, fileName);
				}
			}
		
			app.post(definitionConfiguration.endpoint, function(req, res){
				const responseFilePath = responseFilePathBuilder(definitionName)
				const selected = selectMockResponse(definitionConfiguration, req.rawBody, responseFilePath)
				serveResponse(responseFilePath, selected, res, definitionConfiguration.timeout)
			});
		}
	});	
}