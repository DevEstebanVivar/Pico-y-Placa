import React, { useState } from 'react';
import './App.css';

// Función principal para predecir si el carro puede circular
function PicoYPlacaPredictor(licensePlate, date, time) {
  const lastDigit = parseInt(licensePlate.slice(-1));
  const dateObj = new Date(date);
  const timeObj = new Date(`1970-01-01T${time}:00`);

  const restrictedDay = getRestrictedDay(lastDigit);
  const restrictedTime = isRestrictedTime(timeObj);

  // Verificar el día de la semana (0 = Domingo, 6 = Sábado)
  const dayOfWeek = dateObj.getDay();
  // Si es fin de semana (sábado o domingo), no hay restricciones
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return false; // Puede circular siempre en fines de semana
  }

  // Verificar si es el día restringido y la hora restringida
  return dayOfWeek === restrictedDay && restrictedTime;
}

// Función para obtener el día de restricción basado en el último dígito de la placa
function getRestrictedDay(lastDigit) {
  switch (lastDigit) {
    case 1:
    case 2:
      return 0; // Lunes
    case 3:
    case 4:
      return 1; // Martes
    case 5:
    case 6:
      return 2; // Miércoles
    case 7:
    case 8:
      return 3; // Jueves
    case 9:
    case 0:
      return 4; // Viernes
    default:
      return -1; // Día no válido
  }
}

// Función para verificar si la hora está dentro del rango restringido
function isRestrictedTime(time) {
  const morningStart = new Date("1970-01-01T07:00:00");
  const morningEnd = new Date("1970-01-01T09:30:00");
  const eveningStart = new Date("1970-01-01T16:00:00");
  const eveningEnd = new Date("1970-01-01T19:30:00");

  // Verificar si la hora está en los rangos restringidos
  return (time >= morningStart && time <= morningEnd) || (time >= eveningStart && time <= eveningEnd);
}

function App() {
  const [licensePlate, setLicensePlate] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [canDrive, setCanDrive] = useState(null);
  const [error, setError] = useState('');  // Estado para manejar los errores

  const handleSubmit = (e) => {
    e.preventDefault();

    // Expresión regular para validar la matrícula
    const plateRegex = /^[A-Z]{3}-\d{3,4}$/;
    
    if (!plateRegex.test(licensePlate)) {
      setError('Matrícula no encontrada');  // Mostrar el mensaje de error
      setCanDrive(null);
      return;
    }

    setError('');  // Limpiar el error si la matrícula es válida
    const restricted = PicoYPlacaPredictor(licensePlate, date, time);
    setCanDrive(!restricted);  // true significa que puede circular, false significa que está restringido
  };

  return (
    <div className="container">
      <h1>Pico y Placa Predictor</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingrese matrícula (por ejemplo, PBK-2345 o PBK-345)"
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
        <button type="submit">Predecir</button>
      </form>

      {error && <div className="result error">{error}</div>}  {/* Mostrar el error si la matrícula no es válida */}

      {canDrive !== null && (
        <div className={`result ${canDrive ? 'success' : 'error'}`}>
          {canDrive ? 'El carro puede circular.' : 'El carro NO puede circular.'}
        </div>
      )}
    </div>
  );
}

export default App;
