# ITAlumni — Informe técnico

- **Autor:** Oscar Ballart
- **Proyecto:** Proyecto 1 — curso Front-End de IT Academy (Barcelona Activa)
- **Demo**: SUBIR A VERCEL (PROXIMAMENTE)
- **Repo:** https://github.com/osbavi/itAlumni-main.git

## 1. Visión general

ITAlumni es una plataforma front-end de exalumnos para una academia de IT. Los graduados pueden explorar otros perfiles, consultar ofertas de empleo y seguir los eventos de la comunidad. Es un proyecto solo de front-end: no hay backend, y todos los datos vienen de archivos JSON mock locales.

## 2. Objetivo y alcance

El objetivo evaluable eran tres secciones —Networking, Bolsa de empleo y Eventos—, cada una en dos niveles: ver la lista, y buscar/filtrar.

La autenticación, la mensajería y las solicitudes de conexión quedaban fuera de alcance. También añadí algunas pantallas extra (home, perfil y registro) para que la app se sintiera más completa, pero después de revisar prioridades con mi mentor mantuve el foco en los filtros, dejé los favoritos fuera (eran opcionales).

## 3. Stack técnico y por qué

- **HTML + CSS + JavaScript (vanilla, sin framework).** El enunciado pedía HTML/CSS/JS sin framework. Añadí Vite como servidor de desarrollo y empaquetador: es rápido, sencillo y no impone ninguna arquitectura de framework.
- **CSS con custom properties (design tokens).** Colores, tipografía y espacios definidos una sola vez en `tokens.css`. Es una forma sencilla de mantener el sistema de diseño consistente sin depender de una librería externa.
- **Datos mock en JSON** servidos a través de un pequeño servicio que devuelve una `Promise`. Esto simula una API asíncrona real, que es lo que me permite manejar los estados de carga, vacío y error de la misma forma que lo haría con una API real.
- **Funciones puras de filtrado** en `utils/` (o `filters.js`): reciben datos y devuelven datos, sin tocar el DOM. Eso las hace fáciles de leer y listas para testear.

## 4. Arquitectura y decisiones clave

Separé el código por responsabilidades:

- `data/`: archivos JSON con los datos.
- `filters.js`: función pura de filtrado.
- `render.js`: pintado en el DOM.
- `networking.js`: inicialización, estado y eventos.
- `styles/`: tokens, base, layout y componentes.

La decisión arquitectónica más importante es la **separación entre la lógica de filtrado y el renderizado**. `filters.js` contiene funciones como `filterAlumni`, `isProfileAvailable, isProfileUnavailable` e `isOpenToWork`, que no acceden al DOM y que, en el caso de `filterAlumni`, devuelven un nuevo array sin mutar la lista original. Esto permite probar los filtros sin navegador y reutilizar la lógica en otros contextos.

`render.js`, por su parte, no decide qué perfiles deben mostrarse: recibe una lista ya filtrada y se limita a pintar las tarjetas o el estado vacío. Ahora bien, la separación no es absoluta: `renderAlumni` importa `isProfileAvailable` para mostrar la etiqueta “Disponible” o “No disponible”. Es decir, el render no filtra, pero sí depende de una regla de negocio para representar un dato.

La segunda decisión relevante es el **estado centralizado** en `networking.js`. En lugar de que cada botón o el buscador filtren por su cuenta, existe un único objeto `state` con `{ query, filter}` y una función `applyFiltersAndRender()` que se ejecuta después de cualquier cambio. Así se evita tener varias fuentes de verdad lógica y el flujo es predecible: se actualiza el estado, se actualizan los botones activos y se vuelve a filtrar y renderizar.

Además, `loadAlumniFromJson` incorpora un **fallback**: si el `fetch` falla, la respuesta no es correcta, el JSON no es un array o está vacío, se usa `fallbackAlumni`. Esto evita que un problema al cargar el JSON rompa toda la sección. El fallback cubre la carga inicial de datos, no otros posibles fallos posteriores del render o del filtrado.

En conjunto, la arquitectura está bien separada: los filtros son lógica pura y testeable, el render es reutilizable con cualquier lista filtrada y `networking.js` actúa como orquestador del estado y los eventos. La afirmación de que “añadir un filtro nuevo no implica tocar el render” es cierta siempre que el nuevo filtro solo cambie qué elementos se muestran; si además requiere mostrar información nueva en la tarjeta, sí habría que modificar `render.js`.

## 5. Retos y cómo los resolví

- **Configuración de CSS.** Al principio no aplicaba correctamente bien los estilos CSS. La solución fue separar el sistema de tokens en su propio archivo `tokens.css` y asegurarme de que se cargaba **antes** que los demás. El orden de la cascada importa: si `base.css` se cargaba antes que `tokens.css`, las variables todavía no existían y muchas reglas no se aplicaban.
- **`availability` como string en el JSON.** El JSON trae `"true"`/`"false"` como texto, no como booleano. Si lo comparaba directamente con `=== true` siempre daba falso. La solución fue aceptar ambos formatos en `isProfileAvailable`, que cubre tanto datos reales como datos de prueba.

## 6. Posibles mejoras

- Favoritos guardados en `localStorage` (el nivel 3 opcional).
- Tests unitarios para la funcion de filtrado, que ya es pura y está lista para testear.
- Un backend/API real en lugar de JSON mock, más filtros
- Realizar filtros para oferta de empleo
- Realizar eventos
