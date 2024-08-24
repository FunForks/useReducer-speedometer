## Simplification

>**Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.** 
>
>Antoine de Saint-Exupéry (Author of The Little Prince)

>**Simplificate and add more lightness.**
>
> William Bushnell Stout, aircraft designer

### On/Off is one switch

Do you really need an `if ... else` statement in your `toggleCar()` function?
```js
const toggleCar = () => {
  if (started) {
    dispatch({ type: "ENGINE_STOP" });
  } else {
    dispatch({ type: "ENGINE_ON" });
  }
}
```

How about this:
```js
const toggleCar = () => {
  dispatch({ type: "TOGGLE_STARTED" });
};
```

This would mean a couple of changes to your `TaskReducer.js` script:
```js
export function reducer(state, action) {
    const { type, payload } = action

    switch(type){
        case "TOGGLE_STARTED": { // two cases become one
            return toggleStarted(state);
        }
    // More cases skipped
    }
}


function toggleStarted(state) {
    const started = !state.started // simply toggle state.started
    return { ...state, started };
}
```

### Braking is decelerating
And do you really need two almost identical functions, both of which change speed?
```js
function accelerate(state, payload) {
    const speed = Math.min(state.speed + 5, 200); // set max speed

    return { ...state, speed }
}

function brake(state, payload) {
    const speed = Math.max(state.speed - 5, 0);

    return { ...state, speed }
}
```

How about this, as a function in `TaskReducer.js`:
```js
function changeSpeed(state, change) { // change can be +5 or -5
    const speed = Math.max(0, // can't go below 0
        Math.min(
            state.speed + change,
            200               // can't go above 200
        )
    );

    return { ...state, speed }
}
```
This would require a simpler `case` statement in the `reducer()` function:
```js
export function reducer(state, action) {
    const { type, payload } = action

    switch(type) {
        case "CHANGE_SPEED":
            return changeSpeed(state, payload);
            
        // Other cases omitted
    }
}
```
This in turn would require making both the Accelerate and Brake button call the same handler:
```js
  const changeSpeed = ({target}) => {
    const payload = Number(target.dataset.change)
    dispatch({
      type: "CHANGE_SPEED",
      payload
    })
  }
```

You can find [more details on using data attributes on MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) . There are other ways you could do this, however, like giving each button a class and check if `target.className === "accelerate"` and setting `payload` to a positive value if this is true or a negative value if not.

This last change would mean that you have to change the `dashboardProps`:
```js
  const dashboardProps = {
    speed,
    changeSpeed,
    delta: 5,
    travel,
    buttonStyle
  }
```
And finally(?), you would have to change the return statement in the `Dashboard` component:
```js
  return (
    <>
      <ReactSpeedometer { ...speedometerSettings } />
      <p>Car status: Engine on</p>
      <p>Current speed: {speed} km/h</p>
      <p>Distance travelled: {travel}</p>
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
```

I have deliberately left out one _final_ change that you would have to make in the way the `Car` component and the `Dashboard` component communicate. If you make all the changes I have mentioned above, your browser will show you an error which will tell you how to make the last change for yourself.

Send me a message or create an Issue on the GitHub repo if you have any questions.