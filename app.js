const App = {

    currentPage: "dashboard",

    async init() {
        await openDatabase();
        this.bindEvents();
        await this.seedData();
        await this.render("dashboard");
    },

    bindEvents() {
        document.querySelectorAll(".nav-btn").forEach(button => {
            button.addEventListener("click", () => {
                const page = button.dataset.page;
                this.render(page);
            });
        });

        document.getElementById("modalClose").addEventListener("click", () => {
            this.closeModal();
        });

        document.getElementById("notificationBtn").addEventListener("click", () => {
            this.showNotifications();
        });
    },

    async seedData() {
        const business = await Storage.getBusiness();

        if (!business) {
            await Storage.saveBusiness({
                name: "Bisnis Saya",
                category: "Umum",
                location: "Indonesia",
                description: "Profil bisnis utama"
            });
        }
    },

    async render(page) {
        this.currentPage = page;

        document.querySelectorAll(".nav-btn").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === page
            );
        });

        const titles = {
            dashboard: ["Dashboard", "Pusat jaringan bisnis Anda"],
            business: ["Bisnis", "Kelola identitas bisnis"],
            products: ["Produk", "Kelola produk dalam jaringan"],
            network: ["Network", "Hubungkan bisnis dalam ekosistem"],
            matching: ["AI Matching", "Temukan kecocokan bisnis"],
            requests: ["Kebutuhan", "Kelola kebutuhan bisnis"],
            offers: ["Penawaran", "Kelola penawaran bisnis"],
            transactions: ["Transaksi", "Riwayat transaksi"],
            services: ["Jasa", "Kelola layanan bisnis"]
        };

        document.getElementById("pageTitle").textContent = titles[page][0];
        document.getElementById("pageSubtitle").textContent = titles[page][1];

        const content = document.getElementById("content");

        if (page === "dashboard") {
            await this.renderDashboard(content);
        } else if (page === "business") {
            await this.renderBusiness(content);
        } else if (page === "products") {
            await this.renderProducts(content);
        } else if (page === "network") {
            await this.renderNetwork(content);
        } else if (page === "matching") {
            await this.renderMatching(content);
        } else if (page === "requests") {
            await this.renderRequests(content);
        } else if (page === "offers") {
            await this.renderOffers(content);
        } else if (page === "transactions") {
            await this.renderTransactions(content);
        } else if (page === "services") {
            await this.renderServices(content);
        }
    },

    async renderDashboard(el) {
        const business = await Storage.getBusiness();
        const products = await Storage.getAll(STORES.products);
        const network = await Storage.getAll(STORES.network);
        const requests = await Storage.getAll(STORES.requests);
        const transactions = await Storage.getAll(STORES.transactions);

        el.innerHTML = `
            <div class="hero">
                <h2>Selamat datang di AI BUSINESS NETWORK</h2>
                <p>
                    Hubungkan bisnis, supplier, distributor, reseller,
                    pelanggan dan penyedia jasa dalam satu jaringan bisnis.
                </p>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-icon">🏢</div>
                    <h3>${business ? business.name : "-"}</h3>
                    <p>Bisnis aktif</p>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <h3>${products.length}</h3>
                    <p>Produk terdaftar</p>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">🌐</div>
                    <h3>${network.length}</h3>
                    <p>Koneksi bisnis</p>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <h3>${transactions.length}</h3>
                    <p>Transaksi</p>
                </div>
            </div>

            <div class="card">
                <div class="section-head">
                    <h2>Aksi Cepat</h2>
                </div>

                <div class="quick-actions">
                    <button class="quick-action" onclick="App.openAddProduct()">
                        📦
                        <strong>Tambah Produk</strong>
                        <small>Daftarkan produk</small>
                    </button>

                    <button class="quick-action" onclick="App.openAddNetwork()">
                        🌐
                        <strong>Tambah Network</strong>
                        <small>Hubungkan bisnis</small>
                    </button>

                    <button class="quick-action" onclick="App.openAddRequest()">
                        📋
                        <strong>Buat Kebutuhan</strong>
                        <small>Cari supplier</small>
                    </button>

                    <button class="quick-action" onclick="App.render('matching')">
                        🤖
                        <strong>AI Matching</strong>
                        <small>Cari kecocokan</small>
                    </button>
                </div>
            </div>

            <br>

            <div class="grid">
                <div class="card">
                    <h3>Kebutuhan Terbaru</h3>
                    ${
                        requests.length
                        ? requests.slice(-5).reverse().map(r => `
                            <div class="business-card">
                                <div class="business-name">${this.escape(r.product)}</div>
                                <div class="business-meta">
                                    Qty: ${r.quantity} ${r.unit || ""}<br>
                                    Budget: ${this.formatRupiah(r.budget)}
                                </div>
                            </div>
                        `).join("")
                        : `<div class="empty">Belum ada kebutuhan.</div>`
                    }
                </div>

                <div class="card">
                    <h3>Status Network</h3>
                    <div class="empty">
                        ${network.length
                            ? `Anda memiliki ${network.length} koneksi bisnis.`
                            : "Belum ada koneksi bisnis."}
                    </div>
                </div>
            </div>
        `;
    },

    async renderBusiness(el) {
        const business = await Storage.getBusiness();

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Profil Bisnis</h2>
                    <button class="btn" onclick="App.openBusinessForm()">
                        Edit Profil
                    </button>
                </div>

                ${
                    business
                    ? `
                    <div class="business-card">
                        <div class="business-name">${this.escape(business.name)}</div>
                        <div class="business-meta">
                            Kategori: ${this.escape(business.category)}<br>
                            Lokasi: ${this.escape(business.location)}<br>
                            ${this.escape(business.description || "")}
                        </div>
                    </div>
                    `
                    : `<div class="empty">Profil bisnis belum tersedia.</div>`
                }
            </div>
        `;
    },

    async renderProducts(el) {
        const products = await Storage.getAll(STORES.products);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Produk</h2>
                    <button class="btn" onclick="App.openAddProduct()">
                        + Tambah Produk
                    </button>
                </div>

                ${
                    products.length
                    ? `
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Kategori</th>
                                    <th>Harga</th>
                                    <th>Stok</th>
                                    <th>Peran</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(p => `
                                    <tr>
                                        <td>${this.escape(p.name)}</td>
                                        <td>${this.escape(p.category)}</td>
                                        <td>${this.formatRupiah(p.price)}</td>
                                        <td>${p.stock} ${this.escape(p.unit || "")}</td>
                                        <td>
                                            <span class="badge info">
                                                ${this.escape(p.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn danger"
                                                onclick="App.deleteItem('${STORES.products}', ${p.id})">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    `
                    : `<div class="empty">Belum ada produk.</div>`
                }
            </div>
        `;
    },

    async renderNetwork(el) {
        const network = await Storage.getAll(STORES.network);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Jaringan Bisnis</h2>
                    <button class="btn" onclick="App.openAddNetwork()">
                        + Tambah Bisnis
                    </button>
                </div>

                ${
                    network.length
                    ? network.map(n => `
                        <div class="business-card">
                            <div class="business-top">
                                <div>
                                    <div class="business-name">
                                        ${this.escape(n.name)}
                                    </div>
                                    <div class="business-meta">
                                        ${this.escape(n.category)} ·
                                        ${this.escape(n.location)}
                                    </div>
                                </div>

                                <span class="badge success">
                                    ${this.escape(n.role)}
                                </span>
                            </div>

                            <br>

                            <button class="btn danger"
                                onclick="App.deleteItem('${STORES.network}', ${n.id})">
                                Hapus Koneksi
                            </button>
                        </div>
                    `).join("")
                    : `<div class="empty">
                        Belum ada bisnis dalam network.
                    </div>`
                }
            </div>
        `;
    },

    async renderMatching(el) {
        const products = await Storage.getAll(STORES.products);
        const network = await Storage.getAll(STORES.network);
        const requests = await Storage.getAll(STORES.requests);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>🤖 AI Business Matching</h2>
                    <button class="btn" onclick="App.openAddRequest()">
                        + Buat Kebutuhan
                    </button>
                </div>

                <div class="search-box">
                    <input
                        id="matchingInput"
                        placeholder="Contoh: kopi, gula, kemasan..."
                        oninput="App.runMatching()"
                    >
                </div>

                <div id="matchingResults">
                    <div class="empty">
                        Masukkan kebutuhan untuk mencari kecocokan.
                    </div>
                </div>
            </div>

            <br>

            <div class="card">
                <h3>Kebutuhan Aktif</h3>

                ${
                    requests.length
                    ? requests.slice().reverse().map(r => `
                        <div class="match-card">
                            <div class="match-score">
                                ${this.escape(r.product)}
                            </div>

                            <p>
                                Membutuhkan ${r.quantity}
                                ${this.escape(r.unit || "")}
                            </p>

                            <br>

                            <button class="btn"
                                onclick="App.matchSpecific('${this.escapeAttribute(r.product)}')">
                                Cari Supplier
                            </button>
                        </div>
                    `).join("")
                    : `<div class="empty">Belum ada kebutuhan.</div>`
                }
            </div>
        `;

        this.matchingProducts = products;
        this.matchingNetwork = network;
    },

    async runMatching() {
        const input = document.getElementById("matchingInput");

        if (!input) return;

        const keyword = input.value.trim().toLowerCase();
        const result = document.getElementById("matchingResults");

        if (!keyword) {
            result.innerHTML = `
                <div class="empty">
                    Masukkan kebutuhan untuk mencari kecocokan.
                </div>
            `;
            return;
        }

        const products = await Storage.getAll(STORES.products);
        const network = await Storage.getAll(STORES.network);

        const matches = [];

        products.forEach(product => {
            const text = `
                ${product.name}
                ${product.category}
                ${product.role}
            `.toLowerCase();

            if (text.includes(keyword)) {
                matches.push({
                    type: "Produk",
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    stock: product.stock,
                    role: product.role,
                    score: 95
                });
            }
        });

        network.forEach(business => {
            const text = `
                ${business.name}
                ${business.category}
                ${business.role}
            `.toLowerCase();

            if (text.includes(keyword)) {
                matches.push({
                    type: "Bisnis",
                    name: business.name,
                    category: business.category,
                    location: business.location,
                    role: business.role,
                    score: 80
                });
            }
        });

        if (!matches.length) {
            result.innerHTML = `
                <div class="empty">
                    Tidak ditemukan kecocokan untuk "${this.escape(keyword)}".
                </div>
            `;
            return;
        }

        result.innerHTML = matches.map(item => `
            <div class="match-card">
                <div class="business-top">
                    <div>
                        <div class="business-name">
                            ${this.escape(item.name)}
                        </div>

                        <div class="business-meta">
                            ${this.escape(item.category || "")}<br>
                            ${item.location
                                ? this.escape(item.location)
                                : `Harga: ${this.formatRupiah(item.price)} · Stok: ${item.stock}`}
                        </div>
                    </div>

                    <div class="match-score">
                        ${item.score}%
                    </div>
                </div>

                <br>

                <span class="badge info">
                    ${this.escape(item.role || item.type)}
                </span>
            </div>
        `).join("");
    },

    async matchSpecific(product) {
        this.render("matching");

        setTimeout(() => {
            const input = document.getElementById("matchingInput");

            if (input) {
                input.value = product;
                this.runMatching();
            }
        }, 100);
    },

    async renderRequests(el) {
        const requests = await Storage.getAll(STORES.requests);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Kebutuhan Bisnis</h2>
                    <button class="btn" onclick="App.openAddRequest()">
                        + Buat Kebutuhan
                    </button>
                </div>

                ${
                    requests.length
                    ? requests.slice().reverse().map(r => `
                        <div class="business-card">
                            <div class="business-top">
                                <div>
                                    <div class="business-name">
                                        ${this.escape(r.product)}
                                    </div>
                                    <div class="business-meta">
                                        Jumlah: ${r.quantity}
                                        ${this.escape(r.unit || "")}<br>
                                        Budget: ${this.formatRupiah(r.budget)}<br>
                                        Catatan: ${this.escape(r.notes || "-")}
                                    </div>
                                </div>

                                <span class="badge warning">
                                    ${this.escape(r.status)}
                                </span>
                            </div>

                            <br>

                            <button class="btn danger"
                                onclick="App.deleteItem('${STORES.requests}', ${r.id})">
                                Hapus
                            </button>
                        </div>
                    `).join("")
                    : `<div class="empty">
                        Belum ada kebutuhan bisnis.
                    </div>`
                }
            </div>
        `;
    },

    async renderOffers(el) {
        const offers = await Storage.getAll(STORES.offers);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Penawaran</h2>
                    <button class="btn" onclick="App.openAddOffer()">
                        + Tambah Penawaran
                    </button>
                </div>

                ${
                    offers.length
                    ? `
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Supplier</th>
                                    <th>Harga</th>
                                    <th>Jumlah</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${offers.slice().reverse().map(o => `
                                    <tr>
                                        <td>${this.escape(o.product)}</td>
                                        <td>${this.escape(o.supplier)}</td>
                                        <td>${this.formatRupiah(o.price)}</td>
                                        <td>${o.quantity}</td>
                                        <td>
                                            <span class="badge info">
                                                ${this.escape(o.status)}
                                            </span>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    `
                    : `<div class="empty">Belum ada penawaran.</div>`
                }
            </div>
        `;
    },

    async renderTransactions(el) {
        const transactions = await Storage.getAll(STORES.transactions);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Transaksi</h2>
                    <button class="btn" onclick="App.openAddTransaction()">
                        + Catat Transaksi
                    </button>
                </div>

                ${
                    transactions.length
                    ? `
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Jumlah</th>
                                    <th>Total</th>
                                    <th>Pihak</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.slice().reverse().map(t => `
                                    <tr>
                                        <td>${this.escape(t.product)}</td>
                                        <td>${t.quantity}</td>
                                        <td>${this.formatRupiah(t.total)}</td>
                                        <td>${this.escape(t.partner)}</td>
                                        <td>
                                            <span class="badge success">
                                                ${this.escape(t.status)}
                                            </span>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    `
                    : `<div class="empty">Belum ada transaksi.</div>`
                }
            </div>
        `;
    },

    async renderServices(el) {
        const services = await Storage.getAll(STORES.services);

        el.innerHTML = `
            <div class="card">
                <div class="section-head">
                    <h2>Penyedia Jasa</h2>
                    <button class="btn" onclick="App.openAddService()">
                        + Tambah Jasa
                    </button>
                </div>

                ${
                    services.length
                    ? services.map(s => `
                        <div class="business-card">
                            <div class="business-top">
                                <div>
                                    <div class="business-name">
                                        ${this.escape(s.name)}
                                    </div>

                                    <div class="business-meta">
                                        Kategori: ${this.escape(s.category)}<br>
                                        Harga: ${this.formatRupiah(s.price)}<br>
                                        Area: ${this.escape(s.area)}
                                    </div>
                                </div>
                            </div>

                            <br>

                            <button class="btn danger"
                                onclick="App.deleteItem('${STORES.services}', ${s.id})">
                                Hapus
                            </button>
                        </div>
                    `).join("")
                    : `<div class="empty">Belum ada jasa.</div>`
                }
            </div>
        `;
    },

    openModal(html) {
        document.getElementById("modalContent").innerHTML = html;
        document.getElementById("modal").classList.remove("hidden");
    },

    closeModal() {
        document.getElementById("modal").classList.add("hidden");
        document.getElementById("modalContent").innerHTML = "";
    },

    openBusinessForm() {
        this.openModal(`
            <h2>Edit Profil Bisnis</h2>
            <br>

            <form id="businessForm" class="form-grid">
                <div class="form-group">
                    <label>Nama Bisnis</label>
                    <input name="name" required>
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <input name="category" required>
                </div>

                <div class="form-group">
                    <label>Lokasi</label>
                    <input name="location" required>
                </div>

                <div class="form-group full">
                    <label>Deskripsi</label>
                    <textarea name="description"></textarea>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Simpan Profil
                    </button>
                </div>
            </form>
        `);

        document.getElementById("businessForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.saveBusiness({
                name: form.get("name"),
                category: form.get("category"),
                location: form.get("location"),
                description: form.get("description")
            });

            document.getElementById("profileName").textContent =
                form.get("name");

            this.closeModal();
            this.toast("Profil bisnis berhasil disimpan.");
            this.render("business");
        });
    },

    openAddProduct() {
        this.openModal(`
            <h2>Tambah Produk</h2>
            <br>

            <form id="productForm" class="form-grid">

                <div class="form-group">
                    <label>Nama Produk</label>
                    <input name="name" required>
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <input name="category" required>
                </div>

                <div class="form-group">
                    <label>Harga</label>
                    <input name="price" type="number" min="0" required>
                </div>

                <div class="form-group">
                    <label>Stok</label>
                    <input name="stock" type="number" min="0" required>
                </div>

                <div class="form-group">
                    <label>Satuan</label>
                    <input name="unit" placeholder="kg, pcs, dus...">
                </div>

                <div class="form-group">
                    <label>Peran</label>
                    <select name="role">
                        <option>Supplier</option>
                        <option>Distributor</option>
                        <option>Reseller</option>
                        <option>Penjual</option>
                    </select>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Simpan Produk
                    </button>
                </div>

            </form>
        `);

        document.getElementById("productForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.addProduct({
                name: form.get("name"),
                category: form.get("category"),
                price: Number(form.get("price")),
                stock: Number(form.get("stock")),
                unit: form.get("unit"),
                role: form.get("role")
            });

            this.closeModal();
            this.toast("Produk berhasil ditambahkan.");
            this.render("products");
        });
    },

    openAddNetwork() {
        this.openModal(`
            <h2>Tambah Bisnis ke Network</h2>
            <br>

            <form id="networkForm" class="form-grid">

                <div class="form-group">
                    <label>Nama Bisnis</label>
                    <input name="name" required>
                </div>

                <div class="form-group">
                    <label>Peran</label>
                    <select name="role">
                        <option>Supplier</option>
                        <option>Distributor</option>
                        <option>Reseller</option>
                        <option>Pelanggan</option>
                        <option>Penyedia Jasa</option>
                        <option>Pemilik Bisnis</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <input name="category" required>
                </div>

                <div class="form-group">
                    <label>Lokasi</label>
                    <input name="location" required>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Simpan Network
                    </button>
                </div>

            </form>
        `);

        document.getElementById("networkForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.addNetwork({
                name: form.get("name"),
                role: form.get("role"),
                category: form.get("category"),
                location: form.get("location")
            });

            await Storage.addNotification({
                title: "Network baru",
                message: `${form.get("name")} ditambahkan ke network.`,
                read: false
            });

            this.closeModal();
            this.toast("Bisnis berhasil ditambahkan ke network.");
            this.render("network");
        });
    },

    openAddRequest() {
        this.openModal(`
            <h2>Buat Kebutuhan Bisnis</h2>
            <br>

            <form id="requestForm" class="form-grid">

                <div class="form-group">
                    <label>Produk yang Dibutuhkan</label>
                    <input name="product" required>
                </div>

                <div class="form-group">
                    <label>Jumlah</label>
                    <input name="quantity" type="number" min="1" required>
                </div>

                <div class="form-group">
                    <label>Satuan</label>
                    <input name="unit" placeholder="kg, pcs, dus...">
                </div>

                <div class="form-group">
                    <label>Budget Maksimal</label>
                    <input name="budget" type="number" min="0">
                </div>

                <div class="form-group full">
                    <label>Catatan</label>
                    <textarea name="notes"></textarea>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Buat Kebutuhan
                    </button>
                </div>

            </form>
        `);

        document.getElementById("requestForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.addRequest({
                product: form.get("product"),
                quantity: Number(form.get("quantity")),
                unit: form.get("unit"),
                budget: Number(form.get("budget") || 0),
                notes: form.get("notes"),
                status: "Aktif"
            });

            await Storage.addNotification({
                title: "Kebutuhan baru",
                message: `Kebutuhan ${form.get("product")} dibuat.`,
                read: false
            });

            this.closeModal();
            this.toast("Kebutuhan berhasil dibuat.");
            this.render("requests");
        });
    },

    openAddOffer() {
        this.openModal(`
            <h2>Tambah Penawaran</h2>
            <br>

            <form id="offerForm" class="form-grid">

                <div class="form-group">
                    <label>Produk</label>
                    <input name="product" required>
                </div>

                <div class="form-group">
                    <label>Supplier</label>
                    <input name="supplier" required>
                </div>

                <div class="form-group">
                    <label>Harga</label>
                    <input name="price" type="number" min="0" required>
                </div>

                <div class="form-group">
                    <label>Jumlah</label>
                    <input name="quantity" type="number" min="1" required>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Simpan Penawaran
                    </button>
                </div>

            </form>
        `);

        document.getElementById("offerForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.addOffer({
                product: form.get("product"),
                supplier: form.get("supplier"),
                price: Number(form.get("price")),
                quantity: Number(form.get("quantity")),
                status: "Menunggu"
            });

            this.closeModal();
            this.toast("Penawaran berhasil disimpan.");
            this.render("offers");
        });
    },

    openAddTransaction() {
        this.openModal(`
            <h2>Catat Transaksi</h2>
            <br>

            <form id="transactionForm" class="form-grid">

                <div class="form-group">
                    <label>Produk</label>
                    <input name="product" required>
                </div>

                <div class="form-group">
                    <label>Jumlah</label>
                    <input name="quantity" type="number" min="1" required>
                </div>

                <div class="form-group">
                    <label>Total</label>
                    <input name="total" type="number" min="0" required>
                </div>

                <div class="form-group">
                    <label>Partner Bisnis</label>
                    <input name="partner" required>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Simpan Transaksi
                    </button>
                </div>

            </form>
        `);

        document.getElementById("transactionForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.addTransaction({
                product: form.get("product"),
                quantity: Number(form.get("quantity")),
                total: Number(form.get("total")),
                partner: form.get("partner"),
                status: "Selesai"
            });

            await Storage.addNotification({
                title: "Transaksi baru",
                message: `Transaksi ${form.get("product")} berhasil dicatat.`,
                read: false
            });

            this.closeModal();
            this.toast("Transaksi berhasil dicatat.");
            this.render("transactions");
        });
    },

    openAddService() {
        this.openModal(`
            <h2>Tambah Jasa</h2>
            <br>

            <form id="serviceForm" class="form-grid">

                <div class="form-group">
                    <label>Nama Jasa</label>
                    <input name="name" required>
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <input name="category" required>
                </div>

                <div class="form-group">
                    <label>Harga</label>
                    <input name="price" type="number" min="0">
                </div>

                <div class="form-group">
                    <label>Area Layanan</label>
                    <input name="area" required>
                </div>

                <div class="form-group full">
                    <button class="btn" type="submit">
                        Simpan Jasa
                    </button>
                </div>

            </form>
        `);

        document.getElementById("serviceForm").addEventListener("submit", async e => {
            e.preventDefault();

            const form = new FormData(e.target);

            await Storage.addService({
                name: form.get("name"),
                category: form.get("category"),
                price: Number(form.get("price") || 0),
                area: form.get("area")
            });

            this.closeModal();
            this.toast("Jasa berhasil ditambahkan.");
            this.render("services");
        });
    },

    async deleteItem(store, id) {
        const confirmed = confirm("Hapus data ini?");

        if (!confirmed) return;

        await Storage.remove(store, id);

        this.toast("Data berhasil dihapus.");
        this.render(this.currentPage);
    },

    async showNotifications() {
        const notifications = await Storage.getAll(STORES.notifications);

        this.openModal(`
            <h2>Notifikasi</h2>
            <br>

            ${
                notifications.length
                ? notifications.slice().reverse().map(n => `
                    <div class="notification-item">
                        <strong>${this.escape(n.title)}</strong>
                        <p>${this.escape(n.message)}</p>
                    </div>
                `).join("")
                : `<div class="empty">Tidak ada notifikasi.</div>`
            }
        `);
    },

    formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    },

    escape(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    escapeAttribute(value) {
        return String(value ?? "")
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'");
    },

    toast(message) {
        const toast = document.getElementById("toast");

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(this.toastTimer);

        this.toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    App.init().catch(error => {
        console.error("AI BUSINESS NETWORK:", error);
    });
});