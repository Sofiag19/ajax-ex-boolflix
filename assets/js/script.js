$(document).ready(function(){
  // al click sul button controllo il valore dell'input con il titolo del film
  $("#find").click(function(){
    var nome = $("#inserisci").val();
    // console.log(nome);
    ricerca(nome);
  })
})

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
      for (var i = 0; i < risposta.length; i++) {
        var titolo = risposta[i].title;
        // console.log(titolo);
        var titoloOriginale = risposta[i].original_title;
        // console.log(titoloOriginale);
        var lingua = risposta[i].original_language;
        // console.log(lingua);
        var voto = risposta[i].vote_average;
        // console.log(voto);
        $("#lista_film").append("<li>"+"Titolo: "+titolo+"   Titolo Originale: "+titoloOriginale+"   Lingua: "+lingua+"   Rate: "+voto+"</li>");
      }
    },
    error: function(){
      alert("si è verificato un errore!")
    }
  })

}
