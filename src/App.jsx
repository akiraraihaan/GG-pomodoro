import { useState, useEffect, useRef } from 'react'

function App() {
  // State konfigurasi
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreak, setShortBreak] = useState(5)
  const [longBreak, setLongBreak] = useState(15)

  // State dasar
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 menit
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState('Work') // Work, Short Break, Long Break
  const [sessionCount, setSessionCount] = useState(0)
  const [hasTimerStarted, setHasTimerStarted] = useState(false)

  // State untuk pengaturan suara
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(0.3)
  const [soundType, setSoundType] = useState('sine') // sine, square, triangle, sawtooth

  // Ref untuk interval
  const intervalRef = useRef(null)

  // Format waktu mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  // Function untuk mendapatkan durasi berdasarkan session type
  const getSessionDuration = (type) => {
    switch (type) {
      case 'Work': return workDuration * 60
      case 'Short Break': return shortBreak * 60
      case 'Long Break': return longBreak * 60
      default: return workDuration * 60
    }
  }

  // Function untuk memainkan suara notifikasi
  const playNotificationSound = () => {
    if (!soundEnabled) return // Skip if sound is disabled
    
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Configurable sound settings
      oscillator.frequency.value = sessionType === 'Work' ? 800 : 600 // Different pitch for work vs break
      oscillator.type = soundType
      
      gainNode.gain.setValueAtTime(soundVolume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.8)
      
      // Play additional beeps for work completion (3 beeps) vs break completion (1 beep)
      if (sessionType === 'Work') {
        setTimeout(() => {
          const osc2 = audioContext.createOscillator()
          const gain2 = audioContext.createGain()
          osc2.connect(gain2)
          gain2.connect(audioContext.destination)
          osc2.frequency.value = 800
          osc2.type = soundType
          gain2.gain.setValueAtTime(soundVolume, audioContext.currentTime)
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          osc2.start(audioContext.currentTime)
          osc2.stop(audioContext.currentTime + 0.3)
        }, 300)
        
        setTimeout(() => {
          const osc3 = audioContext.createOscillator()
          const gain3 = audioContext.createGain()
          osc3.connect(gain3)
          gain3.connect(audioContext.destination)
          osc3.frequency.value = 800
          osc3.type = soundType
          gain3.gain.setValueAtTime(soundVolume, audioContext.currentTime)
          gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          osc3.start(audioContext.currentTime)
          osc3.stop(audioContext.currentTime + 0.3)
        }, 600)
      }
    } catch (error) {
      console.log('Audio notification not supported')
    }
  }

  // Function untuk start timer
  const startTimer = () => {
    setIsRunning(true)
    setHasTimerStarted(true)
  }

  // Function untuk pause timer
  const pauseTimer = () => {
    setIsRunning(false)
  }

  // Function untuk reset timer
  const resetTimer = () => {
    setIsRunning(false)
    setHasTimerStarted(false)
    setTimeLeft(getSessionDuration(sessionType))
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Efek untuk mengatur timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer selesai
            setIsRunning(false)
            setHasTimerStarted(false)
            playNotificationSound()
            
            // Auto switch session
            if (sessionType === 'Work') {
              const newCount = sessionCount + 1
              setSessionCount(newCount)
              if (newCount % 4 === 0) {
                setSessionType('Long Break')
                return longBreak * 60
              } else {
                setSessionType('Short Break')
                return shortBreak * 60
              }
            } else {
              setSessionType('Work')
              return workDuration * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, sessionType, sessionCount, workDuration, shortBreak, longBreak])

  // Update timer jika konfigurasi berubah dan timer tidak berjalan
  useEffect(() => {
    if (!hasTimerStarted) {
      setTimeLeft(getSessionDuration(sessionType))
    }
  }, [workDuration, shortBreak, longBreak, sessionType, hasTimerStarted])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if user is typing in an input field
      if (event.target.tagName === 'INPUT') return
      
      switch (event.key.toLowerCase()) {
        case ' ': // Spacebar untuk start/pause
          event.preventDefault()
          if (isRunning) {
            pauseTimer()
          } else {
            startTimer()
          }
          break
        case 'r': // R untuk reset
          event.preventDefault()
          resetTimer()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isRunning])

  // Update document title with timer status
  useEffect(() => {
    const status = isRunning ? '▶️' : hasTimerStarted ? '⏸️' : '⏹️'
    document.title = `${status} ${formatTime(timeLeft)} - ${sessionType} | Pomodoro`
  }, [timeLeft, isRunning, sessionType, hasTimerStarted])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 py-6">
      {/* Card utama */}
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-6 border border-neutral-200">
        {/* Header */}
        <div className="mb-2">
          <div className="text-xs text-neutral-400">Welcome to</div>
          <div className="text-lg font-semibold text-neutral-700 tracking-tight">Pomodoro App</div>
        </div>
        {/* Konfigurasi */}
        <form className="flex gap-2 justify-between" onSubmit={e => e.preventDefault()}>
          <label className="flex flex-col items-center text-xs text-neutral-500 font-medium">
            Work
            <input
              type="number"
              min={1}
              max={60}
              value={workDuration}
              onChange={e => setWorkDuration(Number(e.target.value))}
              disabled={hasTimerStarted}
              aria-label="Work duration in minutes"
              className="w-24 mt-1 px-0.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 transition text-base disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col items-center text-xs text-neutral-500 font-medium">
            Short
            <input
              type="number"
              min={1}
              max={30}
              value={shortBreak}
              onChange={e => setShortBreak(Number(e.target.value))}
              disabled={hasTimerStarted}
              aria-label="Short break duration in minutes"
              className="w-24 mt-1 px-0.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center focus:outline-none focus:ring-2 focus:ring-green-200 transition text-base disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col items-center text-xs text-neutral-500 font-medium">
            Long
            <input
              type="number"
              min={1}
              max={60}
              value={longBreak}
              onChange={e => setLongBreak(Number(e.target.value))}
              disabled={hasTimerStarted}
              aria-label="Long break duration in minutes"
              className="w-24 mt-1 px-0.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-center focus:outline-none focus:ring-2 focus:ring-pink-200 transition text-base disabled:opacity-50"
            />
          </label>
        </form>
        {/* Timer */}
        <div className="flex flex-col items-center gap-2">
          <div 
            className={`text-[56px] md:text-7xl font-mono font-bold tracking-tight bg-neutral-50 rounded-2xl px-8 py-4 shadow-inner border border-neutral-200 ${sessionType === 'Work' ? 'text-neutral-900' : sessionType === 'Short Break' ? 'text-green-600' : 'text-pink-600'}`}
            role="timer"
            aria-live="polite"
            aria-label={`${sessionType} timer: ${formatTime(timeLeft)} remaining`}
          > 
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 font-medium border ${sessionType === 'Work' ? 'bg-neutral-900 text-white border-neutral-900' : sessionType === 'Short Break' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-pink-100 text-pink-700 border-pink-300'}`}>{sessionType}</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-indigo-500 border border-indigo-200">{sessionCount}x Work</span>
          </div>
        </div>
        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <button
              onClick={startTimer}
              aria-label={hasTimerStarted ? 'Resume timer' : 'Start timer'}
              className="flex-1 py-2 rounded-2xl font-semibold text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition shadow"
            >
              {hasTimerStarted ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              aria-label="Pause timer"
              className="flex-1 py-2 rounded-2xl font-semibold text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition shadow"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            aria-label="Reset timer"
            className="flex-1 py-2 rounded-2xl font-semibold text-white bg-neutral-400 hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition shadow"
          >
            Reset
          </button>
        </div>

        {/* Sound Settings */}
        <div className="border-t border-neutral-100 pt-4">
          <div className="text-xs font-medium text-neutral-600 mb-3 text-center">🔊 Sound Settings</div>
          <div className="flex flex-col gap-3">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Enable Sound</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full transition ${soundEnabled ? 'bg-green-500' : 'bg-neutral-300'} relative`}
                aria-label={`Sound ${soundEnabled ? 'enabled' : 'disabled'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
            
            {/* Volume Control */}
            {soundEnabled && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Volume</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={soundVolume}
                    onChange={e => setSoundVolume(Number(e.target.value))}
                    className="w-20 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Sound Type */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Sound Type</span>
                  <select
                    value={soundType}
                    onChange={e => setSoundType(e.target.value)}
                    className="text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  >
                    <option value="sine">Sine (Smooth)</option>
                    <option value="square">Square (Sharp)</option>
                    <option value="triangle">Triangle (Mild)</option>
                    <option value="sawtooth">Sawtooth (Harsh)</option>
                  </select>
                </div>
                
                {/* Test Sound Button */}
                <button
                  onClick={playNotificationSound}
                  className="text-xs py-1 px-3 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition self-center"
                >
                  Test Sound
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="text-xs text-neutral-400 text-center leading-relaxed">
          <p>🍅 Work for {workDuration} minutes, then take a {shortBreak}-minute break.</p>
          <p>After 4 work sessions, enjoy a {longBreak}-minute long break.</p>
          <div className="mt-2 pt-2 border-t border-neutral-100">
            <p>⌨️ Shortcuts: <kbd className="bg-neutral-100 px-1 rounded">Space</kbd> to start/pause, <kbd className="bg-neutral-100 px-1 rounded">R</kbd> to reset</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
