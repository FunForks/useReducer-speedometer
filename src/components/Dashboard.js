import ReactSpeedometer from "react-d3-speedometer";


export const Dashboard = (props) => {
  const {
    speed,
    changeSpeed,
    delta,
    buttonStyle
  } = props

  const speedometerSettings = {
    value:       speed,
    minValue:    0,
    maxValue:    200,
    needleColor: "red",
    startColor:  "green",
    endColor:    "blue",
    segments:    10
  }

  return (
    <>
      <ReactSpeedometer { ...speedometerSettings } />
      <p>Car status: Engine on</p>
      <p>Current speed: {speed} km/h</p>
      <button
        data-change={delta}   // add a data- attribute
        onClick={changeSpeed} // change the handler
        style={buttonStyle}
        disabled={speed===200}
      >
        Accelerate
      </button>
      <button
        data-change={-delta}  // add a data- attribute
        onClick={changeSpeed} // change the handler
        style={buttonStyle}
      >
        Brake
      </button>
    </>
  )
}