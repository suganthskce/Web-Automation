const utils = {};

utils.doCleanJson = (jsonString) => {
    try {
        const json = JSON.parse(jsonString);
        const { TestSuite = {} } = json;
        const { TestCases = {} } = TestSuite;
        const { TestCase = [] } = TestCases;
        let _testCases = TestCase;
        if (!Array.isArray(_testCases)) {
            _testCases = [_testCases];
        }
        _testCases = _testCases.map(testCase => {
            const { Operations = {} } = testCase;
            const { Operation = [] } = Operations;
            let _operations = Operation;
            if (!Array.isArray(_operations)) {
                _operations = [_operations];
            }
            return { ...testCase, Operations: _operations };
        });
        return { TestSuite: { TestCases: _testCases } }
    } catch (e) {
        console.log("Error in parsing the JSON --> ", e);
    }
    return { TestSuite: { TestCases: [] } }
}

module.exports = utils;