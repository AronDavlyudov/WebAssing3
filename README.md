# School Alumni Platform - Assignment 2

## Project Description
**School Alumni** is a web platform designed to connect school graduates. In this version, we have implemented advanced backend features using Express.js, including custom middleware, dynamic routing, server-side validation, and persistent data storage using the file system.

## Team Members
- **Aslan Aldashev**
- **Beybit Yeshimkul**
- **Aron Davlyudov**
- **Group:** SE-2426

## Updated Technical Features (Assignment 2)
- **Middleware:** - `express.urlencoded` for parsing form data.
  - Custom Logger: Logs every HTTP method and URL to the console.
- **Dynamic Routing:** Implementation of Query parameters (`/search`) and Route parameters (`/item/:id`).
- **Data Persistence:** Contact form submissions are validated and saved into `contact_data.json` using the `fs` module.
- **Error Handling:** Custom 404 page for all undefined routes.

## Project Structure
```text
backend/
├── server.js           # Main Express server with routes & middleware
├── package.json        # Project scripts and dependencies
├── contact_data.json   # JSON file where contact form data is saved
├── public/
│   ├── css/           # CSS files (main.css, header.css, etc.)
│   └── img/
└── views/
    ├── index.html      # Home page
    ├── report.html     # Contact/Report form (POST to /contact)
    ├── idea.html       # Ideas page
    ├── login.html      # Login page
    ├── logged.html     # Success login page
    └── 404.html        # Custom 404 Error page

```

## Installation & Run Instructions

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (Node Package Manager)

### Running the Server

1. Install dependencies:
```bash
npm install

```


2. Start the server:
```bash
npm start

```



The server will run on `http://localhost:3000`.

## API & Routes Documentation

| Method | Route | Description |
| --- | --- | --- |
| **GET** | `/` | Home page (Alumni list). |
| **GET** | `/search?q=abc` | Search graduates using query parameter `q`. |
| **GET** | `/item/:id` | View specific graduate details using route parameter `id`. |
| **GET** | `/api/info` | Returns project information in JSON format. |
| **GET** | `/api/items` | Return all items (JSON, sorted by `id` ASC). |
| **GET** | `/api/items/:id` | Return a single item by `id`. |
| **POST** | `/api/items` | Create a new item (JSON body: `{ "title": "...", "description": "..." }`). Returns **201 Created**. |
| **PUT** | `/api/items/:id` | Update an existing item (JSON body: `{ "title": "...", "description": "..." }`). |
| **DELETE** | `/api/items/:id` | Delete an item by `id`. |
| **POST** | `/contact` | Validates and saves report data to `contact_data.json`. |
| **POST** | `/login` | Handles user authentication. |

## Testing Requirements

1. **Server-side Validation:** Submit the form at `/report` with empty fields. The server will return an **HTTP 400 Bad Request** status.
2. **File System:** Upon a successful `/contact` submission, check the root folder for `contact_data.json`.
3. **Logger:** Check the terminal console to see real-time logs of every request (e.g., `GET /api/info`).
4. **404 Handling:** Navigate to `http://localhost:3000/undefined-path` to see the custom 404 page.

### API Validation and Status Codes

- `400 Bad Request` — returned when `:id` is not a valid number or required fields are missing in POST/PUT.
- `404 Not Found` — returned when an item with the requested `id` does not exist.
- `201 Created` — returned for successful POST requests that create an item.
- `200 OK` — successful GET/PUT/DELETE responses.
- `500 Internal Server Error` — returned on database/server error.

## Quick curl examples

Run these after starting the server to exercise the CRUD API.

GET all items:
```bash
curl http://localhost:3000/api/items
```

GET item by id:
```bash
curl http://localhost:3000/api/items/1
```

Create (POST):
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"New Item","description":"Created via curl"}'
```

Update (PUT):
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Updated via curl"}'
```

Delete:
```bash
curl -X DELETE http://localhost:3000/api/items/1
```

## Technologies Used

* **Backend:** Node.js, Express.js (v5.2.1)
* **Frontend:** HTML5, CSS3, SASS
* **Storage:** SQLite (via `sqlite3` package) — `data.db` created automatically