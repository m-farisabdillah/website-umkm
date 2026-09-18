const promoButton = document.querySelector("#promoButton");
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

promoButton.addEventListener("click", () => {
  promoButton.textContent = "Promo Anda sudah aktif! Silahkan tunjukan ke kasir.";
  console.log("Promo Kopi berhasil diklaim pengguna.");
});

hamburger.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true" || false;
  hamburger.setAttribute("aria-expanded", !expanded);
  navMenu.classList.toggle("active");
});
