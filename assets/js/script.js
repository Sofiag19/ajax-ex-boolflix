
$(document).ready(function(){
  // al click sul button controllo il valore dell'input con il titolo del film
  $("#find").click(function(){
    $(".film").remove();
    var nome = $("#inserisci").val();
    // console.log(nome);
    // CONTROLLO CHE NOME ABBIA UN VALORE
    if (nome) {
      ricerca(nome);
    }
    $('#inserisci').val('');
  })
})

// ********************************************************************************
// ***********************************FUNZIONI************************************
// ********************************************************************************


  // ******************************************************************************
  // ***************FUNZIONE PER LA CHIAMATA E RICERCA ELEMENTI*******************
  // ******************************************************************************
  function ricerca(inserimento){

    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method:'GET',
      data: {
        api_key:"b7363eced32d78c930013064eab20f51",
        query: inserimento,
        languages: 'it-IT'
      },
      success: function(films){
        // console.log(films);
        var risposta = films.results;
        console.log(risposta);
        datiFilm(risposta);
        // IN CASO DI RITORNO DI ARRAY VUOTO
        if (risposta.length == 0) {
         alert("nessuna corrispondenza..sorry!");
        }
      },
      error: function(){
        alert("si è verificato un errore!")
      }
    })

  }


  // ******************************************************************************
  // ******************FUNZIONE PER LA STAMPA DEI DATI DEI FILM********************
  // ******************************************************************************
  function datiFilm(elenco){
    var copiaTempl = $("#hb-film").html();
    var templReady = Handlebars.compile(copiaTempl);
    for (var i = 0; i < elenco.length; i++) {
      // console.log(voto);
      var stelle = divisioneStelline(elenco[i].vote_average);
      var iconeStelle = stampaStelle(stelle);
      // var iconeStelleEscape = Handlebars.SafeString(iconeStelle);;
      console.log(iconeStelle);
      var createObj = {
          titolo: elenco[i].title,
          titoloOriginale: elenco[i].original_title,
          lingua: elenco[i].original_language,
          voto: elenco[i].vote_average,
          stelle: stelle,
          iconestelle: iconeStelle
      };
      var createEl = templReady(createObj);
      $("#lista_film").append(createEl);
    }
  }

  // ********************************************************************************************************************
  // *******************************FUNZIONE DIVISIONE (/2) E ARROTONDAMENTO VOTO***************************************
   // *****************************************************************************************************************
  function divisioneStelline(votoNumero) {

    return risultato = Math.round(votoNumero/2);
  }

  // stampa icone Stelle
  function stampaStelle(voto){

    var totaleStelle = "";
    for (var i = 0; i < 5; i++) {
      if (i<voto) {
        totaleStelle += '<i class="fas fa-star"></i>';
      }
      else {
        totaleStelle += '<i class="far fa-star"></i>';
      }
    }
    return totaleStelle
  }
