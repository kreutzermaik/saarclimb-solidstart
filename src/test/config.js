import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import {ReportGenerator} from "lighthouse/report/generator/report-generator.js";
import fs from 'fs';

export const BASE_URL = 'http://localhost:3000/';

export const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    ignoreDefaultArgs: ['--enable-automation']
});

const page = await browser.newPage();

/**
 * @param {string | undefined} pageName
 */
export async function testPerformance(pageName) {
    // @ts-ignore
    const {lhr} = await lighthouse(BASE_URL + pageName, undefined, undefined, page);
    await generateReport(lhr, pageName);
}

/**
 * @param {import("lighthouse/types/lhr/lhr").default | import("lighthouse/types/lhr/flow-result").default} lhr
 * @param {string | undefined} pageName
 */
export async function generateReport(lhr, pageName) {
    const reportHtml = ReportGenerator.generateReport(lhr, 'html');
    if (pageName === "") pageName = "dashboard";
    // @ts-ignore
    fs.writeFileSync(`./src/test/reports/lighthouse_report_${pageName}.html`, reportHtml);
    await browser.close();
}