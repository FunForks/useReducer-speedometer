## Back on (the race) track

If everything in the last section makes sense to you, you can remove the experimental code that you have just been using. You don't need `let renders = 0` anymore at the beginning of `Car.js`, or to `console.log` any of the `state` properties:

```js
const Car = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    started,
    speed,
    distance
  } = state

  // Many lines skipped
}
```
In the same script, you can simplify  the `watchCar()` and` startWatching()` functions. Use `100` as the millisecond delay between each call to `watchCar`.
```js
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
```

In the `TaskReducer.js` script, you can remove the experimental `called` property from `initialState`...
```js
export const initialState = {
      started: false,
      speed: 0,
      distance: 0
};
```
... and you can replace the current `accelerate`, `brake` and `watchCar` functions with these:
```js
function accelerate(state, payload) {
    const speed = Math.min(state.speed + 5, 200); // set maximum speed

    return { ...state, speed }
}

function brake(state, payload) {
    const speed = Math.max(state.speed - 5, 0);

    return { ...state, speed }
}

function watchCar(state) {
    // 1 hour = 60 minutes
    // 1 minute = 60 seconds
    // 1 hour = 60 * 60 = 3600 seconds
    // watchCar() is triggered by a setInterval call every 100ms
    // This is 10 times every second = 36000 times per hour
    // 1 km/h = 1/36000 km every 100 ms
    const distance = state.distance + state.speed/36000
    return { ...state, distance }
}
```
Notice that there is no longer any calculation of `distance` in `accelerate` or `brake`. And you can't go faster than 200 kh/h, so you won't break the speedometer needle.

Refresh your page, click on Turn Engine On, then click 24 times on Accelerate, to bring the car's speed up to 120 km/h. You should see that the distance displayed reaches `1.00km` after just over 30 seconds, even if you don't touch any more buttons. The car should cover the next kilometre almost exactly 30 seconds later. It is now travelling at a constant speed.

If you reduce the speed, the distance should continue to increase, but more slowly. If you reduce it to 30 km/h, the car should take 2 minutes to complete the next kilometre.

Do the comments in the `watchCar()` function all make sense?

Yes? So that was easy, wasn't it?

The next step is to make sure that you can't switch off your car unless it has stopped.

Now run `git checkout 04-switching-off`.