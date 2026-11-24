import { isProfileAvailable } from "./filters.js";

/**
 * Renderiza las tarjetas de exalumnos en el contenedor indicado
 * o muestra el estado vacío si no hay resultados.
 *
 * @param {HTMLElement} container Contenedor donde se pintarán las tarjetas.
 * @param {HTMLElement|null} emptyStateEl Elemento del estado vacío.
 * @param {Object[]} alumniList Lista de exalumnos a renderizar.
 * @returns {void}
 */
export function renderAlumni(container, emptyStateEl, alumniList) {
  // 1. Vaciar el contenedor
  container.replaceChildren();

  // 2. Sin resultados → mostrar estado vacío y salir
  if (!Array.isArray(alumniList) || alumniList.length === 0) {
    if (emptyStateEl) {
      emptyStateEl.hidden = false;
    }
    return;
  }

  // 3. Con resultados → ocultar estado vacío
  if (emptyStateEl) {
    emptyStateEl.hidden = true;
  }

  // 4. Recorrer cada persona y crear su tarjeta
  for (const person of alumniList) {
    // --- Nombre (sin ??, con if) ---
    let nombre = "Sin nombre";
    if (person.name != null) {
      nombre = person.name;
    }

    // --- Nivel y situación laboral ---
    const levelText = person.level ?? "";
    const situationText = person.workSituation ?? "";

    // --- Stack y skills ---
    const skillsText = Array.isArray(person.skills) ? person.skills.join(", ") : "";

    // --- Disponibilidad ---
    const availabilityLabel = isProfileAvailable(person)
      ? "Disponible"
      : "No disponible";

    // 5. Crear elementos
    const card = document.createElement("article");
    card.className = "alumni-card";

    const info = document.createElement("div");
    info.className = "alumni-card__info";

    const nameEl = document.createElement("h3");
    nameEl.className = "alumni-card__name";
    nameEl.textContent = nombre;

    const classEl = document.createElement("p");
    classEl.className = "alumni-card__class";
    classEl.textContent = [levelText, situationText].filter(Boolean).join(" · ");

    const roleEl = document.createElement("p");
    roleEl.className = "alumni-card__role";
    roleEl.textContent = skillsText
      ? `${person.stack ?? ""} · ${skillsText}`
      : (person.stack ?? "");

    const locationEl = document.createElement("p");
    locationEl.className = "alumni-card__location";
    locationEl.textContent = `${person.location ?? ""} · ${availabilityLabel}`;

    // 6. Montar "info" con appendChild uno a uno
    info.appendChild(nameEl);
    info.appendChild(classEl);
    info.appendChild(roleEl);
    info.appendChild(locationEl);

    // 7. Imagen
    const imgEl = document.createElement("img");
    imgEl.className = "alumni-card__image";
    imgEl.src = person.avatar || "../src/img/01_imgNetworkingSection.webp";
    imgEl.alt = `Foto de ${person.name ?? "exalumno"}`;
    imgEl.width = 80;
    imgEl.height = 80;
    imgEl.loading = "lazy";

    // 8. Botón
    const btnEl = document.createElement("button");
    btnEl.type = "button";
    btnEl.className = "btn btn--primary alumni-card__btn alumni-card__btn--message";
    btnEl.textContent = "Conectar";

    // 9. Montar la tarjeta
    card.appendChild(info);
    card.appendChild(imgEl);
    card.appendChild(btnEl);

    // 10. Añadir tarjeta al contenedor
    container.appendChild(card);
  }
}
