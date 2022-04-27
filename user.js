
var ffmpeg = require('fluent-ffmpeg');
var wrtc = require('wrtc');
var w2f = require('wrtc-to-ffmpeg')(wrtc);
var ytdl = require('ytdl-core');


class user 
{
    //create a constructor that stores the socket and the SimplePeer object
    constructor(socket, peer)
    {
        this.socket = socket;
        this.peer = peer;
        this.room = null;
        this.ffmpeg = null;
        this.audioOutput = null;
         // on socket signal event, send the signal to the peer
         this.socket.on('signal', (data) => {
            console.log('signal received');
            this.peer.signal(data);
        }
        );
        
        this.peer.on('signal', (data) => {
            this.socket.emit('signal', JSON.stringify(data));
        }
        );
       
      
        this.socket.on('begin', async function () {
            console.log('begin received');
            this.room.streamAudio();
        }.bind(this));
    
    }

    // method to set the room of the user
    setRoom(room)
    {
        this.room = room;
    }

    // method to get the room of the user
    getRoom()
    {
        return this.room;
    }

    async createAudioOutput()
    {
        this.audioOutput = await w2f.output({kind: 'audio', sampleRate: 48000});
        this.audioStream = new wrtc.MediaStream();
        this.ffmpeg = ffmpeg(ytdl(`MzNXuOWEt0A`)).inputOptions([
            `-re`,
            `-analyzeduration 500000`,
            `-fflags nobuffer`,
            `-max_delay 250000`,
            `-threads 0`,
            `-hwaccel auto`,
            `-ss 00:00:00`,
            `-t 00:00:00`,
        ]).output(this.audioOutput.url)
        .outputOptions([`-map 0:a:0`,`-f s16le`, `-c:a pcm_s16le`,`-ar 48000`, `-ac 1`]).on('error', (err) => {
            console.log(err);
        }).on('start', (commandLine) => {
            console.log('ffmpeg started')
        })

        this.audioStream.addTrack(this.audioOutput.track);
    }

    // method to start the audio stream
    async startStream()
    {
        await this.createAudioOutput();
        this.ffmpeg.run();
        this.peer.addStream(this.audioStream);
    }


}
module.exports = user;