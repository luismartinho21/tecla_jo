# Tecla - Informática (Tecla JO / Tecla Precisa) — Site Estático com Painel `/admin`

Site 100% estático (HTML, CSS e JavaScript puros — sem necessidade de servidor ou base de dados) criado para a **Tecla - Informática** na **Póvoa de Lanhoso**, com painel de administração completo para editar todas as secções.

## Estrutura do Projeto

- `index.html` — Site público completo e responsivo (Mobile-First).
- `admin/index.html` — Painel de administração (`/admin`).
- `js/default-data.js` — Ficheiro de dados padrão do site (textos, catálogo, reparações, contactos, cores, etc.).
- `js/storage.js` — Motor de leitura/gravação (`localStorage`), compressão de imagens e exportação.
- `js/app.js` — Renderização dinâmica de todas as secções do site público.
- `js/admin.js` — Lógica do painel de administração.
- `css/styles.css` e `css/admin.css` — Folhas de estilo do site e do painel.
- `assets/` — Ilustrações e imagens padrão locais.

## Como Aceder e Editar no `/admin`

1. Abra `index.html` no navegador (ou sirva a pasta num alojamento estático como Netlify, Vercel, GitHub Pages ou cPanel).
2. Clique em **Área Reservada (Admin)** no rodapé ou aceda diretamente a `admin/index.html`.
3. Palavra-passe inicial: `admin123` (pode alterá-la em **Publicar & Backup**).
4. Edite qualquer secção e clique em **Guardar Alterações** para pré-visualizar imediatamente no seu navegador.

## Como Publicar as Alterações para Todos os Visitantes

Como o site é 100% estático:
1. No painel `/admin`, vá ao separador **Publicar & Backup**.
2. Clique em **Descarregar default-data.js**.
3. Substitua o ficheiro `js/default-data.js` do projeto pelo ficheiro descarregado e faça upload para o seu alojamento.
