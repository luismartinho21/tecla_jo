/**
 * Painel de Administração completo — Tecla - Informática
 */
(function () {
  const {
    loadSiteData,
    saveSiteData,
    resetSiteData,
    exportDataJs,
    exportDataJson,
    hashPassword,
    compressImageFile,
    escapeHtml,
    resolveAssetPath
  } = window.SiteStorage;

  const SESSION_KEY = "tecla_admin_auth_v1";
  let data = loadSiteData();
  let currentTab = "brand";
  let dirty = false;

  const TAB_TITLES = {
    brand: "Identidade, Cores & Legal",
    visibility: "Secções Ativas no Site",
    hero: "Início (Hero) & 3 Pilares",
    catalog: "Catálogo & Produtos",
    repairs: "Assistência Técnica & Reparações",
    business: "Empresas & Software (B2B)",
    gallery: "Galeria de Imagens",
    about: "Sobre Nós & Valores",
    team: "Equipa",
    testimonials: "Testemunhos de Clientes",
    news: "Novidades & Campanhas",
    contact: "Contactos, Horários & Mapa",
    publish: "Publicar, Backup & Segurança"
  };

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.add("hidden"), 3200);
  }

  function markDirty() {
    dirty = true;
    const st = document.getElementById("saveStatus");
    if (st) {
      st.textContent = "Alterações por guardar";
      st.className = "save-status dirty";
    }
  }

  function markSaved() {
    dirty = false;
    const st = document.getElementById("saveStatus");
    if (st) {
      st.textContent = "Guardado às " + new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
      st.className = "save-status saved";
    }
  }

  function getByPath(obj, path) {
    return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
  }

  function setByPath(obj, path, value) {
    const keys = path.split(".");
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = value;
  }

  function inputHtml(label, path, type = "text", placeholder = "") {
    const val = getByPath(data, path) ?? "";
    if (type === "textarea") {
      return `<label>${escapeHtml(label)}<textarea rows="3" data-path="${escapeHtml(path)}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(val)}</textarea></label>`;
    }
    return `<label>${escapeHtml(label)}<input type="${type}" data-path="${escapeHtml(path)}" value="${escapeHtml(val)}" placeholder="${escapeHtml(placeholder)}" /></label>`;
  }

  function imagePickerHtml(label, path) {
    const val = getByPath(data, path) ?? "";
    const preview = val ? resolveAssetPath(val, true) : "";
    return `
      <div class="img-field">
        <label>${escapeHtml(label)} (URL ou carregar ficheiro)
          <input type="text" data-path="${escapeHtml(path)}" value="${escapeHtml(val)}" placeholder="Ex: assets/prod-phone.svg ou https://..." />
        </label>
        <div class="img-preview-row">
          ${preview ? `<img class="img-thumb" src="${escapeHtml(preview)}" alt="Pré-visualização" />` : `<div class="img-thumb"></div>`}
          <label class="btn btn-outline btn-sm" style="flex-direction:row;cursor:pointer;">
            Carregar imagem
            <input type="file" accept="image/*" data-upload-path="${escapeHtml(path)}" style="display:none;" />
          </label>
          ${val ? `<button type="button" class="btn btn-danger btn-sm" data-clear-path="${escapeHtml(path)}">Remover</button>` : ""}
        </div>
      </div>`;
  }

  function arrayControlsHtml(arrPath, idx, total) {
    return `
      <div class="item-box-actions">
        <button type="button" class="btn btn-outline btn-sm" data-move="${arrPath}" data-idx="${idx}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="btn btn-outline btn-sm" data-move="${arrPath}" data-idx="${idx}" data-dir="1" ${idx === total - 1 ? "disabled" : ""}>↓</button>
        <button type="button" class="btn btn-danger btn-sm" data-del="${arrPath}" data-idx="${idx}">Eliminar</button>
      </div>`;
  }

  function renderTab() {
    const body = document.getElementById("panelBody");
    document.getElementById("panelTitle").textContent = TAB_TITLES[currentTab] || "Admin";
    document.querySelectorAll("#sidebarNav button").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-tab") === currentTab);
    });

    if (currentTab === "brand") {
      body.innerHTML = `
        <section class="card stack">
          <h3>Identidade da Marca</h3>
          <div class="grid-2">
            ${inputHtml("Nome Principal", "brand.name")}
            ${inputHtml("Submarca / Razão Social", "brand.subBrand")}
          </div>
          <div class="grid-2">
            ${inputHtml("Slogan / Título SEO", "brand.tagline")}
            ${inputHtml("Sigla (quando sem logótipo)", "brand.shortCode")}
          </div>
          ${imagePickerHtml("Logótipo Oficial (Cabeçalho e Rodapé)", "brand.logoUrl")}
          ${imagePickerHtml("Ícone / Favicon & Imagem de Perfil", "brand.iconUrl")}
          <div class="grid-2">
            ${inputHtml("Barra de Topo — Localização", "brand.topBarLocation")}
            ${inputHtml("Barra de Topo — Horário resumido", "brand.topBarHours")}
          </div>
        </section>

        <section class="card stack">
          <h3>Paleta de Cores</h3>
          <div class="grid-3">
            ${inputHtml("Cor Primária (Botões/Destaques)", "brand.primaryColor", "color")}
            ${inputHtml("Cor Secundária (Ciano/Accent)", "brand.accentColor", "color")}
            ${inputHtml("Cor Escura (Hero/Empresas/Footer)", "brand.darkColor", "color")}
          </div>
        </section>

        <section class="card stack">
          <h3>Redes Sociais &amp; WhatsApp</h3>
          <div class="grid-2">
            ${inputHtml("Facebook Principal (Tecla - Informática)", "brand.social.facebook", "url")}
            ${inputHtml("Facebook Empresas (Tecla JO / Precisa)", "brand.social.facebookBusiness", "url")}
            ${inputHtml("Instagram", "brand.social.instagram", "url")}
            ${inputHtml("Número WhatsApp (só dígitos com 351)", "brand.social.whatsapp", "text", "351253067976")}
          </div>
        </section>

        <section class="card stack">
          <h3>Rodapé &amp; Informação Legal (Portugal)</h3>
          ${inputHtml("Descrição do Rodapé", "brand.footerText", "textarea")}
          ${inputHtml("Texto de Copyright", "brand.copyright")}
          <div class="grid-2">
            ${inputHtml("Crédito / Autor (Texto do Link)", "brand.creditLabel")}
            ${inputHtml("Crédito / Autor (URL)", "brand.creditUrl", "url")}
          </div>
          ${inputHtml("Link Livro de Reclamações Eletrónico", "brand.legal.complaintsBookUrl", "url")}
          ${inputHtml("Texto Resolução Alternativa de Litígios (RAL)", "brand.legal.ralText", "textarea")}
          ${inputHtml("Texto Política de Privacidade (RGPD)", "brand.legal.privacyText", "textarea")}
        </section>
      `;
    } else if (currentTab === "visibility") {
      const labels = [
        ["hero", "Banner Principal (Hero)"],
        ["pillars", "Cartões de Acesso Rápido (3 Pilares)"],
        ["catalog", "Loja / Catálogo de Produtos"],
        ["repairs", "Assistência Técnica & Reparações"],
        ["business", "Empresas & Software (Tecla Precisa / XD)"],
        ["gallery", "Galeria de Imagens"],
        ["about", "Sobre Nós"],
        ["team", "Equipa"],
        ["testimonials", "Testemunhos"],
        ["news", "Novidades & Campanhas"],
        ["contact", "Contactos & Mapa"]
      ];
      body.innerHTML = `
        <section class="card stack">
          <h3>Ativar ou Ocultar Secções</h3>
          <p class="muted">Desative qualquer secção que não pretenda mostrar temporariamente no site público.</p>
          ${labels
            .map(
              ([k, label]) => `
            <div class="toggle-row">
              <span><strong>${escapeHtml(label)}</strong></span>
              <input type="checkbox" data-bool-path="sectionsVisible.${k}" ${data.sectionsVisible?.[k] !== false ? "checked" : ""} />
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "hero") {
      const stats = data.hero?.stats || [];
      const pillars = data.hero?.pillars || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Banner Principal (Hero)</h3>
          ${inputHtml("Etiqueta Superior (Badge)", "hero.badge")}
          ${inputHtml("Título Principal", "hero.title")}
          ${inputHtml("Subtítulo", "hero.subtitle", "textarea")}
          <div class="grid-2">
            ${inputHtml("Botão Primário — Texto", "hero.primaryCtaText")}
            ${inputHtml("Botão Primário — Link", "hero.primaryCtaLink")}
            ${inputHtml("Botão Secundário — Texto", "hero.secondaryCtaText")}
            ${inputHtml("Botão Secundário — Link", "hero.secondaryCtaLink")}
          </div>
          ${imagePickerHtml("Imagem de Fundo do Hero", "hero.imageUrl")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Destaques / Estatísticas do Hero</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="hero.stats">+ Adicionar</button>
          </div>
          ${stats
            .map(
              (_, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>Destaque #${i + 1}</strong>
                ${arrayControlsHtml("hero.stats", i, stats.length)}
              </div>
              <div class="grid-2">
                ${inputHtml("Valor / Título", `hero.stats.${i}.value`)}
                ${inputHtml("Legenda", `hero.stats.${i}.label`)}
              </div>
            </div>`
            )
            .join("")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Cartões de Acesso Rápido (Pilares)</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="hero.pillars">+ Adicionar Pilar</button>
          </div>
          ${pillars
            .map(
              (_, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>Pilar #${i + 1}</strong>
                ${arrayControlsHtml("hero.pillars", i, pillars.length)}
              </div>
              ${inputHtml("Título", `hero.pillars.${i}.title`)}
              ${inputHtml("Descrição", `hero.pillars.${i}.description`, "textarea")}
              <div class="grid-2">
                ${inputHtml("Texto do Link", `hero.pillars.${i}.linkText`)}
                ${inputHtml("Destino (ex: #catalogo)", `hero.pillars.${i}.linkHref`)}
              </div>
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "catalog") {
      const items = data.catalog?.items || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Cabeçalho do Catálogo</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "catalog.eyebrow")}
            ${inputHtml("Título", "catalog.title")}
          </div>
          ${inputHtml("Subtítulo", "catalog.subtitle")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Produtos (${items.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="catalog.items">+ Novo Produto</button>
          </div>
          ${items
            .map(
              (item, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(item.title || `Produto #${i + 1}`)}</strong>
                ${arrayControlsHtml("catalog.items", i, items.length)}
              </div>
              <div class="grid-3">
                ${inputHtml("Referência", `catalog.items.${i}.ref`)}
                ${inputHtml("Categoria", `catalog.items.${i}.category`)}
                ${inputHtml("Etiqueta / Estado", `catalog.items.${i}.badge`)}
              </div>
              <div class="grid-2">
                ${inputHtml("Nome do Produto", `catalog.items.${i}.title`)}
                ${inputHtml("Preço (ex: 399€)", `catalog.items.${i}.price`)}
              </div>
              ${inputHtml("Descrição", `catalog.items.${i}.description`, "textarea")}
              ${imagePickerHtml("Imagem do Produto", `catalog.items.${i}.imageUrl`)}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "repairs") {
      const items = data.repairs?.services || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Secção Assistência &amp; Reparações</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "repairs.eyebrow")}
            ${inputHtml("Título", "repairs.title")}
          </div>
          ${inputHtml("Subtítulo", "repairs.subtitle", "textarea")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Serviços de Reparação (${items.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="repairs.services">+ Novo Serviço</button>
          </div>
          ${items
            .map(
              (s, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(s.title || `Serviço #${i + 1}`)}</strong>
                ${arrayControlsHtml("repairs.services", i, items.length)}
              </div>
              <div class="grid-2">
                ${inputHtml("Título", `repairs.services.${i}.title`)}
                ${inputHtml("Prazo / Nota", `repairs.services.${i}.eta`)}
              </div>
              ${inputHtml("Descrição", `repairs.services.${i}.description`, "textarea")}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "business") {
      const items = data.business?.highlights || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Empresas &amp; Software (B2B)</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "business.eyebrow")}
            ${inputHtml("Título", "business.title")}
          </div>
          ${inputHtml("Subtítulo", "business.subtitle", "textarea")}
          <div class="grid-2">
            ${inputHtml("Botão CTA — Texto", "business.ctaText")}
            ${inputHtml("Botão CTA — Link", "business.ctaLink")}
          </div>
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Soluções Empresariais (${items.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="business.highlights">+ Nova Solução</button>
          </div>
          ${items
            .map(
              (h, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(h.title || `Solução #${i + 1}`)}</strong>
                ${arrayControlsHtml("business.highlights", i, items.length)}
              </div>
              ${inputHtml("Título", `business.highlights.${i}.title`)}
              ${inputHtml("Descrição", `business.highlights.${i}.description`, "textarea")}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "gallery") {
      const items = data.gallery?.items || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Cabeçalho da Galeria</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "gallery.eyebrow")}
            ${inputHtml("Título", "gallery.title")}
          </div>
          ${inputHtml("Subtítulo", "gallery.subtitle")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Fotografias (${items.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="gallery.items">+ Nova Foto</button>
          </div>
          ${items
            .map(
              (g, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(g.title || `Foto #${i + 1}`)}</strong>
                ${arrayControlsHtml("gallery.items", i, items.length)}
              </div>
              <div class="grid-2">
                ${inputHtml("Título / Legenda", `gallery.items.${i}.title`)}
                ${inputHtml("Categoria", `gallery.items.${i}.category`)}
              </div>
              ${imagePickerHtml("Imagem", `gallery.items.${i}.imageUrl`)}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "about") {
      const vals = data.about?.values || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Sobre Nós</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "about.eyebrow")}
            ${inputHtml("Título", "about.title")}
          </div>
          ${inputHtml("História / Descrição (use parágrafos separados por Enter)", "about.description", "textarea")}
          ${imagePickerHtml("Fotografia da Loja / Equipa", "about.imageUrl")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Valores / Diferenciais (${vals.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="about.values">+ Novo Valor</button>
          </div>
          ${vals
            .map(
              (v, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(v.title || `Valor #${i + 1}`)}</strong>
                ${arrayControlsHtml("about.values", i, vals.length)}
              </div>
              ${inputHtml("Título", `about.values.${i}.title`)}
              ${inputHtml("Descrição", `about.values.${i}.description`, "textarea")}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "team") {
      const members = data.team?.members || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Secção Equipa</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "team.eyebrow")}
            ${inputHtml("Título", "team.title")}
          </div>
          ${inputHtml("Subtítulo", "team.subtitle")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Membros (${members.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="team.members">+ Novo Membro</button>
          </div>
          ${members
            .map(
              (m, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(m.name || `Membro #${i + 1}`)}</strong>
                ${arrayControlsHtml("team.members", i, members.length)}
              </div>
              <div class="grid-2">
                ${inputHtml("Nome", `team.members.${i}.name`)}
                ${inputHtml("Cargo / Função", `team.members.${i}.role`)}
              </div>
              ${inputHtml("Breve Descrição", `team.members.${i}.bio`, "textarea")}
              ${imagePickerHtml("Fotografia", `team.members.${i}.photoUrl`)}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "testimonials") {
      const items = data.testimonials?.items || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Secção Testemunhos</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "testimonials.eyebrow")}
            ${inputHtml("Título", "testimonials.title")}
          </div>
          ${inputHtml("Subtítulo", "testimonials.subtitle")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Avaliações (${items.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="testimonials.items">+ Novo Testemunho</button>
          </div>
          ${items
            .map(
              (t, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(t.name || `Testemunho #${i + 1}`)}</strong>
                ${arrayControlsHtml("testimonials.items", i, items.length)}
              </div>
              <div class="grid-3">
                ${inputHtml("Nome do Cliente", `testimonials.items.${i}.name`)}
                ${inputHtml("Localidade / Tipo", `testimonials.items.${i}.location`)}
                ${inputHtml("Estrelas (1 a 5)", `testimonials.items.${i}.rating`, "number")}
              </div>
              ${inputHtml("Texto da Avaliação", `testimonials.items.${i}.text`, "textarea")}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "news") {
      const items = data.news?.items || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Secção Novidades</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "news.eyebrow")}
            ${inputHtml("Título", "news.title")}
          </div>
          ${inputHtml("Subtítulo", "news.subtitle")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Artigos &amp; Campanhas (${items.length})</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="news.items">+ Nova Publicação</button>
          </div>
          ${items
            .map(
              (n, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>${escapeHtml(n.title || `Artigo #${i + 1}`)}</strong>
                ${arrayControlsHtml("news.items", i, items.length)}
              </div>
              <div class="grid-3">
                ${inputHtml("Data", `news.items.${i}.date`, "date")}
                ${inputHtml("Etiqueta", `news.items.${i}.tag`)}
                ${inputHtml("Título", `news.items.${i}.title`)}
              </div>
              ${inputHtml("Resumo (cartão)", `news.items.${i}.summary`, "textarea")}
              ${inputHtml("Texto Completo (modal)", `news.items.${i}.content`, "textarea")}
              ${imagePickerHtml("Imagem", `news.items.${i}.imageUrl`)}
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "contact") {
      const hours = data.contact?.hours || [];
      body.innerHTML = `
        <section class="card stack">
          <h3>Dados de Contacto &amp; Mapa</h3>
          <div class="grid-2">
            ${inputHtml("Etiqueta", "contact.eyebrow")}
            ${inputHtml("Título", "contact.title")}
          </div>
          ${inputHtml("Subtítulo", "contact.subtitle")}
          ${inputHtml("Morada Completa", "contact.address")}
          <div class="grid-3">
            ${inputHtml("Telefone Fixo", "contact.phone")}
            ${inputHtml("Telemóvel / WhatsApp", "contact.mobile")}
            ${inputHtml("E-mail", "contact.email", "email")}
          </div>
          <div class="grid-2">
            ${inputHtml("Link Google Maps (Botão Como Chegar)", "contact.mapLinkUrl", "url")}
            <label>Destino do Formulário de Contacto
              <select data-path="contact.formDestination">
                <option value="whatsapp" ${data.contact?.formDestination === "whatsapp" ? "selected" : ""}>Abrir no WhatsApp</option>
                <option value="email" ${data.contact?.formDestination === "email" ? "selected" : ""}>Abrir no E-mail</option>
              </select>
            </label>
          </div>
          ${inputHtml("URL Embed do Mapa (iframe src)", "contact.mapEmbedUrl", "url")}
        </section>

        <section class="card stack">
          <div class="card-header">
            <h3>Horário de Funcionamento</h3>
            <button type="button" class="btn btn-primary btn-sm" data-add="contact.hours">+ Adicionar Linha</button>
          </div>
          ${hours
            .map(
              (_, i) => `
            <div class="item-box">
              <div class="item-box-head">
                <strong>Horário #${i + 1}</strong>
                ${arrayControlsHtml("contact.hours", i, hours.length)}
              </div>
              <div class="grid-2">
                ${inputHtml("Dias", `contact.hours.${i}.days`)}
                ${inputHtml("Horas", `contact.hours.${i}.time`)}
              </div>
            </div>`
            )
            .join("")}
        </section>`;
    } else if (currentTab === "publish") {
      body.innerHTML = `
        <div class="info-banner">
          <strong>Como publicar as alterações num site 100% estático:</strong><br/>
          Quando clica em <strong>Guardar Alterações</strong>, as mudanças ficam imediatamente ativas neste navegador para pré-visualização.
          Para que fiquem visíveis para <strong>todos os visitantes na internet</strong>, clique em <strong>Descarregar default-data.js</strong> e substitua o ficheiro <code>js/default-data.js</code> no seu alojamento.
        </div>

        <section class="card stack">
          <h3>Publicação &amp; Backup</h3>
          <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
            <button type="button" class="btn btn-primary" id="exportJsBtn">Descarregar default-data.js (Publicar)</button>
            <button type="button" class="btn btn-outline" id="exportJsonBtn">Exportar Backup (.json)</button>
            <label class="btn btn-outline" style="flex-direction:row;cursor:pointer;">
              Importar Backup (.json)
              <input type="file" accept="application/json,.json" id="importJsonInput" style="display:none;" />
            </label>
          </div>
        </section>

        <section class="card stack">
          <h3>Alterar Palavra-passe do Admin</h3>
          <div class="grid-2">
            <label>Nova Palavra-passe<input type="password" id="newPass1" placeholder="Mínimo 4 caracteres" /></label>
            <label>Confirmar Nova Palavra-passe<input type="password" id="newPass2" placeholder="Repetir palavra-passe" /></label>
          </div>
          <div>
            <button type="button" class="btn btn-outline" id="changePassBtn">Atualizar Palavra-passe</button>
          </div>
        </section>

        <section class="card stack">
          <h3>Repor Dados de Fábrica</h3>
          <p class="muted">Apaga as edições guardadas neste navegador e repõe os dados originais de <code>js/default-data.js</code>.</p>
          <div>
            <button type="button" class="btn btn-danger" id="resetBtn">Repor Dados Originais</button>
          </div>
        </section>`;
    }

    bindPanelEvents();
  }

  function newTemplateFor(arrPath) {
    const id = "id-" + Date.now().toString(36);
    switch (arrPath) {
      case "hero.stats":
        return { value: "Novo", label: "Descrição curta" };
      case "hero.pillars":
        return { icon: "", title: "Novo Pilar", description: "Descrição breve.", linkText: "Ver mais", linkHref: "#catalogo" };
      case "catalog.items":
        return { id, ref: "TEC-NEW-01", category: "Computadores & Portáteis", badge: "Novo", title: "Novo Produto", description: "Descrição do produto.", price: "Sob consulta", imageUrl: "assets/prod-laptop.svg" };
      case "repairs.services":
        return { id, icon: "", title: "Novo Serviço de Reparação", description: "Descrição do serviço.", eta: "Orçamento rápido" };
      case "business.highlights":
        return { id, icon: "", title: "Nova Solução B2B", description: "Descrição da solução empresarial." };
      case "gallery.items":
        return { id, title: "Nova Fotografia", category: "Loja", imageUrl: "assets/gallery-1.svg" };
      case "about.values":
        return { icon: "", title: "Novo Valor", description: "Descrição do valor." };
      case "team.members":
        return { id, name: "Novo Membro", role: "Função", bio: "Breve apresentação.", photoUrl: "assets/avatar-1.svg" };
      case "testimonials.items":
        return { id, name: "Nome do Cliente", location: "Póvoa de Lanhoso", rating: 5, text: "Excelente serviço!" };
      case "news.items":
        return { id, date: new Date().toISOString().slice(0, 10), tag: "Novidade", title: "Nova Publicação", summary: "Resumo breve.", content: "Texto completo da novidade.", imageUrl: "assets/gallery-1.svg" };
      case "contact.hours":
        return { days: "Dias", time: "09:00 – 19:00" };
      default:
        return {};
    }
  }

  function bindPanelEvents() {
    const body = document.getElementById("panelBody");

    body.querySelectorAll("[data-path]").forEach((el) => {
      const eventName = el.tagName === "SELECT" || el.type === "color" ? "change" : "input";
      el.addEventListener(eventName, () => {
        const val = el.type === "number" ? Number(el.value) : el.value;
        setByPath(data, el.getAttribute("data-path"), val);
        markDirty();
      });
    });

    body.querySelectorAll("[data-bool-path]").forEach((el) => {
      el.addEventListener("change", () => {
        setByPath(data, el.getAttribute("data-bool-path"), el.checked);
        markDirty();
      });
    });

    body.querySelectorAll("[data-upload-path]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const dataUrl = await compressImageFile(file);
          setByPath(data, input.getAttribute("data-upload-path"), dataUrl);
          markDirty();
          renderTab();
          showToast("Imagem carregada e otimizada!");
        } catch (err) {
          showToast(err.message || "Erro ao carregar imagem.");
        }
      });
    });

    body.querySelectorAll("[data-clear-path]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setByPath(data, btn.getAttribute("data-clear-path"), "");
        markDirty();
        renderTab();
      });
    });

    body.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const path = btn.getAttribute("data-add");
        let arr = getByPath(data, path);
        if (!Array.isArray(arr)) {
          arr = [];
          setByPath(data, path, arr);
        }
        arr.push(newTemplateFor(path));
        markDirty();
        renderTab();
      });
    });

    body.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const path = btn.getAttribute("data-del");
        const idx = Number(btn.getAttribute("data-idx"));
        const arr = getByPath(data, path);
        if (Array.isArray(arr)) {
          arr.splice(idx, 1);
          markDirty();
          renderTab();
        }
      });
    });

    body.querySelectorAll("[data-move]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const path = btn.getAttribute("data-move");
        const idx = Number(btn.getAttribute("data-idx"));
        const dir = Number(btn.getAttribute("data-dir"));
        const arr = getByPath(data, path);
        const target = idx + dir;
        if (Array.isArray(arr) && target >= 0 && target < arr.length) {
          [arr[idx], arr[target]] = [arr[target], arr[idx]];
          markDirty();
          renderTab();
        }
      });
    });

    // Publish tab buttons
    const exportJsBtn = document.getElementById("exportJsBtn");
    if (exportJsBtn) {
      exportJsBtn.addEventListener("click", () => {
        data = saveSiteData(data);
        markSaved();
        exportDataJs(data);
        showToast("Ficheiro default-data.js descarregado!");
      });
    }

    const exportJsonBtn = document.getElementById("exportJsonBtn");
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener("click", () => {
        exportDataJson(data);
        showToast("Backup JSON descarregado!");
      });
    }

    const importJsonInput = document.getElementById("importJsonInput");
    if (importJsonInput) {
      importJsonInput.addEventListener("change", () => {
        const file = importJsonInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result));
            data = saveSiteData(parsed);
            markSaved();
            renderTab();
            showToast("Backup importado e guardado com sucesso!");
          } catch {
            showToast("Ficheiro JSON inválido.");
          }
        };
        reader.readAsText(file);
      });
    }

    const changePassBtn = document.getElementById("changePassBtn");
    if (changePassBtn) {
      changePassBtn.addEventListener("click", async () => {
        const p1 = document.getElementById("newPass1").value;
        const p2 = document.getElementById("newPass2").value;
        if (p1.length < 4) return showToast("Use pelo menos 4 caracteres.");
        if (p1 !== p2) return showToast("As palavras-passe não coincidem.");
        data.admin = data.admin || {};
        data.admin.passwordHash = await hashPassword(p1);
        data = saveSiteData(data);
        markSaved();
        document.getElementById("newPass1").value = "";
        document.getElementById("newPass2").value = "";
        showToast("Palavra-passe atualizada! Exporte default-data.js para publicar.");
      });
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (!confirm("Tem a certeza que pretende repor os dados originais?")) return;
        data = resetSiteData();
        markSaved();
        renderTab();
        showToast("Dados originais repostos.");
      });
    }
  }

  function showAdminApp() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("adminApp").classList.remove("hidden");
    renderTab();
  }

  function initAuth() {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      showAdminApp();
    }

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pass = document.getElementById("loginPassword").value;
      const hash = await hashPassword(pass);
      const expected = data.admin?.passwordHash || (await hashPassword("admin123"));
      const fallbackDefault = pass === "admin123" && expected === "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";
      if (hash === expected || fallbackDefault) {
        sessionStorage.setItem(SESSION_KEY, "1");
        document.getElementById("loginError").classList.add("hidden");
        showAdminApp();
      } else {
        document.getElementById("loginError").classList.remove("hidden");
      }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.reload();
    });
  }

  function initNavigation() {
    document.querySelectorAll("#sidebarNav button").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTab = btn.getAttribute("data-tab");
        document.getElementById("sidebar").classList.remove("open");
        renderTab();
      });
    });

    document.getElementById("sidebarToggle").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });

    document.getElementById("saveBtn").addEventListener("click", () => {
      try {
        data = saveSiteData(data);
        markSaved();
        showToast("Alterações guardadas! Atualize o site público para ver.");
      } catch (err) {
        showToast("Erro ao guardar (limite de armazenamento atingido). Use imagens mais pequenas ou URLs.");
      }
    });

    window.addEventListener("beforeunload", (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
  }

  initAuth();
  initNavigation();
})();
