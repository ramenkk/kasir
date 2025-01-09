// Contoh URL API, ganti dengan endpoint API Anda
const apiUrl = 'https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/pesanan';

// Fungsi untuk memuat data ke dalam tabel
async function loadTableData() {
    try {
        // Fetch data dari API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Ambil respons mentah
        const responseText = await response.text();
        console.log('Response text:', responseText); // Debug respons mentah

        // Validasi dan bersihkan data JSON
        const jsonData = responseText.trim().match(/^\[.*\]$/)
            ? JSON.parse(responseText.trim())
            : JSON.parse(responseText.trim().replace(/^[^{[]+|[^}\]]+$/g, ''));

        const tableBody = document.querySelector('#dataDisplayTable tbody');

        // Kosongkan tabel sebelum menambahkan data baru
        tableBody.innerHTML = '';

        // Iterasi data dan tambahkan baris ke tabel
        jsonData.forEach(order => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.nama_pelanggan}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.nomor_meja}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.daftar_menu.map(item => `${item.nama_menu} (x${item.jumlah})`).join(', ')}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">Rp ${order.total_harga.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.status_pesanan}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${new Date(order.tanggal_pesanan).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.pembayaran}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${order.catatan_pesanan || '-'}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadTableData);
