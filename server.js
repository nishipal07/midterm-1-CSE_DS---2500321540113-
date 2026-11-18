const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const dataFile = path.join(__dirname, "books.json");
const publicFolder = path.join(__dirname, "public");

// Read books from JSON file
function readBooks() {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// Save books into JSON file
function saveBooks(books) {
    fs.writeFileSync(dataFile, JSON.stringify(books, null, 2));
}

// Send response
function sendResponse(res, status, data) {
    res.writeHead(status, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
}

// Read request body
function getBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                resolve(JSON.parse(body || "{}"));
            } catch (error) {
                reject(error);
            }
        });

        req.on("error", reject);
    });
}

// Create server
const server = http.createServer(async (req, res) => {

    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    // GET ALL BOOKS
    if (req.method === "GET" && pathname === "/api/books") {
        const books = readBooks();
        return sendResponse(res, 200, books);
    }

    // ADD BOOK
    if (req.method === "POST" && pathname === "/api/books") {
        try {
            const body = await getBody(req);

            if (!body.title || !body.author || !body.category) {
                return sendResponse(res, 400, {
                    message: "Please enter all book details"
                });
            }

            const books = readBooks();

            const newBook = {
                id: books.length > 0
                    ? Math.max(...books.map(book => book.id)) + 1
                    : 1,
                title: body.title,
                author: body.author,
                category: body.category
            };

            books.push(newBook);
            saveBooks(books);

            return sendResponse(res, 201, {
                message: "Book added successfully",
                book: newBook
            });

        } catch (error) {
            return sendResponse(res, 400, {
                message: "Invalid JSON data"
            });
        }
    }

    // UPDATE BOOK
    if (req.method === "PUT" && pathname.startsWith("/api/books/")) {
        try {
            const id = Number(pathname.split("/").pop());

            if (!Number.isInteger(id) || id < 1) {
                return sendResponse(res, 400, {
                    message: "Invalid book ID"
                });
            }

            const body = await getBody(req);
            const books = readBooks();

            const index = books.findIndex(book => book.id === id);

            if (index === -1) {
                return sendResponse(res, 404, {
                    message: "Book not found"
                });
            }

            const updatedBook = {
                id: id,
                title: body.title || books[index].title,
                author: body.author || books[index].author,
                category: body.category || books[index].category
            };

            books[index] = updatedBook;
            saveBooks(books);

            return sendResponse(res, 200, {
                message: "Book updated successfully",
                book: updatedBook
            });

        } catch (error) {
            return sendResponse(res, 400, {
                message: "Invalid JSON data"
            });
        }
    }

    // DELETE BOOK
    if (req.method === "DELETE" && pathname.startsWith("/api/books/")) {
        const id = Number(pathname.split("/").pop());

        if (!Number.isInteger(id) || id < 1) {
            return sendResponse(res, 400, {
                message: "Invalid book ID"
            });
        }

        const books = readBooks();
        const updatedBooks = books.filter(book => book.id !== id);

        if (books.length === updatedBooks.length) {
            return sendResponse(res, 404, {
                message: "Book not found"
            });
        }

        saveBooks(updatedBooks);

        return sendResponse(res, 200, {
            message: "Book deleted successfully"
        });
    }

    // SERVE FRONTEND FILES
    if (req.method === "GET") {
        const fileName = pathname === "/"
            ? "index.html"
            : decodeURIComponent(pathname.slice(1));

        const filePath = path.resolve(publicFolder, fileName);

        if (!filePath.startsWith(publicFolder + path.sep)) {
            return sendResponse(res, 403, {
                message: "Access denied"
            });
        }

        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(404);
                return res.end("File not found");
            }

            const ext = path.extname(filePath);

            const types = {
                ".html": "text/html",
                ".css": "text/css",
                ".js": "text/javascript"
            };

            res.writeHead(200, {
                "Content-Type": types[ext] || "application/octet-stream"
            });

            res.end(content);
        });

        return;
    }

    sendResponse(res, 404, {
        message: "Route not found"
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});