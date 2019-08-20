

export default function landing(parent: any) {
    parent.append('div')
        .classed('landing-anime-display', true)
        .append('h1')
        .classed('title', true)
        .text('CCAnime')
        .parent()
        .bind('top-bypopularity', function (d: any[] = []) {
            let self = this;
            self.selectAll('div')
                .data(d)
                .enter()
                .append('div')
                .classed('display-background-img', true)
                .style('background-image', (d: { image_url: any; }) => `url(${d.image_url})`)
            return true;
        })
}