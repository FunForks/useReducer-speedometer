## First impressions

### Good:
- [x] You used `npm` to intall `react-d3-speedometer`
- [x] You created a separate script for your `TaskReducer`
- [x] Your task reducer has only pure functions with no side effects
- [x] The task reducer clones the `state` variable before it returns it
- [x] You make sure that the `speed` of the car can never fall below 0 (yeah... even when accelerating, which seems slightly unnecessary.)

### OK:
- [ ] You have two separate functions in the reducer for starting and stopping the engine. You could have done this with only one.
- [ ] You have a reducer operation that increases speed when `dispatch` is called with `"ACCELERATE"`
- [ ] You have a reducer operation that decreases speed when `dispatch` is called with `"BRAKE"`
- [ ] You don't use the `payload` property in the `action` object in your `dispatch` calls. A `payload` value is not always needed, so that's OK. But you'll see in a moment that using a `payload` can make your code simpler.

### Not so good:
* Your `return` statement in the `Car` component includes calculations. (I like the return statement to be as pure and simple as possible.)
* Your `reducer` function does calculations inside a `switch` statement. You should use a `switch` statement only to decide which _separate function_ to use to treat each specific case.
* You do calculations inside the `return` statements inside the `switch` statements. (Have I mentioned before that I like return statements to be as pure and simple as possible?)

### Unrealistic:
- Your calculation makes distance _decrease_ when `dispatch` is called with `"BRAKE"`
- If you _don't_ press Accelerate, the distance travelled does not increase. Time passes, the speed remains the same, but apparently the world moves backwards while the car stays in the same place.
- If you switch the engine off, even when driving at 200km/h, the speed of the car suddenly falls to 0. It would be good to make it impossible to switch the engine off if the speed is not 0.

## The problems you need to solve

This assignment is tricky because it asks you to solve two different types of questions:

1. **Real-world questions:**
  * How does a car's engine make it go?
  * What is the physical relationship between time, speed and distance?
  * What is the rate of acceleration for a racing car?
  * What happens if you neither accelerate nor brake?
  * Is it possible to change speed instantaneously?
  * ...
2. **React-world questions:**
   * How do I break a real-world problem down into React code?
   * How does the `useReducer` hook work?
   * How do I tell a Reducer  that time has passed?
   * How should I write my code so that it is easy to follow?
   * ...

## Refactoring

I'll start by refactoring your code. That is, any change that I make will not change how the code works; it will only change how the code is organized. This answers the last question ("How should I write my code?)

This is not the most important question, but I'm starting here so that it will be easier for me to show the changes that you need to answer the other questions.

