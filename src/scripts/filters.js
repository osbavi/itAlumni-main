/**
 * Estado inicial de los filtros en la sección Networking.
 *
 * @typedef {Object} AlumniFilterState
 * @property {string} query  Texto escrito en el buscador.
 * @property {"all"|"open-to-work"|"available"} filter  Filtro de categoría activo.
 */

/**
 * @type {AlumniFilterState}
 */
export const initialAlumniFilterState = {
  query: "", // Texto escrito en el buscador
  filter: "all", // "all" | "open-to-work" | "available"
};

/**
 * Comprueba explicitamente si un perfil está disponible según el campo `availability`
 * del JSON (que puede venir como string "true"/"false" o como booleano).
 *
 * @param {Object} person Perfil de exalumno.
 * @param {boolean|string} [person.availability] Indica si está disponible.
 * @returns {boolean} `true` si el perfil está disponible; `false` en caso contrario.
 */
export function isProfileAvailable(person) {
  if (!person) {
    return false;
  }

  return person.availability === true || person.availability === "true";
}

/**
 * Comprueba explícitamente si un perfil NO está disponible. según el campo `availability` del JSON (que puede venir como string "true"/"false" o como booleano).
 *
 * @param {Object} person Perfil de exalumno.
 * @param {boolean|string} [person.availability] Indica si está disponible.
 * @returns {boolean} `true` si `availability` es `false` o `"false"`.
 */
export function isProfileUnavailable(person) {
  if (!person) {
    return false;
  }

  return person.availability === false || person.availability === "false";
}

/**
 * Devuelve la etiqueta en castellano de disponibilidad para facilitar
 * búsquedas por texto como "disponible" o "no disponible".
 *
 * @param {Object} person Perfil de exalumno.
 * @returns {string}
 */
function getAvailabilityLabel(person) {
  if (isProfileAvailable(person)) {
    return "disponible";
  }

  if (isProfileUnavailable(person)) {
    return "no disponible";
  }

  return "";
}

/**
 * Comprueba si un perfil tiene situación laboral "Open to work".
 * La comparación ignora mayúsculas/minúsculas y espacios sobrantes.
 *
 * @param {Object} person Perfil de exalumno.
 * @param {string} [person.workSituation] Situación laboral del exalumno.
 * @returns {boolean} `true` si su situación laboral es "Open to work".
 */
export function isOpenToWork(person) {
  if (
    !person ||
    person.workSituation === undefined ||
    person.workSituation === null
  ) {
    return false;
  }

  return String(person.workSituation).trim().toLowerCase() === "open to work";
}

/**
 * Comprueba si el perfil coincide con el texto de búsqueda normalizado.
 * Trata "disponible" y "no disponible" de forma exacta para que buscar
 * "disponible" no devuelva perfiles marcados como "no disponible".
 *
 * @param {Object} person Perfil de exalumno.
 * @param {string} normalizedQuery Texto de búsqueda en minúsculas y sin bordes.
 * @returns {boolean}
 */
function matchesSearchQuery(person, normalizedQuery) {
  if (normalizedQuery === "disponible") {
    return isProfileAvailable(person);
  }

  if (normalizedQuery === "no disponible") {
    return isProfileUnavailable(person);
  }

  // Construir el texto buscable con los campos del perfil
  const skillsText = Array.isArray(person.skills) ? person.skills.join(" ") : "";
  const availabilityLabel = getAvailabilityLabel(person);

  const searchableText = [
    person.name ?? "",
    person.stack ?? "",
    person.level ?? "",
    person.location ?? "",
    person.workSituation ?? "",
    skillsText,
    availabilityLabel,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

/**
 * Filtra una lista de exalumnos según el texto de búsqueda y el tipo de filtro.
 *
 * Función pura: no muta el array original ni accede al DOM.
 * Devuelve un nuevo array con las personas que cumplen **ambas** condiciones:
 *  - el filtro de categoría (`filter`)
 *  - la búsqueda por texto (`query`)
 *
 * @param {Object[]} alumniList Lista de exalumnos a filtrar.
 * @param {AlumniFilterState} [filters] Estado de los filtros.
 * @param {string} [filters.query=""] Texto de búsqueda introducido por el usuario.
 * @param {"all"|"open-to-work"|"available"} [filters.filter="all"] Filtro de categoría.
 * @returns {Object[]} Nuevo array con los exalumnos que cumplen los filtros.
 *
 * @example
 * filterAlumni(lista, { query: "disponible", filter: "all" });
 */
export function filterAlumni(alumniList, { query = "", filter = "all" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return alumniList.filter((person) => {
    let matchesFilter = true;
    if (filter === "available") {
      matchesFilter = isProfileAvailable(person);
    } else if (filter === "open-to-work") {
      matchesFilter = isOpenToWork(person);
    }

    if (!normalizedQuery) {
      return matchesFilter;
    }

    return matchesFilter && matchesSearchQuery(person, normalizedQuery);
  });
}
