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

function buatKartuProduk(produk) {
    let hargaFinal = hitungHargaPromo(produk);

    let teksBadge = "";
    if (produk.unggulan === true) {
        teksBadge = `<span class="badge-unggulan">Unggulan</span>`;
    }

    let teksHarga = "";
    if (produk.diskon > 0) {
        teksHarga = `<p><s>${formatRupiah(produk.harga)}</s> <strong>${formatRupiah(hargaFinal)}</strong> (Diskon ${produk.diskon}%)</p>`;
    } else {
        teksHarga = `<p><strong>${formatRupiah(hargaFinal)}</strong></p>`;
    }

    let teksStok = "";
    if (produk.stok === 0) {
        teksStok = `<p class="stok-habis"><strong>${statusStok(produk.stok)}!</strong></p>`;
    } else {
        teksStok = `<p>Stok ${statusStok(produk.stok)}</p>`;
    }

    let kartu = `
        <div class="kartu-produk">
            <h3>${produk.nama} ${teksBadge}</h3>
            <p>Kategori: ${produk.kategori}</p>
            ${teksHarga}
            ${teksStok}
        </div>
    `;

    return kartu;
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

function tampilkanProduk() {
    let wadahProduk = document.getElementById("produk-dinamis");

    if (wadahProduk === null) {
        return;
    }

    let produkSiapJual = daftarProduk.filter(function (produkCek) {
        return produkCek.stok > 0;
    });

    let daftarHTML = produkSiapJual.map(function (produkSatu) {
        return buatKartuProduk(produkSatu);
    });

    let teksHTML = daftarHTML.join("");

    wadahProduk.innerHTML = teksHTML;
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

    wadahUnggulan.innerHTML = buatKartuProduk(produkUnggulan);
}

let wadahCek = document.getElementById("produk-dinamis");

if (wadahCek !== null && daftarProduk.length > 0) {
    catatProdukKeConsole();
    tampilkanProdukUnggulan();
    tampilkanProduk();
}
