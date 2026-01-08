(function () {
  let allProducts = [];
  let filtered = [];
  let currentPage = 1;
  const pageSize = 24;

  const elements = {
    resultsCount: document.getElementById("results-count"),
    productsGrid: document.getElementById("products-grid"),
    pagination: document.getElementById("products-pagination"),
    filterBrand: document.getElementById("filter-brand"),
    filterStock: document.getElementById("filter-stock"),
    filterCategory: document.getElementById("filter-category"),
    filterPack: document.getElementById("filter-pack"),
    searchInput: document.getElementById("filter-search"),
    sortSelect: document.getElementById("sort-select")
  };

  function getFilters() {
    return {
      brand: elements.filterBrand.value,
      stock: elements.filterStock.value,
      category: elements.filterCategory.value,
      packSize: elements.filterPack.value,
      query: elements.searchInput.value
    };
  }

  function applyFilters() {
    const filters = getFilters();
    const query = filters.query.toLowerCase();
    const categoryValue = filters.category.trim();
    filtered = allProducts.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesBrand = filters.brand === "all" || product.brand === filters.brand;
      const matchesStock = filters.stock === "all" || product.stockStatus === filters.stock;
      const matchesCategory =
        !categoryValue ||
        categoryValue === "all" ||
        window.tibbi.slugify(product.category) === window.tibbi.slugify(categoryValue);
      const matchesPack = filters.packSize === "all" || product.packSize === filters.packSize;
      return matchesQuery && matchesBrand && matchesStock && matchesCategory && matchesPack;
    });

    const sort = elements.sortSelect.value;
    if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "popular") {
      filtered.sort((a, b) => (a.sortRank || 999) - (b.sortRank || 999));
    }

    currentPage = 1;
    renderProducts();
  }

  function renderProducts() {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    elements.resultsCount.textContent = `${filtered.length} products`;

    if (pageItems.length === 0) {
      elements.productsGrid.innerHTML = '<div class="card" style="padding: 24px; text-align: center;">No products match your filters.</div>';
    } else {
      elements.productsGrid.innerHTML = pageItems
        .map((product) => window.tibbiTemplates.productCard(product))
        .join("");
    }

    renderPagination(totalPages);
    bindAddToCart();
  }

  function renderPagination(totalPages) {
    elements.pagination.innerHTML = "";
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i += 1) {
      const button = document.createElement("button");
      button.textContent = i;
      if (i === currentPage) button.classList.add("active");
      button.addEventListener("click", () => {
        currentPage = i;
        renderProducts();
      });
      elements.pagination.appendChild(button);
    }
  }

  function bindAddToCart() {
    const buttons = document.querySelectorAll("[data-add-to-cart]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-product-id");
        const product = allProducts.find((item) => item.id === id);
        if (!product || product.stockStatus === "Out") return;
        window.tibbiStore.addToCart(product, product.minOrderQty || 1, "");
        button.textContent = "Added";
        setTimeout(() => {
          button.textContent = "Add to cart";
        }, 1200);
      });
    });
  }

  function populateFilterOptions(products) {
    const brands = Array.from(new Set(products.map((product) => product.brand))).sort();
    const packs = Array.from(new Set(products.map((product) => product.packSize))).sort();
    const stocks = ["In Stock", "Low", "Out", "On Request"];

    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      elements.filterBrand.appendChild(option);
    });

    packs.forEach((pack) => {
      const option = document.createElement("option");
      option.value = pack;
      option.textContent = pack;
      elements.filterPack.appendChild(option);
    });

    stocks.forEach((stock) => {
      const option = document.createElement("option");
      option.value = stock;
      option.textContent = stock;
      elements.filterStock.appendChild(option);
    });
  }

  function attachEvents() {
    [
      elements.filterBrand,
      elements.filterStock,
      elements.filterCategory,
      elements.filterPack,
      elements.searchInput,
      elements.sortSelect
    ].forEach((el) => {
      el.addEventListener("input", applyFilters);
      el.addEventListener("change", applyFilters);
    });
  }

  window.tibbi.loadProducts().then((products) => {
    allProducts = products;
    filtered = products.slice();

    populateFilterOptions(products);

    const query = window.tibbi.getQueryParam("q") || "";
    const category = window.tibbi.getQueryParam("category") || "";
    if (query) elements.searchInput.value = query;
    if (category) elements.filterCategory.value = category;

    attachEvents();
    applyFilters();
  });
})();

