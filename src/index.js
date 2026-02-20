const quoteBox = document.querySelector("div.quote");
const quoteLine = quoteBox.querySelector("p#line");
const quoteAuthor = quoteBox.querySelector("p#author");
const quoteTip = quoteBox.querySelector("span#tip");

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
