$(document).ready(function(){
  // al click sul button controllo il valore dell'input con il titolo del film
  $("#find").click(function(){
    var nome = $("#inserisci").val();
    // console.log(nome);
    ricerca(nome);
    $('#inserisci').val('');
  })
})

// FUNZIONI

  // funzione per la chiamata e ricerca elementi
  function ricerca(inserimento){

    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method:'GET',
      data: {
        'api_key':"b7363eced32d78c930013064eab20f51",
        'query': inserimento
      },
      success: function(films){
        // console.log(films);
        var risposta = films.results;
        // console.log(risposta);
         datiFilm(risposta);
      },
      error: function(){
        alert("si è verificato un errore!")
      }
    })

  }

  // funzione per la stampa dei dati dei film
  function datiFilm(elenco){
    var copiaTempl = $("#hb-film").html();
    var templReady = Handlebars.compile(copiaTempl);
    for (var i = 0; i < elenco.length; i++) {
      var titolo = elenco[i].title;
      console.log(titolo);
      var titoloOriginale = elenco[i].original_title;
      // console.log(titoloOriginale);
      var lingua = elenco[i].original_language;
      // console.log(lingua);
      var voto = elenco[i].vote_average;
      // console.log(voto);
      var createObj = {titolo: titolo, titoloOriginale: titoloOriginale, lingua: lingua, voto: voto};
      var createEl = templReady(createObj);
      $("#lista_film").append(createEl);
    }
  }
