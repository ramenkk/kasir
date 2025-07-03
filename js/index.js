async function fetchOrderStats() {
    try {
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/pesanan");
        const data = await response.json();

        console.log("Data Pesanan:", data); 

      
        const today = new Date().toISOString().split('T')[0];
        let dailyOrders = 0;
        let totalOrders = data.length;
        let dailyRevenue = 0;

        data.forEach(order => {
            console.log("Order:", order); 

     
            const orderDate = new Date(order.tanggal_pesanan).toISOString().split('T')[0];

            if (orderDate === today) {
                dailyOrders++;
                if (order.status_pesanan === "selesai") {
                    dailyRevenue += order.total_harga;
                }
            }
        });

        console.log("Daily Orders:", dailyOrders);
        console.log("Daily Revenue:", dailyRevenue); 

        // Update elemen DOM
        document.getElementById("dailyOrders").textContent = dailyOrders;
        document.getElementById("totalOrders").textContent = totalOrders;
        document.getElementById("dailyRevenue").textContent = `Rp ${dailyRevenue.toLocaleString()}`;
    } catch (error) {
        console.error("Failed to fetch order stats:", error);
    }
}

fetchOrderStats();

document.addEventListener("DOMContentLoaded", function () {
    const notificationButton = document.querySelector('[x-data] button');
    const notification = document.querySelector('#notification');
    const notificationCount = document.querySelector('#notificationCount'); // Ambil elemen jumlah notifikasi dari DOM
    const notificationSound = document.getElementById('notificationSound'); // Ambil elemen audio

    let previousOrderCount = 0; // Simpan jumlah pesanan sebelumnya

    // Fungsi untuk memperbarui UI notifikasi
    function updateNotificationUI(orders) {
        notification.innerHTML = ''; // Kosongkan daftar notifikasi
        if (orders.length > 0) {
            notificationCount.textContent = orders.length;
            notificationCount.style.display = 'block'; // Tampilkan jumlah notifikasi

            // Mainkan suara notifikasi jika ada pesanan baru yang masuk
            if (orders.length > previousOrderCount && notificationSound) {
                notificationSound.play(); // Mainkan suara sekali
            }

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

        // Perbarui jumlah pesanan sebelumnya
        previousOrderCount = orders.length;
    }

    // Fungsi untuk mengambil pesanan baru
    function checkNewOrders() {
        fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/bystatus?status=baru')
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
