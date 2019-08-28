import cc, { ccd3 } from 'ccts';
import apis from '../apis/apis';
import '../definitions/definitions';
import { animeList } from './anime-list';
import landing from './landing';

const GENRES = [
    'Action',
    'Adventure',
    'Cars',
    'Comedy',
    'Dementia',
    'Demons',
    'Drama',
    'Ecchi',
    'Fantasy',
    'Game',
    'Harem',
    'Historical',
    'Horror',
    'Magic',
    'Martial Arts',
    'Mecha',
    'Military',
    'Music',
    'Mystery',
    'Parody',
    'Police',
    'Psychological',
    'Romance',
    'Samurai',
    'School',
    'Sci-fi',
    'Space',
    'Sports',
    'Super power',
    'Supernatural',
    'Thriller',
]

export default function module() {
    let debounce = false;
    let section = cc.select(`#landing`)
        .on('wheel', function () {
            if (debounce) {
                return;
            } else {
                debounce = true;
                cc.cast('wheel', true);
                cc.do(function () {
                    debounce = false;
                })
            }
        });

    landing(section);

    animeList(section, 'All Time Favorites', 'top-bypopularity', apis.getTopAnime.bind(apis));
    animeList(section, 'Airing Today', 'schedule-today', apis.getSchedule.bind(apis));
    animeList(section, 'Top Airing', 'top-airing', apis.getTopAnime.bind(apis), ['airing']);


    GENRES.forEach(function (genre: genre) {
        animeList(section, genre, `genre-${genre.toLowerCase()}`, apis.getGenre.bind(apis), [genre]);
    })



}
