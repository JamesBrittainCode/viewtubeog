const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const uploadModal = document.getElementById('upload-modal');
const profileModal = document.getElementById('profile-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const uploadBtn = document.getElementById('upload-btn');
const editProfileButton = document.getElementById('edit-profile-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const userProfile = document.getElementById('user-profile');
const loginSignup = document.getElementById('login-signup');
const logoutButton = document.getElementById('logout-btn');
const submitLoginButton = document.getElementById('submit-login-btn');
const submitSignupButton = document.getElementById('submit-signup-btn');
const submitUploadButton = document.getElementById('submit-upload-btn');
const submitEditProfileButton = document.getElementById('submit-edit-profile');
const videoGrid = document.getElementById('video-grid');
const videoPage = document.getElementById('video-page');
const backToMainButton = document.getElementById('back-to-main');
const logo = document.querySelector('.logo');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const userProfilePage = document.getElementById('user-profile-page');
const userProfileVideos = document.getElementById('user-profile-videos');
const backToMainFromProfile = document.getElementById('back-to-main-from-profile');
const userProfileName = document.getElementById('user-profile-name');
let currentVideo = null;
let viewingUser = null;
// Placeholder Data
let videos = [];
let users = [
  { username: "PurpleArtist", email:"purple@art.com",password: "password1", subscribers: 150000, verified: false, channelName:"Purple Artist", channelLogo: null},
  { username: "StarGazer",email:"star@gaze.com", password: "password2", subscribers: 50000, verified: false, channelName:"Star Gazer", channelLogo: null },
  { username: "WaterLover", email:"water@love.com",password: "password3", subscribers: 15000, verified: false, channelName:"Water Lover", channelLogo: null }
];
let loggedInUser = null;
let whitelist = ["PurpleArtist"]; // Whitelisted users for verification

// Function to generate placeholder thumbnails
function generateThumbnail() {
    const canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Video', canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL();
}


// Function to verify users
function checkVerificationStatus(username, subscribers) {
    return whitelist.includes(username) || subscribers > 100000;
}
function updateDisplayBasedOnLogin(){
    if(loggedInUser){
        loginSignup.style.display = 'none';
        userProfile.style.display = 'block';
         document.getElementById('profile-username').textContent = `Welcome, ${loggedInUser.channelName}`;
          if(loggedInUser.channelLogo){
                document.getElementById('user-icon').style.backgroundImage = `url(${loggedInUser.channelLogo})`;
          } else{
                document.getElementById('user-icon').style.backgroundImage = `none`;
          }

    }else{
        loginSignup.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

// Function to add video cards to the homepage
function displayVideos() {
    videoGrid.innerHTML = '';
    videos.forEach(video => {
        const card = document.createElement('div');
        card.classList.add('video-card');
         if (video.isShort) {
            card.classList.add('short-card');
        }
        card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>
                    <span class="uploader-link" data-uploader="${video.uploader}">${video.uploader}</span> - ${video.views} views
                </p>
            </div>
        `;
         card.addEventListener('click', () => loadVideoPage(video.id));
        videoGrid.appendChild(card);
    });
      // Add event listeners to uploader links
   const uploaderLinks = document.querySelectorAll('.uploader-link');
  uploaderLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop the card event from firing
            const uploaderName = link.getAttribute('data-uploader');
            loadUserProfile(uploaderName);
    });
  });
}

function displayUserProfileVideos(user){
  userProfileVideos.innerHTML = "";
     const userVideos = videos.filter(video => video.uploader === user.username);
     userVideos.forEach(video => {
          const card = document.createElement('div');
        card.classList.add('video-card');
          if (video.isShort) {
            card.classList.add('short-card');
        }
        card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>
                     ${video.uploader} - ${video.views} views
                </p>
            </div>
        `;
         card.addEventListener('click', () => loadVideoPage(video.id));
       userProfileVideos.appendChild(card)
  })
}


function likeVideoOnPage() {
    if(currentVideo){
        currentVideo.likes++;
       document.getElementById('video-likes').textContent = currentVideo.likes;
    }
}
function commentVideoOnPage() {
      if (currentVideo && loggedInUser) {
        const comment = prompt("Enter your comment:");
      if(comment){
          currentVideo.comments.push({ user: loggedInUser.username, text:comment});
          renderComments();
      }
    }else{
      alert("You need to be logged in to comment.")
    }
}

function renderComments(){
    const commentArea = document.getElementById('comment-area');
    commentArea.innerHTML = "";
    if(currentVideo){
      currentVideo.comments.forEach(comment => {
          const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
           commentDiv.innerHTML = `<span class="user">${comment.user}: </span>${comment.text}`;
          commentArea.appendChild(commentDiv);
      })
    }

}

function loadVideoPage(videoId) {
    currentVideo = videos.find(v => v.id === videoId);
     if(currentVideo){
        videoGrid.style.display = "none";
        videoPage.style.display = "block";
            userProfilePage.style.display = 'none';
          const videoPlayer = document.getElementById('video-player');
            videoPlayer.src = currentVideo.videoUrl;
              videoPlayer.play();
             document.getElementById('video-title').textContent = currentVideo.title;
       document.getElementById('video-uploader').textContent = currentVideo.uploader;
        document.getElementById('video-views').textContent = `${currentVideo.views} views`;
        document.getElementById('video-likes').textContent = currentVideo.likes;
        renderComments();
        currentVideo.views++;
    }
}
function searchVideos(query){
    const results = videos.filter(video => video.title.toLowerCase().includes(query.toLowerCase()));
   videoGrid.innerHTML = '';
    if(results.length > 0){
      results.forEach(video => {
          const card = document.createElement('div');
           card.classList.add('video-card');
            if (video.isShort) {
                 card.classList.add('short-card');
             }
          card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-info">
                <h3>${video.title}</h3>
                <p> <span class="uploader-link" data-uploader="${video.uploader}">${video.uploader}</span> - ${video.views} views</p>
            </div>
        `;
         card.addEventListener('click', () => loadVideoPage(video.id));
        videoGrid.appendChild(card);
      });
       // Add event listeners to uploader links
   const uploaderLinks = document.querySelectorAll('.uploader-link');
  uploaderLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop the card event from firing
            const uploaderName = link.getAttribute('data-uploader');
            loadUserProfile(uploaderName);
    });
  });
    }else{
          const errorMessage = document.createElement('p');
        errorMessage.textContent = "No videos found";
      videoGrid.appendChild(errorMessage);
    }


}

function loadUserProfile(username) {
    viewingUser = users.find(user => user.username === username);

  if (viewingUser) {
       videoGrid.style.display = "none";
         videoPage.style.display = 'none';
        userProfilePage.style.display = "block";
          userProfileName.textContent = `${viewingUser.channelName}'s Profile`;
        displayUserProfileVideos(viewingUser);
    }
}


// Modal Handling Functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));
uploadBtn.addEventListener('click', () => openModal(uploadModal));
editProfileButton.addEventListener('click', () => openModal(profileModal));
backToMainButton.addEventListener('click', () => {
   const videoPlayer = document.getElementById('video-player');
    if(videoPlayer){
        videoPlayer.pause();
          videoPlayer.removeAttribute('src');
           videoGrid.style.display = 'grid';
        videoPage.style.display = 'none';
          userProfilePage.style.display = 'none';
         currentVideo = null;
          viewingUser = null;
    } else{
       videoGrid.style.display = 'grid';
        videoPage.style.display = 'none';
        userProfilePage.style.display = 'none';
         currentVideo = null;
        viewingUser = null;
    }

});
backToMainFromProfile.addEventListener('click', () => {
    videoGrid.style.display = "grid";
   userProfilePage.style.display = 'none';
      viewingUser = null;
})
logo.addEventListener('click', () => {
   const videoPlayer = document.getElementById('video-player');
    if(videoPlayer){
        videoPlayer.pause();
        videoPlayer.removeAttribute('src');
         videoGrid.style.display = 'grid';
         videoPage.style.display = 'none';
           userProfilePage.style.display = 'none';
         currentVideo = null;
         viewingUser = null;
    }else{
         videoGrid.style.display = 'grid';
          videoPage.style.display = 'none';
          userProfilePage.style.display = 'none';
        currentVideo = null;
         viewingUser = null;
    }
});
closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
    });
});
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        closeModal(loginModal);
    }
    if(event.target === signupModal){
         closeModal(signupModal);
    }
    if (event.target === uploadModal) {
        closeModal(uploadModal);
    }
   if(event.target === profileModal){
         closeModal(profileModal);
    }
});
submitLoginButton.addEventListener('click',()=>{
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;
  const user = users.find(user => user.username === loginUsername && user.password === loginPassword);
    if(user){
       loggedInUser = user;
       updateDisplayBasedOnLogin();
       closeModal(loginModal);
        alert("Login Successful!");
        document.getElementById('login-username').value = "";
        document.getElementById('login-password').value = "";
    }else{
        alert("Invalid Username or Password")
    }
});
submitSignupButton.addEventListener('click',()=>{
    const signupEmail = document.getElementById('signup-email').value;
  const signupUsername = document.getElementById('signup-username').value;
  const signupPassword = document.getElementById('signup-password').value;
  const userExists = users.some(user => user.username === signupUsername);

  if(signupUsername && signupPassword && signupEmail){
        if(!userExists){
              const newUser = {
              username: signupUsername,
                email: signupEmail,
              password: signupPassword,
              subscribers: 0,
              verified: false,
              channelName: signupUsername,
                channelLogo: null
            };
            users.push(newUser)
             alert("Signup Successful! Please Log in");
           closeModal(signupModal);
             document.getElementById('signup-email').value = "";
           document.getElementById('signup-username').value = "";
           document.getElementById('signup-password').value = "";
        }else{
              alert("User name already exists")
        }
  } else{
    alert("Please fill out all the form fields");
  }
});

