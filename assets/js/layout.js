(function () {
  const config = window.TIBBI_CONFIG;
  const navItems = [
    { href: "index.html", label: "Home" },
    { href: "products.html", label: "Products" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" }
  ];
  const legalItems = [
    { href: "terms.html", label: "Terms" },
    { href: "privacy.html", label: "Privacy" },
    { href: "shipping.html", label: "Shipping" },
    { href: "returns.html", label: "Returns" }
  ];

  function activeClass(href) {
    const current = window.location.pathname.split("/").pop() || "index.html";
    return current === href ? "active" : "";
  }

  const icons = {
    cart:
      '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h1.5l2.5 11h10.5l2-7H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/></svg>',
    phone:
      '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"/></svg>',
    menu:
      '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    whatsapp:
      '<img class="icon-image" src="assets/images/whatsapp.png" alt="" />'
  };

  function renderHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    header.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="index.html">
          <img class="brand-logo" src="assets/images/logo.png" alt="${config.name} logo" />
          <div>
            <div class="font-display" style="font-weight: 700;">${config.name}</div>
            <div class="muted" style="font-size: 12px;">Medical & Lab Consumables</div>
          </div>
        </a>
        <nav class="nav">
          ${navItems
            .map(
              (item) =>
                `<a href="${item.href}" class="${activeClass(item.href)}">${item.label}</a>`
            )
            .join("")}
        </nav>
        <div class="header-actions">
          <a class="btn-secondary call-link" href="tel:${config.contactPhone}">${icons.phone}<span>${config.contactPhone}</span></a>
          <a class="icon-only" href="cart.html" aria-label="Cart">${icons.cart}<span id="cart-count" class="cart-badge" aria-live="polite"></span></a>
          <a class="icon-only" href="https://wa.me/${config.whatsapp}" aria-label="WhatsApp">${icons.whatsapp}</a>
        </div>
        <button class="menu-toggle" id="menu-toggle" aria-label="Menu">
          ${icons.menu}
          <span class="sr-only">Menu</span>
        </button>
      </div>
      <div class="mobile-panel" id="mobile-panel">
        <div class="container" style="display: grid; gap: 14px;">
          <nav>
            ${navItems
              .map(
                (item) =>
                  `<a href="${item.href}" class="${activeClass(item.href)}">${item.label}</a>`
              )
              .join("")}
          </nav>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a class="btn-ghost" href="cart.html">${icons.cart}<span>Cart</span></a>
            <a class="btn-secondary call-link" href="tel:${config.contactPhone}">${icons.phone}<span>${config.contactPhone}</span></a>
            <a class="icon-only" href="https://wa.me/${config.whatsapp}" aria-label="WhatsApp">${icons.whatsapp}</a>
          </div>
        </div>
      </div>
    `;

    function updateCartCount() {
      const cartCount = window.tibbiStore ? window.tibbiStore.getCartCount() : 0;
      const countEl = document.getElementById("cart-count");
      if (!countEl) return;
      if (cartCount > 0) {
        countEl.textContent = "";
        countEl.classList.add("is-visible");
      } else {
        countEl.textContent = "";
        countEl.classList.remove("is-visible");
      }
    }

    updateCartCount();
    document.addEventListener("cart:updated", updateCartCount);

    const toggle = document.getElementById("menu-toggle");
    const panel = document.getElementById("mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        panel.classList.toggle("open");
      });
    }
  }

  function renderFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          <div class="font-display" style="font-weight: 700;">${config.name}</div>
          <p class="muted" style="margin-top: 8px;">${config.description}</p>
          <p class="muted" style="margin-top: 16px;">${config.address}</p>
        </div>
        <div>
          <div style="font-weight: 700;">Quick links</div>
          <ul style="list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 8px;">
            ${navItems
              .slice(1)
              .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
              .join("")}
          </ul>
        </div>
        <div>
          <div style="font-weight: 700;">Contact</div>
          <ul style="list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 8px;" class="muted">
            <li>Phone: ${config.contactPhone}</li>
            <li>Email: ${config.contactEmail}</li>
            <li>WhatsApp: ${config.whatsapp}</li>
            <li>Service area: ${config.serviceArea}</li>
          </ul>
          <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 12px;" class="muted">
            ${legalItems.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
          </div>
        </div>
      </div>
      <div class="muted" style="border-top: 1px solid rgba(148, 163, 184, 0.4); padding: 12px 0; text-align: center; font-size: 12px;">
        ${config.name} - Compliance-first healthcare distribution.
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
  });
})();

