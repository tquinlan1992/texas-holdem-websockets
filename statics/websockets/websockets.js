      

      var socket = io();
      $("#next-table-cards").hide();
      $("#new-hand").hide();
      $("#deal-hands").hide();
      var player = false;
      socket.on('current-players', function(msg){
        if (msg =="") {
          $('#current-players').html("No Players Right Now");
        } else {
          $('#current-players').html("Current Players: "+ msg.join(","));
        }
      });
      socket.on('deck', function(msg){
        console.log(msg.length);
      });
      var hand = [];
      socket.on('deal_hands', function(msg){
        $("#next-table-cards").show();
        $("#card1").attr("src", msg.card1.image_location);
        $("#card2").attr("src", msg.card2.image_location);
        $("#card1").show();
        $("#card2").show();
        hand.push(msg);
        $("#hand").html(hand);
        $("#deal-hands").hide();
        $("#next-table-cards").html("Deal Flop");
      })

      socket.on('deal_table_cards', function(msg){
        if (msg.status == "flop") {
          $("#table_card1").attr("src",msg.cards.card1.image_location);
          $("#table_card2").attr("src",msg.cards.card2.image_location);
          $("#table_card3").attr("src",msg.cards.card3.image_location);
          $("#table_card1").show();
          $("#table_card2").show();
          $("#table_card3").show();
          $("#next-table-cards").html("Deal Turn");
        }
        if (msg.status == "turn") {
          
          $("#table_card4").attr("src",msg.cards.image_location);
          $("#table_card4").show();
          $("#next-table-cards").html("Deal River");
        }
        if (msg.status == "river") {
          $("#table_card5").attr("src",msg.cards.image_location);
          $("#table_card5").show();
          $("#next-table-cards").html("Show Winner");

        }
        if (msg.status == "winners") {
          $("#winner-name").html(msg.winner_hands[0].name + " Wins");
          $("#winner-hand-name").html(msg.winner_hands[0].hand_name);
          $("#winner_card1").attr("src",msg.winner_hands[0].card1.image_location);
          $("#winner_card2").attr("src",msg.winner_hands[0].card2.image_location);
          $("#winner_card1").show();
          $("#winner_card2").show();
          $("#winner-name").show();
          $("#winner-hand-name").show();
          $("#next-table-cards").hide();
          if (player) {
            $("#new-hand").show();
          }
        }
        else {
          return;
        }
      })
      
      socket.on('new_hand', function(msg){
        $("#winner-hand-name").hide();
        $("#winner-name").hide();
        $("#winner_card1").hide();
        $("#winner_card2").hide();
        $("#new-hand").hide();
        $("#card1").hide();
        $("#card2").hide();
        if (player) {
          $("#deal-hands").show();
        }
        $("#table_card1").hide();
        $("#table_card2").hide();
        $("#table_card3").hide();
        $("#table_card4").hide();
        $("#table_card5").hide();
      });
      
      socket.on('spectator-count', function(msg){
        if (msg == 1) {
          $("#spectator-count").html(msg + " Spectator");
        } else {
          $("#spectator-count").html(msg + " Spectators");
        }
      });
      

      socket.on('add-player-response', function(msg) {
        if (msg.success) {
          $("#add-player-form").remove();
          $("#player-name").html("Your Player Name is  " + msg.name);
          $("#deal-hands").show();
          player = true;
        } else {
          alert(msg.error)
        }
      });
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      $("#next-table-cards").click(function(){
        socket.emit("deal_next_table_cards", "");
      });
      
      $("#add-player-form").submit(function(){
        var name = $("#player-name-to-add").val();
        socket.emit("add_player", {name: name});
        return false;
      })
      $("#deal-hands").click(function(){
        socket.emit("deal_hands", "now");
        
      })
      $("#new-hand").click(function(){
              socket.emit("new_hand", "now");
      });
      
      
      
    