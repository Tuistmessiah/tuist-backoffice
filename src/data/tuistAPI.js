import auth from "./auth.json";

// TODO: Choose BASE_URL based on dev/prod .env

const BASE_URL = auth.API_URL[auth.API_URL.auth_mode];
const BASIC_TOKEN = auth.basicToken;
console.log({ BASE_URL });
const TUNO_ENTITY = "tuno";
const SECTION_ENTITY = "section";
const SOUND_ENTITY = "sound";

// - API Endpoints

/* Tuno */
export async function allTunos() {
  return fetchFromAPI(TUNO_ENTITY, "all", { method: "GET" })
    .then((content) => content.tunos)
    .catch((error) => console.error(error));
}
export async function createTuno({ newObj }) {
  const body = JSON.stringify(newObj);
  return fetchFromAPI(TUNO_ENTITY, "new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
export async function updateTuno({ id, updatedObj }) {
  const body = JSON.stringify(updatedObj);
  return fetchFromAPI(TUNO_ENTITY, `update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
export async function deleteTuno({ id }) {
  return fetchFromAPI(TUNO_ENTITY, id, { method: "DELETE" });
}

/* Sound */
export async function allSounds() {
  return fetchFromAPI(SOUND_ENTITY, "all", { method: "GET" })
    .then((content) => content.sounds)
    .catch((error) => console.error(error));
}
export async function createSound({ newObj }) {
  const body = JSON.stringify(newObj);
  return fetchFromAPI(SOUND_ENTITY, "new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
export async function updateSound({ id, updatedObj }) {
  const body = JSON.stringify(updatedObj);
  return fetchFromAPI(SOUND_ENTITY, `update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
export async function deleteSound({ id }) {
  return fetchFromAPI(SOUND_ENTITY, id, { method: "DELETE" });
}

/* Section */
export async function allSections() {
  return fetchFromAPI(SECTION_ENTITY, "all", { method: "GET" })
    .then((content) => content.sections)
    .catch((error) => console.error(error));
}
export async function createSection({ newObj }) {
  const body = JSON.stringify(newObj);
  return fetchFromAPI(SECTION_ENTITY, "new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
export async function updateSection({ id, updatedObj }) {
  const body = JSON.stringify(updatedObj);
  return fetchFromAPI(SECTION_ENTITY, `update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
export async function deleteSection({ id }) {
  return fetchFromAPI(SECTION_ENTITY, id, { method: "DELETE" });
}

// - INTERNALS

function fetchFromAPI(endpoint, url, { method, headers, body }) {
  return fetch(`${BASE_URL}/${endpoint}/${url}`, {
    method,
    headers: { ...headers, basicToken: BASIC_TOKEN },
    body,
  })
    .then((response) => response.json())
    .then(logger)
    .then((responseJSON) => responseJSON.content);
}

function logger(response) {
  console.info("API fetch:", response.message, response.content);
  return response;
}
