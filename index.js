var allSong=[];
var titles=[];
var folders=[];
// https://github.com/Kaustav2004/Media-Player/tree/99979970b6db08cb670b8c8f7cbaa5fb49bb150e/songs
var currFolder='songs/Arijit Singh';
var autoplay=false;
var playAuto=document.querySelectorAll(".autoplay");
var cont=document.querySelector(".autoplayimg");

// seconds convert to minutes:seconds format
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    return formattedMinutes + ':' + formattedSeconds;
}

// function for get all folder
async function getFolder(songs){

    // fetchong all folder from main folder
    let folder=await fetch(`https://github.com/Kaustav2004/Media-Player/tree/99979970b6db08cb670b8c8f7cbaa5fb49bb150e/songs`);
    let text1=await folder.text();

    // push text element into html format
    let div=document.createElement("div");
    div.innerHTML=text1;

    // store list of song folder which is HTML collection
    let collectionHtml=div.getElementsByTagName("li");
    let arr=Array.from(collectionHtml);

    // push into folder array
    for (let index = 1; index < arr.length; index++) {
        const element = arr[index];
        const temp=element.getElementsByTagName('span')[0];
        folders.push(temp.innerHTML);
    }

}

// Function for store title and link from local folder
async function getSogs(currFolder){

    // fetching all songs from local folder
    let song=await fetch(`/${currFolder}/`);

    // converting promise to text format
    let text=await song.text();
    
    // push text element into html format
    let div=document.createElement("div");
    div.innerHTML=text;

    // fetch all anchor tag elements because all songs present in this tag
    let songLink=div.getElementsByClassName('icon-mp3');

    // store all songs link and tittle into array
    allSong=[];
    titles=[];
    for (let index = 0; index < songLink.length; index++) {
        const element=songLink[index];
        let link=element.getAttribute('href');
        let title=element.getAttribute('title').replace(".mp3"," ");
        allSong.push(link);
        titles.push(title.trim());
    }
}

// creating a div in library in side bar
function addsong(){
    insertpos.innerHTML="";
for (let index = 0; index < titles.length; index++) {
  
  insertpos.innerHTML+=`<div class="sidebarsong flex center items-center sidebarsong-font">
                       <img src="music.svg" class="invert logo-new">
                       <div>
                       <div class="width-name default">${titles[index]}</div>
                       </div>
                       <div class="flex items-center gap1">
                           <div class="default">Play Now</div>
                           <img src="play-outline.svg" class="invert logo-new cursor">
                       </div>
                       </div>`;

}
}

// creating div to showing folder in playlist
async function addFolder(){
    let i=0;
    for (let index = 0; index < folders.length; index++) {
        let currFolder=folders[index];
        let card_container=document.querySelector(".card-cont");
        let imgSrc="songs/"+`${currFolder}`+"/image/img.jpg";
        currFolder.replace("%20"," ");
        let textsrc="songs/"+`${currFolder}`+"/text/textfile.json";
        let a=await fetch(`${textsrc}`);
        a= await a.json();
        a=a.tittle;
        card_container.innerHTML+=`<div class="card">
                                    <div class="imgDiv"> 
                                        <img src="https://i.scdn.co/image/ab67706f00000002a98e80d2fc9b1cf3b80c4481" class="folder-img">
                                    </div>

                                    <h3 class="font-left color-white folder-name">${folders[index]}</h3>
                                    <p class="card-font para text">${a}</p>
                                    <div class="svg1 flex items-center autoplay">
                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32">
                                            <path d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm-6 24V8l16.008 8L10 24z" fill="#36e364" class="fill-4e4e50"></path>
                                        </svg>                                                           
                                    </div>  
                                </div>`

        let image1=document.querySelectorAll(".folder-img");
        image1=image1[i++];
        image1.src=imgSrc;
    }
}

// global variables
let play1=document.querySelector("#play");
let playbar=document.querySelector(".topbar");
let songTime=document.querySelector(".time");
let circle=document.querySelector(".circle");
let circle1=document.querySelector(".circle1");
let insertpos=document.querySelector(".l1");
let currentSongName;
let currentSong;
var audio=new Audio();

