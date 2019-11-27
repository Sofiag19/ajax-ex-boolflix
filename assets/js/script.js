
$(document).ready(function(){

  // al click del cerca faccio comparire l'imput per la ricerca
  $("#show_nav_invisible").click(function (){
    $("#nav_visible").hide();
    $("#nav_invisible").css("visibility","visible");
  })

  // al click sulla freccia faccio ricomparire la nav iniziale
  $("#hide_nav_invisible").click(function(){
    $("#nav_visible").show();
    $("#nav_invisible").css("visibility","hidden");
  })

  // al passaggio sopra il poster faccio scomparire il poster e comparire la descrizione
  $("#lista_film").on("mouseover",".anteprima", function (){
      $(".anteprima").removeClass("transparent");
      $(".descrizione").removeClass("active");
      $(this).addClass("transparent");
      $(this).siblings().addClass("active");
  });

  // al click sul button controllo il valore dell'input con il titolo del film
  $("#find").click(function(){
    invioRicerca();
  })

  // init ricerca con invio
  $("#inserisci").on('keypress',function(e) {
    if(e.which == 13) {
      invioRicerca();
    }
  })
})



// ****************************************************************************
// ***********************************FUNZIONI********************************
// ***************************************************************************

  // *************************************************************************
  // ***********************FUNZIONE INVIO RICERCA****************************
  // *************************************************************************
  function invioRicerca(){
    $(".film").remove();
    var nome = $("#inserisci").val();
    // CONTROLLO CHE NOME ABBIA UN VALORE
    if (nome) {
      ricerca(nome);
    }
    $('#inserisci').val('');
  }

  // **************************************************************************
  // ***************FUNZIONE PER LA CHIAMATA E RICERCA ELEMENTI***************
  // *************************************************************************
  function ricerca(inserimento){

    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method:'GET',
      data: {
        api_key:"b7363eced32d78c930013064eab20f51",
        query: inserimento,
        language: 'it-IT'
      },
      success: function(films){
        var rispostaFilm = films.results;
        // datiFilm(rispostaFilm);
        dati("film", rispostaFilm)
        // IN CASO DI RITORNO DI ARRAY VUOTO
        if (rispostaFilm.length == 0) {
         alert("nessuna corrispondenza..sorry!");
        }
      },
      error: function(){
        alert("si è verificato un errore!")
      }
    })

    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method:'GET',
      data: {
        api_key:"b7363eced32d78c930013064eab20f51",
        query: inserimento,
        language: 'it-IT'
      },
      success: function(tv){
        var rispostaTv = tv.results;
        // datiSerieTv(rispostaTv);
        dati("serietv", rispostaTv)
        // IN CASO DI RITORNO DI ARRAY VUOTO
        if (rispostaTv.length == 0) {
         alert("nessuna corrispondenza..sorry!");
        }
      },
      error: function(){
        alert("si è verificato un errore!")
      }
    })
  }

  // **************************************************************************
  // ********FUNZIONE PER LA STAMPA DEI DATI DEI FILM O SERIE TV*************
  // **************************************************************************
  function dati(tipo, elenco){
    var copiaTempl = $("#hb-film").html();
    var templReady = Handlebars.compile(copiaTempl);
    for (var i = 0; i < elenco.length; i++) {
      var stelle = divisioneStelline(elenco[i].vote_average);
      var iconeStelle = stampaStelle(stelle);
      var flag = stampaBandiera(elenco[i].original_language);
      var title_name, titolo_orig_name
      if (tipo == "film") {
        title_name = elenco[i].title;
        titolo_orig_name = elenco[i].original_title;
      } else if (tipo == "serietv") {
        title_name = elenco[i].name;
        titolo_orig_name = elenco[i].original_name;
      }
      var createObj = {
          poster: poster(elenco[i]),
          titolo: title_name,
          titoloOriginale: titolo_orig_name,
          lingua: flag,
          voto: elenco[i].vote_average,
          stelle: stelle,
          iconestelle: iconeStelle,
          overview: elenco[i].overview
      };
      var createEl = templReady(createObj);
      $("#lista_film").append(createEl);
    }
  }

  // **************************************************************************
  // **************FUNZIONE DIVISIONE (/2) E ARROTONDAMENTO VOTO**************
   // ************************************************************************
  function divisioneStelline(votoNumero) {

    return risultato = Math.round(votoNumero/2);
  }

  // *************************************************************************
  // *****************FUNZIONE STAMPA ICONE STELLE***************************
  // ***********************************************************************
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

  // *************************************************************************
  // **********************FUNZIONE STAMPA BANDIERA***************************
  // *************************************************************************

  function stampaBandiera(lang) {

    if (lang == "it") {
      var bandiera = "<img class='flag' src='assets/img/italia.png' alt='italian flag'>"
    } else if (lang == "en") {
      var bandiera = "<img class='flag' src='assets/img/uk.jpeg' alt='english flag'>"
    } else if (lang == "ja") {
      var bandiera = "<img class='flag' src='assets/img/giappone.jpg' alt='japanese flag'>"
    } else {
      var bandiera = lang;
    }
    return bandiera
  }

  // ************************************************************************
  // **************FUNZIONE GENERAZIONE IMMAGINE POSTER**********************
  // ***********************************************************************

  function poster(filmSerieTv){
    var urlBasePoster = "https://image.tmdb.org/t/p/";
    var grandezzaPoster = "w154";
    var urlApiImg = filmSerieTv.poster_path;
    if (urlApiImg) {
      var immaginePoster = "<img class='poster' src='"+ urlBasePoster + grandezzaPoster + urlApiImg +"'>";
    } else {
      var immaginePoster = "<p class='anteprimaNon'>Anteprima non disponibile</p>";
    }
    return immaginePoster
  }
