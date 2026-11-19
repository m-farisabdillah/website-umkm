const newsletterForm = document.querySelector("#form-newsletter");
const newsletterEmail = document.querySelector("#newsletter-email");
const newsletterError = document.querySelector("#newsletter-error");
const newsletterStatus = document.querySelector("#newsletter-status");
const btnHapusNewsletter = document.querySelector("#hapus-newsletter");

const NEWSLETTER_KEY = "kopi-nusa-newsletter";

function validasiNewsletter() {
  newsletterEmail.setCustomValidity("");

  let pesan = "";
  if (newsletterEmail.validity.valueMissing) {
    pesan = "Alamat email langganan wajib diisi.";
  } else if (newsletterEmail.validity.typeMismatch) {
    pesan = "Format email belum valid (contoh: nama@email.com).";
  }

  newsletterEmail.setCustomValidity(pesan);
  newsletterEmail.setAttribute("aria-invalid", pesan ? "true" : "false");
  newsletterError.textContent = pesan;

  return pesan === "";
}

function simpanNewsletter() {
  const data = {
    email: newsletterEmail.value,
    subscribedAt: new Date().toISOString()
  };

  localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
  newsletterStatus.textContent = `Email ${data.email} tersimpan untuk info promo.`;
}

function muatNewsletter() {
  try {
    const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
    if (!tersimpan) return;

    const data = JSON.parse(tersimpan);
    newsletterEmail.value = data.email ?? "";
    newsletterStatus.textContent = `Langganan aktif dimuat: ${newsletterEmail.value}`;
  } catch (error) {
    console.warn("Data newsletter tidak valid.", error);
    localStorage.removeItem(NEWSLETTER_KEY);
    newsletterStatus.textContent = "Data langganan rusak dan telah dihapus.";
  }
}

function hapusNewsletter() {
  localStorage.removeItem(NEWSLETTER_KEY);
  newsletterEmail.value = "";
  newsletterEmail.setCustomValidity("");
  newsletterEmail.setAttribute("aria-invalid", "false");
  newsletterError.textContent = "";
  newsletterStatus.textContent = "Langganan info promo berhasil dihapus.";
}

if (newsletterForm) {
  newsletterEmail.addEventListener("input", validasiNewsletter);

  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validasiNewsletter() || !newsletterForm.checkValidity()) {
      newsletterForm.reportValidity();
      newsletterEmail.focus();
      return;
    }

    simpanNewsletter();
  });

  btnHapusNewsletter.addEventListener("click", hapusNewsletter);

  muatNewsletter();
}