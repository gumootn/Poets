let authorTableDiv = document.querySelector("#authorTableDiv");
let linesTextDiv = document.querySelector("#linesTextDiv");
let linesHeader = document.querySelector("#linesHeader");
let linesText = document.querySelector("#linesText");
let backBtn = document.querySelector("#backBtn").addEventListener("click", backToGrid);

authorTableDiv.style.display = "none";
linesTextDiv.style.display = "none";

let form = document.querySelector("form").addEventListener("submit", generateGrid);

function generateGrid(e) {
  e.preventDefault();
  let authorNameInput = document.querySelector("#authorName");
  let titleInput = document.querySelector("#poemTitle");

  if (validateInput(authorNameInput.value, titleInput.value)) {
    if (authorNameInput.value !== "" && titleInput.value === "") {
      getAuthor(authorNameInput.value);
    }
    if (authorNameInput.value !== "" && titleInput.value !== "") {
      getPoemByAuthorAndTitle(authorNameInput.value, titleInput.value);
    }
    if (authorNameInput.value === "" && titleInput.value !== "") {
      getPoemByTitle(titleInput.value);
    }
  }
};

function backToGrid() {
  authorTableDiv.style.display = "block";
  linesTextDiv.style.display = "none";
}

async function getAuthor(author) {
  try {
    const response = await fetch(`https://poetrydb.org/author/${author}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await response.json().then((data) => {
      renderGrid(data);
    });
  } catch (error) {
    console.error("Error fetching author data:", error);
  }
}

async function getPoemByTitle(title) {
  try {
    let response = await fetch(`https://poetrydb.org/title/${title}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await response.json().then((data) => {
      renderGrid(data);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getPoemByAuthorAndTitle(author, title) {
  try {
    let response = await fetch(`https://poetrydb.org/author,title/${author};${title}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await response.json().then((data) => {
      renderGrid(data);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderGrid(data) {
  const tableBody = document.querySelector('#tableBody');
  tableBody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');

    const cell1 = document.createElement('td');
    cell1.textContent = item.author;
    row.appendChild(cell1);

    const cell2 = document.createElement('td');
    cell2.innerHTML = `<div onclick="showLineText(
      ${JSON.stringify(item.lines).replace(/"/g, '&quot;')}, 
      ${JSON.stringify(item.title).replace(/"/g, '&quot;')}, 
      ${JSON.stringify(item.author).replace(/"/g, '&quot;')})">${item.title}</div>`;
    row.appendChild(cell2);

    tableBody.appendChild(row);

    authorTableDiv.style.display = "block";
  });
}

function showLineText(lines, title, author) {
  linesText.innerHTML = "";
  authorTableDiv.style.display = "none";
  linesTextDiv.style.display = "block";
  linesHeader.innerHTML = `${title} - ${author}`;

  const ul = document.createElement('ul');
  const listItems = lines.map(line => {
    const li = document.createElement('li');
    li.className = "listItem";
    li.textContent = line;
    return li;
  });

  listItems.forEach(li => {
    ul.appendChild(li);
  });

  linesText.appendChild(ul);
}

function validateInput(author, title) {
  if (author === "" && title === "") {
    alert("You must enter either Author, Title or both")
    return false;
  }
  if (!/^\D*$/.test(author)) {
    alert("Author input cannot have numbers");
    return false;
  } else if (!/^\D*$/.test(title)) {
    alert("Title input cannot have numbers");
    return false;
  }
  return true;
}
