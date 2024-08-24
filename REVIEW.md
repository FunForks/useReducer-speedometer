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
- [ ] You have a reducer operation that decrease speed when `dispatch` is called with `"BRAKE"`
- [ ] You don't use the `payload` property in the `action` object in your `dispatch` calls. A `payload` value is not always needed, so that's OK. But you'll see in a moment that using a `payload` can make your code simpler.

### Not so good:
* Your `return` statement in the `Car` component includes calculations. (I like the return statement to be as pure and simple as possible.)
* Your `reducer` function does calculations inside a `switch` statement. You should use a `switch` statement only to decide which _separate function_ to use to treat each specific case.
* You do calculations inside the `return` statements inside the `switch` statements. (Have I mentioned before that I like return statements to be as pure and simple as possible?)

### Unrealistic:
- Your calculation makes distance _decrease_ when `dispatch` is called with `"BRAKE"`
- If you _don't_ press Accelerate, the distance travelled does not increase. Time passes, the speed remains the same, but apparently the world moves backwards while the car stays in the same place.
- Your `dispatch` calls with `"ACCELERATE"` and `"BRAKE"` change speed even when the engine is switched off.
- If you switch the engine off, even when driving at 200km/h, the speed of the cars suddenly falls to 0. It would be good to make it impossible to switch the engine off if the speed is not 0.

## The problems you need to solve

This assignment is tricky because it asks you to solve two different types of questions:

1. Real-world questions:
  * How does a car's engine make it go?
  * What is the physical relationship between time, speed and distance?
  * What is the rate of acceleration for a racing car?
  * What happens if you neither accelerate nor brake?
  * Is it possible to change speed instantaneously?
  * ...
2. React-world questions:
   * How do I break a real-world problem down into React code?
   * How does the `useReducer` hook work?
   * How do I tell a Reducer  that time has passed?
   * How should I write my code so that it is easy to follow?
   * ...

## Refactoring

I'll start by refactoring your code. That is, any change that I make will not change how the code works; it will only change how the code is organized. This answers the last question ("How should I wiret my code?)

This is not the most important question, but I'm starting here so that it will be easier for me to show the changes that you need to answer the other questions.

Refactoring your code is like having your flatmate come into your room and tidying everything up for you... which means that you can't find anything anymore. So I've created a [fork](https://github.com/blackslate/spa-55-usereducerspeedometer-Viktoriya2024) of your repository. You can clone my fork and open it in one window in VS Code, and open your own project in another window, so that you can compare where I've moved things to where they used to be.

In my fork, I've created a series of branches, starting with 01-refactoring. Each numbered branch is a new step to accompany a different section in this review.

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

Now run `git checkout 02-understanding-useReducer`.