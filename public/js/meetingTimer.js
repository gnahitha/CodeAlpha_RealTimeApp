let seconds=0;

setInterval(()=>{

seconds++;

const h=String(Math.floor(seconds/3600)).padStart(2,"0");

const m=String(Math.floor(seconds%3600/60)).padStart(2,"0");

const s=String(seconds%60).padStart(2,"0");

document.getElementById("meetingTimer").innerText=`${h}:${m}:${s}`;

},1000);