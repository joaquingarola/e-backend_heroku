const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("products", (products) => {
  fetch("http://localhost:3000/products.hbs")
    .then((res) => res.text())
    .then((text) => {
      const template = Handlebars.compile(text);
      const html = template({ products: products });

      document.getElementById("products").innerHTML = html;
    });
});

socket.on("update-messages", (getMessages) => {
  document.getElementById("msg").innerHTML = "";
  getMessages
    .forEach((msg) => createMessage(msg));
});

socket.on("new-message", (msg) => {
  createMessage(msg);
});

createMessage = (msg) => {
  document.getElementById("msg").innerHTML += `
    <div class="bg-Light">
      <b class="text-primary">${msg.email}</b> <span class="text-dark">(${msg.date}): </span>
      <span class="text-success">${msg.message}</span>
    </div>
  `;
};

sendMessage = () => {
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  socket.emit("post-message", { email, message });
};