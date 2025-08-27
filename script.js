class PomodoroTimer {
    constructor() {
        this.modes = {
            work: { duration: 25, label: 'Work Session', color: '#ff6b6b' },
            shortBreak: { duration: 5, label: 'Short Break', color: '#4ecdc4' },
            longBreak: { duration: 15, label: 'Long Break', color: '#45b7d1' }
        };
        
        this.currentMode = 'work';
        this.timeLeft = this.modes[this.currentMode].duration * 60;
        this.totalTime = this.timeLeft;
        this.isRunning = false;
        this.timer = null;
        this.sessionCount = 1;
        this.completedSessions = 0;
        this.totalFocusTime = 0;
        this.currentStreak = 0;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadSettings();
        this.loadStats();
        this.updateDisplay();
        this.updateProgressRing();
    }
    
    initializeElements() {
        // Timer elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionType = document.getElementById('sessionType');
        this.sessionNumber = document.getElementById('sessionNumber');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.skipBtn = document.getElementById('skipBtn');
        
        // Mode buttons
        this.modeButtons = document.querySelectorAll('.mode-btn');
        
        // Progress ring
        this.progressCircle = document.querySelector('.progress-ring-circle');
        this.progressRingRadius = 140;
        this.progressRingCircumference = 2 * Math.PI * this.progressRingRadius;
        this.progressCircle.style.strokeDasharray = this.progressRingCircumference;
        
        // Stats elements
        this.completedSessionsEl = document.getElementById('completedSessions');
        this.totalTimeEl = document.getElementById('totalTime');
        this.currentStreakEl = document.getElementById('currentStreak');
        
        // Settings elements
        this.workDurationInput = document.getElementById('workDuration');
        this.shortBreakDurationInput = document.getElementById('shortBreakDuration');
        this.longBreakDurationInput = document.getElementById('longBreakDuration');
        this.autoStartInput = document.getElementById('autoStart');
        this.soundEnabledInput = document.getElementById('soundEnabled');
        
        // Timer section for mode classes
        this.timerSection = document.querySelector('.timer-section');
    }
    
    initializeEventListeners() {
        // Control buttons
        this.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.skipBtn.addEventListener('click', () => this.skipSession());
        
        // Mode buttons
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // Settings inputs
        this.workDurationInput.addEventListener('change', () => this.saveSettings());
        this.shortBreakDurationInput.addEventListener('change', () => this.saveSettings());
        this.longBreakDurationInput.addEventListener('change', () => this.saveSettings());
        this.autoStartInput.addEventListener('change', () => this.saveSettings());
        this.soundEnabledInput.addEventListener('change', () => this.saveSettings());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleTimer();
            } else if (e.code === 'KeyR') {
                this.resetTimer();
            } else if (e.code === 'KeyS') {
                this.skipSession();
            }
        });
        
        // Page visibility API for notifications
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                this.updateTitle();
            } else if (!document.hidden) {
                document.title = 'Pomodoro Timer';
            }
        });
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.isRunning = true;
        this.startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        this.timerSection.classList.add('pulse');
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgressRing();
            this.updateTitle();
            
            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        this.timerSection.classList.remove('pulse');
        clearInterval(this.timer);
        document.title = 'Pomodoro Timer';
    }
    
    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.modes[this.currentMode].duration * 60;
        this.totalTime = this.timeLeft;
        this.updateDisplay();
        this.updateProgressRing();
    }
    
    skipSession() {
        this.pauseTimer();
        this.completeSession();
    }
    
    completeSession() {
        this.pauseTimer();
        this.playNotificationSound();
        this.showNotification();
        this.updateStats();
        this.autoAdvanceSession();
    }
    
    autoAdvanceSession() {
        if (this.currentMode === 'work') {
            this.completedSessions++;
            this.totalFocusTime += this.modes.work.duration;
            this.currentStreak++;
            
            // Every 4 work sessions, take a long break
            if (this.completedSessions % 4 === 0) {
                this.switchMode('longBreak');
            } else {
                this.switchMode('shortBreak');
            }
        } else {
            this.switchMode('work');
            this.sessionCount++;
        }
        
        this.saveStats();
        this.updateStatsDisplay();
        
        // Auto-start if enabled
        if (this.autoStartInput.checked) {
            setTimeout(() => this.startTimer(), 1000);
        }
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        this.timeLeft = this.modes[mode].duration * 60;
        this.totalTime = this.timeLeft;
        
        // Update active mode button
        this.modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // Update timer section class for styling
        this.timerSection.className = 'timer-section';
        if (mode === 'work') {
            this.timerSection.classList.add('work-mode');
        } else if (mode === 'shortBreak') {
            this.timerSection.classList.add('break-mode');
        } else {
            this.timerSection.classList.add('long-break-mode');
        }
        
        this.updateDisplay();
        this.updateProgressRing();
        
        if (this.isRunning) {
            this.pauseTimer();
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.sessionType.textContent = this.modes[this.currentMode].label;
        this.sessionNumber.textContent = this.sessionCount;
    }
    
    updateProgressRing() {
        const progress = (this.totalTime - this.timeLeft) / this.totalTime;
        const offset = this.progressRingCircumference - (progress * this.progressRingCircumference);
        this.progressCircle.style.strokeDashoffset = offset;
    }
    
    updateTitle() {
        if (this.isRunning && document.hidden) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${this.modes[this.currentMode].label}`;
        }
    }
    
    updateStats() {
        // This would typically save to localStorage or a backend
        this.saveStats();
    }
    
    updateStatsDisplay() {
        this.completedSessionsEl.textContent = this.completedSessions;
        
        const hours = Math.floor(this.totalFocusTime / 60);
        const minutes = this.totalFocusTime % 60;
        this.totalTimeEl.textContent = `${hours}h ${minutes}m`;
        
        this.currentStreakEl.textContent = this.currentStreak;
    }
    
    playNotificationSound() {
        if (this.soundEnabledInput.checked) {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        }
    }
    
    showNotification() {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const message = this.currentMode === 'work' 
                ? 'Work session completed! Time for a break.' 
                : 'Break time is over! Ready to focus?';
            
            new Notification('Pomodoro Timer', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            });
        }
        
        // Visual feedback
        this.timerSection.classList.add('shake');
        setTimeout(() => this.timerSection.classList.remove('shake'), 500);
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    saveSettings() {
        const settings = {
            workDuration: parseInt(this.workDurationInput.value),
            shortBreakDuration: parseInt(this.shortBreakDurationInput.value),
            longBreakDuration: parseInt(this.longBreakDurationInput.value),
            autoStart: this.autoStartInput.checked,
            soundEnabled: this.soundEnabledInput.checked
        };
        
        // Update modes with new durations
        this.modes.work.duration = settings.workDuration;
        this.modes.shortBreak.duration = settings.shortBreakDuration;
        this.modes.longBreak.duration = settings.longBreakDuration;
        
        // Reset current timer if not running
        if (!this.isRunning) {
            this.timeLeft = this.modes[this.currentMode].duration * 60;
            this.totalTime = this.timeLeft;
            this.updateDisplay();
            this.updateProgressRing();
        }
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            this.workDurationInput.value = settings.workDuration || 25;
            this.shortBreakDurationInput.value = settings.shortBreakDuration || 5;
            this.longBreakDurationInput.value = settings.longBreakDuration || 15;
            this.autoStartInput.checked = settings.autoStart || false;
            this.soundEnabledInput.checked = settings.soundEnabled !== false;
            
            // Update modes
            this.modes.work.duration = settings.workDuration || 25;
            this.modes.shortBreak.duration = settings.shortBreakDuration || 5;
            this.modes.longBreak.duration = settings.longBreakDuration || 15;
            
            // Update current timer
            this.timeLeft = this.modes[this.currentMode].duration * 60;
            this.totalTime = this.timeLeft;
        }
    }
    
    saveStats() {
        const stats = {
            completedSessions: this.completedSessions,
            totalFocusTime: this.totalFocusTime,
            currentStreak: this.currentStreak,
            date: new Date().toDateString()
        };
        
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('pomodoroStats');
        if (saved) {
            const stats = JSON.parse(saved);
            const today = new Date().toDateString();
            
            // Reset stats if it's a new day
            if (stats.date === today) {
                this.completedSessions = stats.completedSessions || 0;
                this.totalFocusTime = stats.totalFocusTime || 0;
                this.currentStreak = stats.currentStreak || 0;
            } else {
                this.completedSessions = 0;
                this.totalFocusTime = 0;
                this.currentStreak = 0;
            }
        }
        
        this.updateStatsDisplay();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
    
    // Request notification permission
    timer.requestNotificationPermission();
    
    // Add some helpful keyboard shortcut info
    console.log('Keyboard shortcuts:');
    console.log('Space - Start/Pause timer');
    console.log('R - Reset timer');
    console.log('S - Skip session');
});
