var parser = require('xml2json');
const fs = require('fs')
const execute = require('./app/services/execute')

const init = (config) => {
    const { filePath = '', ...restData } = config;
    const data = fs.readFileSync(filePath, 'utf8')
    const json = parser.toJson(data);
    execute(json, restData);
}

module.exports = init;