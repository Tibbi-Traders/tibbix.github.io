(function () {
  function stockTone(status) {
    if (status === "In Stock") return "success";
    if (status === "Low") return "warning";
    if (status === "Out") return "danger";
    return "info";
  }

  function productCard(product, options = {}) {
    const image = product.images && product.images[0] ? product.images[0] : "assets/images/placeholder.svg";
    const isOut = product.stockStatus === "Out";
    const badgeText = options.badgeText ? String(options.badgeText) : "";
    return `
      <div class="card product-card">
        ${badgeText ? `<span class="badge info" style="align-self: flex-start;">${window.tibbi.escapeHtml(badgeText)}</span>` : ""}
        <a href="product.html?id=${encodeURIComponent(product.id)}">
          <div class="product-image">
            <img src="${image}" alt="${window.tibbi.escapeHtml(product.name)}" />
          </div>
          <div class="muted" style="font-size: 12px; text-transform: uppercase; margin-top: 8px;">${window.tibbi.escapeHtml(product.brand)}</div>
          <div class="font-display" style="font-size: 18px; font-weight: 600; margin-top: 4px;">${window.tibbi.escapeHtml(product.name)}</div>
          <div class="muted" style="font-size: 12px;">ID: ${window.tibbi.escapeHtml(product.id)}</div>
        </a>
        <div class="product-meta">
          <span class="badge ${stockTone(product.stockStatus)}">${window.tibbi.escapeHtml(product.stockStatus)}</span>
          <span class="muted" style="font-size: 12px;">${window.tibbi.escapeHtml(product.packSize)}</span>
        </div>
        <div class="product-actions">
          <a class="btn-secondary" href="product.html?id=${encodeURIComponent(product.id)}">View details</a>
          <button class="btn-primary" type="button" data-add-to-cart data-product-id="${window.tibbi.escapeHtml(product.id)}" ${isOut ? "disabled" : ""}>
            ${isOut ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    `;
  }

  window.tibbiTemplates = {
    productCard
  };
})();

