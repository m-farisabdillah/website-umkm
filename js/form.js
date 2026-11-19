const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");

const fields = [
  document.querySelector("#paket"),
  document.querySelector("#nama"),
  document.querySelector("#email"),
  document.querySelector("#nomor"),
  document.querySelector("#pesan"),
  document.querySelector("#setuju")
];

const waktuInputs = document.querySelectorAll('input[name="waktu"]');
const waktuError = document.querySelector("#waktu-error");

const STORAGE_KEY = "kopi-nusa-preferensi-kontak";
const btnSimpanPreferensi = document.querySelector("#simpan-preferensi");
const btnHapusPreferensi = document.querySelector("#hapus-preferensi");
const statusPreferensi = document.querySelector("#preferensi-status");

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) return "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return "Format email belum sesuai (contoh: nama@email.com).";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return "Format nomor WhatsApp harus diawali 08 (10-13 digit angka).";

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiWaktu() {
  let sudahDipilih = false;

  waktuInputs.forEach(function (radio) {
    if (radio.checked) {
      sudahDipilih = true;
    }
  });

  const pesan = sudahDipilih ? "" : "Pilih waktu pemesanan terlebih dahulu.";

  waktuInputs.forEach(function (radio) {
    radio.setAttribute("aria-invalid", pesan ? "true" : "false");
  });

  if (waktuError) {
    waktuError.textContent = pesan;
  }

  return sudahDipilih;
}

function tampilkanPreview() {
  const data = new FormData(form);

  preview.textContent = [
    `Waktu: ${data.get("waktu")}`,
    `Paket: ${data.get("paket")}`,
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("nomor")}`,
    `Pesan: ${data.get("pesan")}`
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

function simpanPreferensi() {
  const data = new FormData(form);
  const paketDipilih = data.get("paket") || "";
  const waktuDipilih = data.get("waktu") || "";

  if (paketDipilih === "" && waktuDipilih === "") {
    statusPreferensi.textContent = "Pilih waktu atau paket terlebih dahulu.";
    return;
  }

  const preferensi = {
    paket: paketDipilih,
    waktu: waktuDipilih,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
  statusPreferensi.textContent = "Preferensi berhasil disimpan.";
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    document.querySelector("#paket").value = preferensi.paket ?? "";

    const waktu = document.querySelector(`input[name="waktu"][value="${preferensi.waktu}"]`);
    if (waktu) {
      waktu.checked = true;
    }

    statusPreferensi.textContent = "Preferensi tersimpan berhasil dimuat.";
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
    statusPreferensi.textContent = "Data preferensi rusak dan telah dihapus.";
  }
}

function hapusPreferensi() {
  localStorage.removeItem(STORAGE_KEY);
  document.querySelector("#paket").value = "";

  waktuInputs.forEach(function (radio) {
    radio.checked = false;
  });

  statusPreferensi.textContent = "Preferensi berhasil dihapus.";
}

if (form) {
  fields.forEach(function (field) {
    if (field) {
      field.addEventListener("input", function () {
        validasiField(field);
      });
      field.addEventListener("change", function () {
        validasiField(field);
      });
    }
  });

  waktuInputs.forEach(function (radio) {
    radio.addEventListener("change", validasiWaktu);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let semuaValid = true;
    fields.forEach(function (field) {
      if (field && !validasiField(field)) {
        semuaValid = false;
      }
    });

    const waktuValid = validasiWaktu();

    if (!semuaValid || !waktuValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang ditandai merah.";
      formFeedback.classList.remove("success");
      form.reportValidity();
      form.querySelector(":invalid")?.focus();
      return;
    }

    tampilkanPreview();
    simpanPreferensi();
  });

  btnSimpanPreferensi.addEventListener("click", simpanPreferensi);
  btnHapusPreferensi.addEventListener("click", hapusPreferensi);

  muatPreferensi();
}