var crypto = require('crypto');
var ffmpeg = require('fluent-ffmpeg');
var wrtc = require('wrtc');
var w2f = require('wrtc-to-ffmpeg')(wrtc);
var ytdl = require('ytdl-core');

class room
{
    constructor()
    {
        this.owner = null;
        this.peers = [];
        this.id = this.generateId();
        this.ffmpeg = null;
        this.stream = null;
        this.audioOutput = null;
        this.audioStream = null;
        this.audioStream2 = null;
    }
    // method to set the owner of the room as a user object
    setOwner(user)
    {
        this.owner = user;
    }
    //method to use the crypto library to generate a random id for the room 
    generateId()
    {
        return  crypto.randomBytes(3).toString('hex');
        
    }
    // method to add a peer to the room
    addPeer(user)
    {
        this.peers.push(user);
    }
   
    async createAudioOutput()
    {
        this.audioOutput = await w2f.output({kind: 'audio', sampleRate: 48000});
        this.audioOutput2 = await w2f.output({kind: 'audio', sampleRate: 48000});
        this.audioStream = new wrtc.MediaStream();
        this.audioStream2 = new wrtc.MediaStream();
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
        .output(this.audioOutput2.url)
        .outputOptions([`-map 0:a:0`,`-f s16le`, `-c:a pcm_s16le`,`-ar 48000`, `-ac 1`]).on('error', (err) => {
            console.log(err);
        }).on('start', (commandLine) => {
            console.log('ffmpeg started')
        })

        this.audioStream.addTrack(this.audioOutput.track);
        this.audioStream2.addTrack(this.audioOutput2.track);
    }

    // method to start the audio stream
    startStream()
    {
        this.ffmpeg.run();
    }

    // method to stream the audio to the peers
    streamAudio()
    {
        this.owner.peer.addStream(this.audioStream2);
        // for each peer, add the audio stream
        for(var i = 0; i < this.peers.length; i++)
        {
            this.peers[i].peer.addStream(this.audioStream);
        }
    }
        
}
module.exports = room;
