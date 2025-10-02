const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; // 🔁 Replace with your actual OAuth 2.0 Client ID
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Load Google API client and auth2
function initClient() {
  gapi.load('client:auth2', () => {
    gapi.auth2.init({ client_id: CLIENT_ID }).then(() => {
      console.log('Google Auth initialized');
    });
  });
}

// Sign in the user
function signIn() {
  gapi.auth2.getAuthInstance().signIn({ scope: SCOPES }).then(() => {
    console.log('User signed in');
    loadDriveClient();
  });
}

// Load Drive API
function loadDriveClient() {
  gapi.client.load('https://content.googleapis.com/discovery/v1/apis/drive/v3/rest')
    .then(() => {
      console.log('Drive API loaded');
    });
}

// Upload file to Drive
async function uploadFile() {
  const fileInput = document.getElementById('noteFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file first.');
    return;
  }

  const metadata = {
    name: file.name,
    mimeType: file.type
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const accessToken = gapi.auth.getToken().access_token;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
    body: form
  });

  const data = await response.json();
  alert('Uploaded: ' + data.name);
}

// Attach event listeners
window.onload = () => {
  initClient();
  document.getElementById('login').addEventListener('click', signIn);
  document.getElementById('upload').addEventListener('click', uploadFile);
};