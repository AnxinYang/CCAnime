import cc, { ccd3 } from 'ccts';

import apis from '../apis/apis';

export function animeList(parent: any, title: string, bind: string, load?: (...args: any[]) => any, params: string[] = []) {
    let isLoaded = false;
    let list = parent.append('div')
        .classed('section-container', true)
        .append('div')
        .classed('section-title-container', true)
        .append('h2')
        .classed('section-title', true)
        .text(title)
        .parent()
        .append('h2')
        .classed('section-reshuffle', true)
        .text('Reshuffle')
        .on('click', function () {
            shuffleOut.call(list, cc.get(bind));
        })
        .parent()
        .parent()
        .append('div')
        .classed('anime-list', true);

    list.bind(bind, shuffleIn.bind(list));

    cc.routine(title + 'loading', function () {
        let a = list.parent().select('.section-title').node()
        if (a) {
            let { top, bottom } = a.getBoundingClientRect();

            if (isLoaded === false && load && top > 0 && bottom < window.innerHeight) {
                list.classed('anime-list-loading', true)
                isLoaded = true
                load(...params).then(function () {
                    list.classed('anime-list-loading', false);
                });
                return false;
            }
        }
    }, 50)

}


function shuffleOut(data: any[] = []) {
    let self = this;
    this.selectAll('div')
        .transition()
        .duration(50)
        .delay(function (d: any, i: number) {
            return 50 * i;
        })
        .style('transform', 'translateX(-100vw)')
        .end()
        .then(function () {
            cc.requestAnimationTimeout(function () {
                shuffleIn.call(self, data);
            }, 200)

        });
}

function shuffleIn(data: any[] = []) {
    let self = this;
    this.selectAll('div')
        .remove();
    this.selectAll('div')
        .data(getRandomItemsFromArray(data, 10))
        .enter()
        .append('div')
        .classed('anime-container', true)
        .style('background-image', (d: { image_url: any; }) => `url(${d.image_url})`)
        .style('transform', 'translateX(95vw)')
        .on('click', function (d: { title: any; }) {
            cc.set('player', '');
            apis.getVideos(d.title).then(function (res: { id: { videoId: any } }) {
                cc.set('player', res.id.videoId);
            })

        })
        .append('span')
        .text((d: { title: any; }) => d.title)
        .parent()
        .transition()
        .duration(300)
        .delay(function (d: any, i: number) {
            return 100 * i;
        })
        .style('transform', 'translateX(0)');
    return true;
}

function getRandomItemsFromArray(data: any[], number: number) {
    let result: any[] = [];
    let d = data.slice(0);
    let len = Math.min(data.length, number);

    while (result.length < len) {
        result.push(d.splice(cc.utils.getRandomInt(0, d.length - 1), 1).pop())
    }

    return result;
}