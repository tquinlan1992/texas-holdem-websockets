hoyleHand = require('hoyle').Hand


    h1 = hoyleHand.make(["2s","3s","8h","5c","As","Ts","8d"])
    h2 = hoyleHand.make(["5s","Ts","3h","Ac","2s","Ts","Td"])
    h3 = hoyleHand.make(["5s","5h","3s","3c","2s","Ts","3d"])
    winners = hoyleHand.pickWinners([h1,h2,h3]);
    h1.name = hoyleHand.pickWinners([h1])[0].name;
    h2.name = hoyleHand.pickWinners([h2])[0].name;
    h3.name = hoyleHand.pickWinners([h3])[0].name;
    console.log(winners[0].name);
    console.log(h2.name);

 


var deck = function(){
    this.cards = [];
    this.shuffle = function(o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    for (i=0; i<4; i++) {
        var suit;
        var image_location;
        if (i == 0) {
            suit = "hearts"
            evalSuit = "h"
        }
        if (i == 1) {
            suit = "diamonds";
            evalSuit = "d";
        }
        if (i == 2) {
            suit = "clubs";
            evalSuit = "c";
        }
        if (i == 3) {
            suit = "spades";
            evalSuit = "s";
        }
        for (a=1; a<14; a++) {
            var name;
            if (a == 9) {
                eval_name = "T"+evalSuit;
            }
            if (a == 10) {
                name = "jack_of_"+suit;
                eval_name = "J"+evalSuit;
                image_location = "/playing_cards/"+name+".png";
            }
            else if (a == 11) {
                name = "queen_of_"+suit;
                eval_name = "Q"+evalSuit;
                image_location = "/playing_cards/"+name+".png";
            }
            else if (a == 12) {
                name = "king_of_"+suit;
                eval_name = "K"+evalSuit;
                image_location = "/playing_cards/"+name+".png";
            }
            else if (a == 13) {
                name = "ace_of_"+suit;
                eval_name = "A"+evalSuit;
                image_location = "/playing_cards/"+name+".png";
            } else {
                name = a+1+"_of_"+suit;
                eval_name = a+1+evalSuit;
                image_location = "/playing_cards/"+name+".png";
            }
            this.cards.push({value : a, suit : suit, eval_name: eval_name, name: name, image_location: image_location})
        }
    }
    this.cards = this.shuffle(this.cards);
    this.flop = {};
    this.turn ={};
    this.river ={};
}

module.exports = function() {
    this.players= [];
    this.current_hand = [];
    this.winners = [];
    
    this.add_player = function(name, socket_id){
        if (this.players.length < 8) {
            this.players.push({name:name, socket_id: socket_id, hand:[]});
            return true;
        } else {
            return false;
        }
    }
    
    this.deal_hands = function(){
        
        this.current_hand = new deck();
        this.next_table_cards = {cards:"",status: "pre-flop"}; 
        for (a in this.players) {
           this.players[a].hand = [];
        } 
            for (a in this.players) {
               this.players[a].hand.card1 = this.current_hand.cards.splice(0,1)[0];
               this.players[a].hand.card2 = this.current_hand.cards.splice(0,1)[0];
               
            } 
        for (i=0; i<3; i++) {
               this.current_hand.flop.card1 = this.current_hand.cards.splice(0,1)[0];
               this.current_hand.flop.card2 = this.current_hand.cards.splice(0,1)[0];
               this.current_hand.flop.card3 = this.current_hand.cards.splice(0,1)[0];
        }
        this.current_hand.turn = (this.current_hand.cards.splice(0,1)[0]);
        this.current_hand.river = (this.current_hand.cards.splice(0,1)[0]);

    }
    
    this.player_names = function() {
        var player_names_array = [];
        for (i in this.players) {
            player_names_array.push(this.players[i].name);
        }
        return player_names_array;
    }
    
    this.next_table_cards = {cards:"",status: "pre-flop"};
    this.evaluate_hands = function() {
        console.log("afk");
        var hands = [];
        for (a in this.players) {
            var hand_to_eval = hoyleHand.make([this.players[a].hand.card1.eval_name, this.players[a].hand.card2.eval_name,
                                                                  this.current_hand.flop.card1.eval_name,
                                                                  this.current_hand.flop.card2.eval_name,
                                                                  this.current_hand.flop.card3.eval_name,
                                                                  this.current_hand.turn.eval_name,
                                                                  this.current_hand.river.eval_name]);
            this.players[a].hand.hand_to_eval = hand_to_eval;
            this.players[a].hand.hand_name = hoyleHand.pickWinners([hand_to_eval])[0].name;
            this.players[a].hand.value = hoyleHand.make([this.players[a].hand.card1.eval_name, this.players[a].hand.card2.eval_name,
                                                                  this.current_hand.flop.card1.eval_name,
                                                                  this.current_hand.flop.card2.eval_name,
                                                                  this.current_hand.flop.card3.eval_name,
                                                                  this.current_hand.turn.eval_name,
                                                                  this.current_hand.river.eval_name]);
            hands.push(hand_to_eval);
        }
        hoyleWinners = hoyleHand.pickWinners(hands);
        for (a in hoyleWinners) {
            this.winners = [];
            console.log(hoyleWinners[a].cards);
            for (b in this.players) {
                if (hoyleWinners[a].cards == this.players[b].hand.hand_to_eval.cards) {
                    this.winners.push(this.players[b]);
                }
            }
        }
    }
    

    this.deal_next_table_cards = function() {
        if (this.next_table_cards.status == "pre-flop") {
            this.next_table_cards.status = "flop";
            return {cards: {card1: this.current_hand.flop.card1, card2: this.current_hand.flop.card2, card3: this.current_hand.flop.card3}, status: this.next_table_cards.status};
        }
        if (this.next_table_cards.status == "flop") {
            this.next_table_cards.status = "turn";
            return {cards: this.current_hand.turn, status: this.next_table_cards.status};
        }
        if (this.next_table_cards.status == "turn") {
            this.next_table_cards.status = "river";
            return {cards: this.current_hand.river, status: this.next_table_cards.status};
        }
        if (this.next_table_cards.status == "river") {
            this.next_table_cards.status = "winners";
            this.evaluate_hands();
            console.log(this.winners[0].hand.card1.image_location);
            var winner_hands = []
            for (a in this.winners) {
                winner_hands.push({name: this.winners[a].name, hand_name: this.winners[a].hand.hand_name, card1: this.winners[a].hand.card1, card2: this.winners[a].hand.card2});
            }
            return {winner_hands: winner_hands, status: this.next_table_cards.status};
        }
        else {
            return {cards:"", status: "Hand Over"};
        }
    }
    
    this.disconnected_socket = function(socket_id) {
        for (i = 0; i< this.players.length; i++) {
                if (this.players[i].socket_id == socket_id) {
                    
                    this.players.splice(i,1);
                }
        }
    }
}