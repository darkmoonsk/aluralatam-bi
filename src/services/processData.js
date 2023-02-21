const data = require("../data/data-19-02-2023H21-43-13.json");
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const stopwords = require("./stopwords.json").stopwords;
const stemmer = natural.PorterStemmerEs;
const tokezedWords = tokenizer.tokenize(data.titles.join(" ")).map((word) => word.toLowerCase()).filter((word) => !stopwords.includes(word));


//frequency = natural.FrequencyDist(tokezedTitles);
//console.log(tokezedTitles);

function getFrequencyWords(array) {
    const frequency = [];
    array.forEach((word) => {
        const wordIndex = frequency.findIndex((item) => item.word === word);
        if (wordIndex === -1) {
            frequency.push({ word, count: 1 });
        } else {
            frequency[wordIndex].count++;
        }
    });
    return frequency.sort((a, b) => b.count - a.count);
}

console.log(getFrequencyWords(tokezedWords));
