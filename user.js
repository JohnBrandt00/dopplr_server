

class user 
{
    //create a constructor that stores the socket and the SimplePeer object
    constructor(socket, peer)
    {
        this.socket = socket;
        this.peer = peer;
        this.room = null;

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
          await this.room.createAudioOutput();
          this.room.startStream();
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

}
module.exports = user;