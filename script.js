document.addEventListener('DOMContentLoaded', function() {
    const openCameraBtn = document.getElementById('openCamera');
    const startCapturingBtn = document.getElementById('startCapturingBtn');
    const camera = document.getElementById('camera');
    let stream = null;

    openCameraBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1080, height: 1920 } }); // Set width and height for portrait mode
            camera.srcObject = stream;
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    });

    startCapturingBtn.addEventListener('click', () => {
        if (!stream) return;
        captureImages(5, 1000);
    });

    function captureImages(count, interval) {
        let capturedCount = 0;
        const captureInterval = setInterval(() => {
            if (capturedCount >= count) {
                clearInterval(captureInterval);
                return;
            }
            captureImage();
            capturedCount++;
        }, interval);
    }

    function captureImage() {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const locationText = `Lat: ${latitude}, Long: ${longitude}`;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = camera.videoWidth;
            canvas.height = camera.videoHeight;
            context.drawImage(camera, 0, 0, canvas.width, canvas.height);

            // Add GPS location & date-time to the image footer
            context.font = '12px Arial';
            context.fillStyle = '#ffffff';
            context.fillText(locationText, 10, canvas.height - 25);
            context.fillText(new Date().toLocaleString(), 10, canvas.height - 10);

            const imageData = canvas.toDataURL('image/jpeg');
            saveImage(imageData);
        });
    }

    function saveImage(imageData) {
        const downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        downloadLink.download = `captured_image_${new Date().getTime()}.jpg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});