Refactoring your code is like having your flatmate come into your room and tidying everything up for you... which means that you can't find anything anymore. So I've created a [new repository](https://github.com/FunForks/useReducer-speedometer) which takes your repository as its starting point. You can clone this repository and open it in one window in VS Code, and open your own project in another window, so that you can compare where I've moved things to where they used to be.

In my repo, I've created a series of branches, starting with 01-refactoring. Each numbered branch is a new step to accompany a different section in this review.

### TaskReducer.js

First, I converted the `reducer` function into something more like a signpost.

![signpost](https://reba.global/static/f8596666f97e229e3531fe8fe2bde7d8/F859-1620637716SimplyhealthMAIN.jpg)

Now, instead of doing anything, it just points to where a particular thing will be done:

```js
export function reducer(state, action) {
    const { type, payload } = action

    switch(type){
        case "ENGINE_ON":{
            return engineOn(state, payload);
        }
        case "ENGINE_STOP":{
            return engineStop(state, payload);
        }
        case "ACCELERATE":{
            return accelerate(state, payload);
        }
        case "BRAKE":
            return brake(state, payload); 
        default:
            return state;
    }
}
``` 
Also, I've added the line `const { type, payload } = action`, to destructure the incoming `action` object. The calls to the functions pass on the value for both `state` and `payload`. Spoiler Alert: I'll be using `payload` later.

Turning `reducer` into a simple `switch` signpost means that I have had to create four new functions, one to handle each of the incoming `type` messages.

The first two look very similar to what your `switch` statement was already doing. I've just added some whitespace, because I think whitespace is a Good Thing® that helps make code easier to read. I've also added a `payload` argument, which is not used yet.

```js
function engineOn(state, payload) {
    return { ...state, started: true };
}

function engineStop(state, payload) {
    return { ...state, started: false, speed: 0 };
}
```

In the next two functions, I have moved the calculations out of the `return` statement. This makes the `return` statement nice and clean. Another developer can look quickly at the function, check the last line, and understand immediately what to expect the function to return.

```js
function accelerate(state, payload) {
    const speed = Math.max(state.speed + 5, 0);
    const distance = state.distance + 0.1;

    return { ...state, speed, distance }
}

function brake(state, payload) {
    const speed = Math.max(state.speed - 5, 0);
    const distance = state.distance - 0.1;

    return { ...state, speed, distance }
}
```
Is there anything that strikes you when you look at these two new functions? How _different_ are they? Just how many characters in the body of these two functions are actually different? Can you guess how you could use a `payload` with a value of either `+5` or `-5`, and reduce these two functions to just one?

Do you see how my version of the `TaskReducer.js` script does exactly the same as yours?

Instead of having the JavaScript elves working in an open-plan office inside the same `reducer()` function, I've given each task to a separate elf, and I've given each elf a space of their own, inside their own function, where they can close the door and work quietly without being bothered by anything else that might be happening?

Your code was 35 lines and mine (so far) is 52, but everything has its own place. Does this look easier to read... and easier to make changes?

### Car.js

The first thing I did here was to destructure the `state` variable that is returned by `useReducer`, so that I can see right from the start what useful values it contains:

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

Now, I can go through the rest of the code and replace `state.xxx` with `xxx`. I find one occurrence of `shift.` and press Ctrl-Alt-F. This opens the Find and Replace dialog, with `state.` already entered in the Find field and the Replace field empty.

There are two buttons to the right of the Replace field. The first button replaces only the current selection, the second button replaces all occurrences of the text in the Find field. In this case, it's safe to press the Replace All button, but often I will press the Replace button multiple times, checking each time that I actually do want to replace the currently selected text.

Already, the code is shorter and easier to read.

For now, I've left your `toggleCar()` function as it is are. However, I want to make changes to the `accelerate()` and `brake()` functions, so I've reformatted them to make their internal workings clearer. This is just cosmetic, though:

```js
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
```

But your `return` statement...

Your `return` statement takes almost 40 lines to do its job. For me, this is likely asking a child to get dressed and put on their shoes on their way to the bus stop for school. I like to have everything ready for the `return` statement before I open the door and send it outside.

#### Engine on?

What the component renders depends on whether `state.started` is true or not. If not, you render just a `<p>` element with the text "Engine is off". It `started` is true, you render something quite complex. A complete dashboard with accelerate and brake pedals, in fact.

You know what? I want to create a separate `Dashboard` component for this.

#### Dashboard

Here's the `Dashboard.js` file that I have created. It spells everything out v.e.r.y c.l.e.a.r.l.y.

* I've destructured the `props` object so that you can see what data it will receive from the `Car` component. (I'll explain these in a moment.)
* One of these props is `buttonStyle`. This is because you use the same style settings for every button, so I've defined a `buttonStyle` object once (in the `Car` component) and shared object with all the buttons.
* I've created a `speedometerSettings` where each property and value are set on a separate line. (Note how `value` is set to `speed`, but the other properties have the custom values that you have chosen.)
* I've removed any conditional statements that depend on the value for `started`, because the Dashboard will only be shown when `started` is true. The Accelerate and Brake buttons are always enabled inside the Dashboard, and the "Car Status" is always "Engine on".
* 

```js
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
```

#### dashboardProps

Your `Car` component shows certain details in two places:
* Distance Travelled
* The Accelerate button
* The Brake button

When you are refactoring, you should not make any changes to what the code does. For this reason, I need to duplicate these details, too, for now. (Later, I will take Distance Travelled out of the Dashboard, and I won't show the Accelerate and Brake buttons at all when the Dashboard is not showing.)

This means that I need to calculate the value for "Distance travelled" in the `Car` component, and pass this value to the `Dashboard` component as a prop.

```js
  const travel = distance.toFixed(2) + "km"
```

And I want to create a `buttonStyle` object, to share with all the buttons:

```js
const buttonStyle = {
  margin: "10px"
}
```
Now I can create a `dashboardProps` object which assembles all the `props` that the `Dashboard` component will need, and generate either a `Dashboard` component or a simple `<p>` element, depending on the value of `started`:

```js
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
```

I can also decide what text to show in the button for `toggleCar`:

```js
const toggleText = started
  ? "Turn Engine Off"
  : "Turn Engine On"
```

The refactored `return` statement can now be much simpler:
```js
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
)
```

(I expect that it will become even simpler later.)

Now run`git checkout 02-understanding-useReducer


## Updating distance at regular intervals

The thing that bothers me the most about your app is how you calculate the distance travelled. I'd like to treat that now... but as you'll see there's something else that I'll need to clear up first.

### Calculating distance...

 If you run at 10 metres per second (like any good Olympic sprinter), you can cover 100 meters in 10 seconds.

> 10 metres per second * 10 seconds = 100 metres / second * second = 100 metres

How far would you travel in 100ms (or 0.1 seconds)?

> 10 metres per second * 0. seconds = 1 metre / second * second = 1 metre

Suppose your `TaskReducer.js`script knows that you are travelling at a speed of `10` (metres per second), and you ask it every 100ms, "How far have I gone now?", it could say: "Well, last time you asked, you had travelled `x` metres. Now you have had time to travel one more metre, so that should be `x + 1`."

In pseudo-code:
```code
  distanceNow = distanceAMomentAgo + (speed * timeSinceAMomentAgo)
```
To be _absolutely_ accurate, that should be `+ (averageSpeed * timeSinceAMomentAgo)`, but this is not a mission-critical application for NASA, so you can use `speed`, even when the speed is changing due to acceleration or braking. Also, any technique that you can use to ask "How far have I gone now?" will not trigger at exactly equal intervals, so `timeSinceAMomentAgo` can vary, but for this assignment, you can ignore that, too.

### ... at regular intervals

The most important thing to note is that you will need to ask your `reducer` function this question very often. At a regular interval. Can you think of a JavaScript technique for calling the same function over and over at regular intervals?

Here's a Google query: [js call function at regular intervals](https://www.google.com/search?q=js+call+function+at+regular+intervals).

When you use a React component to render a DOM element to your page, React will call your component function. Each time it calls the function, the variables inside the function will be in a different _scope_ from the last time. So here are two questions that you need to answer:

1.  How can you start calling a function repeatedly in a React component?
2. How can you ensure that the function you call is in the scope of the current function call?

Which of the hooks  `useState`, `useEffect`, `useRef` and `useContext` do you think would work best for this?

You could add something like this to your `Car` component:

```js
const watchCar = () => {
    dispatch({
      type: "WATCH_CAR",
    })
  }

  const startWatching = () => {
    setInterval(watchCar, 100)
  }

  useEffect(startWatching, [])
```
You'll also have to change the very first line of the `Car.js` script, or your browser will complain that `useEffect` in undefined:
```js
import React, { useReducer, useEffect } from "react"; // add useEffect
```
You don't have `"WATCH_CAR"` case in your `reducer` function yet, so the `default` case would be triggered, and `state` would be returned as-is. Nothing would happen yet.

### Back to the future?

Soon, I'll show you how you can create a `watchCar()` function inside your `TaskReducer.js` script, and use that to calculate how far the car has travelled. But first, I want you to discover how to get React to reveal the secrets of how `useReducer()` works.

Here are a couple of questions for you. I'll answer the first one, and I'll show you how to find the answer to the second.

1. [When will the `useEffect` be triggered?](https://dev.to/cassidoo/when-useeffect-runs-3pf3#when-does-raw-useeffect-endraw-get-called)

It will _always_ be triggered immediately after a component is rendered for the first time. If there is *no* dependency array (here the dependency array is `[]`), then it will be triggered again immediately after the component is rendered every time. If the dependency array contains a variable, it will only be called if the value of that variable changes. But here, the dependency array is empty. It contains no variables that might change. So it will never be called again.

In other words `setInterval(watchCar, 100)` will be called once, when the component is first rendered. But `watchCar` will be called every `100` milliseconds after that.

2. The `watchCar()` function that is called by `setInterval`  was created inside the scope of the first call to the `Car()` function. You then press a button or something and React calls the `Car()` function again and your `Car` component is updated. But the `Car()`function never calls `setInterval` again. So the `watchCar()` function is trapped in a scope from the past, a little like a mosquito in amber which drew blood from a dinosaur in the Jurassic Park stories.
   
   **Is this going to cause a problem?**

That was quite a complicated question, so I'll explain it in a different way. When you first learned about `useState`, you learned that [you have to be careful about using an outdated value](https://medium.com/@anandsimmy7/stale-closures-and-react-hooks-ea60689a3544) of what the state was in a previous rendering of your component. Are you going to have to deal with a similar problem here?

### Counting renders

First, can you edit the beginning of your `Car()` function, so that it looks like this:
```js
let renders = 0 // new line

const Car = () => {
  const render = ++renders // new line

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    started,
    speed,
    distance
  } = state

  console.log("render:", render, ", started:", started); // new line
 
 // Many lines skipped
}
```
What does this do?

1. _When the `Car.js` script is loaded_, the `renders` variable, which is outside the `Car()` function is set to zero. Because it is declared with `let`, the value of `renders` can be changed later.
2. _Each time _ the `Car()function is called`_ the `const render`, which is inside the scope of the `Car()` function will:
	* Read the current value of `renders`
	* Add `1` to this value, so that the value of `renders` itself changes
	* Adopt the new value of `renders`
	
   Note that the `const render` cannot be changed, because it is declared as a `const`.
3. The `console.log(...)` command will print out something in your browser's Console.

Open your app in your browser, open the Developer Tools at the Console tab, and look at what it says. Click on the Turn Engine On button, and then on the Turn Engine Off button. At each render, you should see a message. Here's what I see:
```console
render: 1 , started: false
render: 3 , started: true
render: 5 , started: false
```
### Why such odd numbers?

 Perhaps you are wondering why the numbers jump by `2` each time. The reason is because your app is running in development mode, and `React.StrictMode` is activated.

`React.StrictMode` is designed to help you make sure that your `useEffect()` functions clean up properly after themselves. You can find more about it [here](https://react.dev/reference/react/StrictMode).

You can switch it off by editing the file at `src/index.js`. Here's what it looks like now:
```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```
You can comment out the lines with `<React.StrictMode>` and `</React.StrictMode>`, but be sure to leave the comma before the line `document.getElementById("root")`:
 
 ```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
  ,
  document.getElementById("root")
);

