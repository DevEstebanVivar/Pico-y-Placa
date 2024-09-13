import React, { useState } from 'react';
import './App.css';

// Main function to predict if the car can circulate
function PicoYPlacaPredictor(licensePlate, date, time) {
  const lastDigit = parseInt(licensePlate.slice(-1));
  const dateObj = new Date(date);
  const timeObj = new Date(`1970-01-01T${time}:00`);

  const restrictedDay = getRestrictedDay(lastDigit);
  const restrictedTime = isRestrictedTime(timeObj);

  // Check the day of the week (5 = Sunday, 6 = Saturday)
  const dayOfWeek = dateObj.getDay();
  // If it is a weekend (Saturday or Sunday), there are no restrictions
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return false; // It can always circulate on weekends
  }

  // Check if it is the restricted day and the restricted time
  return dayOfWeek === restrictedDay && restrictedTime;
}

// Function to obtain the restriction day based on the last digit of the license plate
function getRestrictedDay(lastDigit) {
  switch (lastDigit) {
    case 1:
    case 2:
      return 0; // Monday
    case 3:
    case 4:
      return 1; // Tuesday
    case 5:
    case 6:
      return 2; // Wednesday
    case 7:
    case 8:
      return 3; // Thursday
    case 9:
    case 0:
      return 4; // Friday
    default:
      return -1; // Invalid day
  }
}

// Function to check if the time is within the restricted range
function isRestrictedTime(time) {
  const morningStart = new Date("1970-01-01T07:00:00");
  const morningEnd = new Date("1970-01-01T09:30:00");
  const eveningStart = new Date("1970-01-01T16:00:00");
  const eveningEnd = new Date("1970-01-01T19:30:00");

  // Check if the time is in the restricted ranges
  return (time >= morningStart && time <= morningEnd) || (time >= eveningStart && time <= eveningEnd);
}

function App() {
  const [licensePlate, setLicensePlate] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [canDrive, setCanDrive] = useState(null);
  const [error, setError] = useState('');  // State to handle errors

  const handleSubmit = (e) => {
    e.preventDefault();

    // Regular expression to validate the registration
    const plateRegex = /^[A-Z]{3}-\d{3,4}$/;
    
    if (!plateRegex.test(licensePlate)) {
      setError('License plate not found');  // Show error message
      setCanDrive(null);
      return;
    }

    setError('');  // Clear the error if the license plate is valid
    const restricted = PicoYPlacaPredictor(licensePlate, date, time);
    setCanDrive(!restricted);  // True means it can circulate, false means it is restricted
  };

  return (
    <div className="container">
      <h1>Pico y Placa</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter license plate number (For example, PBK-2345 or PBK-345)"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Consult</button>
      </form>

      {error && <div className="result error">{error}</div>}  {/* Show the error if the license plate is not valid */}

      {canDrive !== null && (
        <div className={`result ${canDrive ? 'success' : 'error'}`}>
          {canDrive ? 'The car is allowed to be on the road.' : 'The car is NOT allowed to be on the road.'}
        </div>
      )}
    </div>
  );
}

export default App;
