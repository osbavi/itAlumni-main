import { initialAlumniFilterState, filterAlumni } from "./filters.js";
import { renderAlumni } from "./render.js";

/**
 * Lista de exalumnos de respaldo.
 * Se usa cuando falla la carga del JSON o este viene vacío/inválido.
 *
 * @type {Object[]}
 */
const fallbackAlumni = [
  {
    id: "alu-01",
    name: "Laura Martínez",
    avatar: "https://i.pravatar.cc/150?img=49",
    stack: "Front-end",
    location: "Barcelona",
    availability: "true",
    skills: ["React", "TypeScript", "Tailwind"],
    level: "Junior",
    workSituation: "Open to work",
  },
  {
    id: "alu-02",
    name: "Carlos Navarro",
    avatar: "https://i.pravatar.cc/150?img=70",
    stack: "Back-end",
    location: "Madrid",
    availability: "false",
    skills: ["Node.js", "Express", "PostgreSQL"],
    level: "Mid-level",
    workSituation: "Employed",
  },
];

/**
 * Carga la lista de exalumnos desde `alumni.json`.
 *
 * Si la petición falla, la respuesta HTTP no es correcta, el JSON no es
 * un array o está vacío, devuelve `fallbackAlumni`.
 *
 * @async
 * @returns {Promise<Object[]>} Lista de exalumnos cargada o la lista de respaldo.
 */
async function loadAlumniFromJson() {
  try {
    const response = await fetch("../src/data/alumni.json");
    if (!response.ok) {
      throw new Error(`No se pudo cargar alumni.json (${response.status})`);
    }
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return fallbackAlumni;
  } catch (error) {
    console.warn("Usando datos de respaldo:", error);
    return fallbackAlumni;
  }
}

/**
 * Actualiza el estado visual y accesible de los botones de filtro.
 *
 * @param {HTMLButtonElement[]} buttons Lista de botones de filtro.
 * @param {string} activeFilter Filtro activo: `"all"`, `"available"` u `"open-to-work"`.
 * @returns {void}
 */
function updateActiveFilterButton(buttons, activeFilter) {
  for (const btn of buttons) {
    const isSelected = btn.dataset.filter === activeFilter;

    if (isSelected) {
      btn.classList.add("networking__filter-btn--active");
    } else {
      btn.classList.remove("networking__filter-btn--active");
    }

    btn.setAttribute("aria-pressed", String(isSelected));
  }
}

/**
 * Inicializa la sección de Networking.
 *
 * @async
 * @returns {Promise<void>}
 */
async function initNetworking() {
  const formEl = document.querySelector(".search-bar");
  const searchInputEl = document.querySelector("#search-alumni");
  const filterButtons = Array.from(
    document.querySelectorAll(".networking__filter-btn"),
  );
  const resultsContainer = document.querySelector("#alumni-results");
  const emptyStateEl = document.querySelector("#alumni-empty-state");

  if (!resultsContainer) return;

  const state = {
    query: initialAlumniFilterState.query,
    filter: initialAlumniFilterState.filter,
  };
  const allAlumni = await loadAlumniFromJson();

  const applyFiltersAndRender = () => {
    const filtered = filterAlumni(allAlumni, state);
    renderAlumni(resultsContainer, emptyStateEl, filtered);
  };

  updateActiveFilterButton(filterButtons, state.filter);
  applyFiltersAndRender();

  if (formEl) {
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFiltersAndRender();
    });
  }

  if (searchInputEl) {
    searchInputEl.addEventListener("input", (event) => {
      state.query = event.target.value;
      applyFiltersAndRender();
    });
  }

  for (const btn of filterButtons) {
    btn.addEventListener("click", () => {
      let newFilter = btn.dataset.filter;
      if (newFilter == null) {
        newFilter = "all";
      }
      state.filter = newFilter;

      updateActiveFilterButton(filterButtons, state.filter);
      applyFiltersAndRender();
    });
  }
}

document.addEventListener("DOMContentLoaded", initNetworking);
