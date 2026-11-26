/**
 * Gestão de dados (localStorage + DEFAULT_SITE_DATA + Exportar/Importar)
 */
(function (global) {
  const STORAGE_KEY = "tecla_informatica_site_data_v1";

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function mergeDefaults(defaults, saved) {
    if (!saved || typeof saved !== "object") return deepClone(defaults);
    const out = deepClone(defaults);
    for (const key of Object.keys(saved)) {
      if (
        saved[key] &&
        typeof saved[key] === "object" &&
        !Array.isArray(saved[key]) &&
        out[key] &&
        typeof out[key] === "object" &&
        !Array.isArray(out[key])
      ) {
        out[key] = mergeDefaults(out[key], saved[key]);
      } else {
        out[key] = deepClone(saved[key]);
      }
    }
    return out;
  }

  function loadSiteData() {
    const defaults = global.DEFAULT_SITE_DATA || {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(defaults);
      const parsed = JSON.parse(raw);
      return mergeDefaults(defaults, parsed);
    } catch (err) {
      console.warn("Falha ao ler localStorage, a usar dados padrão:", err);
      return deepClone(defaults);
    }
  }

  function saveSiteData(data) {
    const payload = deepClone(data);
    payload.meta = payload.meta || {};
    payload.meta.version = 1;
    payload.meta.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  function resetSiteData() {
    localStorage.removeItem(STORAGE_KEY);
    return deepClone(global.DEFAULT_SITE_DATA || {});
  }

  function hasLocalEdits() {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  }

  function hexToRgb(hex) {
    const clean = (hex || "").replace("#", "").trim();
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    if (clean.length === 6) {
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    return "31, 92, 71";
  }

  function darkenHex(hex, amount) {
    const clean = (hex || "#1f5c47").replace("#", "");
    if (clean.length !== 6) return hex;
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const r = clamp(parseInt(clean.slice(0, 2), 16) * (1 - amount));
    const g = clamp(parseInt(clean.slice(2, 4), 16) * (1 - amount));
    const b = clamp(parseInt(clean.slice(4, 6), 16) * (1 - amount));
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  function applyThemeColors(brand) {
    if (!brand) return;
    const root = document.documentElement;
    if (brand.primaryColor) {
      root.style.setProperty("--primary", brand.primaryColor);
      root.style.setProperty("--primary-dark", darkenHex(brand.primaryColor, 0.18));
      root.style.setProperty("--primary-rgb", hexToRgb(brand.primaryColor));
    }
    if (brand.accentColor) {
      root.style.setProperty("--accent", brand.accentColor);
      root.style.setProperty("--accent-rgb", hexToRgb(brand.accentColor));
    }
    if (brand.backgroundColor) {
      root.style.setProperty("--bg", brand.backgroundColor);
    }
    if (brand.darkColor) {
      root.style.setProperty("--dark", brand.darkColor);
    }
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportDataJs(data) {
    const header =
      "/**\n" +
      " * Dados publicados do site (gerado automaticamente pelo painel /admin).\n" +
      " * Substitua o ficheiro js/default-data.js por este ficheiro.\n" +
      " */\n";
    const body = "window.DEFAULT_SITE_DATA = " + JSON.stringify(data, null, 2) + ";\n";
    downloadFile("default-data.js", header + body, "application/javascript;charset=utf-8");
  }

  function exportDataJson(data) {
    downloadFile(
      "site-backup-" + new Date().toISOString().slice(0, 10) + ".json",
      JSON.stringify(data, null, 2),
      "application/json;charset=utf-8"
    );
  }

  async function hashPassword(plainText) {
    if (global.crypto && global.crypto.subtle) {
      const enc = new TextEncoder().encode(plainText);
      const buf = await global.crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    // Fallback simples para contextos sem WebCrypto (ex: HTTP não-localhost antigo)
    let hash = 5381;
    for (let i = 0; i < plainText.length; i++) {
      hash = (hash * 33) ^ plainText.charCodeAt(i);
    }
    return "fallback_" + (hash >>> 0).toString(16);
  }

  function compressImageFile(file, maxWidth = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error("Selecione um ficheiro de imagem válido."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Erro ao ler a imagem."));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error("Não foi possível processar a imagem."));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(mime, quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDatePt(isoDate) {
    if (!isoDate) return "";
    const parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    const months = [
      "jan", "fev", "mar", "abr", "mai", "jun",
      "jul", "ago", "set", "out", "nov", "dez"
    ];
    const m = parseInt(parts[1], 10) - 1;
    return `${parseInt(parts[2], 10)} ${months[m] || parts[1]} ${parts[0]}`;
  }

  function resolveAssetPath(url, isAdmin) {
    if (!url) return "";
    if (/^(https?:|data:|blob:|\/)/i.test(url)) return url;
    return isAdmin ? "../" + url : url;
  }

  global.SiteStorage = {
    STORAGE_KEY,
    deepClone,
    loadSiteData,
    saveSiteData,
    resetSiteData,
    hasLocalEdits,
    applyThemeColors,
    exportDataJs,
    exportDataJson,
    hashPassword,
    compressImageFile,
    escapeHtml,
    formatDatePt,
    resolveAssetPath
  };
})(window);
