const KEY="winterArcV1";
const goals=["sleep","water","steps","workout","nofast","nocandy","nosoda","humble","honest","school"];
const workouts={1:"Pectoraux + triceps",2:"Jambes + abdos",4:"Pectoraux + épaules",5:"Dos + bras + abdos"};
const $=id=>document.getElementById(id);
function dateKey(d=new Date()){return d.toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}}
let db=load();
function save(){localStorage.setItem(KEY,JSON.stringify(db));render()}
function day(){const k=dateKey(); if(!db[k])db[k]={sleep:0,water:0,steps:0,workout:false,nofast:false,nocandy:false,nosoda:false,humble:false,honest:false,school:false}; return db[k]}
function workoutName(){let d=new Date().getDay();return workouts[d]||"Repos / récupération"}
function isComplete(x){return Number(x.sleep)>=8 && Number(x.water)>=2 && Number(x.steps)>=6000 && (workouts[new Date().getDay()]?x.workout:true) && x.nofast&&x.nocandy&&x.nosoda&&x.humble&&x.honest&&x.school}
function render(){
 const x=day(); $("todayLabel").textContent=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
 $("sleep").value=x.sleep||"";$("steps").value=x.steps||"";$("waterLabel").textContent=`${(x.water||0).toFixed(2).replace(".",",")} / 2 L`;$("waterFill").style.width=Math.min(100,(x.water||0)/2*100)+"%";
 $("workoutName").textContent=workoutName();
 $("workoutBtn").textContent=x.workout?"✓ Séance validée":"Marquer la séance comme faite";
 $("workoutBtn").disabled=x.workout;
 ["nofast","nocandy","nosoda","humble","honest","school"].forEach(id=>$(id).checked=!!x[id]);
 let done=0; if(x.sleep>=8)done++;if(x.water>=2)done++;if(x.steps>=6000)done++;if(!workouts[new Date().getDay()]||x.workout)done++;["nofast","nocandy","nosoda","humble","honest","school"].forEach(id=>{if(x[id])done++});
 const total=workouts[new Date().getDay()]?10:9,pct=Math.round(done/total*100);$("progressText").textContent=`${done} / ${total} objectifs`;$("progressPct").textContent=pct+"%";$("streak").textContent=streak();
 $("sStreak").textContent=streak(); const vals=Object.values(db); const withSleep=vals.filter(v=>v.sleep>0),withSteps=vals.filter(v=>v.steps>0);
 $("sSleep").textContent=(withSleep.length?withSleep.reduce((a,v)=>a+Number(v.sleep),0)/withSleep.length:0).toFixed(1)+" h";
 $("sSteps").textContent=withSteps.length?Math.round(withSteps.reduce((a,v)=>a+Number(v.steps),0)/withSteps.length).toLocaleString("fr-FR"):"0";
 $("sWorkout").textContent=vals.filter(v=>v.workout).length; $("successfulDays").textContent=vals.filter(isComplete).length; calendar();
}
function streak(){let n=0,d=new Date();while(true){let k=dateKey(d),x=db[k];if(x&&isComplete(x)){n++;d.setDate(d.getDate()-1)}else break}return n}
function calendar(){let c=$("calendar");c.innerHTML="";let start=new Date(new Date().getFullYear(),9,1),end=new Date(new Date().getFullYear(),11,31);for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){let e=document.createElement("div");e.className="day";let k=dateKey(d);e.textContent=d.getDate();if(db[k]&&isComplete(db[k]))e.classList.add("success");if(k===dateKey())e.classList.add("today");c.appendChild(e)}}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.page).classList.add("active")});
$("workoutBtn").onclick=()=>{day().workout=true;save()};
document.querySelectorAll(".check input").forEach(i=>i.onchange=()=>{day()[i.id]=i.checked;save()});
document.querySelectorAll("[data-water]").forEach(b=>b.onclick=()=>{let x=day();x.water=Math.max(0,Math.min(10,(x.water||0)+Number(b.dataset.water)));save()});
document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{let x=day();if(b.dataset.action==="saveSleep")x.sleep=Number($("sleep").value)||0;if(b.dataset.action==="saveSteps")x.steps=Number($("steps").value)||0;save()});
$("resetDay").onclick=()=>{if(confirm("Réinitialiser les objectifs d'aujourd'hui ?")){delete db[dateKey()];save()}};
$("clearBtn").onclick=()=>{if(confirm("Effacer toutes les données du Winter Arc ?")){db={};save()}};
$("exportBtn").onclick=()=>{let blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="winter-arc-donnees.json";a.click();URL.revokeObjectURL(a.href)};
render();
