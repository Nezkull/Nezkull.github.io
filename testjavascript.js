// BEGIN TO CONVERT CODE FROM ES5 TO ES6

/*__________________TO_DO_____________________
    ___ Need to be able to disable the navbar on the main page when modals are active/ have a scroll bar.
        ___ Other option split captions up into seperate strings in an array for each project. <-- (probably this one)
    _X_ Reorganize the css, JSON, js, and html files as needed.
        ___ Do it again after adding in more style sets. (base HTML -> Classes -> IDs -> IDs w/ extensions -> animations)
    
  __________________MAYBE_DO_____________________
    ___ Try loading all of the the HTML from JSON file (?). <-- (Probably won't be horrible to do)
    ___ Add download buttons for demos, project exes, apks, etc.
    ___ Look into adding contact functionality that works on the main page. <-- (not even sure where to begin with this, never done it before)
    ___ Try to generate the modals dynamically. <-- (this wouldn't be hard at all, just kind of an extra step)
*/

// global variables, slim these down to bare essentials
let outerDiv, contentTag, captionDiv, linkTag, closure, fileExten, sourceTag, buttonTag, inputTag, videoControls, body, divTag;
let slideIndex = [1,1,1,1,1,1,1,1];
let slideId = [];

// these are built in the HTML file, used as references to generate other content or reference page locations
let modals = document.getElementsByClassName("modal");
let imgs = document.getElementsByClassName("img");
let vids = document.getElementsByTagName("video");

let bars = document.getElementsByClassName("progressBar");
let sliders = document.getElementsByClassName("volumeSlider"); // this might be useless if the hover mute button to show volume slider code doesn't work

// an array of all of the custom video control objects on the page
// let controls = document.getElementsByClassName(data.repeatedClasses[7]);

// ******* maybe have an array of video controls and just access child components like buttons and sliders. ******** Do this later

// load data from JSON
let requestURL = 'content.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

// run setup functions after JSON file has been loaded
request.onload = () => {
    const data = request.response;
    
    createBodyDivs(data);
    buildNavbar(data);
    
    generateModalContent(data);
    populateAbout(data);
    setupSlides();
};

// creates the navbar and grid divs in the body
const createBodyDivs = (data) => {
    body = document.querySelector("body");
    
    for(let i = 0; i < data.bodyIds.length; i++){
        divTag = document.createElement("div");
        divTag.id = data.bodyIds[i];
        body.appendChild(divTag);
    }
};

// constructs navbar HTML structure
const buildNavbar = (data) => {
    outerDiv = document.querySelector("#navbar");
    
    divTag = document.createElement("div");
    divTag.id = data.navbarLinks[0];        // sets id to links
    
    outerDiv.appendChild(divTag);
    
    outerDiv = document.querySelector("#links");    // set outerDiv to links
    
    // loop through all navbar links from JSON, skip the first array entry
    for(let i = 1; i < data.navbarLinks.length; i++){
        divTag = document.createElement("a");
        divTag.href = "#" + data.navbarLinks[i];    // set href
        divTag.innerHTML = data.navbarLinks[i];     // set innerHTML text
        
        outerDiv.appendChild(divTag);
    }
};

// constructs grid HTML structure
const buildGrid = (data) => {
    outerDiv = document.querySelector("#grid");
    divTag = document.createElement("div");
    
    divTag.id = "home";
    outerDiv.appendChild(divTag);
    
    outerDiv = doocument.querySelector("#home");
    
    divTag = document.createElement("div");
    divTag.id = "headers";
    
    outerDiv.appendChild(divTag);
    
    outerDiv = document.querySelector("#headers");
    
    
};

// function that populates the about section in the html. Accepted parameter is a string from the JSON data 
const populateAbout = (data) => {
    let aboutMe = document.querySelector('#about');
    
    aboutMe.innerHTML = data.aboutMe[0];
};

