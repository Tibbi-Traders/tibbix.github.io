(function () {
  const container = document.getElementById("cart-list");
  const summary = document.getElementById("cart-summary");
  if (!container) return;

  function render() {
    const items = window.tibbiStore.getCart();
    if (items.length === 0) {
      container.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center;">
          <div>Your cart is empty. Browse products to add items.</div>
          <a class="btn-primary" style="margin-top: 12px;" href="products.html">Browse products</a>
        </div>
      `;
      if (summary) summary.innerHTML = "";
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
          <div class="card cart-item">
            <div class="product-image">
              <img src="${item.image}" alt="${window.tibbi.escapeHtml(item.name)}" />
            </div>
            <div>
              <div class="muted" style="font-size: 12px;">${window.tibbi.escapeHtml(item.brand)}</div>
              <div class="font-display" style="font-size: 18px; font-weight: 600;">${window.tibbi.escapeHtml(item.name)}</div>
              <div class="muted" style="font-size: 12px;">ID: ${window.tibbi.escapeHtml(item.id)} ${item.variantLabel ? `| ${window.tibbi.escapeHtml(item.variantLabel)}` : ""}</div>
              <div class="muted" style="margin-top: 8px; font-size: 14px;">Pack: ${window.tibbi.escapeHtml(item.packSize)} | MOQ: ${window.tibbi.escapeHtml(item.minOrderQty)}</div>
            </div>
            <div class="cart-actions">
              <div class="qty-control">
                <label class="muted" style="font-size: 12px;">Qty</label>
                <input type="number" min="${item.minOrderQty}" step="${item.minOrderQty}" value="${item.quantity}" data-qty data-id="${window.tibbi.escapeHtml(item.id)}" data-variant="${window.tibbi.escapeHtml(item.variantLabel)}" />
              </div>
              <button class="btn-ghost" data-remove data-id="${window.tibbi.escapeHtml(item.id)}" data-variant="${window.tibbi.escapeHtml(item.variantLabel)}">Remove</button>
            </div>
          </div>
        `
      )
      .join("");

    if (summary) {
      const summaryItems = items
        .map(
          (item) => `
            <div class="summary-item">
              <div>
                <div style="font-weight: 600;">${window.tibbi.escapeHtml(item.name)}</div>
                <div class="muted" style="font-size: 12px;">${window.tibbi.escapeHtml(item.packSize)}</div>
              </div>
              <div class="summary-qty">
                <button class="qty-button" data-step="-1" data-id="${window.tibbi.escapeHtml(item.id)}" data-variant="${window.tibbi.escapeHtml(item.variantLabel)}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-button" data-step="1" data-id="${window.tibbi.escapeHtml(item.id)}" data-variant="${window.tibbi.escapeHtml(item.variantLabel)}">+</button>
              </div>
            </div>
          `
        )
        .join("");

      summary.innerHTML = `
        <div class="card" style="padding: 20px;">
          <div class="font-display" style="font-size: 18px; font-weight: 600;">Cart summary</div>
          <div style="margin-top: 12px; display: grid; gap: 12px;">
            ${summaryItems}
          </div>
          <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 10px;">
            <a class="btn-ghost" href="products.html">Add more products</a>
            <a class="btn-primary" href="quote.html">Request quote</a>
          </div>
        </div>
      `;
    }

    bindEvents();
  }

  function bindEvents() {
    const qtyInputs = document.querySelectorAll("[data-qty]");
    qtyInputs.forEach((input) => {
      input.addEventListener("change", (event) => {
        const target = event.target;
        const id = target.getAttribute("data-id");
        const variant = target.getAttribute("data-variant");
        window.tibbiStore.updateQuantity(id, variant, target.value);
        render();
      });
    });

    const removeButtons = document.querySelectorAll("[data-remove]");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.target;
        const id = target.getAttribute("data-id");
        const variant = target.getAttribute("data-variant");
        window.tibbiStore.removeItem(id, variant);
        render();
      });
    });

    const stepButtons = document.querySelectorAll("[data-step]");
    stepButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.target;
        const id = target.getAttribute("data-id");
        const variant = target.getAttribute("data-variant");
        const step = Number(target.getAttribute("data-step")) || 0;
        const items = window.tibbiStore.getCart();
        const item = items.find(
          (entry) => entry.id === id && entry.variantLabel === variant
        );
        if (!item) return;
        const minQty = item.minOrderQty || 1;
        const nextQty = Math.max(minQty, item.quantity + step * minQty);
        window.tibbiStore.updateQuantity(id, variant, nextQty);
        render();
      });
    });
  }

  render();
})();

