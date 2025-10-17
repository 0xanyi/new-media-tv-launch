// New Media TV Launch Event Script
class NewMediaTVLaunch {
    constructor() {
        this.video = null;
        this.hls = null;
        this.countdownInterval = null;
        this.launchDate = new Date('2025-10-18T11:00:00+01:00'); // October 18th, 11 AM GMT+1
        
        this.init();
    }

    init() {
        this.initVideoPlayer();
        this.initCountdown();
        this.initEventListeners();
        this.checkStreamStatus();
        
        // Update stream status every 30 seconds
        setInterval(() => this.checkStreamStatus(), 30000);
    }

    initVideoPlayer() {
        this.video = document.getElementById('video-player');
        const videoOverlay = document.getElementById('video-overlay');
        const playButton = document.getElementById('play-button');
        const videoLoading = document.getElementById('video-loading');

        // TODO: Replace with your actual HLS stream URL
        const hlsStreamUrl = 'https://stream-hls.castr.net/669859478d4515508937865a/live_98c5c5e06bb711efa7fb7fc6a849f4ff/index.m3u8';
        // Example formats:
        // - 'https://cdn.your-streaming-provider.com/live/stream.m3u8'
        // - 'https://live.example.com/media/playlist.m3u8'
        // - '/path/to/your/playlist.m3u8' (for local testing)
        
        // Initialize HLS.js
        if (Hls.isSupported()) {
            this.hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            this.hls.loadSource(hlsStreamUrl);
            this.hls.attachMedia(this.video);
            
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest parsed successfully');
                videoLoading.style.display = 'none';
                
                // Attempt to autoplay after manifest is parsed
                this.attemptAutoplay();
            });
            
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
                this.handleVideoError(data);
            });
            
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            this.video.src = hlsStreamUrl;
            
            // Attempt autoplay for native HLS
            this.video.addEventListener('loadedmetadata', () => {
                this.attemptAutoplay();
            });
        } else {
            // Fallback for browsers without HLS support
            this.setupFallbackVideo();
        }

        // Custom play button handler
        playButton.addEventListener('click', () => {
            this.playVideo();
        });

        // Video event listeners
        this.video.addEventListener('play', () => {
            videoOverlay.classList.add('hidden');
        });

        this.video.addEventListener('pause', () => {
            if (!this.video.ended) {
                videoOverlay.classList.remove('hidden');
            }
        });

        this.video.addEventListener('ended', () => {
            videoOverlay.classList.add('hidden');
            playButton.innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="rgba(255, 255, 255, 0.9)"/>
                    <rect x="25" y="25" width="10" height="30" fill="#1a1a2e"/>
                    <rect x="45" y="25" width="10" height="30" fill="#1a1a2e"/>
                </svg>
            `;
        });

        this.video.addEventListener('waiting', () => {
            videoLoading.style.display = 'block';
            playButton.style.display = 'none';
        });

        this.video.addEventListener('canplay', () => {
            videoLoading.style.display = 'none';
            playButton.style.display = 'block';
        });
    }

    attemptAutoplay() {
        const videoOverlay = document.getElementById('video-overlay');
        const videoLoading = document.getElementById('video-loading');
        
        // Try to autoplay (muted autoplay is widely supported)
        this.video.play()
            .then(() => {
                console.log('🎬 Autoplay started successfully');
                videoOverlay.classList.add('hidden');
                // Unmute after successful autoplay (user gesture might be needed)
                setTimeout(() => {
                    this.video.muted = false;
                }, 1000);
            })
            .catch(error => {
                console.log('📱 Autoplay blocked, waiting for user interaction');
                // Keep the play button visible if autoplay is blocked
                videoOverlay.classList.remove('hidden');
            });
    }

    playVideo() {
        const videoLoading = document.getElementById('video-loading');
        videoLoading.style.display = 'block';
        
        if (this.hls) {
            this.hls.startLoad();
        }
        
        this.video.play().then(() => {
            this.video.muted = false; // Unmute on manual play
        }).catch(error => {
            console.error('Error playing video:', error);
            videoLoading.style.display = 'none';
            this.showErrorMessage('Unable to play stream. Please try again.');
        });
    }

    handleVideoError(error) {
        const videoLoading = document.getElementById('video-loading');
        const videoOverlay = document.getElementById('video-overlay');
        
        videoLoading.style.display = 'none';
        
        if (error.fatal) {
            console.error('Fatal video error:', error);
            this.showErrorMessage('Stream temporarily unavailable. Please refresh the page.');
        }
    }

    setupFallbackVideo() {
        // Fallback placeholder video or message
        console.warn('HLS not supported, using fallback');
        this.video.poster = 'assets/fallback-poster.jpg';
        this.showErrorMessage('Your browser may not support live streaming. Please try a modern browser.');
    }

    showErrorMessage(message) {
        const videoInfo = document.querySelector('.video-info');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: rgba(245, 87, 108, 0.1);
            border: 1px solid rgba(245, 87, 108, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            color: #f5576c;
            font-size: 0.9rem;
        `;
        errorDiv.textContent = message;
        
        // Remove existing error message if any
        const existingError = videoInfo.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        videoInfo.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }

    initCountdown() {
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = new Date();
        const difference = this.launchDate - now;

        if (difference <= 0) {
            // Launch time has arrived!
            this.launchSequence();
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    launchSequence() {
        const countdownContainer = document.querySelector('.countdown-container');
        const countdownTitle = document.querySelector('.countdown-title');
        const countdown = document.querySelector('.countdown');
        
        // Clear the countdown interval
        clearInterval(this.countdownInterval);
        
        // Phase 1: Final countdown celebration (5 seconds)
        let celebrationCount = 5;
        const celebrationInterval = setInterval(() => {
            if (celebrationCount > 0) {
                countdownTitle.textContent = `🚀 LAUNCHING IN ${celebrationCount}... 🚀`;
                countdownTitle.style.animation = 'pulse 0.5s ease-in-out';
                celebrationCount--;
            } else {
                clearInterval(celebrationInterval);
                this.postLaunchTransition();
            }
        }, 1000);
    }

    postLaunchTransition() {
        const countdownContainer = document.querySelector('.countdown-container');
        const countdownTitle = document.querySelector('.countdown-title');
        const countdown = document.querySelector('.countdown');
        
        // Update stream status to live
        this.setStreamStatus('live');
        
        // Phase 2: Fade out countdown and show launch message
        countdown.style.transition = 'opacity 1s ease-out';
        countdown.style.opacity = '0';
        
        setTimeout(() => {
            countdown.style.display = 'none';
            countdownTitle.textContent = '🎉 WE ARE LIVE! 🎉';
            countdownTitle.style.fontSize = '2rem';
            countdownTitle.style.background = 'linear-gradient(135deg, #4ade80 0%, #06b6d4 100%)';
            countdownTitle.style.webkitBackgroundClip = 'text';
            countdownTitle.style.webkitTextFillColor = 'transparent';
            countdownTitle.style.backgroundClip = 'text';
            
            // Add celebration animation
            countdownTitle.style.animation = 'fadeInUp 1s ease-out, pulse 2s ease-in-out infinite';
            
            // Scroll to video section after launch
            setTimeout(() => {
                const videoSection = document.querySelector('.video-section');
                videoSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 2000);
        }, 1000);
        
        // Phase 3: Hide the entire countdown container after 10 seconds
        setTimeout(() => {
            countdownContainer.style.transition = 'opacity 2s ease-out, transform 2s ease-out';
            countdownContainer.style.opacity = '0';
            countdownContainer.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                countdownContainer.style.display = 'none';
            }, 2000);
        }, 10000);
    }

    checkStreamStatus() {
        const now = new Date();
        const oneHourBeforeLaunch = new Date(this.launchDate.getTime() - 60 * 60 * 1000);
        const oneHourAfterLaunch = new Date(this.launchDate.getTime() + 60 * 60 * 1000);

        if (now >= this.launchDate && now <= oneHourAfterLaunch) {
            this.setStreamStatus('live');
        } else if (now >= oneHourBeforeLaunch && now < this.launchDate) {
            this.setStreamStatus('starting-soon');
        } else {
            this.setStreamStatus('offline');
        }
    }

    setStreamStatus(status) {
        const indicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');

        switch(status) {
            case 'live':
                indicator.classList.add('live');
                statusText.textContent = '🔴 LIVE NOW';
                statusText.style.color = '#4ade80';
                break;
            case 'starting-soon':
                indicator.classList.remove('live');
                statusText.textContent = 'Stream Starting Soon';
                statusText.style.color = '#f59e0b';
                break;
            case 'offline':
                indicator.classList.remove('live');
                statusText.textContent = 'Stream Offline';
                statusText.style.color = '#a0a0b8';
                break;
        }
    }

    initEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                if (this.video.paused) {
                    this.playVideo();
                } else {
                    this.video.pause();
                }
            }
            
            if (e.code === 'KeyF' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            if (e.code === 'KeyM' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleMute();
            }
        });

        // Video player touch events for mobile
        let touchTimer;
        this.video.addEventListener('touchstart', () => {
            touchTimer = setTimeout(() => {
                const videoOverlay = document.getElementById('video-overlay');
                videoOverlay.classList.toggle('hidden');
            }, 300);
        });

        this.video.addEventListener('touchend', () => {
            clearTimeout(touchTimer);
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.video.paused) {
                // Pause video when page is hidden to save bandwidth
                this.video.pause();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const videoWrapper = document.querySelector('.video-wrapper');
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen();
            } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
    }

    handleResize() {
        // Adjust video quality based on bandwidth and screen size
        if (this.hls) {
            const isMobile = window.innerWidth <= 768;
            
            // Adjust buffer settings for mobile
            if (isMobile) {
                this.hls.config.maxBufferLength = 30;
                this.hls.config.maxMaxBufferLength = 60;
            } else {
                this.hls.config.maxBufferLength = 60;
                this.hls.config.maxMaxBufferLength = 120;
            }
        }
    }

    // Analytics and monitoring
    trackEngagement(action, data = {}) {
        // Placeholder for analytics tracking
        console.log('Analytics Event:', action, data);
        
        // Example: Send to analytics service
        // gtag('event', action, {
        //     'event_category': 'video_engagement',
        //     'event_label': data.label || '',
        //     'value': data.value || 0
        // });
    }

    // Cleanup on page unload
    cleanup() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        if (this.hls) {
            this.hls.destroy();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 New Media TV Launch Event Page Loaded');
    console.log('📅 Launch Date: October 18th, 11:00 AM GMT+1');
    console.log('🔧 Remember to update the HLS stream URL in script.js');
    
    window.newMediaTV = new NewMediaTVLaunch();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.newMediaTV) {
            window.newMediaTV.cleanup();
        }
    });
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
    if (window.newMediaTV && window.newMediaTV.hls) {
        window.newMediaTV.hls.startLoad();
    }
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    if (window.newMediaTV && window.newMediaTV.video) {
        window.newMediaTV.video.pause();
    }
});
