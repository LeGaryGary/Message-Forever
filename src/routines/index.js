import {UpdatePrivateMessages} from './privateMessagesUpdate'

let running = false
export function RunAllRoutines(){
    if (running) return;
    setInterval(UpdatePrivateMessages, 10000)

    running = true;
}

