// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

console.log("Let's get this party started!");

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

let NUM_CATEGORIES = [];

async function getCategoryIds() {
    try {
        const categoriesUrl = 'https://jservice.io/api/categories?count=100';
        const response = await axios.get(categoriesUrl);
        const ids = getRandomNum();
        const categories = response.data.map(result => {
            return [result.id, result.title, result.clues_count]
        }).filter(result => {
            return result[2] >=5
        });
        const categoriesId = ids.map(index => categories[index]);
        // return categoriesId;
        console.log(categoriesId);
        NUM_CATEGORIES = [...categoriesId];
        NUM_CATEGORIES = NUM_CATEGORIES.map(arr => arr[0]);
    } catch (err) {
        alert("Sorry, something went wrong..");
        console.log(err);
    }     
}

function getRandomNum() {
    let mySet = new Set();
    while(mySet.size <= 5) {
        mySet.add(Math.floor(Math.random()*85));
    }
    return Array.from(mySet);
}

getCategoryIds();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

let CATEGORIES_ARR = [];

async function getCategory(catId) {
    try {
        const categoryUrl = 'http://jservice.io/api/category';
        const response = await axios.get(categoryUrl, {params: {id:catId}});
        const clueArray = response.data.clues.map(result => {
            return {"question": result.question, "answer": result.answer, "showing": null};
        }).filter(function(result) {
            return result.question !== "=";
        });
        const title = Object.entries(response.data)[1][1];
        const categoryObj = {"title": title, "clues": shuffleArray(clueArray).slice(0,5)};
        //return categoryObj;
        return CATEGORIES_ARR.push(categoryObj);
    } catch(err) {
        alert("Sorry, something went wrong..");
        console.log(err);
    }
}

function shuffleArray(arr) {
    return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function getCategoryAll() {
    for (val of NUM_CATEGORIES) {
        getCategory(val);
    }
}

setTimeout(() => getCategoryAll(), 1600);

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

const CLUES = 5;
const CATEGORIES = 6;

async function fillTable() {
    const body = document.querySelector("body");

    const btn = document.createElement("button");
    btn.innerHTML = "Restart";
    btn.setAttribute("id", "restart");
    // btn.innerText("Restart");
    body.prepend(btn);

    const table = document.createElement("table");
    table.setAttribute("id", "jeopardy");
    table.setAttribute("border", "1");
    const thead = document.createElement("thead");
    const theadTr = document.createElement("tr");
    const titles = CATEGORIES_ARR.map((item) => item.title);

    for (let x = 0; x < CATEGORIES; x++) {
        const theadTh = document.createElement("th");
        theadTh.setAttribute("id", x);
        const theadText= document.createTextNode(`${titles[x]}`);
        theadTh.append(theadText);
        theadTr.append(theadTh);
    }
    thead.append(theadTr);
    table.append(thead);

    const tbody= document.createElement("tbody");

    for (let y = 0; y < CLUES; y++) {
        const tbodyTr = document.createElement("tr");
        for (let x = 0; x < CATEGORIES; x++) {
            const tbodyTh = document.createElement("td");
            tbodyTh.setAttribute("id", `${x}-${y}`);
            const tbodyText = document.createTextNode(`?`);
            tbodyTh.append(tbodyText);
            tbodyTr.append(tbodyTh);
        }
        tbody.append(tbodyTr);
    }
    table.append(tbody);
    body.prepend(table);
}

setTimeout(() => fillTable(), 1700);

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

$('body').on('click', '#jeopardy', function handleClick(evt) {
    let id = evt.target.id;
    let [catId, clueId] = id.split("-");
    let clue = CATEGORIES_ARR[catId].clues[clueId];
    // console.log(clue);
    let cellText = '';

    if(!clue.showing) {
        cellText = clue.question;
        clue.showing = "question";
    } else if (clue.showing === "question") {
        cellText = clue.answer;
        clue.showing = "answer";
    } else {
        return;
    }
    $(`#${catId}-${clueId}`).html(cellText);
})

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {

}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

 $('body').on('click', '#restart', function setupAndStart() {
    location.reload();
})

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

