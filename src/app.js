const fs = require("fs");
const readlineSync = require("readline-sync");
const getData = require("./services/aluraWebScraping");
const watson = require("./services/watson");
const forumUrls = require("./forumUrl");
const forums = ["frontend", "java", "dataScience", "devops", "offtopic"];
const options = ["Pegar dados do forum", "Analisar dados do forum"]


const titleSelector = "a.forumList-item-subject-info-title-link";
const courseNameSelector = "ol.topic-breadCrumb-list li:nth-child(3) a";



while(true){
    console.log("Bem vindo ao analisador de dados da Alura Latam")
    const option = Number(readlineSync.keyInSelect(options, "O que deseja fazer: "));
    console.log(option);

    if(option === 0) { //Pegar dados
        console.clear();
        const forumIndex = readlineSync.keyInSelect(forums,"De qual forum deseja pegar os dados? ");
        if(forumIndex === -1) return;
        const forumPages = Number(readlineSync.question("Digite a quantidade de paginas que deseja ler: ")) || 1;
        getData(forumUrls[forums[forumIndex]], forumPages, titleSelector, courseNameSelector, forums[forumIndex]);
        break;

    } else if (option === 1) { //Analisar dados
        console.clear();
        const fileName = readlineSync.question("Digite o nome do arquivo que deseja analisar: ");
        const data = require(`./data/forumDataOutput/${fileName}.json`).titles;
        watson.processData(data);
        break;

    } else if(option === -1) {
        console.log("Saindo...");
        break
    }
}