const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const getDateNow = require("./date");

async function getData(forumUrl, pagesToRead, titleSelector, courseNameSelector, forumName) {
    let allTitles = [];
    let allCourses = [];

    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    for (let i = 1; i <= pagesToRead; i++) {

        await page.goto(forumUrl + i);
        console.clear();
        console.log("Lendo a pagina: ", i + "/" + pagesToRead);
        await page.waitForSelector(titleSelector);
        await page.waitForSelector(courseNameSelector);
        const titles = await page.$$eval(titleSelector, (titles) => titles.map((title) => title.innerText));
        const courses = await page.$$eval(courseNameSelector, (courses) => courses.map((course) => course.innerText));

        allTitles = [...allTitles, ...titles];
        allCourses = [...allCourses, ...courses];
        await page.waitForTimeout(500);

    }
    await browser.close();

    const coursesOcurrences = getCourseOcurrencesInArray(allCourses).sort((a, b) => b.count - a.count);
    const coursesFiltered = allCourses.filter((course, index) => allCourses.indexOf(course) === index);
    const data = { coursesOcurrences, allTitles, coursesFiltered };

    console.log("Total de dados: ", allTitles.length + coursesFiltered.length);
    console.log("Salvando arquivo...");
    const jsonData = JSON.stringify(data);
    saveData(jsonData, forumName);
}

function getCourseOcurrencesInArray(arr) {
    const obj = arr.reduce((acc, cur) => {
        acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
        return acc;
    }, {});

    return Object.entries(obj).map(([key, value]) => ({
        course: key,
        count: value,
    }));
}

function saveData(jsonData, forumName, type) {
    const date = getDateNow();

    const file = fs.writeFile(
        path.join("./src/data/forumDataOutput", `${type ? type : "data"}-${forumName}-${date}.json`),
        jsonData,
        "utf8",
        (err) => {
            if (err) {
                console.log("Erro ao salvar arquivo: ", err);
                return;
            }
            console.log("Arquivo salvo com sucesso!");
        }
    );
}

module.exports = getData;
