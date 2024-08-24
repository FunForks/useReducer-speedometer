import React, { useReducer, useEffect } from "react";
import { reducer, initialState } from "./TaskReducer";
import { Dashboard } from "./Dashboard";


const Car = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    started,
    speed,
    distance
  } = state

  const toggleCar = () => {
    if (started) {
      dispatch({ type: "ENGINE_STOP" });
    } else {
      dispatch({ type: "ENGINE_ON" });
    }
  };

  const accelerate = () => {
    dispatch({
      type: "ACCELERATE"
    })
  }

  const brake = () => {
    dispatch({
      type: "BRAKE"
    })
  }

  const travel = distance.toFixed(2) + "km"
  const buttonStyle = {
    margin: "10px"
  }

  const dashboardProps = {
    speed,
    accelerate,
    brake,
    travel,
    buttonStyle
  }
  const display = started
    ? <Dashboard  { ...dashboardProps }/>
    : <p>Engine is off</p>

  const toggleText = started
    ? "Turn Engine Off"
    : "Turn Engine On"


  const watchCar = () => {
    dispatch({
      type: "WATCH_CAR"
    })
  }

  const startWatching = () => {
    const interval = setInterval(watchCar, 100)

    return () => {
      clearInterval(interval)
    }
  }

  useEffect(startWatching, [])

  return (
    <div className="car">
      {display}
      <p>Distance Travelled: {travel}</p>
      <button
        onClick={toggleCar}
      >
        {toggleText}
      </button>
      <button
        onClick={accelerate}
        disabled={!started}
        style={buttonStyle}
      >
        Accelerate
      </button>
      <button
        onClick={brake}
        disabled={!started}
        style={buttonStyle}
      >
        Brake
      </button>
    </div>
  );
};

export default Car;