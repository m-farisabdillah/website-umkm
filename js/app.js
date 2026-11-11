let daftarProduk = [
    {
        nama: "Americano",
        kategori: "Panas",
        harga: 15000,
        stok: 10,
        diskon: 10,
        unggulan: false
    },
    {
        nama: "Kopi Susu Gula Aren",
        kategori: "Dingin",
        harga: 17000,
        stok: 20,
        diskon: 9,
        unggulan: true
    },
    {
        nama: "Cappuccino",
        kategori: "Dingin",
        harga: 20000,
        stok: 30,
        diskon: 8,
        unggulan: true
    },
    {
        nama: "Kopi Pandan",
        kategori: "Panas",
        harga: 19000,
        stok: 0,
        diskon: 7,
        unggulan: false
    }
];

function formatRupiah(nilai) {
    let angkaTeks = nilai.toLocaleString("id-ID");
    return "Rp " + angkaTeks;
}

function statusStok(stok) {
    if (stok === 0) {
        return "Habis";
    }
    return "Tersedia (sisa " + stok + ")";
}

function hitungHargaPromo(produk) {
    if (produk.diskon === 0) {
        return produk.harga;
    }

    let hargaDiskon = produk.harga - (produk.harga * produk.diskon / 100);
    let hargaBulat = Math.round(hargaDiskon);
    return hargaBulat;
}

function buatElemenProduk(produk) {
    let hargaFinal = hitungHargaPromo(produk);

    let card = document.createElement("article");
    card.classList.add("kartu-produk");

    let title = document.createElement("h3");
    title.textContent = produk.nama;

    if (produk.unggulan === true) {
        let badge = document.createElement("span");
        badge.classList.add("badge-unggulan");
        badge.textContent = "Unggulan";
        title.append(badge);
    }

    let kategoriInfo = document.createElement("p");
    kategoriInfo.textContent = "Kategori: " + produk.kategori;

    let harga = document.createElement("p");
    if (produk.diskon > 0) {
        let hargaCoret = document.createElement("s");
        hargaCoret.textContent = formatRupiah(produk.harga);

        let hargaHasil = document.createElement("strong");
        hargaHasil.textContent = " " + formatRupiah(hargaFinal);

        let diskonText = document.createTextNode(` (Diskon ${produk.diskon}%)`);

        harga.append(hargaCoret, hargaHasil, diskonText);
    } else {
        let hargaHasil = document.createElement("strong");
        hargaHasil.textContent = formatRupiah(hargaFinal);
        harga.append(hargaHasil);
    }

    let stok = document.createElement("p");
    if (produk.stok === 0) {
        stok.classList.add("stok-habis");
        let textStok = document.createElement("strong");
        textStok.textContent = statusStok(produk.stok) + "!";
        stok.append(textStok);
    } else {
        stok.textContent = "Stok: " + statusStok(produk.stok);
    }

    card.append(title, kategoriInfo, harga, stok);

    return card;
}

function catatProdukKeConsole() {
    console.log("=== Catatan Daftar Produk ===");

    daftarProduk.forEach(function (produkSatu) {
        console.log(
            formatRupiah(hitungHargaPromo(produkSatu)) + " | " +
            statusStok(produkSatu.stok) + " | " +
            produkSatu.nama
        );
    });
}

function renderProduk(kategoriAktif = "Semua") {
    let wadahProduk = document.querySelector("#produk-dinamis");
    let statusProduk = document.querySelector("#produk-status");

    if (wadahProduk === null || statusProduk === null) {
        return;
    }

    let produkTampil = [];
    if (kategoriAktif === "Semua") {
        produkTampil = daftarProduk;
    } else {
        produkTampil = daftarProduk.filter(function (produk) {
            return produk.kategori === kategoriAktif;
        });
    }

    wadahProduk.replaceChildren();

    if (produkTampil.length === 0) {
        statusProduk.textContent = "0 produk ditemmukan";

        let kotakKosong = document.createElement("div");
        kotakKosong.classList.add("empty-state");

        let pesanKosong = document.createElement("p");
        pesanKosong.textContent = `Belum ada produk dengan kategori "${kategoriAktif}".`;

        kotakKosong.append(pesanKosong);
        wadahProduk.append(kotakKosong);
        return;
    }

    produkTampil.forEach(function (produk) {
        let kartu = buatElemenProduk(produk);
        wadahProduk.append(kartu);
    });

    statusProduk.textContent = `${produkTampil.length} produk ditampilkan.`;
}

function tampilkanProdukUnggulan() {
    let wadahUnggulan = document.getElementById("produk-unggulan");

    if (wadahUnggulan === null) {
        return;
    }

    let produkUnggulan = daftarProduk.find(function (produkCek) {
        return produkCek.unggulan === true;
    });

    if (produkUnggulan === undefined) {
        wadahUnggulan.innerHTML = "<p>Belum ada produk unggulan hari ini.</p>";
        return;
    }

    wadahUnggulan.replaceChildren();
    wadahUnggulan.append(buatElemenProduk(produkUnggulan));
}


function inisialisasiFilterDOM() {
    let daftarTombol = document.querySelectorAll("[data-filter]");
    let wadah = document.querySelector("#produk-dinamis");

    if (daftarTombol.length === 0 || wadah === null) {
        return;
    }

    renderProduk("Semua");

    daftarTombol.forEach(function (tombol) {
        tombol.addEventListener("click", function (event) {
            let kategoriDipilih = event.currentTarget.dataset.filter;

            daftarTombol.forEach(function (btn) {
                btn.classList.remove("is-active");
            });

            event.currentTarget.classList.add("is-active");

            renderProduk(kategoriDipilih);
        });
    });
}

function removeElemen() {
    let kartuPertama = document.querySelector(".kartu-produk");
    if (kartuPertama !== null) {
        kartuPertama.remove();
        console.log("Memanggil method remove() untuk menghapus elemen kartu pertama");
    }
}

let wadahCek = document.getElementById("produk-dinamis");

if (wadahCek !== null && daftarProduk.length > 0) {
    catatProdukKeConsole();
    tampilkanProdukUnggulan();
    inisialisasiFilterDOM();
}