(function () {
  const container = document.getElementById("product-detail");
  if (!container) return;

  window.tibbi.loadProducts().then((products) => {
    const id = window.tibbi.getQueryParam("id");
    const product = products.find((item) => item.id === id);
    if (!product) {
      container.innerHTML = '<div class="card" style="padding: 24px; text-align: center;">Product not found.</div>';
      return;
    }

    const image = product.images && product.images[0] ? product.images[0] : "assets/images/placeholder.svg";
    const variants = product.variants || [];

    container.innerHTML = `
      <div class="card" style="padding: 24px; display: grid; gap: 20px;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px;">
          <div>
            <div class="muted" style="font-size: 12px; text-transform: uppercase;">${window.tibbi.escapeHtml(product.brand)}</div>
            <h1 class="font-display" style="font-size: 28px; margin: 6px 0;">${window.tibbi.escapeHtml(product.name)}</h1>
            <div class="muted" style="font-size: 13px;">ID: ${window.tibbi.escapeHtml(product.id)}</div>
          </div>
          <span class="chip">${window.tibbi.escapeHtml(product.stockStatus)}</span>
        </div>
        <div class="grid-2">
          <div class="product-image" style="height: 260px;">
            <img src="${image}" alt="${window.tibbi.escapeHtml(product.name)}" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div>
            <p class="muted" style="font-size: 14px;">${window.tibbi.escapeHtml(product.description)}</p>
            <div style="margin-top: 16px; display: grid; gap: 10px;">
              <div class="notice">
                <div style="font-size: 12px; text-transform: uppercase; color: var(--muted);">Pack details</div>
                <div style="margin-top: 6px; font-size: 14px;">Pack size: ${window.tibbi.escapeHtml(product.packSize)}</div>
                <div style="margin-top: 4px; font-size: 14px;">MOQ: ${window.tibbi.escapeHtml(product.minOrderQty)}</div>
              </div>
              <div class="notice">
                <div style="font-size: 12px; text-transform: uppercase; color: var(--muted);">Manufacturer</div>
                <div style="margin-top: 6px; font-size: 14px;">${window.tibbi.escapeHtml(product.manufacturer || "-")}</div>
                <div style="margin-top: 4px; font-size: 14px;">${window.tibbi.escapeHtml(product.manufacturerLocation || "-")}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          ${variants.length ? `
          <select id="variant-select">
            ${variants
              .map(
                (variant) =>
                  `<option value="${window.tibbi.escapeHtml(`${variant.name}: ${variant.value}`)}">${window.tibbi.escapeHtml(`${variant.name}: ${variant.value}`)}</option>`
              )
              .join("")}
          </select>
          ` : ""}
          <input id="quantity" type="number" min="${product.minOrderQty || 1}" step="${product.minOrderQty || 1}" value="${product.minOrderQty || 1}" />
          <button class="btn-primary" id="add-to-cart" ${product.stockStatus === "Out" ? "disabled" : ""}>
            ${product.stockStatus === "Out" ? "Out of stock" : "Add to cart"}
          </button>
          <a class="btn-secondary" href="https://wa.me/${window.TIBBI_CONFIG.whatsapp}?text=${encodeURIComponent(
            `Requesting ${product.name} (${product.id})`
          )}">WhatsApp inquiry</a>
        </div>
        <div>
          <div class="font-display" style="font-size: 18px; font-weight: 600;">Specifications</div>
          <div class="grid-3" style="margin-top: 12px;">
            ${Object.entries(product.specs || {})
              .map(
                ([key, value]) =>
                  `<div class="card" style="padding: 12px;">
                    <div class="muted" style="font-size: 12px; text-transform: uppercase;">${window.tibbi.escapeHtml(key)}</div>
                    <div style="margin-top: 4px;">${window.tibbi.escapeHtml(value)}</div>
                  </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    const button = document.getElementById("add-to-cart");
    const quantityInput = document.getElementById("quantity");
    const variantSelect = document.getElementById("variant-select");

    if (button && product.stockStatus !== "Out") {
      button.addEventListener("click", () => {
        const quantity = Number(quantityInput.value) || product.minOrderQty || 1;
        const variantLabel = variantSelect ? variantSelect.value : "";
        window.tibbiStore.addToCart(product, quantity, variantLabel);
        button.textContent = "Added";
        setTimeout(() => {
          button.textContent = "Add to cart";
        }, 1200);
      });
    }
  });
})();

