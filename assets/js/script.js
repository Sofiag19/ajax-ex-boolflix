
$(document).ready(function(){
  // all'apertura della pagina compaiono i film del 2019
  firstResearch()

  // al click del cerca faccio comparire l'imput per la ricerca
  $(".show_nav_invisible").click(function (){
    $("#nav_visible").hide();
    $("#container_nav_insivible").show();
  })

  // al click sulla freccia faccio ricomparire la nav iniziale
  $("#hide_nav_invisible").click(function(){
    $("#nav_visible").show();
    $("#container_nav_insivible").hide();
  })

  // al click su ham si apre menu TENDINA
  $(".fa-bars").click(function(){
    $("#container_menu_tendina").show();
  });

  // al click su x si chiude menu tendina
  $(".fa-times").click(function(){
    $("#container_menu_tendina").hide();
  })
  // al click sul button controllo il valore dell'input con il titolo del film
  $("#find").click(function(){
    invioRicerca($("#inserisci"));
  })

  // init ricerca con invio
  $("#inserisci").on('keypress',function(e) {
    if(e.which == 13) {
      invioRicerca($("#inserisci"));
    }
  })

  // QUERY 500
  // al click del cerca faccio comparire l'imput per la ricerca - query 500
  $("#bottom_search i").click(function (){
    $("#intestazione").hide();
    $("#contenitore_intestazione_invisibile").show();
  })

  // al click sulla freccia faccio ricomparire la nav iniziale - query 500
  $("#hide_intestazione_invisible").click(function(){
    $("#intestazione").show();
    $("#contenitore_intestazione_invisibile").hide();
  })

  // invio ricerca con lente - query 500
  $("#find_min").click(function(){
    invioRicerca($("#inserisci_min"));
  })

  // invio ricerca con invio - query 500
  $("#inserisci_min").on('keypress',function(e) {
    if(e.which == 13) {
      invioRicerca($("#inserisci_min"));
    }
  })

  // al click su un genere compaiono film e serie tv di quel genere
  $("#genere li").click(function(){
    var numGenere = $(this).attr("num-genre");
    console.log(numGenere);
    ricGenere(numGenere);
  })
})

// ****************************************************************************
// ***********************************FUNZIONI********************************
// ***************************************************************************

  // *************************************************************************
  // ************FUNZIONE PER LA PRIMA RICERCA*******************************
  // ************************************************************************
  function firstResearch(){
    var urlFilm2019 = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc";
    var urlSerietv2019 = "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc";
    var doveFilm = $("#lista_film");
    var doveSerieTv = $("#lista_serietv");
    ricercaPrimaPag(urlFilm2019,"film",doveFilm);
    ricercaPrimaPag(urlSerietv2019,"serietv",doveSerieTv);
  }

  // funzione per la ricerca con genere
  function ricGenere(numgen){
    var urlFilmGen = "https://api.themoviedb.org/3/discover/movie";
    var urlSerietvGen = "https://api.themoviedb.org/3/discover/tv";
    var doveFilm = $("#lista_film");
    var doveSerieTv = $("#lista_serietv");
    ricercaGenere (urlFilmGen,"film",doveFilm,numgen);
    ricercaGenere (urlSerietvGen,"serietv",doveSerieTv,numgen);
  }
  // *************************************************************************
  // ***********************FUNZIONE INVIO RICERCA****************************
  // *************************************************************************
  function invioRicerca(dove){
    $(".film").remove();
    var nome = dove.val();
    var urlFilm = "https://api.themoviedb.org/3/search/movie";
    var urlSerietv = "https://api.themoviedb.org/3/search/tv";
    // CONTROLLO CHE NOME ABBIA UN VALORE
    var doveFilm = $("#lista_film");
    var doveSerieTv = $("#lista_serietv");
    if (nome) {
      ricerca(urlFilm, nome, "film",doveFilm);
      ricerca(urlSerietv, nome, "serietv",doveSerieTv);
    }
    dove.val('');
  }

  // **************************************************************************
  // ***************FUNZIONE PER LA CHIAMATA E RICERCA ELEMENTI***************
  // *************************************************************************
  function ricerca(url,inserimento,tipo,where){

    $.ajax({
      url: url ,
      method:'GET',
      data: {
        api_key:"b7363eced32d78c930013064eab20f51",
        query: inserimento,
        language: 'it-IT'
      },
      success: function(data){
        var risposta = data.results;
        dati(tipo, risposta, where)
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

  // *********************************************************************
  // ***********FUNZIONE PER LA RICERCA SENZA INPUT**********************
  // *********************************************************************
  function ricercaPrimaPag(url,tipo,where){

    $.ajax({
      url: url ,
      method:'GET',
      data: {
        api_key:"b7363eced32d78c930013064eab20f51",
        language: 'it-IT'
      },
      success: function(data){
        var risposta = data.results;
        dati(tipo, risposta, where)
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

// funzione ricerca per genere
function ricercaGenere (url,tipo,where,numgen){
  $.ajax({
    url: url ,
    method:'GET',
    data: {
      api_key:"b7363eced32d78c930013064eab20f51",
      with_genres: numgen,
      language: 'it-IT'
    },
    success: function(data){
      console.log(data);
      var risposta = data.results;
      dati(tipo, risposta, where)
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


  // **************************************************************************
  // ********FUNZIONE PER LA STAMPA DEI DATI DEI FILM O SERIE TV*************
  // **************************************************************************
  function dati(tipo, elenco, where){
    var copiaTempl = $("#hb-film").html();
    var templReady = Handlebars.compile(copiaTempl);
    for (var i = 0; i < elenco.length; i++) {
      var stelle = divisioneStelline(elenco[i].vote_average);
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
          lingua: stampaBandiera(elenco[i].original_language),
          voto: elenco[i].vote_average,
          stelle: stelle,
          iconestelle: stampaStelle(stelle),
          overview: elenco[i].overview
      };
      var createEl = templReady(createObj);
      where.append(createEl);
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
      var immaginePoster = "<img class='anteprimaNon' src='assets/img/logo.png' alt=''>";
    }
    return immaginePoster
  }
