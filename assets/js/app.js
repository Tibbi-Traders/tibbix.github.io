(function () {
  const config = {
    name: "Tibbix",
    brand: "Tibbix",
    description:
      "B2B supplier of medical and laboratory consumables with reliable availability and compliance-first documentation.",
    url: "https://tibbitraders.com",
    contactEmail: "contact@tibbitraders.com",
    contactPhone: "7903431904",
    whatsapp: "917903431904",
    address: "Ranchi, Jharkhand, India",
    serviceArea: "Jharkhand and adjacent states",
    quoteEndpoint: "https://formspree.io/f/REPLACE_ME"
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function loadProducts() {
    return fetch("assets/data/products.json")
      .then((response) => response.json())
      .catch(() => []);
  }

  window.TIBBI_CONFIG = config;
  window.tibbi = {
    escapeHtml,
    slugify,
    getQueryParam,
    loadProducts
  };
})();

