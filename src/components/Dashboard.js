import ReactSpeedometer from "react-d3-speedometer";


export const Dashboard = (props) => {
  const {
    speed,
    accelerate,
    brake,
    travel,
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
      <p>Distance travelled: {travel}</p>
      <button
        onClick={accelerate}
        style={buttonStyle}
        disabled={speed===200}
      >
        Accelerate
      </button>
      <button
        onClick={brake}
        style={buttonStyle}
      >
        Brake
      </button>
    </>
  )
}