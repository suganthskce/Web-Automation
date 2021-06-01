const { doCleanJson } = require('../utils')
const puppeteer = require('puppeteer');
const R = require("ramda");
const then = R.curry((f, p) => p.then(f));
const join = require('path').join;

let page = {};
let target = '';
let currentTestCase = {};
let currentOperation = {};
let config = {};
let browser = {};

const wait = async ({ operation }) => {
    const dynamicWait = ['type', 'click', 'scroll'];
    const { waitFor = '', timeout = 10000, operationType = '', selector = '' } = operation;
    const _waitFor = waitFor ? waitFor : dynamicWait.includes(operationType) ? selector : '';
    try {
        if (_waitFor) {
            const rx = new RegExp(/^\d+(?:\.\d{1,2})?$/)
            if (typeof _waitFor == 'number' || rx.test(_waitFor)) {
                await page.waitForTimeout(_waitFor);
            } else {
                await page.waitForSelector(_waitFor, { timeout });
            }
        }
    } catch (error) {
        if (dynamicWait.includes(operationType)) {
            throw new Error(error);
        }
    }
}

const preOpearion = async (operation) => {
    const result = await R.pipe(wait)({ operation });
}

const doOperation = async (operation) => {
    const { payload = {}, screenshotFilePath = '' } = config;
    const { operationType: type = '' } = operation;
    // console.log("operation", operation);
    switch (type) {
        case "type": {
            const { value = '', evalue = '', selector = '' } = operation;
            const finalValue = value ? value : evalue ? eval(evalue) || '' : ''
            await page.type(selector, finalValue);
            break;
        }
        case "goto": {
            const { type = '', link = '', ...restData } = operation;
            await page.goto(link, { waitUntil: 'load' });
            break;
        }
        case "scroll": {
            const { selector = '', distance = 100 } = operation;
            if (selector) {
                // await page.mouse.down();
                await page.evaluate(({ selector, distance }) => {
                    const scrollableSection = document.querySelector(selector);
                    // console.log("scrollableSection", distance, scrollableSection);
                    if (scrollableSection) {
                        // scrollableSection.scrollIntoView();
                        // scrollableSection.scrollTop = scrollableSection.offsetHeight;
                        // console.log("scrollableSection.offsetHeight", scrollableSection.offsetHeight);
                        scrollableSection.scrollBy(0, distance);
                    }
                }, { selector, distance });
            } else {
                await page.evaluate(distance => {
                    window.scrollBy(0, distance);
                }, distance);
            }
            // await page.evaluate((selector) => {
            //     const scrollableSection = document.querySelector(selector);
            //     if (scrollableSection) {
            //         scrollableSection.scrollIntoView(true);
            //     }
            // }, selector);
            break;
        }
        case "capture": {
            const { fileName = '' } = operation;
            const path = join(screenshotFilePath, `${fileName}.png`);
            await page.screenshot({ path });
            break;
        }
        case "click": {
            target = page.target();
            const { selector = '' } = operation;
            await page.click(selector);
            break;
        }
    }
}

const postOperation = async (operation) => {
    const { operationType = '', target: operationTarget = '' } = operation;
    const { viewport = {} } = config;
    if (operationType == 'click' && operationTarget == 'newWindow') {
        const newTarget = await browser.waitForTarget(_target => _target.opener() === target);
        page = await newTarget.page();
        page.setViewport(viewport);
    }
}

const execOpertion = async (operation) => {
    const { ignoreError = false } = operation;
    try {
        await preOpearion(operation);
        await doOperation(operation);
        await postOperation(operation);
        return { success: true };
    } catch (e) {
        console.log("Error in Executing Operation , ", e);
        if (ignoreError) {
            return { success: false };
        }
        throw new Error(e);
    }
}

const execTestCase = async (testCase) => {
    const { Operations: operations = [] } = testCase;
    let response = [];
    for (let operationIndex in operations) {
        currentOperation = operations[operationIndex];
        console.log(`[${1 + Number(operationIndex)}] Operation : ${currentOperation.operationType}`);
        response[operationIndex] = await execOpertion(currentOperation);
    }
    return response;
}

const filterTestCase = (testCases) => {
    const { testcases: testcasesToRun = [] } = config;
    return testCases.filter(testCase => !testcasesToRun.length || testcasesToRun.includes(testCase.id));
}

const execTestSuite = async (testSuite) => {
    const { TestCases: allTestCases = [] } = testSuite;
    let result = [], index = 0;
    const { headless = false, viewport = {} } = config;
    browser = await puppeteer.launch({ headless });
    let retryCount = 0, testCaseIndex = 0;
    const testCases = filterTestCase(allTestCases);
    while (testCaseIndex < testCases.length) {
        currentTestCase = testCases[testCaseIndex];
        const { retry = 0 } = currentTestCase;
        let failed = false;
        let res = {}
        try {
            console.log("Executing Testcase : ", currentTestCase.id || testCaseIndex);
            page = await browser.newPage();
            page.setViewport(viewport);
            res = await execTestCase(currentTestCase);
            console.log("Execution completed for Testcase : ", currentTestCase.id || testCaseIndex);
        } catch (e) {
            console.log("Error in Testcase : ", currentTestCase.id || testCaseIndex);
            console.log(e);
            failed = true;
            res = { success: false }
        } finally {
            await page.close();
        }
        result[testCaseIndex] = res;
        if (!(retryCount < retry && failed)) {
            testCaseIndex++;
            retryCount = 0;
        } else {
            retryCount++;
            console.log("Retrying --->", currentTestCase.id);
        }
    }
    await browser.close();
    return result;
}

async function execute(json, _config) {
    config = _config;
    const cleanJson = doCleanJson(json);
    const { TestSuite = {} } = cleanJson;
    const res = await execTestSuite(TestSuite);
    // console.log("res", res);
    return res;
}

module.exports = execute;


// Loader in search page
//#app > div.wrapper.p-R > div > div.search__wrapper > div.hotel__container > div.hotel__search__container > div.searchloader 