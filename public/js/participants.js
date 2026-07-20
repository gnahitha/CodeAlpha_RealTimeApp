const participantsBtn=document.getElementById("participantsBtn");

const participantsPanel=document.getElementById("participantsPanel");

const closeParticipants=document.getElementById("closeParticipants");

if(participantsBtn){

participantsBtn.onclick=()=>{

participantsPanel.classList.add("open");

}

}

if(closeParticipants){

closeParticipants.onclick=()=>{

participantsPanel.classList.remove("open");

}

}