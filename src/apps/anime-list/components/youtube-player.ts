import cc, { ccd3 } from '../../../cc';
import apis from '../apis/apis';

let player: any;

export default function module() {
    cc.select('#player-container')
        .style('display', 'none')
        .on('click', function () {
            player.stopVideo();
            cc.select('#player-container')
                .style('display', 'none')
        })
        .append('div')
        .attr('id', 'player')
        .parent()
        .bind('player', function (d: any) {
            if (!(<any>window).YT) return;
            this.style('display', 'flex')
            if (!d) return;
            if (player) {
                player.loadVideoById({
                    videoId: d,
                    suggestedQuality: 'hd720'
                })
            } else {
                player = new (<any>window).YT.Player('player', {
                    height: '66%',
                    width: '66%',
                    videoId: d,
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    },
                    suggestedQuality: 'large'
                });
                //player.setPlaybackQuality('hd720');
            }
            return true;
        });


    setupPlayer();
}

function setupPlayer() {
    cc.select('head')
        .append('script')
        .attr('src', 'https://www.youtube.com/iframe_api');
}

function onPlayerReady(event: any) {
    player.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event: any) {
    if (event.data == (<any>window).YT.PlayerState.PLAYING && !done) {
        //setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}