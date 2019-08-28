import cc, { ccd3 } from 'ccts';
import app from './anime-list/components/app';
import YoutubePlayer from './anime-list/components/youtube-player';


const sections = [
    { id: 'landing' },
    { id: 'player-container' },
]

// Setup basic layout
cc.select('#root')
    .text('')
    .selectAll('div')
    .data(sections)
    .enter()
    .append('div')
    .attr('id', d => d.id)
// Setup routines



// Load components
app();
YoutubePlayer();

