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
    const speed = Math.max(state.speed + 5, 0);
    const distance = state.distance + 0.1;

    return { ...state, speed, distance }
}

function brake(state, payload) {
    const speed = Math.max(state.speed - 5, 0);
    const distance = state.distance - 0.1;

    return { ...state, speed, distance }
}

function watchCar(state, setBy) {
    const called = state.called + 1;
    return { ...state, setBy, called }
}


export const initialState = {
      started: false,
      speed: 0,
      distance: 0,
      called: 0
};
