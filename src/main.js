import "./style.css";

let quoteBox;
let quoteLine;
let quoteAuthor;
let quoteTip;

async function generateQuote() {
	const res = await fetch("https://dummyjson.com/quotes/random");

	if (!res.ok) {
		throw new Error("Error fetching random quote", { cause: res.text() });
	}

	const data = await res.json();
	delete data["id"];

	Object.assign(data, { date: new Date().toISOString() });
	localStorage.setItem("quote", JSON.stringify(data));
	updateQuote(data);
}

function updateQuote(quote) {
	quoteLine.innerHTML = quote["quote"];
	quoteAuthor.innerHTML = "— " + quote["author"];
	quoteLine.classList.remove("hidden");
	quoteAuthor.classList.remove("hidden");
	quoteTip.classList.add("hidden");
	document.getElementById("generate").setAttribute("disabled", true);
}

window.onload = () => {
	document.querySelector("#app").innerHTML = `
  <div class="container">
    <h1 id="title">Daily Quote Generator</h1>
  
    <div class="quote">
      <p class="hidden" id="line"></p>
      <p class="hidden" id="author"></p>
      <span class="hidden" id="tip">
        Click the button below to get a quote!
      </span>
    </div>
  
    <div class="panel">
      <button id="generate">Get Your Quote!</button>
    </div>
  </div>
  `;
	document.getElementById("generate").onclick = generateQuote;

	quoteBox = document.querySelector("div.quote");
	quoteLine = quoteBox.querySelector("p#line");
	quoteAuthor = quoteBox.querySelector("p#author");
	quoteTip = quoteBox.querySelector("span#tip");
	const rawQuote = localStorage.getItem("quote");

	if (!rawQuote) {
		quoteTip.classList.remove("hidden");
		return;
	}

	const quote = JSON.parse(rawQuote);
	const storedDate = new Date(quote["date"]).toDateString();
	const todayDate = new Date().toDateString();

	if (storedDate === todayDate) {
		updateQuote(quote);
		return;
	}

	quoteTip.classList.remove("hidden");
};
