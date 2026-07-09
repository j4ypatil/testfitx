const cache = {};

export async function fetchExerciseDetails(name) {
  if (cache[name]) return cache[name];

  try {
    const res = await fetch(`/api/exercise-details/${encodeURIComponent(name)}`);
    const data = await res.json();
    if (data.ok) cache[name] = data;
    return data;
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export function getExerciseImageUrl(id) {
  if (!id) return null;
  return `/api/exercise-image/${id}`;
}

export function getCachedDetails(name) {
  return cache[name] || null;
}