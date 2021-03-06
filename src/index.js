import loadMovies from './movies-component.js';
import { updateSearchTerm } from './search-component.js';
import { updatePagingInfo } from './paging-component.js';
import { readFromQuery } from './hash-query.js';
import makeSearchMovieUrl from './make-search-movie-url.js';

const prompt = document.getElementById('prompt');
const moviesContainer = document.getElementById('movies-container');

window.addEventListener('hashchange', loadQuery);

loadQuery();

function loadQuery() {
    const query = window.location.hash.slice(1); //remove #
    const queryOptions = readFromQuery(query);
    updateSearchTerm(queryOptions.searchTerm);

    const url = makeSearchMovieUrl(queryOptions);

    if(!url) {
        prompt.classList.remove('hidden');
        moviesContainer.classList.add('hidden');
        return;
    }
    else {
        prompt.classList.add('hidden');
        moviesContainer.classList.remove('hidden');
    }

    fetch(url)
        .then(response => response.json())
        .then(body => {
            loadMovies(body.results);

            const pagingInfo = {
                page: body.page,
                totalPages: body.total_pages,
            };
            updatePagingInfo(pagingInfo);
        });
}