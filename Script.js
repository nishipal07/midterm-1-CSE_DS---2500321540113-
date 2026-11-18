
let books = JSON.parse(localStorage.getItem("books")) || [];
function displayBooks() {

    let list = document.getElementById("bookList");

    list.innerHTML = "";

    books.forEach((book, index) => {

        list.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>
                    <button onclick="editBook(${index})">Edit</button>
                    <button onclick="deleteBook(${index})">Delete</button>
                </td>
            </tr>
        `;

    });
}
function addBook() {

    let book = {
        id: document.getElementById("id").value,
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value
    };

    if (!book.id || !book.title || !book.author || !book.category) {
        alert("Please fill all fields");
        return;
    }

    if (books.some(b => b.id === book.id)) {
        alert("Book ID already exists");
        return;
    }

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));

    alert("Book Added Successfully");

    clearForm();
    displayBooks();
}
function editBook(index) {

    document.getElementById("id").value = books[index].id;
    document.getElementById("title").value = books[index].title;
    document.getElementById("author").value = books[index].author;
    document.getElementById("category").value = books[index].category;

}
function updateBook() {

    let id = document.getElementById("id").value;

    let index = books.findIndex(book => book.id === id);

    if (index === -1) {
        alert("Book not found");
        return;
    }

    books[index].title = document.getElementById("title").value;
    books[index].author = document.getElementById("author").value;
    books[index].category = document.getElementById("category").value;

    localStorage.setItem("books", JSON.stringify(books));

    alert("Book Updated Successfully");

    clearForm();
    displayBooks();
}
function deleteBook(index) {

    if (confirm("Are you sure you want to delete this book?")) {

        books.splice(index, 1);

        localStorage.setItem("books", JSON.stringify(books));

        displayBooks();
    }
}
function clearForm() {

    document.getElementById("id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("category").value = "";

}
displayBooks();
