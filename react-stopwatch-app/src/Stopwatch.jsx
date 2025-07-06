
import React from 'react';
import './App.css';

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsedTime: 0,
      isRunning: false,
      laps: [],
      lastUpdateTime: null
    };

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.recordLap = this.recordLap.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }

  componentDidMount() {

    this.intervalId = null;
  }

  componentWillUnmount() {
   
    clearInterval(this.intervalId);
  }

  startTimer() {
    if (this.state.isRunning) return;

    this.setState({
      isRunning: true,
      lastUpdateTime: Date.now() - this.state.elapsedTime
    });

    this.intervalId = setInterval(() => {
      this.setState({
        elapsedTime: Date.now() - this.state.lastUpdateTime
      });
    }, 10);
  }

  stopTimer() {
    if (!this.state.isRunning) return;

    clearInterval(this.intervalId);
    this.setState({
      isRunning: false
    });
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.setState({
      elapsedTime: 0,
      isRunning: false,
      laps: [],
      lastUpdateTime: null
    });
  }

  recordLap() {
    if (!this.state.isRunning) return;

    this.setState(prevState => ({
      laps: [...prevState.laps, prevState.elapsedTime]
    }));
  }

  formatTime(milliseconds) {
   
    const ms = Math.floor(milliseconds % 1000 / 10);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
      ms.toString().padStart(2, '0')
    ].join(':');
  }

  render() {
    const { elapsedTime, isRunning, laps } = this.state;
    const formattedTime = this.formatTime(elapsedTime);

    return (
      <div className="stopwatch-container">
        <h1>React Stopwatch</h1>
        <div className="display">{formattedTime}</div>
        
        <div className="controls">
          <button 
            onClick={this.startTimer} 
            disabled={isRunning}
            className="control-button start"
          >
            Start
          </button>
          <button 
            onClick={this.stopTimer} 
            disabled={!isRunning}
            className="control-button stop"
          >
            Stop
          </button>
          <button 
            onClick={this.resetTimer} 
            disabled={elapsedTime === 0 && laps.length === 0}
            className="control-button reset"
          >
            Reset
          </button>
          <button 
            onClick={this.recordLap} 
            disabled={!isRunning}
            className="control-button lap"
          >
            Lap
          </button>
        </div>

        {laps.length > 0 && (
          <div className="laps-container">
            <h2>Laps</h2>
            <ol className="laps-list">
              {laps.map((lapTime, index) => (
                <li key={index} className="lap-item">
                  <span>Lap {index + 1}</span>
                  <span>{this.formatTime(lapTime)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }
}

export default Stopwatch;