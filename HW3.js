$(document).ready(function() {
  var mapWidth = 10;
  var mapHeight = 10;
  var endG = false;
  var startingMessage = false;
  var found = false;
  var walls = 15;



  var input = document.getElementById("input");
  var yesBtn = document.getElementById("yes-button");
  var noBtn = document.getElementById("no-button");
  var messageElement = document.getElementById("message");

  var upBtn = document.getElementById("up-Btn");
  var downBtn = document.getElementById("down-Btn");
  var leftBtn = document.getElementById("left-Btn");
  var rightBtn = document.getElementById("right-Btn");

  upBtn.onclick = function() {
    nextMove("up");
  }
    downBtn.onclick = function() {
    nextMove("down");
  }
  leftBtn.onclick = function() {
    nextMove("left");
  }
  rightBtn.onclick = function() {
    nextMove("right");
  }

  var getChoice = function(binding, msg, callback) {
    startingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    yesBtn.innerText = "Yes";
    yesBtn.classList.remove("hidden");
    noBtn.innerText = "No";
    noBtn.classList.remove("hidden");
    yesBtn.onclick = function() {
      messageElement.classList.add("hidden");
      yesBtn.classList.add("hidden");
      noBtn.classList.add("hidden");
      startingMessage = false;
      callback(true);
      display();
    };
    noBtn.onclick = function() {
      messageElement.classList.add("hidden");
      yesBtn.classList.add("hidden");
      noBtn.classList.add("hidden");
      startingMessage = false;
      callback(false);
      display();
    };
  };



  var getInput = function(binding, msg, callback) {
    startingMessage = true;
    if(!callback) callback = function() {};
    else callback = callback.bind(binding);
    messageElement.innerText = msg;
    messageElement.classList.remove("hidden");
    input.value = "";
    input.classList.remove("hidden");
    yesBtn.innerText = "Continue";
    yesBtn.classList.remove("hidden");
    noBtn.innerText = "Skip Name";
    noBtn.classList.remove("hidden");
    yesBtn.onclick = function() {
      messageElement.classList.add("hidden");
      input.classList.add("hidden");
      yesBtn.classList.add("hidden");
      noBtn.classList.add("hidden");
      startingMessage = false;
      callback(input.value);
      display();
    };
    noBtn.onclick = function() {
      messageElement.classList.add("hidden");
      input.classList.add("hidden");
      yesBtn.classList.add("hidden");
      noBtn.classList.add("hidden");
      startingMessage = false;
      callback(null);
      display();
    };
  };

  var table = document.getElementById("map-table");



  var events = getEvents();

  var player;

  var playerName;
  var map;
  getInput(this, "What is your name?", function(input) {
    playerName = input;
    if(playerName === null || playerName.trim() === "") {
      playerName = "P";
    }
    player = new Player(playerName);
    map = generateMap();
    display();
  });

 function nextMove(nonPlayerMovement) {
    if(endG || startingMessage) return;
    var move;
    if(nonPlayerMovement) {
      move = nonPlayerMovement;
    } else {

    }

    var toLocation = {
      "up": { x: player.x, y: player.y - 1 },
      "down": { x: player.x, y: player.y + 1 },
      "right": { x: player.x + 1, y: player.y },
      "left": { x: player.x - 1, y: player.y }
    }
    var toGo = toLocation[move];
    if((toGo.x < 0) || (toGo.y < 0) || (toGo.x > mapWidth - 1) || (toGo.y > mapHeight - 1)) {
      if(!nonPlayerMovement) nextMove();
      return;
    }

    var toArea = map[toGo.x][toGo.y];
    if(!toArea.canPass) {
      toArea.explored = true;

      return;
    }


    var successfulMove = function() {
      player.x = toGo.x;
      player.y = toGo.y;
      toArea.explored = true;

      display();
    };
{
      successfulMove();
    }
  }

  /*was not able to make events*/
  function getEvents() {
    var events = [];

    return events;
  }

  function Player(name) {
    return {
      "name": name,

      "x": null,
      "y": null,
      inventory: [],


    };
  }; 
  function generateMap() {
    var map = [];

    for(var i = 0; i < mapWidth; i++) {
      map[i] = [];
      for(var j = 0; j < mapHeight; j++) {
        map[i].push({ event: null, explored: found, canPass: true});
      }
    }

    while(true) {
      var x = Math.round(Math.random() * (mapWidth - 1));
      var y = Math.round(Math.random() * (mapHeight - 1));

      if(map[x][y].event === null) {
        player.x = x;
        player.y = y;
        map[x][y].explored = true;
        break;
      }
    }

    for(var i = 0; i < walls; i++) {
      var maxWall = 66;
      var possibleWalls = 0;
      while(true) {
        if(!(++possibleWalls < maxWall)) {

          break;
        }
        var x = Math.round(Math.random() * (mapWidth - 1));
        var y = Math.round(Math.random() * (mapHeight - 1));

        if(map[x][y].event === null && player.x != x && player.y != y) {
          var skip = false;
          var wallCount = 0;
          var eventCount = 0;
          for(var r = x - 1; r <= x + 1; r++) {
            for(var j = y - 1; j <= y + 1; j++) {
             
              try {

                if(!map[r][j].canPass) {
                  wallCount++;
                }
                if(map[r][j].event) {
                  eventCount++;
                }
              } catch(error) { wallCount += 0.7 }
            }
          }
          if((wallCount > 3) || (wallCount > 1 && eventCount > 0)) {
            skip = true;
          }
          if(skip) {

            continue;
          }

          map[x][y].canPass = false;

          break;
        }
      }
    }
    return map;
  }

  function display() {

    var table = document.getElementById("map-table");
    if(table) {
      table.innerHTML = "";
    }

    for(var i = 0; i < mapWidth; i++) {
      var row = document.createElement("tr");
      for(var j = 0; j < mapHeight; j++) {
        var mapCell = map[j][i];

        var displayCell = document.createElement("td");
        if(player.x === j && player.y === i) {
          displayCell.innerText = player.name;
          displayCell.className = "player";
        } else if(mapCell.explored === true) {
          if(mapCell.event) {
            displayCell.innerHTML = mapCell.event.name;
            if(mapCell.event.done) {
              displayCell.className = "_E_";
            } else {
              displayCell.className = "walls";
            }
          } else if(!mapCell.canPass) {
            displayCell.innerHTML = "|W|";
            displayCell.className = "walls";
          } else {
            displayCell.innerHTML = "_E_";
          }
        } else {
          displayCell.innerHTML = "?";
          displayCell.className = "unexplored";
        }

        row.appendChild(displayCell);
      }
      table.appendChild(row);
    }
  }

});
