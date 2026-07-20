const myVideo = document.getElementById("myVideo");

if (myVideo) {

navigator.mediaDevices
.getUserMedia({
video: true,
audio: true
})
.then(stream => {

myVideo.srcObject = stream;

})
.catch(error => {

console.log(error);

alert("Camera Permission Denied");

});

}