// function to play song
function play(source){
    // if prevsong is same as currsong then just play prevsong no need to create new audio
    // for this audio can stopped when it was paused
    if(currentSongName!=source.replace(".mp3","")){
        audio = new Audio(`${currFolder}/`+source);
        audio.play();
    }
    else{
        currentSong.play();
        audio=currentSong;
    }
    audio.volume=0.7;
    document.querySelector(".volume").setAttribute("style",`opacity:1`);
    circle1.setAttribute("style",`left:${audio.volume*100}%`);
    
    play1.src="media-pause.svg";
    currentSongName=source.replace(".mp3","");
    playbar.querySelector(".songname").innerHTML=source.replace(".mp3","");
    audio.addEventListener('timeupdate', function() {
       songTime.innerHTML=`${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
       let width=document.querySelector(".track-bar").clientWidth;
       let distance=Math.floor(width*(audio.currentTime/audio.duration))*0.99;
       circle.setAttribute("style",`left:${distance}px;`);
       if(audio.currentTime==audio.duration){
         
         if(autoplay){
            let url=currentSong.src.replaceAll("%20"," ").replace(".mp3","");
            let part=url.split(`${currFolder}/`);
            let position=titles.indexOf(part[1]);
            if(position+1<titles.length){
                currentSong=play(titles[position+1]+".mp3");
            }
            else{
                play1.src="play.svg";
            }
         }
         else{
            play1.src="play.svg";
         }
       }
    });
    return audio;
}

//  adding eventlistener on play svg on left side
function playBar_left_event_add(songeventlistener){
    for (const iterator of songeventlistener) {
        iterator.addEventListener('click',()=>{
            let parentclass=iterator.parentNode.parentNode;
            let song=parentclass.querySelector(".width-name");
            currentSong.pause();
            currentSong=play(song.innerHTML.trim()+".mp3");
    
        })
    }
}

// adding eventlistner on playbutton of right side folder
function autoPlay(){
            autoplay=!autoplay;
            
            if(autoplay){
                cont.setAttribute("style","opacity:1");
            }
            else{
                cont.setAttribute("style","opacity:0.3;");
            }
}

// click on folder and song will loaded in side bar
 function addSongFromFolder(songeventlistener){
    let card=document.querySelectorAll(".card");
    let card_arr=Array.from(card);
    let temp_div=document.createElement("div");
    for (let index = 0; index < card_arr.length; index++) {
        let card_image=card_arr[index].querySelector(".folder-img");
        let button=card_arr[index].querySelector(".autoplay");
        card_image.addEventListener("click",async()=>{
            temp_div.innerHTML=card_arr[index].innerHTML;
            let name=card_arr[index].querySelector(".folder-name").innerHTML;
            currFolder=`songs/${name}`;
            await getSogs(`${currFolder}`);
            addsong();
            //  adding eventlistener on play svg on left side
            playBar_left_event_add(songeventlistener);
        })
        button.addEventListener("click",async()=>{
            temp_div.innerHTML=card_arr[index].innerHTML;
            let name=card_arr[index].querySelector(".folder-name").innerHTML;
            currFolder=`songs/${name}`;
            await getSogs(`${currFolder}`);
            addsong();
            //  adding eventlistener on play svg on left side
            playBar_left_event_add(songeventlistener);
            // autoplay activate and deactivate
            autoPlay();
            // if current song paused then play the folder song
            if(currentSongName!=titles[0]){
                currentSong.pause();
                currentSong=play(titles[0]+".mp3");
            }
            else if(currentSong.paused){
                currentSong=play(titles[0]+".mp3");
            }
        })
    }
}

// main function
async function main(){
 await getFolder();
 await addFolder();
 await getSogs(`${currFolder}`);
 addsong();
 let songeventlistener=document.getElementsByClassName("logo-new");
 currentSong=new Audio(`${currFolder}/`+titles[0].trim()+".mp3");
 currentSongName=titles[0];

//  adding eventlistener on play svg on left side
playBar_left_event_add(songeventlistener);

//  adding eventlistener on playbar
play1.addEventListener('click',()=>{
    if(currentSong.paused){
        play1.src="media-pause.svg";
        currentSong=play(currentSongName.trim()+".mp3");
        
    }
    else{
        currentSong.pause();
        play1.src="play.svg";

    }
})

// seekbar song movement
document.querySelector(".track-bar").addEventListener('click',(e)=>{
    let duration1=audio.duration;
    if((duration1)>0){
    let leftPos=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    circle.setAttribute("style",`left:${leftPos}%`);
    songTime.innerHTML=`${formatTime(duration1*leftPos/100)} / ${formatTime(duration1)}`;
    audio.currentTime=duration1*leftPos/100;
    }
})

// volume movement
document.querySelector(".sound-bar").addEventListener('click',(e)=>{
    let volume=audio.volume;
    let pos=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    circle1.setAttribute("style",`left:${pos}%`);
    audio.volume=pos/100;
    document.querySelector(".mute").src="speaker.svg";
    if(pos==0){
        document.querySelector(".mute").src="volume-mute.svg";
    }
})

// side bar show
document.querySelector("#menu").addEventListener('click',()=>{
    document.querySelector(".left").setAttribute("style","left:0%;width:350px;margin:0");
})
document.querySelector(".cross").addEventListener('click',()=>{
    document.querySelector(".left").setAttribute("style","left:-120%;");
})

// add eventlistner for previous
document.querySelector("#previous").addEventListener("click",()=>{
    let url=currentSong.src.replaceAll("%20"," ").replace(".mp3","");
    let part=url.split(`${currFolder}/`);
    let position=titles.indexOf(part[1]);
    if(position-1>=0){
        currentSong.pause();
        currentSong=play(titles[position-1]+".mp3");
    }
})

// add eventlistner for next
document.querySelector("#next").addEventListener("click",()=>{
    let url=currentSong.src.replaceAll("%20"," ").replace(".mp3","");
    let part=url.split(`${currFolder}/`);
    let position=titles.indexOf(part[1]);
    if(position+1<titles.length){
        currentSong.pause();
        currentSong=play(titles[position+1]+".mp3");
    }
})

// code for display default view of song in playbar
document.querySelector(".songname").innerHTML=currentSongName;
currentSong.addEventListener("loadedmetadata",(e)=>{
    songTime.innerHTML=`${formatTime(currentSong.currentTime)} / ${formatTime(e.currentTarget.duration)}`;
})

addSongFromFolder(songeventlistener);


let click=false;
cont.addEventListener("click",()=>{
    click=!click;
    if(click){
        autoplay=true;
        cont.setAttribute("style","opacity:1");
    }
    else{
        autoplay=false;
        cont.setAttribute("style","opacity:0.3;");
    }           
})

}

main();
