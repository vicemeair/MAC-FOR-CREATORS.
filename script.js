// URL publique du Cloudflare Worker à compléter après son déploiement.
const API_BASE_URL="https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev";
const GOAL_EUR=400;
const input=document.getElementById("custom-amount");
const message=document.getElementById("payment-message");
const buttons=[...document.querySelectorAll("[data-amount]")];
function setAmount(value){input.value=String(value);buttons.forEach(b=>b.classList.toggle("selected",Number(b.dataset.amount)===Number(value)));}
buttons.forEach(b=>b.addEventListener("click",()=>setAmount(b.dataset.amount)));
input.addEventListener("input",()=>buttons.forEach(b=>b.classList.toggle("selected",Number(b.dataset.amount)===Number(input.value))));
async function refreshTotal(){try{const r=await fetch(API_BASE_URL+"/api/total");if(!r.ok)return;const d=await r.json();const total=Math.max(0,Number(d.total)||0);document.getElementById("raised").textContent=total.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});const p=Math.min(100,total/GOAL_EUR*100);document.getElementById("progress-fill").style.width=p+"%";document.getElementById("percentage").textContent=Math.round(p)+" %";}catch(_){}}
function initPayPal(){if(!window.paypal){message.textContent="Le bouton PayPal apparaîtra après la configuration du Client ID.";return;}if(API_BASE_URL.includes("YOUR-WORKER-NAME")){message.textContent="Le serveur sécurisé doit encore être configuré.";return;}
paypal.Buttons({style:{layout:"vertical",color:"gold",shape:"rect",label:"paypal",tagline:false},
createOrder:async()=>{const amount=Number(input.value);if(!Number.isFinite(amount)||amount<1||amount>400||Math.round(amount*100)!==amount*100){message.textContent="Choisissez un montant entre 1 € et 400 €.";throw new Error("Montant invalide");}message.textContent="Préparation du paiement sécurisé…";const r=await fetch(API_BASE_URL+"/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:amount.toFixed(2)})});const d=await r.json();if(!r.ok||!d.id)throw new Error(d.error||"Création du paiement impossible");return d.id;},
onApprove:async data=>{message.textContent="Confirmation du paiement…";const r=await fetch(API_BASE_URL+"/api/capture",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderID:data.orderID})});const d=await r.json();if(!r.ok||d.status!=="COMPLETED"){message.textContent="Paiement non confirmé. Contactez le responsable de la cagnotte.";return;}message.textContent="Merci beaucoup ! Votre contribution a bien été reçue ❤️";await refreshTotal();},
onCancel:()=>message.textContent="Paiement annulé. Vous pouvez réessayer.",onError:e=>{console.error(e);message.textContent="Une erreur est survenue. Réessayez plus tard.";}
}).render("#paypal-button-container");}
refreshTotal();window.addEventListener("load",initPayPal);