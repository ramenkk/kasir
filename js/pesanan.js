// Ambil outlet_id dari URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const outletID = urlParams.get('outlet_id');

// Jika outletID tidak ditemukan, arahkan pengguna ke halaman awal
if (!outletID) {
    alert("Outlet ID tidak ditemukan!");
    window.location.href = 'index.html';
} else {
    fetchPesananByOutletID(outletID);
}

// Fungsi untuk mengambil data pesanan berdasarkan outlet_id
function fetchPesananByOutletID(outletID) {
    fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/pesanan/byoutletid?outlet_id=${outletID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal mengambil data pesanan.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                renderTableData(data.data); 
            } else {
                throw new Error("Pesanan tidak ditemukan untuk outlet ini.");
            }
        })
        .catch(error => {
            alert(error.message);
        });
}

// Fungsi untuk merender data pesanan ke dalam tabel HTML
function renderTableData(data) {
    const tableBody = document.querySelector('#dataDisplayTable tbody');
    tableBody.innerHTML = ''; 

    data.forEach(pesanan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.nama_pelanggan}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.daftar_menu.map(item => item.nama_menu).join(', ')}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.daftar_menu.map(item => `Rp ${item.harga_satuan.toLocaleString('id-ID')}`).join(', ')}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.daftar_menu.map(item => `Rp ${item.subtotal.toLocaleString('id-ID')}`).join(', ')}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${new Date(pesanan.tanggal_pesanan).toLocaleDateString('id-ID')}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.pembayaran}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.catatan_pesanan || '-'}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${pesanan.status_pesanan}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <button 
                    class="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onclick="deletePesanan('${pesanan.id}')">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk menghapus pesanan (contoh, implementasikan sesuai kebutuhan backend)
function deletePesanan(pesananID) {
    alert(`Fitur hapus pesanan dengan ID: ${pesananID} belum diimplementasikan.`);
}
