/*__________________TO_DO_____________________
    ___ Need to be able to disable the navbar on the main page when modals are active/ have a scroll bar.
        ___ Other option split captions up into seperate strings in an array for each project. <-- (probably this one)
    ___ Try to stylize the video controls to fit the page theme.
        ___ To do this I'm probably going to have to build/design my own media player. <-- (probably this one) <<__ (this has been started and is working fairly well)
        ___ Stylize/position custom video controls. (Maybe make use of ReactJS to do this?)
    _X_ Reorganize the css, JSON, js, and html files as needed.
        ___ Do it again after adding in more style sets. (base HTML -> Classes -> IDs -> IDs w/ extensions -> animations)
    _X_ Fill the about me section out with more personal info or something.
    _X_ Add contact info onto the main page.
        _X_ Add new href and stuff or something.
    _X_ Make use of the important class to break up the color monatony of text.
    
  __________________MAYBE_DO_____________________
    ___ Try loading all of the the HTML from JSON file (?). <-- (Probably won't be horrible to do, but will require a ton of code refactoring)
    ___ Add download buttons for demos, project exes, apks, etc. <-- (wouldn't be hard to do, but will add alot to overall file size)
    ___ Look into adding contact functionality that works on the main page. <-- (not even sure where to begin with this, never done it before) <<-- (currently, this doesn't seem possible)
    ___ Try to generate the modals dynamically. <-- (this wouldn't be hard at all, just kind of an extra step) <<-- (trying to do this caused more of an issue than I think that doing it this way is worth)
    ___ Remove the slide count tags (?). <-- (not sure yet if this should stay or not, gives good info but doesn't really fit in)
    ___ 
*/

// global variables
let outerDiv, countDiv, contentTag, captionDiv, linkTag, closure, fileExten, sourceTag, buttonTag, inputTag, videoControls;
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
request.onload = function(){
    const data = request.response;
    generateModalContent(data);
    setupSlides();
    populateAbout(data);
}

// function that populates the about section in the html. Accepted parameter is the JSON data that is loaded in from the 
function populateAbout(data){
    let aboutMe = document.querySelector('#about');
    
    aboutMe.innerHTML = data.aboutMe[0];
}

