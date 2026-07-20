const shareBtn = document.getElementById("shareScreenBtn");

if(shareBtn){

shareBtn.onclick = async ()=>{

try{

const stream = await navigator.mediaDevices.getDisplayMedia({

video:true

});

const videoTrack = stream.getVideoTracks()[0];

myVideo.srcObject = stream;

videoTrack.onended=()=>{

location.reload();

};

}catch(err){

console.log(err);

}

}

}