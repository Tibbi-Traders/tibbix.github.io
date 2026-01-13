(function () {
  const form = document.getElementById("quote-form");
  const summary = document.getElementById("quote-summary");
  const status = document.getElementById("quote-status");
  if (!form) return;

  const config = window.TIBBI_CONFIG || {};
  const endpoint =
    typeof config.quoteEndpoint === "string" ? config.quoteEndpoint : "";
  const contactEmail =
    typeof config.contactEmail === "string" ? config.contactEmail : "";
  const hasEndpoint = endpoint && endpoint.indexOf("REPLACE_ME") === -1;
  const useAjax = endpoint.indexOf("formspree.io") !== -1;
  if (hasEndpoint) {
    form.setAttribute("action", endpoint);
  }

  function renderSummary() {
    if (!summary) return;
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
    if (!status) return;
    status.textContent = message;
    status.style.color = tone === "error" ? "#b91c1c" : "#0f766e";
  }

  form.addEventListener("submit", (event) => {
    const items = window.tibbiStore.getCart();
    if (items.length === 0) {
      event.preventDefault();
      showStatus("Cart is empty. Add products before submitting.", "error");
      return;
    }

    const cartField = document.getElementById("cart-items");
    if (cartField) {
      cartField.value = JSON.stringify(items);
    }

    if (!hasEndpoint) {
      event.preventDefault();
      if (!contactEmail) {
        showStatus("Quote submission is not configured yet. Add a form endpoint or contact email.", "error");
        return;
      }
      const formData = new FormData(form);
      const subject = encodeURIComponent("Quote request - Tibbi Traders");
      const body = encodeURIComponent(
        `Name: ${formData.get("customerName")}\nEmail: ${formData.get("customerEmail")}\nPhone: ${formData.get("customerPhone")}\nCompany: ${formData.get("companyName")}\n\nItems:\n${items
          .map((item) => `${item.name} (${item.id}) x ${item.quantity}`)
          .join("\n")}\n\nNotes:\n${formData.get("notes") || ""}`
      );
      showStatus("Opening your email client for the quote request...", "success");
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      return;
    }

    if (!useAjax) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(form);
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