submitUploadButton.addEventListener('click', () => {
    const uploadTitle = document.getElementById('upload-title').value;
    const uploadVideo = document.getElementById('upload-video').files[0];
     const uploadThumbnail = document.getElementById('upload-thumbnail').files[0];
    if(uploadTitle && uploadVideo){
          const videoUrl = URL.createObjectURL(uploadVideo);
             const thumbnailReader = new FileReader();
              thumbnailReader.onload = function (e){
                    const newThumbnail = e.target.result;
                         const videoElement = document.getElementById('video-player');
                    videoElement.src = videoUrl;
                       videoElement.addEventListener('loadedmetadata', () => {
                         const duration = videoElement.duration;
                           const newVideo = {
                            id: videos.length + 1,
                            title: uploadTitle,
                            uploader: loggedInUser ? loggedInUser.username : "Guest",
                            views: 0,
                            likes: 0,
                             comments: [],
                                 videoUrl: videoUrl,
                                 thumbnail: newThumbnail,
                             isShort: duration < 60

                          };
                          videos.push(newVideo);
                         displayVideos();
                           });
                     }
                  if(uploadThumbnail){
                         thumbnailReader.readAsDataURL(uploadThumbnail);
                        }else {
                             const videoElement = document.getElementById('video-player');
                               videoElement.src = videoUrl;
                           videoElement.addEventListener('loadedmetadata', () => {
                                const duration = videoElement.duration;
                                 const newVideo = {
                                    id: videos.length + 1,
                                    title: uploadTitle,
                                     uploader: loggedInUser ? loggedInUser.username : "Guest",
                                    views: 0,
                                    likes: 0,
                                      comments: [],
                                    videoUrl: videoUrl,
                                      thumbnail: generateThumbnail(),
                                     isShort: duration < 60
                            };
                            videos.push(newVideo);
                          displayVideos();
                     });
                }



        closeModal(uploadModal);
      document.getElementById('upload-title').value = "";
      document.getElementById('upload-video').value = "";
        document.getElementById('upload-thumbnail').value = "";
    }
  else {
      alert("Please fill out all the form fields");
  }
});
submitEditProfileButton.addEventListener('click',()=>{
  const newChannelName = document.getElementById('edit-channel-name').value;
  const newChannelLogo = document.getElementById('edit-channel-logo').files[0];
 if(newChannelName || newChannelLogo){
    if(newChannelName){
        loggedInUser.channelName = newChannelName;
    }
   if(newChannelLogo){
           const reader = new FileReader();
      reader.onload = function(e){
            loggedInUser.channelLogo = e.target.result;
                document.getElementById('user-icon').style.backgroundImage = `url(${loggedInUser.channelLogo})`
      }
        reader.readAsDataURL(newChannelLogo);

   }
   updateDisplayBasedOnLogin();
      closeModal(profileModal);
   document.getElementById('edit-channel-name').value ="";
  document.getElementById('edit-channel-logo').value = "";
 } else{
    alert("Please fill out the form");
 }

})

logoutButton.addEventListener('click',()=>{
    loggedInUser = null;
    updateDisplayBasedOnLogin();
     document.getElementById('user-icon').style.backgroundImage = `none`;
});
// Initial Display
displayVideos();
updateDisplayBasedOnLogin();

searchButton.addEventListener('click', ()=>{
   const query = searchInput.value;
   searchVideos(query);
})

git config --global user.email = "jthomasbrittain@gmail.com"
git config --global user.name = "James Brittain Code"