```
Now, if you refresh your page, and click on the Turn Engine On button, and then on the Turn Engine Off button, here's what you should see:
```console
   render: 1 , started: false
   render: 2 , started: true
   render: 3 , started: false
```
Now that you understand why you are seeing only odd numbers for `render`, you can revert your  file at `src/index.js`, to turn `React.StrictMode` back on. It's there to help you. In the log extracts that follow, you'll see the output that I get with `React.StrictMode` back on.

### Unstuck in time

To see which render was active when `startWatching` was called by `useEffect`, add this code to your `Car()` function:

```js
  const watchCar = setBy => {
    console.log(`watchCar(${setBy})`)
        
    dispatch({
      type: "WATCH_CAR",
      payload: setBy
    })
  }

  const startWatching = () => {
    const interval = setInterval(watchCar, 1000, render)

    return () => {
      console.log(`Cleaning up startWatching (render: ${render})`)
      clearInterval(interval)
    }
  }

  useEffect(startWatching, [])
```

Points to note:
* I've used `1000` milliseconds as the interval in `setInterval(watchCar, 1000, render)`, so that the logging in your browser doesn't go crazy
* I've added `render` as [the third argument for `setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval#arg1). The first argument should be a function (here `watchCar`), the second should be the millisecond delay between each time the function is called, and any subsequent arguments are sent as arguments to the function call.
* The `watchCar()` function uses a `setBy` parameter. This will have the value that `render` had when `setInterval()` was invoked.
* The `watchCar()` function logs its name and the value of `setBy` to the console, each time it is called
* The call to `dispatch` doesn't do anything useful yet, as I described earlier.

