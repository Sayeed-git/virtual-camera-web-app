// Function to show the current date and time
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
    const day = now.toLocaleString('en-us', { weekday: 'long' });
    const date = now.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
    dateTimeElement.innerText = `${day}, ${date}`;
}
setInterval(updateDateTime, 1000); // Update every second

// Function to access the camera feed
async function startCamera() {
    const videoElement = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        // Enable the start recording button
        document.getElementById('startBtn').disabled = false;
    } catch (err) {
        alert("Please allow camera access.");
    }
}
startCamera();

// Variables for recording
let mediaRecorder;
let recordedChunks = [];

// Start recording functionality
document.getElementById('startBtn').addEventListener('click', () => {
    const stream = document.getElementById('video').srcObject;
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('downloadBtn').addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            a.click();
        });
    };

    mediaRecorder.start();
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
});

// Stop recording functionality
document.getElementById('stopBtn').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('stopBtn').disabled = true;
});
