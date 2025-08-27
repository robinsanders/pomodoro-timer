# Pomodoro Timer

Stay focused and boost your productivity using the proven Pomodoro Technique.
This project is a simple Pomodoro timer built by human-in-the-loop prompting with WindsurfAI. It follows streamlined standards for HTML, CSS, and JavaScript.
### File Structure
```
pomodoro-timer/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md          # This file
```

### Core Timer Functionality
- **Work Sessions**: Default 25-minute focused work periods
- **Short Breaks**: 5-minute breaks between work sessions
- **Long Breaks**: 15-minute extended breaks every 4th session
- **Visual Progress**: Circular progress ring with real-time updates
- **Auto-advance**: Automatically transitions between work and break sessions

### Customization
- **Adjustable Durations**: Customize work, short break, and long break times
- **Auto-start Option**: Automatically start the next session
- **Sound Notifications**: Toggle audio alerts on/off
- **Multiple Themes**: Different color schemes for work and break modes

### User Experience
- **Keyboard Shortcuts**: 
  - `Space` - Start/Pause timer
  - `R` - Reset current session
  - `S` - Skip to next session
- **Browser Notifications**: Get notified even when the tab is not active
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Visual Feedback**: Smooth animations and hover effects

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start your first Pomodoro session!

### Running Locally
```bash
# Option 1: Using Python (if installed)
python3 -m http.server 8000

# Option 2: Using Node.js (if installed)
npx serve .

# Option 3: Simply open index.html in your browser
```
Then navigate to `http://localhost:8000` in your browser.


### Built With
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with flexbox/grid and animations
- **Vanilla JavaScript**: ES6+ features, no external dependencies
- **Web APIs**: Notifications API, Web Audio API, Local Storage

## Customization

### Changing Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
  --work-color: #ff6b6b;
  --break-color: #4ecdc4;
  --long-break-color: #45b7d1;
}
```

### Adding New Features
The `PomodoroTimer` class in `script.js` is well-structured for extensions:
- Add new timer modes
- Implement task management
- Add data export functionality
- Integrate with external APIs

## Mobile Support

The timer is fully responsive and works great on mobile devices:
- Touch-friendly buttons
- Optimized layout for small screens
- Prevents screen sleep during active sessions
- Swipe gestures (future enhancement)

## Contributing

Contributions are welcome! Here are some ways you can help:
- Report bugs or suggest features
- Improve the UI/UX design
- Add new timer modes or features
- Enhance mobile experience
- Add internationalization

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the Pomodoro Technique® developed by Francesco Cirillo
- Icons provided by [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

