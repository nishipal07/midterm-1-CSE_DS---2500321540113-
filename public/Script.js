const API = "/api/books";

// ADD BOOK
async function addBook() {

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;

    if (!title || !author || !category) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            author: author,
            category: category
        })
    });

    const result = await response.json();

    alert(result.message);

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("category").value = "";

    loadBooks();
}


// DISPLAY ALL BOOKS
async function loadBooks() {

    const response = await fetch(API);
    const books = await response.json();

    const bookList = document.getElementById("bookList");

    bookList.innerHTML = "";

    books.forEach(book => {

        bookList.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
            </tr>
        `;
    });
}


// UPDATE BOOK
async function updateBook() {

    const id = document.getElementById("updateId").value;
    const title = document.getElementById("newTitle").value;
    const author = document.getElementById("newAuthor").value;
    const category = document.getElementById("newCategory").value;

    if (!id) {
        alert("Please enter Book ID");
        return;
    }

    const response = await fetch(API + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            author: author,
            category: category
        })
    });

    const result = await response.json();

    alert(result.message);

    loadBooks();
}


// DELETE BOOK
async function deleteBook() {

    const id = document.getElementById("deleteId").value;

    if (!id) {
        alert("Please enter Book ID");
        return;
    }

    const response = await fetch(API + "/" + id, {
        method: "DELETE"
    });

    const result = await response.json();

    alert(result.message);

    document.getElementById("deleteId").value = "";

    loadBooks();
}


// Load books when website opens
loadBooks();