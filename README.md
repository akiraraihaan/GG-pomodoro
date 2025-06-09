# 🍅 Pomodoro Timer

A modern, responsive Pomodoro Timer web application built with React and Vite. This project implements the Pomodoro Technique to help boost productivity through focused work sessions and strategic breaks.

## 📋 Project Overview

This project is part of the [roadmap.sh Pomodoro Timer challenge](https://roadmap.sh/projects/pomodoro-timer). The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.

## ✨ Features

### 🎯 Core Functionality
- **Configurable Timers**: Customize work duration (25min), short breaks (5min), and long breaks (15min)
- **Automatic Session Management**: Cycles through work → short break → work → long break after 4 work sessions
- **Start/Pause/Resume**: Full timer control with proper state management
- **Session Tracking**: Visual counter showing completed work sessions

### 🎨 User Interface
- **Modern Design**: Clean, card-based UI inspired by popular Pomodoro apps
- **Visual Indicators**: Color-coded session types (Work: black, Short Break: green, Long Break: pink)
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Monospace Timer Display**: Large, easy-to-read countdown timer

### 🔊 Notifications & Accessibility
- **Audio Notifications**: Sound alerts when sessions complete (using Web Audio API)
- **Keyboard Shortcuts**: 
  - `Spacebar` - Start/Pause timer
  - `R` - Reset timer
- **Screen Reader Support**: Full ARIA labels and live regions
- **Document Title Updates**: Shows timer status in browser tab

### 🎛️ User Experience
- **Real-time Configuration**: Adjust timer durations on the fly
- **Visual Feedback**: Clear button states and session indicators
- **Helpful Instructions**: Built-in guide explaining the Pomodoro Technique
- **Keyboard Navigation**: Full accessibility support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GG-pomodoro-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for modern, responsive design
- **Audio**: Web Audio API for notification sounds
- **State Management**: React useState and useEffect hooks

## 📁 Project Structure

```
src/
├── App.jsx          # Main application component with timer logic
├── main.jsx         # React DOM root and app initialization
├── index.css        # Tailwind CSS imports and global styles
└── assets/          # Static assets
```

## 🎮 How to Use

1. **Configure Timers**: Set your preferred work, short break, and long break durations
2. **Start Working**: Click "Start" or press `Spacebar` to begin a work session
3. **Take Breaks**: The app automatically switches to break mode when work sessions complete
4. **Stay Focused**: Use the visual indicators and audio notifications to maintain rhythm
5. **Track Progress**: Monitor your completed work sessions in the session counter

## 🔧 Configuration

Default timer settings:
- **Work Session**: 25 minutes
- **Short Break**: 5 minutes  
- **Long Break**: 15 minutes
- **Long Break Interval**: After every 4 work sessions

All durations can be customized through the input fields in the app.

## 🎯 Features Implemented

- ✅ Configurable work and break intervals
- ✅ Start, pause, and resume functionality
- ✅ Automatic session switching
- ✅ Session counter and progress tracking
- ✅ Visual indicators for different session types
- ✅ Sound notifications when sessions end
- ✅ Responsive design with modern UI
- ✅ Keyboard shortcuts for accessibility
- ✅ Screen reader support
- ✅ Document title updates

## 🌟 Design Inspiration

The UI design draws inspiration from popular Pomodoro apps like:
- time.fyi
- pomofocus.io

Featuring clean, minimal design with effective use of whitespace and color coding.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 References

- [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique)
- [roadmap.sh Pomodoro Timer Project](https://roadmap.sh/projects/pomodoro-timer)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
