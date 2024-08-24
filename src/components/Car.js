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
    dispatch({ type: "TOGGLE_STARTED" });
  };

  const changeSpeed = ({target}) => {
    const payload = Number(target.dataset.change)
    dispatch({
      type: "CHANGE_SPEED",
      payload
    })
  }

  const travel = distance.toFixed(2) + "km"
  const buttonStyle = {
    margin: "10px"
  }

  const dashboardProps = {
    speed,
    changeSpeed,
    delta: 5,
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
        disabled={speed > 0} // new line
      >
        {toggleText}
      </button>
    </div>
  );
};

export default Car;