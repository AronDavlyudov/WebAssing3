async function loadItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    document.getElementById("list").innerHTML =
        data.map(i => `<li>${i.title}</li>`).join("");
}

async function createItem() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    loadItems();
}

loadItems();
