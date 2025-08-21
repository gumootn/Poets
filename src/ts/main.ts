let authorTableDiv = document.querySelector("#authorTableDiv") as HTMLElement | null;
let linesTextDiv = document.querySelector("#linesTextDiv") as HTMLElement | null;
let linesHeader = document.querySelector("#linesHeader") as HTMLElement | null;
let linesText = document.querySelector("#linesText") as HTMLElement | null;
const backBtn = document.querySelector("#backBtn");
if (backBtn) {
  backBtn.addEventListener("click", backToGrid);
}

if (authorTableDiv) {
  if (authorTableDiv) {
    authorTableDiv.style.display = "none";
  }
}
if (linesTextDiv) {
  linesTextDiv.style.display = "none";
}

let form = document.querySelector("form")
if (form) {
  form.addEventListener("submit", generateGrid);
}

type PoemData = {
  title: string;
  author: string;
  lines: string[];
};

function generateGrid(e: Event) {
  e.preventDefault();
  let authorNameInput = document.querySelector("#authorName") as HTMLInputElement | null;
  let titleInput = document.querySelector("#poemTitle") as HTMLInputElement | null;

  if (authorNameInput && titleInput && validateInput(authorNameInput.value, titleInput.value)) {
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
  if (authorTableDiv) {
    authorTableDiv.style.display = "block";
  }
  if (linesTextDiv) {
    linesTextDiv.style.display = "none";
  }
}

async function getAuthor(author: string) {
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

async function getPoemByTitle(title: string) {
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

async function getPoemByAuthorAndTitle(author: string, title: string) {
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

function renderGrid(poems: PoemData[]) {
  const tableBody = document.querySelector('#tableBody') as HTMLTableSectionElement | null;
  if (tableBody) {
    tableBody.innerHTML = '';
  }

  poems.forEach(item => {
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

    if (tableBody) {
      tableBody.appendChild(row);
    }

    if (authorTableDiv) {
      authorTableDiv.style.display = "block";
    }
  });
}

function showLineText(lines: string[], title: string, author: string) {
  if (!linesText || !authorTableDiv || !linesTextDiv || !linesHeader) {
    return;
  }
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

function validateInput(author: string, title: string) {
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
