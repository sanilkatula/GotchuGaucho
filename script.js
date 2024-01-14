function showPage(pageId) {
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(pageId).style.display = 'block';

    // Initialize or adjust the map when the 'party-locator' page is shown
    if (pageId === 'party-locator') {
        setTimeout(function() {
            if (window.map) {
                window.map.invalidateSize();
            }
        }, 0);
    }
}

window.onload = function() {
    showPage('home');

    document.getElementById('partyPostsContainer').addEventListener('click', function(event) {
        if (event.target.classList.contains('action-button')) {
            var action = event.target.getAttribute('data-action');
            var postId = event.target.getAttribute('data-post-id');
            handleAction(action, postId);
            event.target.classList.toggle('active');
        }
    });
};




document.getElementById('postForm').addEventListener('submit', function(event){
    event.preventDefault();

    // Get user input
    var title = document.getElementById('partyTitle').value;
    var date = document.getElementById('partyDate').value;
    var time = document.getElementById('partyTime').value;
    var venue = document.getElementById('partyVenue').value;
    var description = document.getElementById('partyDescription').value;
    var image = document.getElementById('partyImage').files[0];

    // Create a new post element
    var postElement = document.createElement('div');
    postElement.classList.add('party-post');

    var imgElement = document.createElement('img');
    imgElement.src = image ? URL.createObjectURL(image) : 'default-image.jpg';
    imgElement.alt = 'Party Image';
    imgElement.classList.add('party-post-image');

    var contentElement = document.createElement('div');
    contentElement.classList.add('party-post-content');
    contentElement.innerHTML = `
        <h3>${title}</h3>
        <p><small>Posted on: ${new Date().toLocaleString()}</small></p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p>${description}</p>`;

    var actionsElement = document.createElement('div');
    actionsElement.classList.add('party-post-actions');
    actionsElement.innerHTML = `
        <button class="action-button">Like</button>
        <button class="action-button">Going</button>
        <button class="action-button">Not Going</button>
    `;

    postElement.appendChild(imgElement);
    postElement.appendChild(contentElement);
    postElement.appendChild(actionsElement);
    document.getElementById('partyPostsContainer').appendChild(postElement);

    // Clear the form
    document.getElementById('partyTitle').value = '';
    document.getElementById('partyDate').value = ''; // Clear the date input
    document.getElementById('partyTime').value = ''; // Clear the time input
    document.getElementById('partyVenue').value = ''; // Clear the venue input
    document.getElementById('partyDescription').value = '';
    document.getElementById('partyImage').value = '';
});

function handleAction(action, postId) {
    // Example: Send data to the server using Fetch API
    fetch('/api/post-action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: action, postId: postId }),
    })
    .then(response => response.json())
    .then(data => {
        // Update the count on the page based on the response
        updateCount(postId, action, data.count);
    })
    .catch(error => console.error('Error:', error));
}

actionsElement.innerHTML = `
    <button class="action-button" data-action="like" data-post-id="${postId}">Like</button>
<button class="action-button" data-action="going" data-post-id="${postId}">Going</button>
<button class="action-button" data-action="not-going" data-post-id="${postId}">Not Going</button>
`;

document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function() {
        var action = this.getAttribute('data-action');
        var postId = this.getAttribute('data-post-id');
        // Call a function to handle the action
        handleAction(action, postId);
    });
});

document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active'); // Toggle the 'active' class
        var action = this.getAttribute('data-action');
        var postId = this.getAttribute('data-post-id');
        handleAction(action, postId);
    });
});

function initializeMap() {
    var map = L.map('map').setView([34.4140, -119.8489], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}



