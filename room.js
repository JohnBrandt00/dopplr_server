var crypto = require('crypto');


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
   

    // method to stream the audio to the peers
    streamAudio()
    {
        // this.owner.peer.addStream(this.audioStream);
        // // for each peer, add the audio stream
        // for(var i = 0; i < this.peers.length; i++)
        // {
        //     this.peers[i].peer.addStream(this.audioStream2);
        // }

        this.owner.startStream();
        for(var i = 0; i < this.peers.length; i++)
        {
            this.peers[i].startStream();
        }
    }
        
}
module.exports = room;
