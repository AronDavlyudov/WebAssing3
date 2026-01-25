const cards = document.getElementById("cards");

async function loadItems() {
    const res = await fetch("/api/items");
    const items = await res.json();

    cards.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.marginTop = "15px";

        div.innerHTML = `
            <h3>${item.title}</h3>
            <p>Class of ${item.description}</p>
            <button onclick="editItem('${item._id}', '${item.title}', '${item.description}')">Edit</button>
            <button onclick="deleteItem('${item._id}')">Delete</button>
        `;

        cards.appendChild(div);
    });
}

async function createItem() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!title || !description) {
        alert("Fill all fields");
        return;
    }

    await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    loadItems();
}

async function deleteItem(id) {
    await fetch(`/api/items/${id}`, {
        method: "DELETE"
    });
    loadItems();
}

async function editItem(id, oldTitle, oldDesc) {
    const title = prompt("Graduate name:", oldTitle);
    const description = prompt("Class year:", oldDesc);

    if (!title || !description) return;

    await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    loadItems();
}

loadItems();
