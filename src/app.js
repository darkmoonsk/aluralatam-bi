const readlineSync = require("readline-sync");
const getData = require("./services/aluraWebScraping");
const forumUrls = require("./forumUrl");
const forums = ["frontend", "java", "dataScience", "devops", "offtopic"];



const titleSelector = "a.forumList-item-subject-info-title-link";
const courseNameSelector = "ol.topic-breadCrumb-list li:nth-child(3) a";



while(true){
    const option = Number(readlineSync.question("Digite 1 para ler o forum ou 2 para sair: "));

    if(option === 1) {
        const forumIndex = readlineSync.keyInSelect(forums,"De qual forum deseja pegar os dados? ");
        const forumPages = Number(readlineSync.question("Digite a quantidade de paginas que deseja ler: ")) || 1;
        getData(forumUrls[forums[forumIndex]], forumPages, titleSelector, courseNameSelector, forums[forumIndex]);

        break;
    }else if(option === 2) {
        console.log("Saindo...");
        break
    }
}