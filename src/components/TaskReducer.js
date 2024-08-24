export function reducer(state, action) {
    const { type, payload } = action

    switch(type) {
        case "TOGGLE_STARTED":
            return toggleStarted(state);

        case "CHANGE_SPEED":
            return changeSpeed(state, payload);
        
        case "WATCH_CAR":
            return watchCar(state);

        default:
            return state;
    }
}


function toggleStarted(state) {
    const started = !state.started
    return { ...state, started };
}

function changeSpeed(state, change) {
    const speed = Math.max(0, // can't go below 0
        Math.min(
            state.speed + change,
            200               // can't go above 200
        )
    );

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


export const initialState = {
      started: false,
      speed: 0,
      distance: 0
};
