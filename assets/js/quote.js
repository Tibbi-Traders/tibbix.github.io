(function () {
  const form = document.getElementById("quote-form");
  const summary = document.getElementById("quote-summary");
  const status = document.getElementById("quote-status");
  if (!form) return;

  const endpoint = window.TIBBI_CONFIG.quoteEndpoint;
  if (endpoint && endpoint.indexOf("REPLACE_ME") === -1) {
    form.setAttribute("action", endpoint);
  }

  function renderSummary() {
    const items = window.tibbiStore.getCart();
    if (items.length === 0) {
      summary.innerHTML = '<div class="notice">Your cart is empty. Add products before requesting a quote.</div>';
      return;
    }

    summary.innerHTML = items
      .map(
        (item) => `
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <span>${window.tibbi.escapeHtml(item.name)} x ${item.quantity}</span>
            <span class="muted">${window.tibbi.escapeHtml(item.packSize)}</span>
          </div>
        `
      )
      .join("");

    const cartField = document.getElementById("cart-items");
    if (cartField) {
      cartField.value = JSON.stringify(items);
    }
  }

  function showStatus(message, tone) {
    status.textContent = message;
    status.style.color = tone === "error" ? "#b91c1c" : "#0f766e";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = window.tibbiStore.getCart();
    if (items.length === 0) {
      showStatus("Cart is empty. Add products before submitting.", "error");
      return;
    }

    const formData = new FormData(form);
    const hasEndpoint = endpoint && endpoint.indexOf("REPLACE_ME") === -1;

    if (!hasEndpoint) {
      const subject = encodeURIComponent("Quote request - Tibbi Traders");
      const body = encodeURIComponent(
        `Name: ${formData.get("customerName")}\nEmail: ${formData.get("customerEmail")}\nPhone: ${formData.get("customerPhone")}\nCompany: ${formData.get("companyName")}\n\nItems:\n${items
          .map((item) => `${item.name} (${item.id}) x ${item.quantity}`)
          .join("\n")}\n\nNotes:\n${formData.get("notes") || ""}`
      );
      window.location.href = `mailto:${window.TIBBI_CONFIG.contactEmail}?subject=${subject}&body=${body}`;
      return;
    }

    fetch(form.getAttribute("action"), {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok || data.success) {
          showStatus("Request received. We will respond within 24 hours.", "success");
          window.tibbiStore.clearCart();
          form.reset();
          renderSummary();
        } else {
          showStatus("Submission failed. Please try again.", "error");
        }
      })
      .catch(() => {
        showStatus("Submission failed. Please try again.", "error");
      });
  });

  renderSummary();
})();

