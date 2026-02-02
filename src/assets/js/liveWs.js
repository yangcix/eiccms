let ws;
let wsHost = process.env.NODE_ENV === "production" ? `${location.hostname}` : '192.168.164.59';
import Event from "./event.js"
export const MyEvents = new Event();
export async function connects(id){   // islocalMode ：是否是本机  localName：校外本机采用的name值
	return new Promise( (resolve, reject) => {
    let protocol = location.protocol === 'https:' 
      ? `wss://${wsHost}:8553/theme?themeId=${id}`
      : `ws://${wsHost}:8553/theme?themeId=${id}`;
    // let protocol = location.protocol === 'https:' 
    //   ? `wss://192.168.164.59:8080/theme?themeId=${id}`
    //   : `ws://192.168.164.59:8080/theme?themeId=${id}`;
      ws = new WebSocket(protocol);
      ws.onopen = function(e) {
        resolve('200')
      };
      ws.onmessage = function(message) {
        MyEvents.emit('message', JSON.parse(message.data))
      }
})}
export function sendMessage(message) {
	var jsonMessage = JSON.stringify(message);
	ws.send(jsonMessage);
}
export function closeWs() {
	ws.close();
}