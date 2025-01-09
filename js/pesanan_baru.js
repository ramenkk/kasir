document.addEventListener('DOMContentLoaded', function() {
    // URL API dengan parameter status=baru
    const url = 'https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/bystatus?status=baru';

    // Fungsi untuk mengambil dan menampilkan data pesanan
    function fetchData() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pesanan tidak ditemukan atau status tidak valid');
                }
                return response.json();
            })
            .then(data => {
                // Menampilkan data pesanan ke dalam tabel
                const tableBody = document.querySelector('#dataDisplayTable tbody');
                tableBody.innerHTML = ''; // Clear the table before adding new rows
                
                data.forEach(pesanan => {
                    const row = document.createElement('tr');
                    
                    // Memastikan format tanggal yang valid
                    const tanggalPesanan = new Date(pesanan.tanggal_pesanan.$date || pesanan.tanggal_pesanan);
                    
                    // Membuat kolom-kolom dalam tabel
                    row.innerHTML = `
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.nama_pelanggan}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.nomor_meja}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            ${pesanan.daftar_menu.map(item => item.nama_menu).join(', ')}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.total_harga}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.status_pesanan}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${new Date(pesanan.tanggal_pesanan).toLocaleDateString()}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.pembayaran}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.catatan_pesanan}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat mengambil data');
            });
    }

    // Memanggil fungsi untuk mengambil data saat halaman dimuat
    fetchData();
});