// called after the JSON request has loaded, creates image tags and sets their value
const generateModalContent = (data) => {
    
    // outer loop, iterates through all projects
    for(let i = 0; i < data.projects.length; i++){
        
        // create,set, and add closure to the modal
        closure = document.createElement("span");
        closure.className = data.repeatedClasses[6];    // [6] close
        closure.innerHTML = data.repeatedTextValues[2]; // [2] X
        
        //pauses videos when modal is closed
        closure.onclick = () => {
            modals[i].style.display = "none";
            pauseVid();
        };
        
        // adding the closure button to the slideshows
        modals[i].appendChild(closure);
        
        // inner loop to generate slideshow image html tags for each project
        for(let j = 0; j < data.projects[i].links.length; j++){
            
            // create and build slideshow containers
            outerDiv = document.createElement("div");
            
            // populating an array of close classes depending on the number of slides loaded from the JSON
            if(j == 0){
                slideId.push(data.repeatedClasses[13] + (i + 1)); // [13] mySlides + n
                // n is a value appended to the end of the class to help differentiate between different slide sets
            }
            
            // adding all of the personal classes to an array for later referencing
            outerDiv.className = slideId[i] + " " + data.repeatedClasses[0]; // [0] fade
            
            // pass each link associated with a specific porject to the checkFileExtension function
            fileExten = checkFileExtension(data.projects[i].links[j]);
            
            // check if link is a video, else its an image
            if(fileExten == "mp4" || fileExten == "ogg" || fileExten == "webM"){
                // create, set, and add video to slideshow
                contentTag = document.createElement("video");
                contentTag.className = data.repeatedClasses[2]; // [2] model-content
                contentTag.controls = false;                    // disables default video controls
                contentTag.poster = data.projects[i].thumbNail;  // sets video thumbnail
                contentTag.volume = 0.5;                        // set default volume value
                sourceTag = document.createElement("source");
                sourceTag.src = data.projects[i].links[j];
                sourceTag.type = "video/" + fileExten;
                contentTag.appendChild(sourceTag);
                
                // creating and adding event listener to the video tag that triggers whenever the timeline on the video is changed
                contentTag.addEventListener('timeupdate', () => {
                    for(let l = 0; l < vids.length; l++){
                        let percent = Math.floor((100 / vids[l].duration) * vids[l].currentTime);
                        bars[l].value = percent;
                    }
                });
                
                // add content to slideshow
                outerDiv.appendChild(contentTag);
                
                // video controls panel generation begins here
                videoControls = document.createElement("div");
                videoControls.className = data.repeatedClasses[7]; // 7 videoControls
                
                // play/pause button generation code
                buttonTag = document.createElement("button");
                buttonTag.type = "button";
                buttonTag.className = data.repeatedClasses[8] + " " + data.repeatedClasses[0]; // 8 playPause  0 fade
                buttonTag.innerHTML = "Play";
                
                // need to fix the button text not changing 
                // custom play/pause button
                buttonTag.addEventListener('click', () => {
                    for(let l = 0; l < vids.length; l++){
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            if(vids[l].paused === true){
                                vids[l].play();
                                this.innerHTML = "Pause";
                            }else{
                                vids[l].pause();
                                this.innerHTML = "Play";
                            }
                        }
                    }
                });
                
                // play/pause button added to videoControls panel
                videoControls.appendChild(buttonTag);
                
                // progressBar generation code
                inputTag = document.createElement("input");
                inputTag.type = "range";
                inputTag.className = data.repeatedClasses[9] + " " + data.repeatedClasses[0]; // 9 progressBar  0 fade
                inputTag.value = 0;
                
                // update to ES6 arrow function
                inputTag.addEventListener("click", function(e){
                    for(let l = 0; l < vids.length; l++){
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            
                            var percent = e.offsetX / this.offsetWidth;  
                            vids[l].currentTime = percent * vids[l].duration;
                            e.target.value = Math.floor(percent / 100);
                        }
                    }
                });
                
                // video progress bar added to controls
                videoControls.appendChild(inputTag);
                
                // maybe try to set the volume slider and mute button up to the same thing, show slider on hover otherwise click volume to mute?
                // mute button generation code
                buttonTag = document.createElement("button");
                buttonTag.type = "button";
                buttonTag.className = data.repeatedClasses[10] + " " + data.repeatedClasses[0]; // 10 mute  0 fade
                buttonTag.innerHTML = "Mute";
                
                // creating and adding event listener that triggers when the mute button is clicked
                buttonTag.addEventListener('click', () => {
                    for(let l = 0; l < vids.length; l++){
                        // check the vidsArr src against the current link
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            // check current muted state
                            if(vids[l].muted == false){
                                vids[l].muted = true;
                                this.innerHTML = "Unmute";
                                // make this unmuted icon instead
                            }else{
                                vids[l].muted = false;
                                this.innerHTML = "Mute";
                                // make this mute icon instead
                            }
                        }
                    }
                });
                
                // mute button added to videoControls panel
                videoControls.appendChild(buttonTag);
                
                // volume slider generation code
                inputTag = document.createElement("input");
                inputTag.type = "range";
                inputTag.className = data.repeatedClasses[11] + " " + data.repeatedClasses[0]; // 11 volumeSlider
                inputTag.min = 0;
                inputTag.max = 1;
                inputTag.step = 0.1;
                inputTag.value = 0.5;
                // need to look at the default volume for each video, might need to modify JSON to set each initial value to a more reasonable level
                
                // eventlistener that updates the videos volume level whenever the user changes it on the slider
                inputTag.addEventListener("change", function(e) {
                    for(let l = 0; l < vids.length; l++){
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            vids[l].volume = e.target.value;
                        }
                    }
                });
                
                // volume slider added to videoControls panel
                videoControls.appendChild(inputTag);
                
                // fullscreen button generation code
                buttonTag = document.createElement("button");
                buttonTag.type = "button";
                buttonTag.className = data.repeatedClasses[12] + " " + data.repeatedClasses[0]; // 12 fullScreen  0 fade
                buttonTag.innerHTML = "Full-Screen";
                
                // default controls appear when in fullscreen, need to change this once custom controls are fully working
                
                // creating and adding event listener that triggers when the fullscreen button is clicked
                buttonTag.addEventListener('click', () => {
                    // there is an error thrown in the main if statement, but it is not page breaking, maybe just try catch and drop it
                    for(let l = 0; l < vids.length; l++){
                        // check the vidsArr src against the current link
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            if(vids[l].requestFullscreen){
                                vids[l].requestFullscreen();
                            }
                            else if(vids[l].mozRequestFullscreen){
                                vids[l].mozRequestFullscreen();   // firefox
                            }
                            else if(vids[l].webkitRequestFullscreen){
                                vids[l].webkitRequestFullscreen(); // chrome & safari
                            }
                        }
                    }
                });
                
                // full-screen button added to videoControls panel
                videoControls.appendChild(buttonTag);
                
                // videoControls panel added to each video slide
                outerDiv.appendChild(videoControls);
                
            }
            // Slideshow image logic
            else{
                // create, set, and add image to slideshow container
                contentTag = document.createElement("img");
                contentTag.className = data.repeatedClasses[2]; // [2] modal-content
                contentTag.src = data.projects[i].links[j];
                // add content to slideshow
                outerDiv.appendChild(contentTag);
            }
            
            // add slideshow containers to modal
            modals[i].appendChild(outerDiv);
        }
        
        // this is important, currently there isn't any form of scrolling for if there is too much text.
        // by breaking it up into an array the captionTag code will have to be moved into the second loop so that it all gets loaded properly
        // maybe make the caption attribute an array so that content can be broken up or tailored to specific images or videos
        
        // create, set, and add the caption to the modal
        captionDiv = document.createElement("div");
        captionDiv.className = data.repeatedClasses[3];
        captionDiv.innerHTML = data.projects[i].description;
        modals[i].appendChild(captionDiv);
        
        // creates two link tags
        for(let k = 0; k < 2; k++){
            // create, set, and add links to modal
            linkTag = document.createElement("a");
            linkTag.className = data.repeatedClasses[4 + k];
            
            linkTag.onclick = () => { plusSlides(data.repeatedIntValues[k],i); };
            
            linkTag.innerHTML = data.repeatedTextValues[k];
            modals[i].appendChild(linkTag);
        }
        
        // give each image onclick functionality
        imgs[i].onclick = () => {
            // enable the modal
            modals[i].style.display = "block";
        };
    }
}

