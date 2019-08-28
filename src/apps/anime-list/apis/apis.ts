import cc, { ccd3 } from 'ccts';
import '../definitions/definitions';

const HOST = `https://api.jikan.moe/v3/`;
const TEST = '';
const Y_KEY = 'AIzaSyDfT4s2tpTWmSFslxM7aJqwwXH1CsU2aWA';

const GENRE_MAP = {
    'action': 1,
    'adventure': 2,
    'cars': 3,
    'comedy': 4,
    'dementia': 5,
    'demons': 6,
    'drama': 8,
    'ecchi': 9,
    'fantasy': 10,
    'game': 11,
    'harem': 35,
    'hentai': 12,
    'historical': 13,
    'horror': 14,
    'josei': 43,
    'kids': 15,
    'magic': 16,
    'martial arts': 17,
    'mecha': 18,
    'military': 38,
    'music': 19,
    'mystery': 7,
    'parody': 20,
    'police': 39,
    'psychological': 40,
    'romance': 22,
    'samurai': 21,
    'school': 23,
    'sci-fi': 24,
    'seinen': 42,
    'shoujo': 25,
    'shoujo ai': 26,
    'shounen': 27,
    'shounen ai': 28,
    'slice of life': 36,
    'space': 29,
    'sports': 30,
    'super power': 31,
    'supernatural': 37,
    'thriller': 41,
    'vampire': 32,
    'yaoi': 33,
    'yuri': 34
}

class Apis {
    private static instance: Apis
    private frame = 100;
    private maxRequest = 2;
    private requestQueue: any[] = [];
    private baseUrl: string;

    constructor(baseUrl: string) {
        let self = this;
        this.baseUrl = baseUrl;
        cc.routine('api-timer', function () {
            for (let i = self.maxRequest; i > 0 && self.requestQueue.length > 0; i--) {
                self.requestQueue.shift()()
            }
        }, this.frame)

    }

    static create(baseUrl: string) {
        return this.instance || new Apis(baseUrl);
    }

    get(...parameters: string[]) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let request = function () {
                fetch(self.baseUrl + parameters.join('/'))
                    .then(function (res: { json: any }) {
                        return res.json();
                    })
                    .then(resolve)
                    .catch(reject);
            }
            self.requestQueue.push(request);
        })
    }

    getByUrl(url: string, noLimit: boolean = false) {
        let self = this;
        if (noLimit) {
            return fetch(url)
                .then(function (res: { json: any }) {
                    return res.json();
                });
        }
        return new Promise(function (resolve, reject) {
            let request = function () {
                fetch(url)
                    .then(function (res: { json: any }) {
                        return res.json();
                    })
                    .then(resolve)
                    .catch(reject);
            }
            self.requestQueue.push(request);
        })
    }

    getTopAnime(subtype: top_anime_subtype = 'bypopularity', page: number = 1) {
        return this.get('top', 'anime', `${page}`, subtype)
            .then((res: { top: any }) => {
                cc.set(`top-${subtype}`, res.top)
            });
    }

    getGenre(genre: genre) {
        genre = <genre>genre.toLowerCase();
        return this.get('genre', 'anime', GENRE_MAP[genre].toString(), '1')
            .then((res: { anime: any }) => {
                cc.set('genre-' + genre, res.anime)
            });
    }


    getSchedule(day?: day) {
        let format = ccd3.timeFormat('%A');
        let today = format(new Date()).toLowerCase();
        let _day = day || today
        return this.get('schedule', _day)
            .then((res: any) => {
                if (!day) {
                    cc.set('schedule-today', res[_day])
                }
                cc.set('schedule-' + _day, res[_day])
            });
    }

    getVideos(title: string) {
        return this.getByUrl(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=anime%20${title.replace(' ', '%20')}%20official%20trailer&type=video&key=${Y_KEY}&maxResults=1&order=relevance`, true)
            .then(function (res: { items: any[] }) {
                return res.items[0]
            });
    }
}

export default Apis.create(HOST);