What do you see in your browser console? In my browser, I see that `watchCar(2)` is logged, with a counter in front of it to say how many times this message was logged:

```console
   render: 1 , started: false
8  watchCar(2)
```

If you see something different, you can click on the Settings button in the Console and select the Group Similar Messages checkbox.
![group similar messages](images/group.webp)

To stop these messages from being logged, you can comment out the line that logs them:
```js
  const watchCar = setBy => {
    // console.log(`watchCar(${setBy})`)
        
    dispatch({
      type: "WATCH_CAR",
      payload: setBy
    })
  }
```

This will force VS Code to recompile your web page, and your browser should now tell you that the clean-up function returned by `startWatching()` has been triggered. I did this while the React page was active in my browser, and here's what the Console showed me:
```console
   render: 1 , started: false
9  watchCar(2)
   render: 1 , started: false
   Cleaning up startWatching (render: 2)
   render: 3 , started: false
```

### So why `render 2`?

In `React.StrictMode`, React calls the component function twice for each render. It never actually renders the first call; it just runs through the motions. The `useEffect` function is not triggered until the component is actually rendered on the second call React makes. So: on `render 2`.

### Which `render` scope is the `dispatch` function in?

If `watchCar()` is constantly being called from the scope of a function that performed a render in the past, won't that put the call to `dispatch()` in the same scope. How can you check that?

