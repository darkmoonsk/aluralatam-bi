const fs = require("fs");
const path = require("path");
const natural = require("natural");
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const api = require("../../api.json");
const getDateNow = require("./date");




async function processData(data) {

    // const tokenizer = new natural.WordTokenizer();
    // const stopwords = require("../stopwords.json").stopwords;
    // const tokenizedWords = tokenizer.tokenize(data.join(" ")).filter(word => !stopwords.includes(word)).map((word) => word.toLowerCase()).join(" ");

    await watsonNLU(data.join(" "));
    
    
}

async function watsonNLU(text){
    const nlu = new NaturalLanguageUnderstandingV1({
        version: "2022-04-07",
        authenticator: new IamAuthenticator({
            apikey: `${api.key}`,
        }),
        serviceUrl: `${api.url}`,
    });
    
    const analyzeParams = {
        "text": text,
        "features": {
            "keywords": {
                "emotion": true,
                "sentiment": true,
                "limit": 100
            }
        }
    };
    
    await nlu.analyze(analyzeParams)
    .then(analysisResults => {
        console.log("Análise concluída com sucesso!");
        const data = analysisResults.result;
        data.keywords.sort((a, b) => b.count - a.count);
    
        const file = fs.writeFile(path.join("./src/data/processedDataOutput", `data-${getDateNow()}.json`) ,JSON.stringify(data), "utf8", (err) => {
            if (err) {
                console.log("Erro ao salvar arquivo: ", err);
                return true;
            }
            console.log("Arquivo com os dados processados salvo com sucesso!");
        });
    })
    .catch(err => {
        console.log("error:", err);
        return err;
    });
}

module.exports = { processData };


