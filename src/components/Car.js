import React, { useReducer } from "react";
import { reducer, initialState } from "./TaskReducer";
import ReactSpeedometer from "react-d3-speedometer";

const Car = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleCar = () => {
    if (state.started) {
      dispatch({ type: "ENGINE_STOP" });
    } else {
      dispatch({ type: "ENGINE_ON" });
    }
  };

  const accelerate = () => dispatch({ type: "ACCELERATE" });
  const brake = () => dispatch({ type: "BRAKE" });

  return (
    <div className="car">
      {state.started ? (
        <>
          <ReactSpeedometer
            value={state.speed}
            minValue={0}
            maxValue={200}
            needleColor="red"
            startColor="green"
            segments={10}
            endColor="blue"
          />
          <p>Car status: {state.started ? "Engine on" : "Engine off"}</p>
          <p>Current speed: {state.speed} km/h</p>
          <p>Distance Travelled: {state.distance.toFixed(2)} km</p>
          <button onClick={accelerate} disabled={!state.started} style={{ margin: "10px" }}>
            Accelerate
          </button>
          <button onClick={brake} disabled={!state.started || state.speed === 0} style={{ margin: "10px" }}>
            Brake
          </button>
        </>
      ) : (
        <p>Engine is off</p>
       
      )}
        <p>Distance Travelled: {state.distance.toFixed(2)} km</p>
      <button onClick={toggleCar}>
        {state.started ? "Turn Engine Off" : "Turn Engine On"}
      </button>
      <button onClick={accelerate} disabled={!state.started} style={{ margin: "10px" }}>
            Accelerate
          </button>
          <button onClick={brake} disabled={!state.started || state.speed === 0} style={{ margin: "10px" }}>
            Brake
          </button>
    </div>
  );
};

export default Car;
