const API_KEY = "48c609d6";
const URL = 'https://www.omdbapi.com/';

export async function getMovie(url_supp) {
    const url = `${URL}?apikey=${API_KEY}` + url_supp
    const res = await fetch(url)
    const data = await res.json();

    if (data.Response === "False") {
        throw new Error(data.Error);
    } 
    return data.Search ? data.Search : data
}

export async function getMovieByTitle(title) {
    return `&s=${title}`
}

export async function getMovieByYear(year) {
    return `&y=${year}`

}

export async function getMovieById(id) {
    return `&i=${id}`
}