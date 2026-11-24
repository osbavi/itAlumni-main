# ITAlumni

Plataforma front-end de exalumnos para una academia de IT. Los graduados pueden descubrirse entre sí, consultar ofertas de empleo y seguir los eventos de la comunidad. Nace como **Proyecto 1** del curso Front-End de IT Academy (Barcelona Activa).

Solo front-end: funciona enteramente con **datos mock en JSON**, sin backend.

## Vista previa

🔗 **Demo en vivo:** SUBIR A VERCEL (PROXIMAMENTE)

## Funcionalidades

La app cubre tres secciones, cada una con su listado y su buscador/filtros:

- **Networking (Comunidad)** — explora perfiles de exalumnos; busca por nombre o skill; filtra por estado (todos, disponibles, open to work).
- **Bolsa de empleo** — explora ofertas; busca por título o empresa; filtra por stack, tipo de contrato y ubicación.
- **Eventos** — explora charlas y talleres; busca por título; filtra por tipo.

En todas las secciones:

- Estados claros de **carga, vacío y error**.
- Una **barra de filtros reutilizable** (un componente, configurado por sección).
- Diseño **responsive** (mobile-first) con navegación superior en escritorio y barra inferior en móvil.

También incluye pantallas extra para que la app se sienta completa: portada/home, perfil y registro (solo UI).

## Stack técnico

- **HTML + CSS + JavaScript** (vanilla, sin framework)
- **CSS moderno** con custom properties (design tokens)
- **Datos mock** en JSON locales

## Estructura del proyecto

```text
pages/ # otros archivos html
src/
├── assets/icons/ # logos, iconos
├── data/ # datos mock: alumni.json, jobs.json, events.json
├── img/ # imágenes
├── scripts/ # filters.js, networking.js, render.js
├── styles/ # tokens.css, base.css, layout.css, components.css
└── index.html # punto de entrada
└── DOCUMENTATION.md #
└── README.md #
└── REPORT.md #
```

## Cómo arrancar

```bash
# clonar
git clone https://github.com/osbavi/itAlumni-main.git
cd itAlumni

# instalar
pnpm install

# desarrollo
pnpm run dev
```

Otros scripts:

```bash
npm run build     # build de producción a dist/
npm run preview   # sirve el build de producción en local
```

## Alcance

**Dentro del alcance (evaluable)**: las secciones Networking, Bolsa de empleo, cada una en dos niveles — ver la lista, y buscar/filtrar.

**Fuera del alcance**: autenticación, mensajería, solicitudes de conexión, postulaciones reales y panel de administración. Las pantallas home, perfil y registro son extras de UI y no forman parte del alcance evaluable así como otros.

## Autor

Oscar Ballart — https://github.com/osbavi/itAlumni-main.git
