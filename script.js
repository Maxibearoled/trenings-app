let bruker = "";
let valgtDag = "Mandag";
let alleBrukere = JSON.parse(localStorage.getItem("treningsBrukere")) || {
  "Ola": { poeng: 50, plan: {} },
  "Kari": { poeng: 80, plan: {} },
  "Per": { poeng: 30, plan: {} }
};

function lagre() {
  localStorage.setItem("treningsBrukere", JSON.stringify(alleBrukere));
}

function loggInn() {
  let navn = document.getElementById("navn-input").value;
  if (navn == "") {
    alert("Skriv et navn!");
    return;
  }
  bruker = navn;
  if (!alleBrukere[bruker]) {
    alleBrukere[bruker] = {
      poeng: 0,
      plan: {
        Mandag: [], Tirsdag: [], Onsdag: [], Torsdag: [], Fredag: [], Lørdag: [], Søndag: []
      }
    };
  }
  lagre();
  document.getElementById("login-boks").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("velkommen").innerText = "Hei, " + bruker;
  oppdaterSkjerm();
}

function loggUt() {
  bruker = "";
  document.getElementById("login-boks").style.display = "block";
  document.getElementById("app").style.display = "none";
}

function byttDag(dag) {
  valgtDag = dag;
  document.getElementById("valgt-dag-tittel").innerText = dag;
  oppdaterSkjerm();
}

function leggTilOvelse() {
  let tekst = document.getElementById("ovelse-input").value;
  if (tekst == "") return;
  if (!alleBrukere[bruker].plan[valgtDag]) {
    alleBrukere[bruker].plan[valgtDag] = [];
  }
  alleBrukere[bruker].plan[valgtDag].push({ navn: tekst, gjort: false });
  document.getElementById("ovelse-input").value = "";
  lagre();
  oppdaterSkjerm();
}

function fullforOvelse(index) {
  let ovelse = alleBrukere[bruker].plan[valgtDag][index];
  if (!ovelse.gjort) {
    ovelse.gjort = true;
    alleBrukere[bruker].poeng += 10;
  } else {
    ovelse.gjort = false;
    alleBrukere[bruker].poeng -= 10;
  }
  lagre();
  oppdaterSkjerm();
}

function slettOvelse(index) {
  alleBrukere[bruker].plan[valgtDag].splice(index, 1);
  lagre();
  oppdaterSkjerm();
}

function velgPlan(type) {
  let nyPlan = {
    Mandag: [], Tirsdag: [], Onsdag: [], Torsdag: [], Fredag: [], Lørdag: [], Søndag: []
  };

  if (type == "nybegynner") {
    nyPlan.Mandag = [{ navn: "3x10 Knebøy", gjort: false }, { navn: "3x10 Pushups", gjort: false }];
    nyPlan.Onsdag = [{ navn: "3x10 Utfall", gjort: false }, { navn: "30 sek Planke", gjort: false }];
    nyPlan.Fredag = [{ navn: "20 min Jogging", gjort: false }];
  } else if (type == "styrke") {
    nyPlan.Mandag = [{ navn: "4x8 Benkpress", gjort: false }, { navn: "3x10 Skulderpress", gjort: false }];
    nyPlan.Onsdag = [{ navn: "4x8 Markløft", gjort: false }, { navn: "3x10 Nedtrekk", gjort: false }];
    nyPlan.Fredag = [{ navn: "4x8 Knebøy", gjort: false }, { navn: "3x12 Leg curl", gjort: false }];
  } else if (type == "kondis") {
    nyPlan.Tirsdag = [{ navn: "30 min Løping", gjort: false }];
    nyPlan.Torsdag = [{ navn: "4x4 Intervaller", gjort: false }];
    nyPlan.Søndag = [{ navn: "45 min Sykling", gjort: false }];
  }

  alleBrukere[bruker].plan = nyPlan;
  lagre();
  oppdaterSkjerm();
}

function oppdaterSkjerm() {
  document.getElementById("poeng-tekst").innerText = alleBrukere[bruker].poeng;

  let liste = document.getElementById("ovelse-liste");
  liste.innerHTML = "";
  let dagensOvelser = alleBrukere[bruker].plan[valgtDag] || [];

  for (let i = 0; i < dagensOvelser.length; i++) {
    let li = document.createElement("li");
    let klasse = dagensOvelser[i].gjort ? "ferdig" : "";
    li.innerHTML = `
      <span class="${klasse}">${dagensOvelser[i].navn}</span>
      <div>
        <button onclick="fullforOvelse(${i})">Ferdig</button>
        <button onclick="slettOvelse(${i})" style="background:red;">Slett</button>
      </div>
    `;
    liste.appendChild(li);
  }

  let lbListe = document.getElementById("leaderboard-liste");
  lbListe.innerHTML = "";

  let sortert = Object.keys(alleBrukere).sort(function(a, b) {
    return alleBrukere[b].poeng - alleBrukere[a].poeng;
  });

  for (let i = 0; i < sortert.length; i++) {
    let navn = sortert[i];
    let li = document.createElement("li");
    li.innerText = (i + 1) + ". " + navn + " - " + alleBrukere[navn].poeng + " poeng";
    lbListe.appendChild(li);
  }
}