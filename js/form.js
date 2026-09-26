const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  preview.textContent = [
    `Waktu: ${data.get("waktu")}`,
    `paket: ${data.get("paket")}`,
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Nomor: ${data.get("nomor")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");
});