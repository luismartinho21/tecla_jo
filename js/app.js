/**
 * Renderização dinâmica do site público Tecla - Informática
 */
(function () {
  const { loadSiteData, applyThemeColors, escapeHtml, formatDatePt, resolveAssetPath } = window.SiteStorage;

  const data = loadSiteData();
  applyThemeColors(data.brand);

  const state = {
    catalogCategory: "Todos",
    catalogSearch: ""
  };

  function cleanPhoneForWa(raw) {
    return String(raw || "").replace(/\D/g, "");
  }

  function buildWhatsAppUrl(message) {
    const num = cleanPhoneForWa(data.brand?.social?.whatsapp || data.contact?.mobile || data.contact?.phone);
    if (!num) return "#contactos";
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${num}${text}`;
  }

  function buildMailtoUrl(subject, body) {
    const email = data.contact?.email || "geral@tecla-precisa.pt";
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || "";
  }

  function toggleSectionVisibility() {
    const vis = data.sectionsVisible || {};
    document.querySelectorAll("[data-section]").forEach((sec) => {
      const key = sec.getAttribute("data-section");
      sec.classList.toggle("hidden", vis[key] === false);
    });
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const key = link.getAttribute("data-nav");
      link.classList.toggle("hidden", vis[key] === false);
    });
  }

  function renderBrandAndChrome() {
    const b = data.brand || {};
    document.title = `${b.name || "Tecla - Informática"} | ${b.tagline || "Póvoa de Lanhoso"}`;

    setText("topBarLocation", `📍 ${b.topBarLocation || data.contact?.address || ""}`);
    setText("topBarHours", `🕒 ${b.topBarHours || ""}`);

    const phone = data.contact?.phone || "";
    const topPhone = document.getElementById("topBarPhone");
    if (topPhone && phone) {
      topPhone.textContent = `📞 ${phone}`;
      topPhone.href = `tel:${phone.replace(/\s+/g, "")}`;
    }

    const waUrl = buildWhatsAppUrl(`Olá ${b.name || "Tecla"}, gostaria de obter mais informações.`);
    const topWa = document.getElementById("topBarWhatsapp");
    if (topWa) topWa.href = waUrl;

    setText("brandName", b.name);
    setText("brandSub", b.subBrand || b.tagline);

    const mark = document.getElementById("brandMark");
    const logo = document.getElementById("brandLogo");
    if (b.logoUrl) {
      logo.src = resolveAssetPath(b.logoUrl, false);
      logo.classList.remove("hidden");
      mark.classList.add("hidden");
    } else {
      mark.textContent = b.shortCode || "TI";
      mark.classList.remove("hidden");
      logo.classList.add("hidden");
    }

    const favicon = document.getElementById("siteFavicon");
    if (favicon && (b.iconUrl || b.logoUrl)) {
      favicon.href = resolveAssetPath(b.iconUrl || b.logoUrl, false);
    }

    const footerLogo = document.getElementById("footerLogo");
    if (footerLogo) {
      if (b.logoUrl) {
        footerLogo.src = resolveAssetPath(b.logoUrl, false);
        footerLogo.classList.remove("hidden");
      } else {
        footerLogo.classList.add("hidden");
      }
    }

    // Footer
    setText("footerBrandName", b.name);
    setText("footerText", b.footerText);
    setText("footerCopyright", b.copyright);
    const compLink = document.getElementById("footerComplaintsLink");
    if (compLink && b.legal?.complaintsBookUrl) compLink.href = b.legal.complaintsBookUrl;

    // Mobile bottom bar + Floating WhatsApp
    const mobCall = document.getElementById("mobCall");
    if (mobCall && phone) mobCall.href = `tel:${phone.replace(/\s+/g, "")}`;
    const mobWa = document.getElementById("mobWhatsapp");
    if (mobWa) mobWa.href = waUrl;
    const mobMaps = document.getElementById("mobMaps");
    if (mobMaps) mobMaps.href = data.contact?.mapLinkUrl || "#contactos";

    const floatWa = document.getElementById("floatingWhatsapp");
    if (floatWa && cleanPhoneForWa(b.social?.whatsapp || data.contact?.mobile)) {
      floatWa.href = waUrl;
      floatWa.classList.remove("hidden");
    }
  }

  function renderHeroAndPillars() {
    const h = data.hero || {};
    const bg = document.getElementById("heroBg");
    if (bg && h.imageUrl) {
      bg.style.backgroundImage = `url("${resolveAssetPath(h.imageUrl, false)}")`;
    }
    setText("heroBadge", h.badge);
    setText("heroTitle", h.title);
    setText("heroSubtitle", h.subtitle);

    const pCta = document.getElementById("heroPrimaryCta");
    if (pCta) {
      pCta.textContent = h.primaryCtaText || "Ver Equipamentos";
      pCta.href = h.primaryCtaLink || "#catalogo";
    }
    const sCta = document.getElementById("heroSecondaryCta");
    if (sCta) {
      sCta.textContent = h.secondaryCtaText || "Marcar Reparação";
      sCta.href = h.secondaryCtaLink || "#reparacoes";
    }

    const statsEl = document.getElementById("heroStats");
    if (statsEl) {
      statsEl.innerHTML = (h.stats || [])
        .map((s) => `<div class="stat-item"><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}</span></div>`)
        .join("");
    }

    const pillarsEl = document.getElementById("pillarsGrid");
    if (pillarsEl) {
      pillarsEl.innerHTML = (h.pillars || [])
        .map(
          (p) => `
          <article class="pillar-card">
            <div class="pillar-icon">${escapeHtml(p.icon || "💻")}</div>
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.description)}</p>
            <a class="pillar-link" href="${escapeHtml(p.linkHref || "#catalogo")}">${escapeHtml(p.linkText || "Saber mais")} →</a>
          </article>`
        )
        .join("");
    }
  }

  function renderCatalog() {
    const cat = data.catalog || {};
    setText("catalogEyebrow", cat.eyebrow);
    setText("catalogTitle", cat.title);
    setText("catalogSubtitle", cat.subtitle);

    const items = cat.items || [];
    const categories = ["Todos", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

    const filtersEl = document.getElementById("catalogFilters");
    if (filtersEl) {
      filtersEl.innerHTML = categories
        .map(
          (c) => `<button type="button" class="pill ${state.catalogCategory === c ? "active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`
        )
        .join("");

      filtersEl.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.catalogCategory = btn.getAttribute("data-cat");
          renderCatalog();
        });
      });
    }

    const q = state.catalogSearch.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const catMatch = state.catalogCategory === "Todos" || item.category === state.catalogCategory;
      const textMatch =
        !q ||
        `${item.title} ${item.description} ${item.category} ${item.ref} ${item.badge}`.toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    const gridEl = document.getElementById("catalogGrid");
    if (!gridEl) return;

    if (!filtered.length) {
      gridEl.innerHTML = `<div class="empty-state">Nenhum produto encontrado para a sua pesquisa. Experimente outra categoria ou contacte-nos diretamente.</div>`;
      return;
    }

    gridEl.innerHTML = filtered
      .map((item) => {
        const msg = `Olá ${data.brand?.name || "Tecla"}! Tenho interesse em reservar/encomendar o artigo "${item.title}" (Ref: ${item.ref || "N/A"})${item.price ? ` - ${item.price}` : ""}.`;
        const waHref = buildWhatsAppUrl(msg);
        return `
        <article class="product-card">
          <div class="product-media">
            <img src="${escapeHtml(resolveAssetPath(item.imageUrl || "assets/prod-laptop.svg", false))}" alt="${escapeHtml(item.title)}" loading="lazy" />
            ${item.badge ? `<span class="product-badge">${escapeHtml(item.badge)}</span>` : ""}
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${escapeHtml(item.category || "")}</span>
              <span>${item.ref ? `Ref: ${escapeHtml(item.ref)}` : ""}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <div class="product-footer">
              <span class="product-price">${escapeHtml(item.price || "Sob consulta")}</span>
              <a href="${waHref}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Reservar / WhatsApp</a>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderRepairs() {
    const r = data.repairs || {};
    setText("repairsEyebrow", r.eyebrow);
    setText("repairsTitle", r.title);
    setText("repairsSubtitle", r.subtitle);

    const gridEl = document.getElementById("repairsGrid");
    if (gridEl) {
      gridEl.innerHTML = (r.services || [])
        .map(
          (s) => `
          <article class="repair-card">
            <div class="repair-icon">${escapeHtml(s.icon || "🛠️")}</div>
            <h3>${escapeHtml(s.title)}</h3>
            <p>${escapeHtml(s.description)}</p>
            ${s.eta ? `<span class="repair-eta">${escapeHtml(s.eta)}</span>` : ""}
          </article>`
        )
        .join("");
    }
  }

  function renderBusiness() {
    const b = data.business || {};
    setText("businessEyebrow", b.eyebrow);
    setText("businessTitle", b.title);
    setText("businessSubtitle", b.subtitle);

    const cta = document.getElementById("businessCta");
    if (cta) {
      cta.textContent = b.ctaText || "Agendar Demonstração Gratuita";
      cta.href = b.ctaLink || "#contactos";
    }

    const gridEl = document.getElementById("businessGrid");
    if (gridEl) {
      gridEl.innerHTML = (b.highlights || [])
        .map(
          (h) => `
          <article class="business-card">
            <div class="b-icon">${escapeHtml(h.icon || "💼")}</div>
            <h3>${escapeHtml(h.title)}</h3>
            <p>${escapeHtml(h.description)}</p>
          </article>`
        )
        .join("");
    }
  }

  function renderGallery() {
    const g = data.gallery || {};
    setText("galleryEyebrow", g.eyebrow);
    setText("galleryTitle", g.title);
    setText("gallerySubtitle", g.subtitle);

    const gridEl = document.getElementById("galleryGrid");
    if (!gridEl) return;

    gridEl.innerHTML = (g.items || [])
      .map(
        (item, idx) => `
        <figure class="gallery-item" data-gal-idx="${idx}" style="margin:0;">
          <img src="${escapeHtml(resolveAssetPath(item.imageUrl, false))}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <figcaption class="gallery-caption">
            <small>${escapeHtml(item.category || "")}</small>
            <strong>${escapeHtml(item.title)}</strong>
          </figcaption>
        </figure>`
      )
      .join("");

    gridEl.querySelectorAll(".gallery-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = Number(el.getAttribute("data-gal-idx"));
        const item = (g.items || [])[idx];
        if (!item) return;
        openModal(`
          <img src="${escapeHtml(resolveAssetPath(item.imageUrl, false))}" alt="${escapeHtml(item.title)}" style="width:100%;border-radius:12px;margin-bottom:1rem;" />
          <span class="eyebrow">${escapeHtml(item.category || "")}</span>
          <h3>${escapeHtml(item.title)}</h3>
        `);
      });
    });
  }

  function renderAbout() {
    const a = data.about || {};
    setText("aboutEyebrow", a.eyebrow);
    setText("aboutTitle", a.title);

    const img = document.getElementById("aboutImage");
    if (img && a.imageUrl) img.src = resolveAssetPath(a.imageUrl, false);

    const descEl = document.getElementById("aboutDescription");
    if (descEl) {
      descEl.innerHTML = String(a.description || "")
        .split(/\n+/)
        .filter(Boolean)
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");
    }

    const valsEl = document.getElementById("aboutValues");
    if (valsEl) {
      valsEl.innerHTML = (a.values || [])
        .map(
          (v) => `
          <div class="value-card">
            <span>${escapeHtml(v.icon || "✅")}</span>
            <h4>${escapeHtml(v.title)}</h4>
            <p>${escapeHtml(v.description)}</p>
          </div>`
        )
        .join("");
    }
  }

  function renderTeam() {
    const t = data.team || {};
    setText("teamEyebrow", t.eyebrow);
    setText("teamTitle", t.title);
    setText("teamSubtitle", t.subtitle);

    const gridEl = document.getElementById("teamGrid");
    if (!gridEl) return;

    gridEl.innerHTML = (t.members || [])
      .map(
        (m) => `
        <article class="team-card">
          <img src="${escapeHtml(resolveAssetPath(m.photoUrl || "assets/avatar-1.svg", false))}" alt="${escapeHtml(m.name)}" loading="lazy" />
          <h3>${escapeHtml(m.name)}</h3>
          <span class="team-role">${escapeHtml(m.role)}</span>
          <p>${escapeHtml(m.bio)}</p>
        </article>`
      )
      .join("");
  }

  function renderTestimonials() {
    const t = data.testimonials || {};
    setText("testimonialsEyebrow", t.eyebrow);
    setText("testimonialsTitle", t.title);
    setText("testimonialsSubtitle", t.subtitle);

    const gridEl = document.getElementById("testimonialsGrid");
    if (!gridEl) return;

    gridEl.innerHTML = (t.items || [])
      .map((item) => {
        const stars = "★".repeat(Math.max(1, Math.min(5, Number(item.rating) || 5)));
        return `
        <article class="testimonial-card">
          <div class="stars" aria-label="${item.rating} estrelas">${stars}</div>
          <blockquote>“${escapeHtml(item.text)}”</blockquote>
          <div class="testimonial-author">
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(item.location || "")}</small>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderNews() {
    const n = data.news || {};
    setText("newsEyebrow", n.eyebrow);
    setText("newsTitle", n.title);
    setText("newsSubtitle", n.subtitle);

    const gridEl = document.getElementById("newsGrid");
    if (!gridEl) return;

    gridEl.innerHTML = (n.items || [])
      .map(
        (item, idx) => `
        <article class="news-card">
          ${item.imageUrl ? `<img src="${escapeHtml(resolveAssetPath(item.imageUrl, false))}" alt="${escapeHtml(item.title)}" loading="lazy" />` : ""}
          <div class="news-body">
            <div class="news-meta">
              <span class="news-tag">${escapeHtml(item.tag || "Novidade")}</span>
              <span>${escapeHtml(formatDatePt(item.date))}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <button type="button" class="news-read-btn" data-news-idx="${idx}">Ler mais →</button>
          </div>
        </article>`
      )
      .join("");

    gridEl.querySelectorAll(".news-read-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = (n.items || [])[Number(btn.getAttribute("data-news-idx"))];
        if (!item) return;
        const paragraphs = String(item.content || item.summary || "")
          .split(/\n+/)
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("");
        openModal(`
          ${item.imageUrl ? `<img src="${escapeHtml(resolveAssetPath(item.imageUrl, false))}" alt="${escapeHtml(item.title)}" style="width:100%;border-radius:12px;margin-bottom:1rem;max-height:280px;object-fit:cover;" />` : ""}
          <span class="eyebrow">${escapeHtml(item.tag || "Novidade")} · ${escapeHtml(formatDatePt(item.date))}</span>
          <h2 style="margin-bottom:1rem;">${escapeHtml(item.title)}</h2>
          <div style="color:var(--text-muted);">${paragraphs}</div>
        `);
      });
    });
  }

  function renderContact() {
    const c = data.contact || {};
    const social = data.brand?.social || {};

    setText("contactEyebrow", c.eyebrow);
    setText("contactTitle", c.title);
    setText("contactSubtitle", c.subtitle);

    const listEl = document.getElementById("contactList");
    if (listEl) {
      const rows = [
        { icon: "📍", label: "Morada", html: `<strong>${escapeHtml(c.address || "")}</strong>` },
        {
          icon: "📞",
          label: "Telefone",
          html: c.phone ? `<a href="tel:${escapeHtml(c.phone.replace(/\s+/g, ""))}">${escapeHtml(c.phone)}</a>` : ""
        },
        {
          icon: "✉️",
          label: "E-mail",
          html: c.email ? `<a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a>` : ""
        }
      ].filter((r) => r.html);

      listEl.innerHTML = rows
        .map((r) => `<div class="contact-row"><span>${r.icon}</span><div><small>${r.label}</small>${r.html}</div></div>`)
        .join("");
    }

    const hoursEl = document.getElementById("contactHours");
    if (hoursEl) {
      hoursEl.innerHTML = (c.hours || [])
        .map((h) => `<li><span>${escapeHtml(h.days)}</span><strong>${escapeHtml(h.time)}</strong></li>`)
        .join("");
    }

    const socialEl = document.getElementById("contactSocials");
    if (socialEl) {
      const chips = [];
      if (social.facebook) chips.push(`<a class="social-chip" href="${escapeHtml(social.facebook)}" target="_blank" rel="noopener">📘 Facebook (Tecla)</a>`);
      if (social.facebookBusiness) chips.push(`<a class="social-chip" href="${escapeHtml(social.facebookBusiness)}" target="_blank" rel="noopener">🏢 Facebook (Tecla JO)</a>`);
      if (social.instagram) chips.push(`<a class="social-chip" href="${escapeHtml(social.instagram)}" target="_blank" rel="noopener">📸 Instagram</a>`);
      if (social.whatsapp) chips.push(`<a class="social-chip" href="${buildWhatsAppUrl("Olá Tecla - Informática!")}" target="_blank" rel="noopener">💬 WhatsApp</a>`);
      socialEl.innerHTML = chips.join("");
    }

    const mapBtn = document.getElementById("contactMapBtn");
    if (mapBtn && c.mapLinkUrl) mapBtn.href = c.mapLinkUrl;

    const mapWrap = document.getElementById("mapWrap");
    if (mapWrap) {
      if (c.mapEmbedUrl) {
        mapWrap.innerHTML = `<iframe title="Localização Tecla - Informática" src="${escapeHtml(c.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
      } else {
        mapWrap.innerHTML = "";
      }
    }
  }

  function openModal(html) {
    const modal = document.getElementById("appModal");
    const body = document.getElementById("modalBody");
    if (!modal || !body) return;
    body.innerHTML = html;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    const modal = document.getElementById("appModal");
    if (modal) modal.classList.add("hidden");
  }

  function bindEvents() {
    // Menu mobile
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => nav.classList.remove("open"));
      });
    }

    // Pesquisa catálogo
    const searchInput = document.getElementById("catalogSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.catalogSearch = e.target.value;
        renderCatalog();
      });
    }

    // Formulário de Orçamento de Reparação
    const repairForm = document.getElementById("repairForm");
    const repairEmailBtn = document.getElementById("repairEmailBtn");

    function getRepairMessage() {
      const fd = new FormData(repairForm);
      return (
        `Pedido de Orçamento de Reparação (${data.brand?.name || "Tecla - Informática"})\n` +
        `• Equipamento: ${fd.get("deviceType")}\n` +
        `• Marca/Modelo: ${fd.get("model")}\n` +
        `• Avaria: ${fd.get("issue")}\n` +
        `• Nome: ${fd.get("name")}\n` +
        `• Contacto: ${fd.get("contact")}`
      );
    }

    if (repairForm) {
      repairForm.addEventListener("submit", (e) => {
        e.preventDefault();
        window.open(buildWhatsAppUrl(getRepairMessage()), "_blank", "noopener");
      });
    }
    if (repairEmailBtn && repairForm) {
      repairEmailBtn.addEventListener("click", () => {
        if (!repairForm.reportValidity()) return;
        const fd = new FormData(repairForm);
        window.location.href = buildMailtoUrl(
          `Orçamento Reparação: ${fd.get("deviceType")} ${fd.get("model")}`,
          getRepairMessage()
        );
      });
    }

    // Formulário geral de contactos
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(contactForm);
        const msg =
          `Contacto via site (${data.brand?.name || "Tecla"})\n` +
          `• Nome: ${fd.get("name")}\n` +
          `• Contacto: ${fd.get("replyTo")}\n` +
          `• Assunto: ${fd.get("subject")}\n` +
          `• Mensagem: ${fd.get("message")}`;
        if (data.contact?.formDestination === "email") {
          window.location.href = buildMailtoUrl(String(fd.get("subject") || "Contacto Site"), msg);
        } else {
          window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
        }
      });
    }

    // Modais legais
    const privBtn = document.getElementById("openPrivacyBtn");
    if (privBtn) {
      privBtn.addEventListener("click", () => {
        openModal(`
          <span class="eyebrow">RGPD &amp; Privacidade</span>
          <h2>Política de Privacidade</h2>
          <p style="color:var(--text-muted);">${escapeHtml(data.brand?.legal?.privacyText || "")}</p>
        `);
      });
    }
    const ralBtn = document.getElementById("openRalBtn");
    if (ralBtn) {
      ralBtn.addEventListener("click", () => {
        openModal(`
          <span class="eyebrow">Informação ao Consumidor</span>
          <h2>Resolução Alternativa de Litígios (RAL)</h2>
          <p style="color:var(--text-muted);">${escapeHtml(data.brand?.legal?.ralText || "")}</p>
        `);
      });
    }

    // Fechar modal
    const modal = document.getElementById("appModal");
    const closeBtn = document.getElementById("modalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  toggleSectionVisibility();
  renderBrandAndChrome();
  renderHeroAndPillars();
  renderCatalog();
  renderRepairs();
  renderBusiness();
  renderGallery();
  renderAbout();
  renderTeam();
  renderTestimonials();
  renderNews();
  renderContact();
  bindEvents();
})();
