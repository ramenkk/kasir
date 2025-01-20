let allOrders = []; 

// Fungsi untuk memuat data dan menyimpannya dalam allOrders
async function loadTableData() {
    try {
        // Fetch data dari API
        const response = await fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/pesanan');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Ambil respons mentah
        const responseText = await response.text();
        console.log('Response text:', responseText); 

        // Validasi dan bersihkan data JSON
        const jsonData = responseText.trim().match(/^\[.*\]$/)
            ? JSON.parse(responseText.trim())
            : JSON.parse(responseText.trim().replace(/^[^{[]+|[^}\]]+$/g, ''));

        allOrders = jsonData; 
        renderTableData(allOrders); 
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}

// Fungsi untuk menampilkan data ke tabel
function renderTableData(orders) {
    const tableBody = document.querySelector('#dataDisplayTable tbody');
    
    // Kosongkan tabel sebelum menambahkan data baru
    tableBody.innerHTML = '';

    orders.forEach(order => {
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
}

function filterData() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter data berdasarkan nama_pelanggan, nomor_meja, atau status_pesanan
    const filteredOrders = allOrders.filter(order => {
        return (
            order.nama_pelanggan.toLowerCase().includes(query) ||
            order.nomor_meja.toString().includes(query) ||
            order.status_pesanan.toLowerCase().includes(query)
        );
    });

    // Render data yang sudah difilter
    renderTableData(filteredOrders);
}

document.addEventListener('DOMContentLoaded', loadTableData);
