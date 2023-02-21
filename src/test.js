const axios = require("axios");
const cheerio = require("cheerio");
const titles = [];
const courses = [];

// const forumUrl = "https://app.aluracursos.com/forum/categoria-front-end/todos/";

// axios.get(forumUrl + 1).then((res) => {
//   const $ = cheerio.load(res.data);
//   const titleSelector = "a.forumList-item-subject-info-title-link";
//   const courseSelector = "ol.topic-breadCrumb-list li:nth-child(3) a";
//   $(titleSelector).map((i, el) =>
//     titles.push($(el).text().replace(/[\n+]/g, "").replace(/\s+/g, " "))
//   );

//   $(courseSelector).map((i, el) =>
//     courses.push($(el).text().replace(/[\n+]/g, "").replace(/\s+/g, " "))
//   );
//   console.log(titles, titles.length);
//   console.log(courses, courses.length);
// });

function getCourseOcurrencesInArray(arr){
    const obj = arr.reduce((acc, cur) => {
        acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
        return acc;
      }, {});

      return Object.entries(obj).map(([key, value]) => ({ course: key, count: value }));
}


