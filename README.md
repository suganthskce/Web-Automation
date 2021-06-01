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
        <TestCase id='testcase1' description="Google Search Testcase"">
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
| payload | Object containing Dynamic keys that is used in Operations | Object |




## XML Tags & Attributes
### TestSuite
This is a single Test Suite that contains the Test cases to be executed.

### TestCases
This contains the list of Test cases available under the Test Suite.

### TestCase
This is single unit of Test case. This has the list of Operations that needs to be executed when runing the testcase.


| Arrtibute | Usage | Values |
| ------ | ------ | ------ |
| id | Unique Identifier for each Test cases | String or Number |
| description | Description of the Test case. | String |
| retry | Number of times the test case should be tried when failed in between. | Number |

### Operations
This contains the list of Operation available under the TestCase.

### Operation
This specify the single opeartion that needs to be perforemd.

| Arrtibute | Usage | Values |
| ------ | ------ | ------ |
| operationType | This specify the tyoe of the Operation | ENUM (type, goto, scroll, capture, click) |
| link | Link of the webpage. Used when operationType is goto | String |
| selector | The Selector of the HTML Element in which operation needs to be performed. | String |
| waitFor | Time till which the script waits before executing the current operation. Can be millisecond or a Selector | Selector or Number |
| timeout | Maximim time till which we wait for a Selector. This is used when waitFor is provided as Selector. Defailt value is set to 10000(10s)| Number |
| fileName | File name with which the captured Screen must be saved. Used in case operationType is capture | String |
| target | For operationType - click, the window may opens in a new Tab. When we need to focus on newly opened window we need to have target="newWindow" | String |
| distance | Distance in px that needs to be scrolled along. Used when operationType is scroll | Number |
| value | Text that needs to be typed when operationType is type | String |
| evalue | This must be the key from payload(From Options that discussed above). Dynamic values will be picked from the payload object. | String |
| ignoreError | If there is a operation that breaks and we do not want to stop the Test case Execution , we set ignoreError="true" | Boolean |



### Support

Features are still in Development. 
For any Suggestion or Queries, contact suganth2610@gmail.com