// called once the JSON request has loaded, creates image tags and sets their value
function generateModalContent(data){
    // outer loop, iterates through all projects
    for(let i = 0; i < data.projects.length; i++){
        
        // create,set, and add closure to the modal
        closure = document.createElement("span");
        closure.className = data.repeatedClasses[6];
        closure.innerHTML = data.repeatedTextValues[2];
        
        closure.onclick = function(){
            modals[i].style.display = "none";
            pauseVid();
        }
        // adding the closure button to the slideshows
        modals[i].appendChild(closure);
        
        // inner loop to generate slideshow image html tags for each project
        for(let j = 0; j < data.projects[i].links.length; j++){
            
            // create and build slideshow containers
            outerDiv = document.createElement("div");
            
            // populating an array of clise classes depending on the number of slides loaded from the JSON
            if(j == 0){
                slideId.push(data.repeatedClasses[13] + (i + 1));
            }
            
            // adding all of the personal classes to an array for later referencing
            outerDiv.className = slideId[i] + " " + data.repeatedClasses[0];
            
            // pass each link associated with a specific porject to the checkFileExtension function
            fileExten = checkFileExtension(data.projects[i].links[j]);
            
            // check if link is a video, else its an image
            if(fileExten == "mp4" || fileExten == "ogg" || fileExten == "webM"){
                // create, set, and add video to slideshow
                contentTag = document.createElement("video");
                contentTag.className = data.repeatedClasses[2];
                contentTag.controls = false;
                contentTag.poster = data.projects[i].links[0];
                contentTag.volume = 0.5;
                sourceTag = document.createElement("source");
                sourceTag.src = data.projects[i].links[j];
                sourceTag.type = "video/" + fileExten;
                contentTag.appendChild(sourceTag);
                
                // creating and adding event listener to the video tag that triggers whenever the timeline on the video is updated
                contentTag.addEventListener("timeupdate", function(){
                    for(let l = 0; l < vids.length; l++){
                        var percentage = Math.floor((100 / vids[l].duration) * vids[l].currentTime);
                        bars[l].value = percentage;
                    } 
                });
                
                outerDiv.appendChild(contentTag);
                
                // video controls panel generation begins here
                videoControls = document.createElement("div");
                videoControls.className = data.repeatedClasses[7]; // 7 videoControls
                
                // play/pause button generation code
                buttonTag = document.createElement("button");
                buttonTag.type = "button";
                buttonTag.className = data.repeatedClasses[8] + " " + data.repeatedClasses[0]; // 8 playPause  0 fade
                buttonTag.innerHTML = "Play";
                
                // custom play/pause works now
                buttonTag.addEventListener("click", function(){
                    for(let l = 0; l < vids.length; l++){
                        // check the vidsArr src against the current link
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            // check current play state
                            if(vids[l].paused == true){
                                vids[l].play();
                                this.innerHTML = "Pause";
                                // make this a pause icon instead later
                            }else{
                                vids[l].pause();
                                this.innerHTML = "Play";
                                // make this a play icon instead later
                            }
                        }
                    }
                });
                // play/pause button added to videoControls panel
                videoControls.appendChild(buttonTag);
                
                
                // this doesn't work at all (progress bar)
                
                // progressBar generation code
                inputTag = document.createElement("input");
                inputTag.type = "range";
                inputTag.className = data.repeatedClasses[9] + " " + data.repeatedClasses[0]; // 9 progressBar  0 fade
                inputTag.value = 0;
                
                inputTag.addEventListener("click", function(e){
                    for(let l = 0; l < vids.length; l++){
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            
                            // do logic check and then have return for true statement, else disable visibility of volume slider
                            
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
                buttonTag.addEventListener("click", function(){
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
                
                // kinda works, the setTimeout works but as soon as you mouseover it starts instead of while
                buttonTag.addEventListener("mouseover", function(e){
                    // maybe change it to while hover show stuff
                    setTimeout( function(){
                        for(let l = 0; l < vids.length; l++){
                            // only access the controls associated with the videos that are for the specific project
                            if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                                // there should be the same number of videos as there are number of custom controls, so the index for a specific video should be the same index for that video's custom controls
                                // allow the user to see the volume slider
                                sliders[l].style.visibility = "visible"; 
                            }
                        }
                    }, 1000);
                    
                });
                // if user mouseouts before slider is visible slider stays visible - look into this more
                // this works need to allow user to be able to scroll over to the volume slider
                buttonTag.addEventListener("mouseout", function(){
                    for(let l = 0; l < vids.length; l++){
                            // only access the controls associated with the videos that are for the specific project
                            if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                                // there should be the same number of videos as there are number of custom controls, so the index for a specific video should be the same index for that video's custom controls
                                
                                // allow the user to see the volume slider
                                sliders[l].style.visibility = "hidden"; 
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
                // inputTag.style.visibility = "hidden"; // if the lower eventListener is uncommented this should be set to hidden
                // need to look at the default volume for each video, might need to modify JSON to set each initial value to a more reasonable level
                
                // eventlistener that updates the videos volume level whenever the user changes it on the slider
                inputTag.addEventListener("change", function(e) {
                    for(let l = 0; l < vids.length; l++){
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            vids[l].volume = e.target.value;
                        }
                    }
                });
                // this works but another part that is needed for this is not done yet
                /*
                inputTag.addEventListener("mouseover", function(){
                    for(let l = 0; l < vids.length; l++){
                        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
                            // if the mouse is no longer hovering over the volume slider, then hide it
                            sliders[l].style.visibility = "visible";
                        }
                    }
                });
                */
                // volume slider added to videoControls panel
                videoControls.appendChild(inputTag);
                
                
                // the fade class & animation doesn't seem to be doing anything for the video controls, pretty much entirely due to not affecting the right properties
                
                
                // fullscreen button generation code
                buttonTag = document.createElement("button");
                buttonTag.type = "button";
                buttonTag.className = data.repeatedClasses[12] + " " + data.repeatedClasses[0]; // 12 fullScreen  0 fade
                buttonTag.innerHTML = "Full-Screen";
                
                // default controls appear when in fullscreen, need to change this once custom controls are fully working
                
                // creating and adding event listener that triggers when the fullscreen button is clicked
                buttonTag.addEventListener("click", function(){
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
            else{
                // create, set, and add image to slideshow container
                contentTag = document.createElement("img");
                contentTag.className = data.repeatedClasses[2];
                contentTag.src = data.projects[i].links[j];
                outerDiv.appendChild(contentTag);
            }
            
            // add slideshow containers to modal
            modals[i].appendChild(outerDiv);
        }
        
        // this is important, currently there isn't any form of scrolling for if there is too much text, well there is but it isn't reliable.
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
            linkTag.onclick = function(){ plusSlides(data.repeatedIntValues[k],i); }
            linkTag.innerHTML = data.repeatedTextValues[k];
            modals[i].appendChild(linkTag);
        }
        
        // give each image onclick functionality
        imgs[i].onclick = function(){
            // enable the modal
            modals[i].style.display = "block";
        }
    }
}

// Displays starting slide for each slideshow
// function that
function setupSlides(){
    showSlides(1, 0);
    showSlides(1, 1);
    showSlides(1, 2);
    showSlides(1, 3);
    showSlides(1, 4);
    showSlides(1, 5);
    showSlides(1, 6);
    showSlides(1, 7);
}

// Displays next slide in slideshow
function plusSlides(n, no){
    showSlides(slideIndex[no] += n , no);
}

// function that displays the current image for the specified slideshow. n: current slide, no: specific slideshow
function showSlides(n, no){
    let x = document.getElementsByClassName(slideId[no]);
    
    if(n > x.length) {
        slideIndex[no] = 1;
    }
    
    if(n < 1){
        slideIndex[no] = x.length;
    }
    
    for(let i = 0; i < x.length; i++){
        x[i].style.display = "none";
    }
    x[slideIndex[no]-1].style.display = "block";
    
    // call the pause vid function to pause the video if it was left running
    pauseVid();
}

// function that returns the file extension for the file link that is passed in as a parameter
function checkFileExtension(currLink){
    return currLink.split('.').pop();
}

// maybe add all of the video control divs to an array, then each child will be accessible as needed

// function that pauses the video if it was left playing when changing to next slide
function pauseVid(){
    for(let i = 0; i < vids.length; i++){
        if(!vids[i].paused){
            vids[i].pause();
        }
    }
}

// Not sure if I am actually using this at this point in time. It looks like the function originally had a different purpose, from the function name, but the code doesn't correspond with that in any considerable way. If unused just remove it entirely.

// function that sets a specific volume slider's visibility style property 
function volumeTimer(i, j){
    for(let l = 0; l < vids.length; l++){
        // only access the controls associated with the videos that are for the specific project
        if(vids[l].firstChild.src.includes(data.projects[i].links[j])){
            // there should be the same number of videos as there are number of custom controls, so the index for a specific video should be the same index for that video's custom controls
            // allow the user to see the volume slider
            sliders[l].style.visibility = "visible"; 
        } else {
            // hide the slider if the user moves off of the mute button
            sliders[l].style.visibility = "hidden";
        }
    }
}