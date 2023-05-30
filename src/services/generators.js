
const regexp = new RegExp("(\\${generate:(integer)})", "ig");


const generators = {
    'integer': () => Math.floor(Math.random() * 100000000)
}

exports.process = function(buf){
    data = buf.toString()
    //console.log(data);
    //console.log(typeof data);

    const matchedGenerators = [...data.matchAll(regexp)];

    matchedGenerators.forEach(generator => {
        const generatorType = generator[2];
        const needle = generator[1];
        const replace = generators[generatorType]();
        console.log(`Replace ${needle} with value ${replace} obtained by ${generatorType}`);
        data = data.replace(needle, replace);
    })

    return data;
}