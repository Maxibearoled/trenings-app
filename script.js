// Henter lagret data fra nettleseren
let bruker = localStorage.getItem("bruker");
let aktivPlan = JSON.parse(localStorage.getItem("aktivPlan")) || null;
let egneOvelser = JSON.parse(localStorage.getItem("egneOvelser")) || [];
let poengListe = JSON.parse(localStorage.getItem("poengListe")) || [
    { navn: "Ola", poeng: 100 },
    { navn: "Kari", poeng: 80 }
];

// Starter appen hvis bruker allerede er logget inn
if (bruker) {
    visApp();
}

function loggInn() {
    let navn = document.getElementById("brukernavn-input").value;
    if (navn === "") return;

    localStorage.setItem("bruker", navn);
    bruker = navn;

    // Sjekk om bruker finnes i lista fra før
    let finnes = false;
    for (let i = 0; i < poengListe.length; i++) {
        if (poengListe[i].navn === navn) {
            finnes = true;
        }
    }
    if (!finnes) {
        poengListe.push({ navn: navn, poeng: 0 });
    }

    lagreData();
    visApp();
}

function loggUt() {
    localStorage.removeItem("bruker");
    location.reload();
}

function visApp() {
    document.getElementById("login-side").style.display = "none";
    document.getElementById("app-ramme").style.display = "block";
    document.getElementById("velkomst-tekst").innerText = "👤 " + bruker;
    oppdaterSkjerm();
}

// Funksjon for å bytte mellom "sidene" i bunnmenyen
function byttSide(sideId) {
    let faner = document.getElementsByClassName("fane");
    for (let i = 0; i < faner.length; i++) {
        faner[i].style.display = "none";
    }
    document.getElementById(sideId).style.display = "block";
}

// Velger en hel ferdig plan og sender deg til "Min plan"
function velgPlan(tittel, ovelser, poeng) {
    aktivPlan = {
        tittel: tittel,
        ovelser: ovelser,
        poeng: poeng
    };
    lagreData();
    oppdaterSkjerm();
    byttSide("side-min-plan"); // Hopper automatisk til Min plan
}

// Gir poeng når du fullfører den valgte planen
function fullforAktivPlan() {
    if (!aktivPlan) return;
    giPoeng(aktivPlan.poeng);
    alert("Bra jobbet! Du fikk " + aktivPlan.poeng + " poeng!");
}

function leggTilEgenOvelse() {
    let dag = document.getElementById("dag-velger").value;
    let ovelse = document.getElementById("ovelse-input").value;
    if (ovelse === "") return;

    egneOvelser.push(dag + ": " + ovelse);
    document.getElementById("ovelse-input").value = "";
    lagreData();
    oppdaterSkjerm();
}

function giPoeng(antall) {
    for (let i = 0; i < poengListe.length; i++) {
        if (poengListe[i].navn === bruker) {
            poengListe[i].poeng += antall;
        }
    }
    lagreData();
    oppdaterSkjerm();
}

function lagreData() {
    localStorage.setItem("aktivPlan", JSON.stringify(aktivPlan));
    localStorage.setItem("egneOvelser", JSON.stringify(egneOvelser));
    localStorage.setItem("poengListe", JSON.stringify(poengListe));
}

function oppdaterSkjerm() {
    // 1. Oppdater valgt ferdig plan
    if (aktivPlan) {
        document.getElementById("aktiv-plan-boks").style.display = "block";
        document.getElementById("ingen-plan-tekst").style.display = "none";
        document.getElementById("aktiv-plan-tittel").innerText = aktivPlan.tittel;
        document.getElementById("aktiv-plan-ovelse").innerText = aktivPlan.ovelser;
        document.getElementById("aktiv-plan-poeng").innerText = aktivPlan.poeng;
    }

    // 2. Oppdater egne ukeplan-øvelser
    let planListe = document.getElementById("egen-plan-liste");
    planListe.innerHTML = "";
    for (let i = 0; i < egneOvelser.length; i++) {
        planListe.innerHTML += "<li>" + egneOvelser[i] + "</li>";
    }

    // 3. Oppdater leaderboard
    poengListe.sort((a, b) => b.poeng - a.poeng);
    let lbListe = document.getElementById("leaderboard-liste");
    lbListe.innerHTML = "";
    for (let i = 0; i < poengListe.length; i++) {
        lbListe.innerHTML += "<li><strong>" + poengListe[i].navn + "</strong>: " + poengListe[i].poeng + " poeng</li>";
    }
}