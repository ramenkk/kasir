import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");


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
                Swal.fire({
                    icon: 'error',
                    title: 'error get data',
                    text: 'error get data. ' +error,
                    timer: 2000,
                    showConfirmButton: false,
     });
            });
    }

    // Fungsi untuk menangani perubahan status
    function handleStatusChange(pesananId, newStatus) {
        if (!newStatus) return;
    
        Swal.fire({
            title: 'Konfirmasi',
            text: `Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Ubah',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
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
                 
                        Swal.fire({
                            icon: 'success',
                            title: 'Update berhasil',
                            text: 'Status berhasil diperbarui.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    } catch (error) {
                        console.warn('Error parsing JSON:', text);
                        Swal.fire({
                            icon: 'success',
                            title: 'Update berhasil',
                            text: 'Status berhasil diperbarui.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    }
                    fetchData(); // Refresh data
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Kesalahan',
                        text: 'Gagal memperbarui status pesanan. ' + error,
                        timer: 2000,
                        showConfirmButton: false,
                    });
                });
            }
        });
    }

    // Memanggil fetchData saat halaman selesai dimuat
    fetchData();
});


document.addEventListener("DOMContentLoaded", function () {
    const notificationButton = document.querySelector('[x-data] button');
    const notification = document.querySelector('#notification');
    const notificationCount = document.querySelector('#notificationCount'); // Ambil elemen jumlah notifikasi dari DOM

    // Fungsi untuk memperbarui UI notifikasi
    function updateNotificationUI(orders) {
        notification.innerHTML = ''; // Kosongkan daftar notifikasi
        if (orders.length > 0) {
            notificationCount.textContent = orders.length;
            notificationCount.style.display = 'block'; // Tampilkan jumlah notifikasi

            orders.forEach(order => {
                const orderItem = document.createElement('a');
                orderItem.href = '#';
                orderItem.classList.add(
                    'flex', 'items-center', 'px-4', 'py-3', '-mx-2', 
                    'text-gray-600', 'hover:text-white', 'hover:bg-indigo-600'
                );
                orderItem.innerHTML = `
                    <img class="object-cover w-8 h-8 mx-1 rounded-full"
                        src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
                        alt="avatar">
                    <p class="mx-2 text-sm">
                        <span class="font-bold">${order.nama_pelanggan}</span> 
                        memesan <span class="font-bold text-indigo-400">${order.total_harga}</span>
                    </p>
                `;
                notification.appendChild(orderItem);
            });
        } else {
            notificationCount.style.display = 'none'; // Sembunyikan jika tidak ada notifikasi baru
        }
    }

    // Fungsi untuk mengambil pesanan baru
    function checkNewOrders() {
        fetch('https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/bystatus?status=baru')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    updateNotificationUI(data);
                } else {
                    console.error("Format data tidak valid:", data);
                }
            })
            .catch(error => console.error("Gagal mengambil data pesanan:", error));
    }

    // Panggil fungsi pertama kali dan set interval untuk memeriksa pesanan baru setiap 5 detik
    checkNewOrders();
    setInterval(checkNewOrders, 5000);

    // Toggle notifikasi dropdown
    notificationButton.addEventListener("click", function () {
        notification.style.display = (notification.style.display === 'none' || notification.style.display === '') ? 'block' : 'none';
    });

    // Tutup notifikasi jika klik di luar area
    document.addEventListener("click", function (event) {
        if (!notificationButton.contains(event.target) && !notification.contains(event.target)) {
            notification.style.display = 'none';
        }
    });
});
