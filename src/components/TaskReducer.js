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
        
        case "WATCH_CAR":
            return watchCar(state, payload);

        default:
            return state;
    }
}


function engineOn(state, payload) {
    return { ...state, started: true };
}

function engineStop(state, payload) {
    return { ...state, started: false, speed: 0 };
}

function accelerate(state, payload) {
    const speed = Math.min(state.speed + 5, 200); // set max speed

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


export const initialState = {
      started: false,
      speed: 0,
      distance: 0
};
