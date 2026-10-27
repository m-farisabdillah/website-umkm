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

console.table(daftarProduk);

function tampilkanProduk() {
    let wadahProduk = document.getElementById("produk-dinamis");

    if (wadahProduk === null) {
        return;
    }

    let teksHTML = "";

    for (const produkSatu of daftarProduk) {
        let hargaJadi = produkSatu.harga;
        if (produkSatu.diskon > 0) {
            hargaJadi = produkSatu.harga - (produkSatu.harga * produkSatu.diskon / 100);
        }

        let teksBadge = "";
        if (produkSatu.unggulan === true) {
            teksBadge = `<span class="badge-unggulan">Unggulan</span>`;
        }

        let teksHarga = "";
        if (produkSatu.diskon > 0) {
            teksHarga = `
                <p><s>Rp ${produkSatu.harga}</s> <strong>Rp ${hargaJadi}</strong> (Diskon ${produkSatu.diskon}%)</p>
            `;
        } else {
            teksHarga = `<p><strong>Rp ${hargaJadi}</strong></p>`;
        }

        let teksStok = "";
        if (produkSatu.stok === 0) {
            teksStok = `<p class="stok-habis"><strong>Stok Habis!</strong></p>`;
        } else {
            teksStok = `<p>Stok: ${produkSatu.stok}</p>`;
        }

        teksHTML = teksHTML + `
            <div class="kartu-produk">
                <h3>${produkSatu.nama} ${teksBadge}</h3>
                <p>Kategori: ${produkSatu.kategori}</p>
                ${teksHarga}
                ${teksStok}
            </div>
        `;
    }

    wadahProduk.innerHTML = teksHTML;
}

tampilkanProduk();
