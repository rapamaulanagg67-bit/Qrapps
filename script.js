const $=s=>document.querySelector(s);
const splash=$("#splash"),home=$("#home"),success=$("#success"),bar=$("#bar"),timer=$("#timer");
const phone="083867468118";
let done=false,interval;

function goHome(){if(done)return;done=true;clearInterval(interval);splash.classList.remove("active");home.classList.add("active");window.scrollTo(0,0)}
function start(){
 let start=Date.now();
 interval=setInterval(()=>{
   let p=Math.min((Date.now()-start)/10000,1);
   bar.style.width=(p*100)+"%";
   let r=Math.max(0,Math.ceil(10-p*10));
   timer.textContent=r?`${r} detik`:"Membuka…";
   if(p>=1)goHome();
 },50);
}
$("#skip").onclick=goHome;

document.querySelectorAll(".method").forEach(btn=>{
 btn.onclick=()=>{
   document.querySelectorAll(".method").forEach(x=>x.classList.remove("selected"));
   btn.classList.add("selected");
   document.querySelectorAll(".radio").forEach(x=>x.textContent="○");
   btn.querySelector(".radio").textContent="✓";
   showToast(btn.dataset.method==="dana"?"Metode DANA dipilih":"Gunakan QR untuk scan pembayaran");
 };
});

const amount=$("#amount");
amount.addEventListener("input",()=>{
 let n=amount.value.replace(/\D/g,"");
 amount.value=n?new Intl.NumberFormat("id-ID").format(n):"";
});

async function copyPhone(){
 try{await navigator.clipboard.writeText(phone)}
 catch{const t=document.createElement("textarea");t.value=phone;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove()}
 showToast("✓ Nomor DANA berhasil disalin");
}
$("#copy").onclick=copyPhone;

$("#confirm").onclick=async()=>{
 await copyPhone();
 const raw=amount.value.replace(/\D/g,"");
 $("#summaryAmount").textContent="Rp"+(raw?new Intl.NumberFormat("id-ID").format(raw):"0");
 home.classList.remove("active");success.classList.add("active");window.scrollTo(0,0);
};

function openDana(){
 showToast("Nomor sudah disalin. Membuka DANA…");
 setTimeout(()=>{window.location.href="dana://"},250);
}
$("#openDana").onclick=openDana;
$("#backHome").onclick=()=>{success.classList.remove("active");home.classList.add("active");window.scrollTo(0,0)};

let toastTimer;
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}
start();
