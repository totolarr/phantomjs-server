// import the webserver module, and create a server
var server = require('webserver').create();

// start a server on port 8080 and register a request listener
server.listen(8080, function(request, response) {

var page = new WebPage(), testindex = 0, loadInProgress = false, table,object, save;
// DEBUG événement sur les message
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

// Evénement début de chargement
page.onLoadStarted = function() {
  loadInProgress = true;
  console.log("load started");
};

// Evénement fin de chargement
page.onLoadFinished = function() {
  loadInProgress = false;
  console.log("load finished");
};

// Tableau contenant les étapes
var steps = [
  // Ouverture de la page de login
  function() {
    page.open("http://www.iutbayonne.univ-pau.fr/user");
  },
  // Soumisson du formulaire d'identification
  function() {
    page.evaluate(function() {
      $("#edit-name").val("blarroqu");
      $("#edit-pass").val("allezol");
      $("#edit-submit").click();
    });
  }, 
  // DEBUG génération d'une image de la page en cours
  // function() {
  //   page.render("test.png");
  // }, 
  // Ouverture de la page des notes
  function(){
    page.open("http://www.iutbayonne.univ-pau.fr/intranet/consultation-notes.html");
  },
  // DEBUG génération d'une image de la page en cours
  // function(){
  //   page.render("notes.png");
  // },
  // function(){
  //   page.evaluate(function(){
  //     page.content = $(".bulletin")[0].outerHTML;
  //     });      
  // },
  function(){
    page.evaluate(function(){
      
      table = $(".bulletin")[0].innerHTML;

      var object = {};
      var currentUE = "";
      var currentMatiere = "";
      var currentEvalutation = "";

      $.each($(".bulletin tbody tr"), function(i, v){
          var classe = $(v).attr("class");
          switch(classe){
            case "ue":
              currentUE = $(v).text();
              object[currentUE] = {};
              //console.log(JSON.stringify(object));
              break;
            case "matiere":
              currentMatiere = $(v).text();
              object[currentUE][currentMatiere] = {};
              //console.log(JSON.stringify(object));
              break;
            case "evaluation" :
              currentEvalutation = $(v).text();
              object[currentUE][currentMatiere][currentEvalutation] = {};
              //console.log(JSON.stringify(object));
              break;
            default:
              break;
          }

      // console.log(JSON.stringify(object));
      save = object;
    });
      }); 
  },
  // function(){
  //     response.statusCode = 200;
  //     response.headers = {
  //   'Cache': 'no-cache',
  //   'Content-Type': 'text/html'
  //     };
  //     console.log(save);
  //     response.content = table;
  //     console.log(table);
  //     response.write(table);
  //     console.log(response.content);
  //     response.close();
  //     page.close();
  // }
];

// Mise en place d'une boucle à intervalle de 10 ms
interval = setInterval(function() {
  // Si pas de chargement en cours et que l'étape courante est une fonction
  if (!loadInProgress && typeof steps[testindex] == "function") {
    console.log("step " + (testindex + 1));
    steps[testindex]();
    testindex++;
  }
  // Si l'étape courante n'est pas une fonction on arrête la boucle
  if (typeof steps[testindex] != "function") {
    console.log("test complete!");
    //phantom.exit();
    clearInterval(interval);
  }
}, 50);

console.log("yoooooo");

});