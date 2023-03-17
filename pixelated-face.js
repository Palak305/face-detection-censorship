// console.log('it works');
const video=document.querySelector('.webcam');

const canvas=document.querySelector('.video');
const ctx=canvas.getContext('2d');


const faceCanvas=document.querySelector('.face');
const facectx=faceCanvas.getContext('2d');

const faceDetector= new window.FaceDetector();
console.log(video,canvas,faceCanvas,faceDetector);
const SIZE=10;
const SCALE=1.35;


//function to populate users video

async function populateVideo() //usimg users webcam to get the video //async because we have to wait to get the users stream from webcam
{
  const stream=await navigator.mediaDevices.getUserMedia({
    video:{ width:1280, height:720}
  });
//  console.log(stream); //promises to get the video stream eventually
video.srcObject=stream; // putting the stream content in  the video
await video.play();
//size the canvas to be the same size as video
canvas.width=video.videoWidth;
canvas.height=video.videoHeight;
faceCanvas.width=video.videoWidth;
faceCanvas.height=video.videoHeight;
}
async function detect()
{
  const faces= await faceDetector.detect(video);
  //console.log(faces.length); how many faces detected
  faces.forEach(facedraw);//for each face draw a box around it
  faces.forEach(censor);
  //ask the browser for next animation frame and run detect for it
  requestAnimationFrame(detect); //recursion
}

populateVideo().then(detect);// first populate the video then detect face 

function facedraw(face) // to draw rectangles arou d detected faces
{
 const {width,height,top,left}=face.boundingBox; //take from these properties from the bounding box in the console
//  console.log({width,height,top,left});
ctx.clearRect(0,0,canvas.width,canvas.height); //every time it runs it clears the canvas based on top and left using canvas width and height
ctx.strokeStyle='#ffc600';
ctx.lineWidth=2;
  ctx.strokeRect(left,top,width,height); //api fr drawing a rectangle
}

function censor({boundingBox:face}) //to pixelate the face //bounding box renamed as face
{
//  console.log(face);
facectx.imageSmoothingEnabled=false; // to enable bluring
facectx.clearRect(0,0,faceCanvas.width,faceCanvas.height);
//draw the small face
facectx.drawImage(
  video, //Ffrom where should i grab the photo
  face.x, //from what x and y shpould i START CAPTURING
  face.y,  //from what x and y shpould i START CAPTURING
  face.width, 
  face.height,
  
  //DRAWING
  face.x, //where should I start drawing the x and y
  face.y,
  SIZE, //upo what widht and height should I draw
  SIZE,
)

//draw that small face back on but scale up
const width=face.width*SCALE;
const height=face.height*SCALE;

facectx.drawImage(
  faceCanvas, //source
  face.x,
  face.y,
  SIZE,
  SIZE,

  //drawing
   face.x - (width-face.width)/2,
   face.y - (height-face.height)/2,
   width,
   height,
)

}
