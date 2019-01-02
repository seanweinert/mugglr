const API_KEY = "84cf92c8d81644c3968525c8ee6d99de";
let xhr = new XMLHttpRequest();
var mugglr = "";

function sendRequest(search) {
  mugglr = search;
  let BASEURL = `https://newsapi.org/v2/everything?q=${search}&apiKey=`;
  xhr.open("GET", BASEURL + API_KEY);
  xhr.send();
  xhr.onload = successHandler;
  xhr.onerror = errorHandler;
}

function successHandler() {
  let cleanData = JSON.parse(xhr.responseText),
    containerDiv = document.getElementById("container"),
    modalDiv = document.getElementById("content"),
    wrapperDiv = "";
  containerDiv.innerHTML = "";
  for (let i = 0; i < cleanData.totalResults; i++) {
    // make sure an article at this index exists
    if (cleanData.articles[i]) {
      // check for nulls before trying to assign data
      // should probably also check for undefined
      let author =
          cleanData.articles[i].author == null
            ? "Unknown"
            : cleanData.articles[i].author,
        source =
          cleanData.articles[i].name == null
            ? "Unknown"
            : cleanData.articles[i].name,
        headline =
          cleanData.articles[i].title == null
            ? "Unknown"
            : cleanData.articles[i].title
                .replace(properCase(mugglr), "Muggles")
                .replace(mugglr.toLowerCase(), "Muggles"),
        description =
          cleanData.articles[i].title == null
            ? "Unknown"
            : cleanData.articles[i].description.replace(mugglr, "muggles"),
        link =
          cleanData.articles[i].url == null
            ? "Unknown"
            : cleanData.articles[i].url,
        setHeadline = `<div class="results"><h1>${headline}</h1>`,
        setModal = `<div class="modal"><div id="content" class="modal-content">
               <span class="close">×</span><p>${description}</p><a href="${link}">Read more...</a></div>
            </div> `;
      // put a wrapper around each result & it's modal so
      // we can use result's parent to find the modal
      wrapperDiv = "<div>";
      wrapperDiv += setHeadline;
      wrapperDiv += setModal;
      wrapperDiv += "</div>";
      containerDiv.innerHTML += wrapperDiv;
    }
  }
  articlesLoaded();
}

function articlesLoaded() {
  let results = document.getElementsByClassName("results");
  let closeButtons = document.getElementsByClassName("close");

  for (var i = 0; i < results.length; i++) {
    results[i].addEventListener("click", function(e) {
      // allow clicks on the div or the first h1 only. This blocks the close button
      // from triggering the results.click listener
      showModal(this);
    });
    closeButtons[i].addEventListener("click", function(e) {
      hideModal(this);
      e.stopPropagation();
    });
  }
}

function showModal(el) {
  var modal = el.parentNode.querySelector(".modal");
  modal.style.display = "block";
}

function hideModal(el) {
  var modal = el.parentNode.parentNode;
  modal.style.display = "none";
}

function errorHandler() {
  console.log("something went wrong");
}

sendRequest("People");

const button = document.querySelector("#btn"),
  search = document.querySelector("#search");

let userInput = "";

button.addEventListener("click", function() {
  event.preventDefault();
  userInput = search.value;
  //searchInput.value = "";

  changeMugglr(userInput);
});

function changeMugglr() {
  //console.log(userInput)
  sendRequest(userInput);
}

function properCase(string) {
  var fixed = string.charAt(0).toUpperCase() + string.slice(1);
  return fixed;
}
