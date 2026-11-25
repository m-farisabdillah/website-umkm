const DATA_URL = "data/products.json";
const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "Semua";

function setStatus(state, message) {
  catalogStatus.className = "catalog-status";

  if (state) {
    catalogStatus.classList.add(state);
  }

  catalogStatus.textContent = message;
}

function formatRupiah(angka) {
  return `Rp ${angka.toLocaleString("id-ID")}`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("kartu-produk");

  const title = document.createElement("h3");
  title.textContent = product.name;

  if (product.featured === true) {
    const badge = document.createElement("span");
    badge.classList.add("badge-unggulan");
    badge.textContent = "Unggulan";
    title.append(badge);
  }

  const kategori = document.createElement("p");
  kategori.textContent = `Kategori: ${product.category}`;

  const deskripsi = document.createElement("p");
  deskripsi.textContent = product.description;

  const harga = document.createElement("p");
  if (product.discount > 0) {
    const hargaAkhir = product.price - (product.price * product.discount) / 100;
    harga.textContent = `Harga: ${formatRupiah(hargaAkhir)} (Diskon ${product.discount}%)`;
  } else {
    harga.textContent = `Harga: ${formatRupiah(product.price)}`;
  }

  const stok = document.createElement("p");
  if (product.stock > 0) {
    stok.textContent = `Stok: ${product.stock} cup`;
  } else {
    stok.textContent = "Stok Habis";
    stok.classList.add("stok-habis");
  }

  card.append(title, kategori, deskripsi, harga, stok);

  return card;
}

function createEmptyState() {
  const emptyState = document.createElement("div");
  emptyState.classList.add("empty-state");
  emptyState.textContent = "Belum ada produk yang tersedia untuk kategori ini.";

  return emptyState;
}

function renderFeaturedProducts(items) {
  if (!produkUnggulan) {
    return;
  }

  produkUnggulan.replaceChildren();

  const daftarUnggulan = items.filter(function (product) {
    return product.featured === true;
  });

  if (daftarUnggulan.length === 0) {
    produkUnggulan.textContent = "Belum ada produk unggulan.";
    return;
  }

  const daftarNama = daftarUnggulan.map(function (product) {
    return product.name;
  }).join(", ");

  produkUnggulan.textContent = `Menu unggulan hari ini: ${daftarNama}`;
}

function renderProducts(items) {
  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState());
    produkRingkasan.textContent = "0 produk ditemukan.";
    setStatus("empty", "Tidak ada produk yang cocok dengan kategori ini.");
    return;
  }

  items.forEach(function (product) {
    produkGrid.append(createProductCard(product));
  });

  produkRingkasan.textContent = `${items.length} produk ditampilkan.`;
}

async function loadProducts() {
  try {
    setStatus("loading", "Memuat data produk...");

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    products = await response.json();

    renderFeaturedProducts(products);
    renderProducts(products);

    if (products.length > 0) {
      setStatus("success", `${products.length} produk berhasil dimuat.`);
    }
  } catch (error) {
    produkGrid.replaceChildren();
    produkRingkasan.textContent = "0 produk ditampilkan.";
    setStatus("error", `Gagal memuat produk: ${error.message}`);
  }
}

function applyFilter(category) {
  activeCategory = category;

  let filtered;
  if (category === "Semua") {
    filtered = products;
  } else {
    filtered = products.filter(function (product) {
      return product.category === category;
    });
  }

  renderProducts(filtered);

  if (filtered.length > 0) {
    setStatus("success", `${filtered.length} produk berhasil ditampilkan.`);
  }
}

tombolFilter.forEach(function (tombol) {
  tombol.addEventListener("click", function (event) {
    tombolFilter.forEach(function (btn) {
      btn.classList.remove("is-active");
    });

    event.currentTarget.classList.add("is-active");
    applyFilter(event.currentTarget.dataset.filter || "Semua");
  });
});

if (produkGrid) {
  loadProducts();
}
