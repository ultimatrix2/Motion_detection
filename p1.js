const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        let previousFrame = null;

        async function startVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (err) {
                console.error('Error accessing webcam:', err);
            }
        }

        function detectMotion(currentFrame, width, height) {
            const motionRects = [];
            const threshold = 30; 
            const blockSize = 10;

            for (let y = 0; y < height; y += blockSize) {
                for (let x = 0; x < width; x += blockSize) {
                    const index = (y * width + x) * 4;

                    const rDiff = Math.abs(currentFrame[index] - previousFrame[index]);
                    const gDiff = Math.abs(currentFrame[index + 1] - previousFrame[index + 1]);
                    const bDiff = Math.abs(currentFrame[index + 2] - previousFrame[index + 2]);

                    if (rDiff > threshold || gDiff > threshold || bDiff > threshold) {
                        motionRects.push({ x, y, width: blockSize, height: blockSize });
                    }
                }
            }

            return motionRects;
        }

        async function renderFrame() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            if (previousFrame) {
                const motionRects = detectMotion(currentFrame, canvas.width, canvas.height);

                motionRects.forEach(rect => {
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
                });
            }

            previousFrame = currentFrame.slice(); arison
            requestAnimationFrame(renderFrame);
        }

        async function init() {
            await startVideo();

            video.addEventListener('loadeddata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                renderFrame();
            });
        }

        init();