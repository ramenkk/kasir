document.addEventListener('DOMContentLoaded', function() {

    const url = 'https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/bystatus?status=selesai';
    let allOrders = [];  // Untuk menyimpan data pesanan yang sudah dimuat

    function fetchData() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pesanan tidak ditemukan atau status tidak valid');
                }
                return response.json();
            })
            .then(data => {
                allOrders = data; 
                renderTableData(data); 
                addPrintButtons(); 
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat mengambil data');
            });
    }

    // Fungsi untuk merender data ke dalam tabel
    function renderTableData(data) {
        const tableBody = document.querySelector('#dataDisplayTable tbody');
        tableBody.innerHTML = ''; // Kosongkan tabel

        data.forEach(pesanan => {
            const row = document.createElement('tr');
            const tanggalPesanan = new Date(pesanan.tanggal_pesanan.$date || pesanan.tanggal_pesanan);

            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.nama_pelanggan}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.nomor_meja}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.daftar_menu.map(item => `${item.nama_menu} (x${item.jumlah})`).join(', ')}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.total_harga}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.status_pesanan}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${new Date(pesanan.tanggal_pesanan).toLocaleDateString()}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.pembayaran}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${pesanan.catatan_pesanan}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                    <button class="printBtn bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 transition" data-id="${pesanan.id}">
                        Cetak
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fungsi untuk menambahkan event listener pada tombol cetak
    function addPrintButtons() {
        const printButtons = document.querySelectorAll('.printBtn');
        printButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pesananId = this.dataset.id;
                const pesanan = allOrders.find(item => item.id === pesananId);
                printReceipt(pesanan);
            });
        });
    }

    // Fungsi untuk mencetak struk pesanan
    function printReceipt(pesanan) {
        const strukWindow = window.open('', '', 'height=600,width=800');
        strukWindow.document.write('<html><head><title>Struk Pesanan</title></head><body>');
        strukWindow.document.write('<h1>Struk Pesanan</h1>');
        strukWindow.document.write('<p><strong>Nama Pelanggan:</strong> ' + pesanan.nama_pelanggan + '</p>');
        strukWindow.document.write('<p><strong>No Meja:</strong> ' + pesanan.nomor_meja + '</p>');
        strukWindow.document.write('<p><strong>Daftar Menu:</strong> ' + pesanan.daftar_menu.map(item => item.nama_menu).join(', ') + '</p>');
        strukWindow.document.write('<p><strong>Total Harga:</strong> Rp ' + pesanan.total_harga.toFixed(2) + '</p>');
        strukWindow.document.write('<p><strong>Status Pesanan:</strong> ' + pesanan.status_pesanan + '</p>');
        strukWindow.document.write('<p><strong>Tanggal Pesanan:</strong> ' + new Date(pesanan.tanggal_pesanan).toLocaleString() + '</p>');
        strukWindow.document.write('<p><strong>Pembayaran:</strong> ' + pesanan.pembayaran + '</p>');
        strukWindow.document.write('<p><strong>Catatan Pesanan:</strong> ' + pesanan.catatan_pesanan + '</p>');
        strukWindow.document.write('</body></html>');
        strukWindow.document.close();
        strukWindow.print();
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
        addPrintButtons();
    }

    // Fungsi untuk filter mingguan
    function filterWeekly() {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.tanggal_pesanan.$date || order.tanggal_pesanan);
            return orderDate >= startOfWeek && orderDate <= endOfWeek;
        });
    
        console.log('Filtered Weekly Orders:', filteredOrders); // Debugging
        renderTableData(filteredOrders);
        addPrintButtons();
    }
    
    function filterMonthly() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.tanggal_pesanan.$date || order.tanggal_pesanan);
            return orderDate >= startOfMonth && orderDate <= endOfMonth;
        });
    
        renderTableData(filteredOrders);
        addPrintButtons(); // Pastikan ini dipanggil setelah renderTableData
    }

    fetchData();

    // Menambahkan event listener untuk filter
    document.getElementById('searchInput').addEventListener('keyup', filterData);
    document.getElementById('filterWeekly').addEventListener('click', filterWeekly);
    document.getElementById('filterMonthly').addEventListener('click', filterMonthly);
});