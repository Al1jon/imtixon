const http = require("http")
const fs = require("fs");
const todoList = "./db/todo.json"

http
    .createServer((req, res) => {
        if (req.url == "/" && req.method == "GET") {
                fs.readFile(todoList, (error, data) => {
                    if (error) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("todoni o'qishda xatolik !");
                    }
                    else {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(data);
                        console.log(data)
                    }
                })
        }
        else if (req.url == "/" && req.method == "POST") {
            let body = "";
            req.on("data", (todo) => {
                body += todo;
            });
            req.on("end", () => {
                const todo = JSON.parse(body);
                fs.readFile(todoList, (error, data) => {
                    if (error) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("todo qo'shishda xatolik !");
                    } else {
                        const todos = JSON.parse(data);
                        todos.push(todo);
                        fs.writeFile(todosFile, JSON.stringify(todos, null, 2), (err) => {
                            if (err) {
                                console.log(err);
                                res.writeHead(500, { "Content-Type": "text/plain" });
                                res.end("todo yaratishda xatolik");
                            } else {
                                res.writeHead(201, { "Content-Type": "application/json" });
                                res.end(JSON.stringify(todo));
                            }
                        });
                    }
                });
            });
        }
        else if (req.url.startsWith("/todo/") && req.method == "DELETE") {
            const id = parseInt(req.url.slice(6));
            fs.readFile(todoList, (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Todoni o'chirishda xatolik");
                } else {
                    let todos = JSON.parse(data);
                    const newTodos = todos.filter((todo) => todo.id != id);
                    if (newTodos.length == todos.length) {
                        res.writeHead(404, { "Content-Type": "text/plain" });
                        res.end("Todo topilmadi");
                    } else {
                        fs.writeFile(todosFile, JSON.stringify(newTodos, null, 2), (err) => {
                            if (err) {
                                console.log(err);
                                res.writeHead(500, { "Content-Type": "text/plain" });
                                res.end("Todoni o'chirishda xatolik");
                            } else {
                                res.writeHead(204, { "Content-Type": "text/plain" });
                                res.end();
                            }
                        });
                    }
                }
            });
        }
    })
    .listen(5005, () => console.log('Port ->' + 5005))  