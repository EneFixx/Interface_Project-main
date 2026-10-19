const API_KEY = '48c609d6'
const BASE_URL = 'https://www.omdbapi.com/'

// Films affichés dans "En vedette"
const FEATURED_IDS = ['tt0816692', 'tt0468569', 'tt1375666']

async function request(params) {
  const res = await fetch(`${BASE_URL}?${new URLSearchParams({ apikey: API_KEY, ...params })}`)
  if (!res.ok) throw new Error(`Erreur réseau (${res.status})`)
  const data = await res.json()
  if (data.Response === 'False') throw new Error(data.Error || 'Erreur OMDb')
  return data
}

const clean = (v) => (v && v !== 'N/A' ? v : '')

// Format OMDb -> format de l'appli (celui attendu par le store)
function normalize(m) {
  return {
    id: m.imdbID,
    title: clean(m.Title),
    year: clean(m.Year),
    poster: clean(m.Poster),
    director: clean(m.Director),
    description: clean(m.Plot),
    rating: Number(clean(m.imdbRating)) || null,
    genre: clean(m.Genre),
    runtime: clean(m.Runtime),
    actors: clean(m.Actors),
  }
}

export async function getMovie(id, plot = 'short') {
  return normalize(await request({ i: id, plot }))
}

// La recherche OMDb ne renvoie ni réalisateur ni note : on complète avec le détail de chaque film
export async function searchMovies(query, page = 1) {
  const data = await request({ s: query, type: 'movie', page })
  const movies = await Promise.all(data.Search.map((m) => getMovie(m.imdbID).catch(() => normalize(m))))
  return { movies, totalResults: Number(data.totalResults) || 0 }
}

export function getFeatured() {
  return Promise.all(FEATURED_IDS.map((id) => getMovie(id)))
}

export const formatRating = (rating) => `★ ${Number(rating).toFixed(1)}/10`
