# Web-Automation

A XML based Web Autoamtion Testing Framework.

## Installation
```
npm i web-automation-xml --save
```

## Usage
### index.js

```
const execute = require('web-automation-xml')
const join = require('path').join;
const _path = join(__dirname, 'testing.xml');

execute({ 
    headless: false,
    viewport: { width: 1200, height: 800 },
    filePath: _path
});
```

### testing.xml
```
<TestSuite> 
    <TestCases>
        <TestCase id='testcase1' description="Login Test case">
            <Operations>
                <Operation operationType="goto" link="https://www.google.com/"/>
                <Operation operationType="type" selector="body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input" value="web-automation-xml npm"/>
                <Operation operationType="click" selector="body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.FPdoLc.lJ9FBc > center > input.gNO89b"/>
                <Operation operationType="capture" fileName="googleSampleSearch" waitFor="5000"/>
            </Operations>
        </TestCase>
    </TestCases>
</TestSuite>
```

## Options

| Field | Usage | Values |
| ------ | ------ | ------ |
| headless | To open browser headless or not | Boolean |
| viewport | Viewport Configuration when opening the broswer | Object |
| viewport.width | Width of the screen that is opened | Number |
| viewport.height | Height of the screen that is opened | Number |
| filePath | Path to the XML file that contains the Test suite. | String |

