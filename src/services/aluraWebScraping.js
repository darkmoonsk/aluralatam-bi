const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const { get } = require("http");

function getData(
    forumUrl,
    pagesToRead,
    titleSelector,
    courseNameSelector,
    forumName
) {
    let currentPage = 1;
    const titles = [];
    const courses = [];
    let isDataInSaveProcess = false;

    const getForumData = setInterval(async () => {
        if (currentPage <= pagesToRead) {
           await axios.get(forumUrl + currentPage).then((res) => {
                const $ = cheerio.load(res.data);
                $(titleSelector).map((i, el) =>
                    titles.push(
                        $(el).text().replace(/[\n+]/g, "").replace(/\s+/g, " ")
                    )
                );
                $(courseNameSelector).map((i, el) =>
                    courses.push(
                        $(el).text().replace(/[\n+]/g, "").replace(/\s+/g, " ")
                    )
                );
            }).catch((err) => {
                console.log("Erro ao ler a pagina: ", err);
                clearInterval(getForumData);
                return;
            });
        }

        console.clear();
        console.log("Lendo a pagina: ", currentPage + "/" + pagesToRead);

        if (currentPage === pagesToRead && !isDataInSaveProcess) {
            setTimeout(() => {
                const coursesOcurrences = getCourseOcurrencesInArray(courses).sort(
                    (a, b) => b.count - a.count
                );
                const coursesFiltered = courses.filter(
                    (course, index) => courses.indexOf(course) === index
                );
                const data = { coursesOcurrences, titles, coursesFiltered };
    
                //console.log(data);
                console.log(
                    "Total de dados: ",
                    titles.length + coursesFiltered.length
                );
                console.log("Salvando arquivo...");
                const dateNow = getDateNow();
                const jsonData = JSON.stringify(data);
                saveData(jsonData, dateNow, forumName);
            }, 1000);
            clearInterval(getForumData);
            isDataInSaveProcess = true;
            return;
        }

        currentPage++;
    }, 500);

}

function getDateNow() {
    const dateNow = new Date()
        .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
        .replace(/[:/]+/g, "-")
        .replace(" ", "H");

    return dateNow;
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

function saveData(jsonData, date, forumName) {
    const file = fs.writeFile(
        path.join(
            "./src/data/forumDataOutput",
            `data-${forumName}-${date}.json`
        ),
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
