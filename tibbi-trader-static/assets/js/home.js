(function () {
  function renderCategories(categories) {
    const container = document.getElementById("categories-list");
    if (!container) return;
    container.innerHTML = categories
      .map(
        (category) => `
          <a class="card" style="padding: 16px; display: flex; justify-content: space-between; align-items: center;" href="products.html?category=${encodeURIComponent(category.slug)}">
            <span style="font-weight: 600;">${category.name}</span>
            <span class="muted" style="font-size: 12px;">Browse</span>
          </a>
        `
      )
      .join("");
  }

  function renderFeatured(products, allProducts) {
    const container = document.getElementById("featured-list");
    if (!container) return;
    container.innerHTML = products
      .map((product) =>
        window.tibbiTemplates.productCard(product, { badgeText: "Top selling" })
      )
      .join("");
    bindAddToCart(container, allProducts);
  }

  function bindAddToCart(container, products) {
    if (!container) return;
    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-to-cart]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const id = button.getAttribute("data-product-id");
      const product = products.find((item) => item.id === id);
      if (!product || product.stockStatus === "Out" || !window.tibbiStore) return;
      window.tibbiStore.addToCart(product, product.minOrderQty || 1, "");
      button.textContent = "Added";
      setTimeout(() => {
        button.textContent = "Add to cart";
      }, 1200);
    });
  }


  function renderHeroSearch(products, categories) {
    const form = document.getElementById("hero-product-search");
    const input = document.getElementById("hero-product-input");
    const datalist = document.getElementById("hero-product-suggestions");
    const chips = document.getElementById("hero-category-chips");
    if (!form || !input || !datalist) return;

    const escape = window.tibbi.escapeHtml || ((value) => String(value || ""));
    datalist.innerHTML = products
      .map((product) => `<option value="${escape(product.name)} - ${escape(product.id)}"></option>`)
      .join("");

    if (chips && categories.length) {
      chips.innerHTML = categories
        .slice(0, 8)
        .map(
          (category) =>
            `<a class="chip" href="products.html?category=${encodeURIComponent(category.slug)}">${escape(
              category.name
            )}</a>`
        )
        .join("");
    }

    function resolveProduct(value) {
      const trimmed = String(value || "").trim();
      if (!trimmed) return null;
      const byId = products.find(
        (product) => product.id.toLowerCase() === trimmed.toLowerCase()
      );
      if (byId) return byId;
      const match = trimmed.match(/\s-\s(.+)$/);
      if (match) {
        const id = match[1].trim();
        const byParsedId = products.find(
          (product) => product.id.toLowerCase() === id.toLowerCase()
        );
        if (byParsedId) return byParsedId;
      }
      const byName = products.find(
        (product) => product.name.toLowerCase() === trimmed.toLowerCase()
      );
      return byName || null;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) {
        input.focus();
        return;
      }
      const product = resolveProduct(value);
      if (product) {
        window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
        return;
      }
      window.location.href = `products.html?q=${encodeURIComponent(value)}`;
    });
  }

  window.tibbi.loadProducts().then((products) => {
    const serviceEl = document.getElementById("service-area");
    if (serviceEl) serviceEl.textContent = window.TIBBI_CONFIG.serviceArea;
    const whatsappLink = document.getElementById("hero-whatsapp");
    if (whatsappLink) whatsappLink.href = "https://wa.me/" + window.TIBBI_CONFIG.whatsapp;

    const categoriesMap = new Map();
    products.forEach((product) => {
      if (!categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, {
          name: product.category,
          slug: window.tibbi.slugify(product.category)
        });
      }
    });

    const categories = Array.from(categoriesMap.values());
    const featuredExclude = new Set(["LC-003"]);
    const featured = products
      .filter((product) => {
        if (featuredExclude.has(product.id)) return false;
        const image = product.images && product.images[0];
        return image && !String(image).toLowerCase().includes("placeholder");
      })
      .sort((a, b) => (a.sortRank || 999) - (b.sortRank || 999))
      .slice(0, 8);

    renderHeroSearch(products, categories);
    renderCategories(categories);
    renderFeatured(featured, products);
  });
})();