You can ask the `reducer()` function to tell you. In your `TaskReducer.js` script, add a new case to the `reducer()` function, and add a new `watchCar()` function. Add a new `called` state to the `initialState` object:

```js
export function reducer(state, action) {
    const { type, payload } = action

    switch(type){
        // Existing cases skipped
        
        case "WATCH_CAR": // new case
            return watchCar(state, payload);
    }
}

// Existing functions skipped

function watchCar(state, setBy) { // new function
    const called = state.called + 1;
    return { ...state, setBy, called }
}

export const initialState = {
      started: false,
      speed: 0,
      distance: 0,
      called: 0  // new state
};
```
Notice what the `watchCar()` function does here. It reads the value of `called` from its own current `state`, adds `1` to it, and returns a new object which is a clone of the earlier `state`, but with a new value of `called` and the value of `setBy` that was set in the call to `dispatch()`

In your `Car.js` script, edit the beginning of your `Car()` function:
```js
let renders = 0

const Car = () => {
  const render = ++renders

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    started,
    speed,
    distance,
    setBy,
    called
  } = state

  console.log("render:", render, ", setBy:", setBy, ", called:", called);

  // The rest of the code is the same as before
}
```
Refresh the page in your browser, and look at what is printed in the Console now. Here's what I see:
```console
render: 1 , setBy: undefined , called: 0
render: 3 , setBy: 2 , called: 1
render: 5 , setBy: 2 , called: 2
render: 7 , setBy: 2 , called: 3
render: 9 , setBy: 2 , called: 4
```
You didn't include a `setBy` property in the `initialState` object, so the first time the `Car()` function is called, `state.setBy` is `undefined`.  After that, it is always set to `2`, which is what you would expect, because `setInterval()` was invoked during the second call to the `Car()` function.

The key point to note is that `called` has increased by 1 each time the `console.log()` call is executed. What does this mean? This means that _it is the same `dispatch()` function that is called each time_. Specifically:

**The problem with stale values that you can get with `useState` does not occur with `useReducer`.**

### How is `useReducer` different from `useState`?

The way you set up `useState` and `useReducer` look very similar. Both call a React method, both receive an array containing two values as the output:
```js
  const [ value, setValue ] = useState(initialValue)
  const [ state, dispatch ] = useReducer(reducer, initialState);
```
The key difference is that`useReducer` requires you to send a  _function_ (called `reducer` in the example above) as one of the arguments. The `useState` hook does not. The `useState` hook does _allow_ you to [use an updater function when you call it with an update](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state#updating-state-based-on-the-previous-state), but it does not _require_ you to do this. If you don't use an updater function, you may have problems with stale values.

The `useReducer` hook _forces_ you to call an updater function. Indeed, it forces you to declare the updater function that you want it to call, before you can even start using `useReducer()`.

Because of this, `useReducer` will always provide the latest value of `state` to your component function, even if the call to the `dispatch` function comes from a scope that is no longer used for the current render.

### Take-aways from this section

Here's what I hope you have learned on this side track:

1. You can provide arguments for the functions called by `setInterval` and `setTimeout`. 
2. Using `setInterval` or `setTimeout` in a React component can be a source of headaches.
3. If you use `useEffect` you should clean up afterwards.
4. `React.StrictMode` is designed to encourage you to do this.
5. The `useReducer` hook is inherently more robust than `useState`, especially when used in combination with `useEffect`.
6. Adding a `payload` to a `dispatch` action object allows you to provide arguments for your `reducer` function to work with

And more importantly, in the long term:

7. It is possible to write code that makes the code engine show you how it works internally. Whenever you find that your code is not doing what you expected it to do, you can create a new branch in Git and write some experimental code that you can delete later, after you have learned from it.

An alternative approach might be to ask ChatGPT a question when you run into a problem. The difficulty there is knowing what question to ask. I found that the following question prompted ChatGPT to give a good answer to the problem that I have just described. Perhaps it will give you a useful answer too.

>In React, the useEffect hook can provide stale data. Is this a problem with useReducer?

However, I think that when you experimental code yourself, you will understand both the problems and the solutions more clearly than if you ask a person, or Google, or ChatGPT for an explanation. So, even if you _do_ ask for help, you should _also_ write some code that demonstrates the understanding that you have just acquired.

Now run `git checkout 03-calculating-distance`.


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

Send me a message or create an Issue on the GitHub repo if you have any questions