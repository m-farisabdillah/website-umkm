const promoButton = document.querySelector("#promoButton");

promoButton.addEventListener("click", () => {
  promoButton.textContent = "Promo Anda sudah aktif! Silahkan tunjukan ke kasir.";
  console.log("Promo Kopi berhasil diklaim pengguna.");
});