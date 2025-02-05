async function fetchOrderStats() {
    try {
        const response = await fetch("https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/pesanan");
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


    document.addEventListener("DOMContentLoaded", () => {
        checkNewOrders(); // Cek saat halaman pertama kali dimuat
        setInterval(checkNewOrders, 5000); // Cek setiap 5 detik
    });

    async function checkNewOrders() {
        try {
            const response = await fetch("https://asia-southeast2-menurestoran-443909.cloudfunctions.net/menurestoran/data/bystatus?status=baru");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const orders = await response.json();
            updateNotificationUI(orders);
        } catch (error) {
            console.error("Gagal mengambil data pesanan:", error);
        }
    }

    function updateNotificationUI(orders) {
        const notificationIcon = document.getElementById("notificationIcon");
        const notificationDropdown = document.getElementById("notificationDropdown");

        if (orders.length > 0) {
            notificationIcon.classList.add("text-red-500"); // Ubah warna lonceng jadi merah
            notificationIcon.innerHTML = `<span class="absolute top-0 right-0 block h-3 w-3 bg-red-600 rounded-full"></span>`;

            // Tampilkan daftar pesanan baru
            notificationDropdown.innerHTML = `
                <div class="p-4 border-b">
                    <h3 class="text-lg font-semibold text-gray-700">Pesanan Baru (${orders.length})</h3>
                </div>
                <ul class="max-h-60 overflow-y-auto">
                    ${orders.map(order => `
                        <li class="p-4 border-b">
                            <p class="font-medium">${order.nama_pelanggan} (Meja ${order.nomor_meja})</p>
                            <p class="text-sm text-gray-500">${order.total_harga.toLocaleString()} IDR</p>
                        </li>
                    `).join("")}
                </ul>
            `;

            // Notifikasi suara (opsional)
            const audio = new Audio("https://www.myinstants.com/media/sounds/notification.mp3");
            audio.play();

            // Notifikasi Browser (opsional)
            if (Notification.permission === "granted") {
                new Notification("Pesanan Baru!", {
                    body: `Ada ${orders.length} pesanan baru!`,
                    icon: "https://yourwebsite.com/icon.png"
                });
            }
        } else {
            notificationIcon.classList.remove("text-red-500");
            notificationIcon.innerHTML = "";
            notificationDropdown.innerHTML = `<div class="p-4 text-gray-500">Tidak ada pesanan baru</div>`;
        }
    }

    // Minta izin notifikasi browser
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
