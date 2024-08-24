## Switching off the engine

This is even easier. What change do you need to make to the `toggleCar()` function to make it impossible to turn the car off if the speed is not `0`? Here's what it looks like now:
```js
  const toggleCar = () => {
    if (started) {
      dispatch({ type: "ENGINE_STOP" });
    } else {
      dispatch({ type: "ENGINE_ON" });
    }
  };
```

How about this?
```js
  const toggleCar = () => {
    if (started) {
      if (speed === 0) {
        dispatch({ type: "ENGINE_STOP" });
      }
    } else {
      dispatch({ type: "ENGINE_ON" });
    }
  };
```
But the Turn Engine Off button is still active. You could disable it if `speed > 0`, in which case the edit above is actually not needed.

Another thing that you don't need is duplicates of the Accelerate and Brake buttons. You could reduce the `return` statement of the `Car` component to this:
```js
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
```

While you are at it, you could disable the Accelerate button in the `Dashboard` component if the car has already reached top speed:
```js
  return (
    <>
      <ReactSpeedometer { ...speedometerSettings } />
      <p>Car status: Engine on</p>
      <p>Current speed: {speed} km/h</p>
      <p>Distance travelled: {travel}</p>
      <button
        onClick={accelerate}
        style={buttonStyle}
        disabled={speed===200} // new line
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
```

So now everything works, you have no duplicate buttons, and the user interface tells you when a button will not have any effect. You could stop there. But you haven't used `payload` for real yet, and you still have more `reducer` cases than I think you need.

If you want to go the extra mile, run `git checkout 05-using-payload`