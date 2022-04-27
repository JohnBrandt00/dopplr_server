var room = require('./room.js');
class roomManager
{
    constructor()
    {
        this.rooms = [];
        

    }

    // method to add a room to the room list with the owner as the user object
    addRoom(user)
    {
        var Room = new room();
       Room.setOwner(user);
        this.rooms.push(Room);
        return Room;


    }

    // method to find a room by id 
    findRoomById(id)
    {
        for(var i = 0; i < this.rooms.length; i++)
        {
            if(this.rooms[i].id == id)
            {
                return this.rooms[i];
            }
        }
        return null;

    }

    // method to find a room by owner
    findRoomByOwner(owner)
    {
        for(var i = 0; i < this.rooms.length; i++)
        {
            if(this.rooms[i].owner == owner)
            {
                return this.rooms[i];
            }
        }
        return null;

    }

    // method to get all rooms
    getRooms()
    {
        return this.rooms;
    }



}

module.exports = roomManager;