// this can be made to be more dynamic
// function that displays the initial slide for each slideshow
const setupSlides = () => {
    showSlides(1, 0);
    showSlides(1, 1);
    showSlides(1, 2);
    showSlides(1, 3);
};

// Displays next slide in slideshow
const plusSlides = (n, no) => {
    showSlides(slideIndex[no] += n , no);
};

// function that displays the current image for the specified slideshow. n: current slide, no: specific slideshow
const showSlides = (n, no) => {
    let x = document.getElementsByClassName(slideId[no]);
    
    // user has looped through all slides, go to the first
    if(n > x.length) {
        slideIndex[no] = 1;
    }
    
    // user has looped through all slides backwards, go to last slide
    if(n < 1){   
        slideIndex[no] = x.length;
    }
    
    // hide all slides that aren't in view
    for(let i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }
    
    // display the slide
    x[slideIndex[no]-1].style.display = "block";
    
    // call the pause vid function to pause the video if it was left running
    pauseVid();
};

// function that returns the file extension for the file link that is passed in as a parameter
const checkFileExtension = (currLink) => {
    return currLink.split('.').pop();
};

// function that pauses the video if it was left playing when changing to next slide
const pauseVid = () => {
    for(let i = 0; i < vids.length; i++){
        if(!vids[i].paused){
            vids[i].pause();
        }
    }
};