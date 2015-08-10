









var texas_holdem_game = require('./texas_holdem');



texas_holdem = new texas_holdem_game();
var connected_sockets = [];
var remove_disconnected_socket = function(socket_id) {
    for (i=0; i<connected_sockets.length;i++) {
        if (connected_sockets[i] == socket_id) {
            connected_sockets.splice(i, 1);
        }
    }
}

var spectator_count = function() {
    return connected_sockets.length - texas_holdem.players.length;
}
  module.exports = function(io){
  
   io.on('connection', function(socket){
    connected_sockets.push(socket.id);
    io.emit('current-players', texas_holdem.player_names());
    io.emit('spectator-count',spectator_count());
    socket.on('disconnect', function() {
        remove_disconnected_socket(socket.id);
        texas_holdem.disconnected_socket(socket.id);
        io.emit('spectator-count', spectator_count());
        console.log('Got disconnect!' + socket.id);
        io.emit('current-players', texas_holdem.player_names());
 
    });
   
   
    socket.on('chat message', function(msg){
      console.log(socket.id);
      io.emit('chat message', msg);
    });
    
    socket.on("add_player", function(msg){
        if (texas_holdem.add_player(msg.name, socket.id)) {
            io.emit('current-players', texas_holdem.player_names());
            io.emit('spectator-count', spectator_count());
            socket.emit('add-player-response', {success: true, name: msg.name});
        } else {
            socket.emit('add-player-response', {success: false, error: 'There are already 8 players in the game, please wait until a player leaves'});
        }
    });
  
    socket.on("deal_hands", function(msg){
        texas_holdem.deal_hands();
        for (i = 0; i< texas_holdem.players.length; i++) {
            io.sockets.connected[texas_holdem.players[i].socket_id].emit("deal_hands", {card1: texas_holdem.players[i].hand.card1, card2: texas_holdem.players[i].hand.card2});
        }

        console.log(Object.keys(io.engine.clients));
    });
  
    socket.on("deal_next_table_cards", function(msg){
            io.emit("deal_table_cards", texas_holdem.deal_next_table_cards());
    });
    
    socket.on("new_hand", function(msg){
            io.emit("new_hand", "");
        
    });
    

    

  
  



    });
   
};


