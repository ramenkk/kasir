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
