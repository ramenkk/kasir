document.addEventListener('DOMContentLoaded', function () {
    const url = 'https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/bystatus?status=baru';

    // Fungsi untuk mengambil data pesanan dan menampilkan di tabel
    function fetchData() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pesanan tidak ditemukan atau status tidak valid');
                }
                return response.json();
            })
            .then(data => {
                const tableBody = document.querySelector('#dataDisplayTable tbody');
                tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan baris baru

                data.forEach(pesanan => {
                    const row = document.createElement('tr');

                    // Format tanggal pesanan
                    const tanggalPesanan = new Date(pesanan.tanggal_pesanan.$date || pesanan.tanggal_pesanan);

                    // Menambahkan baris data
                    row.innerHTML = `
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.nama_pelanggan}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.nomor_meja}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.daftar_menu.map(item => item.nama_menu).join(', ')}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.total_harga}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.status_pesanan}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${tanggalPesanan.toLocaleDateString()}</td>
                     
                        <td class="px-6 py-4 text-sm text-gray-500">${pesanan.catatan_pesanan}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            <select class="status-select" data-id="${pesanan.id}">
                               <option value="" class="bg-blue-500 text-white">Update</option>
                                <option value="diproses">Diproses</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });

                // Tambahkan event listener untuk dropdown
                const selects = document.querySelectorAll('.status-select');
                selects.forEach(select => {
                    select.addEventListener('change', function () {
                        handleStatusChange(this.dataset.id, this.value);
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat mengambil data');
            });
    }

    // Fungsi untuk menangani perubahan status
    function handleStatusChange(pesananId, newStatus) {
        if (!newStatus) return;

        if (confirm(`Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`)) {
            fetch(`https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/update/status?id=${pesananId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status_pesanan: newStatus }),
            })
            .then(response => response.text())
            .then(text => {
                console.log('Respons mentah dari server:', text); // Debug
                try {
                    // Menghilangkan null atau spasi ekstra
                    const jsonText = text.trim().replace(/null$/, '');
                    const data = JSON.parse(jsonText);
                    alert(data.message || 'Status pesanan berhasil diperbarui');
                } catch (error) {
                    console.warn('Error parsing JSON:', text);
                    alert('Status pesanan berhasil diperbarui (respons tidak sepenuhnya valid)');
                }
                fetchData(); // Refresh data
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat memperbarui status');
            });
        }
    }

    // Memanggil fetchData saat halaman selesai dimuat
    fetchData();
});
