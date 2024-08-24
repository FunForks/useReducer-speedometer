import React from "react";


export function reducer(state,action){
    switch(action.type){
        case "ENGINE_ON":{
            return{ ...state, started:true};
        }
        case "ENGINE_STOP":{
            return{...state,started:false,speed:0}
        }
        case "ACCELERATE":{
           return{...state,
            speed:Math.max(state.speed +5,0),
            distance: state.distance + 0.1
           }
        }
        case "BRAKE":
            {
                return{...state,
                 speed:Math.max(state.speed  - 5,0),
                 distance: state.distance - 0.1
                }
             }
        
        default:
            return state;
    }
}

 export  const initialState = {
      started: false,
      speed:0,
      distance:0
    };
