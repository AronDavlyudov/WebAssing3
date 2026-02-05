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

async function updateNavbar() {
  const res = await fetch("/auth/me");
  const data = await res.json();

  const nav = document.getElementById("authNav");

  if (data.authenticated) {
    nav.innerHTML = `
      <li><a href="/">Alumni</a></li>
      <li><a href="/alumni-crud">CRUD</a></li>
      <li><span>Hello, ${data.username}</span></li>
      <li><button id="logoutBtn">Logout</button></li>
    `;

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/auth/logout", { method: "POST" });
      window.location.href = "/login";
    });

  } else {
    nav.innerHTML = `
      <li><a href="/">Alumni</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Register</a></li>
    `;
  }
}

updateNavbar();