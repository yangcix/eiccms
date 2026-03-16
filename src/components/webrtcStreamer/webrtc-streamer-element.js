import "./adapter.min.js";
import "./webrtcstreamer.js";
import "./tensorflow.js";

class WebRTCStreamerElement extends HTMLElement {
	static get observedAttributes() {
		return ['url', 'options', 'webrtcurl', 'notitle', 'width', 'height', 'algo'];
	}  
	
	constructor() {
		super(); 
		this.shadowDOM = this.attachShadow({mode: 'open'});
		this.shadowDOM.innerHTML = `
					<style>@import "styles.css"</style>
					<h2 id="title"></h2>
					<div id="content">
						<video id="video"  playsinline autoplay controls muted disablePictureInPicture controlslist="nodownload" ></video>
						<canvas id="canvas" style="width:0px;height:0px"></canvas>
					</div>
					`;
					
		this.initialized = false;
		this.titleElement = this.shadowDOM.getElementById("title");
		this.videoElement = this.shadowDOM.getElementById("video");
		this.canvasElement = this.shadowDOM.getElementById("canvas");
		this.modelLoaded = [];
	}
	connectedCallback() {
		this.connectStream(true);
		this.initialized = true;
	}
	disconnectedCallback() {
		this.disconnectStream();
		this.initialized = false;
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName === "notitle") {
			this.titleElement.style.visibility = "hidden";
		} else if (attrName === "width") {
			this.videoElement.style.width = newVal;
		} else if (attrName === "height") {
			this.videoElement.style.height = newVal;
		} if (this.initialized) {
			this.connectStream((attrName !== "algo"));
		}
	}
	
	disconnectStream() {
		if (this.webRtcServer) {
			this.webRtcServer.disconnect();
			this.webRtcServer = null;
		}
	}

	connectStream(reconnect) {
		
		const webrtcurl = this.getAttribute("webrtcurl");

		let videostream;
		let audiostream;

		const url = this.getAttribute("url");
		if (url) {
			try {
				let urljson = JSON.parse(url);
				videostream = urljson.video;
				audiostream = urljson.audio;
			} catch (e) {
				videostream = url;
			}
			
			const notitle = this.getAttribute("notitle");
			if (notitle === null) {
				this.titleElement.innerHTML = videostream; 
			}
			this.videoElement.title = videostream;

			// stop running algo
			Object.values(this.modelLoaded).forEach( promise => {
				if (promise.model) {
					promise.model.run = null; 
				} 
			});

			let imgLoaded;
			if (reconnect) {
				this.disconnectStream();
				this.webRtcServer = new WebRtcStreamer(this.videoElement, webrtcurl);
				this.webRtcServer.connect(videostream, audiostream, this.getAttribute("options"));

				imgLoaded = new Promise( (resolve,rejet) => {
					this.videoElement.addEventListener('loadeddata', (event) => { 
						resolve(event)
					});
				} );
			} else {
				imgLoaded = new Promise( (resolve) => resolve() );
			}
			
			let modelLoaded = this.getModelPromise(this.getAttribute("algo"));
		
			Promise.all([imgLoaded, modelLoaded]).then(([event,model]) => {	
				this.setVideoSize(this.videoElement.videoWidth, this.videoElement.videoHeight)

				if (model) {
					model.run = modelLoaded.run;
					model.run(model, this.videoElement, this.canvasElement)
					modelLoaded.model = model;
				}
			});			
		}
	}	

	setVideoSize(width, height) {
		this.videoElement.width = width;
		this.videoElement.height = height;

		setTimeout(()=> {
			this.videoElement.play()
		},10)
		this.canvasElement.width = 0;
		this.canvasElement.height = 0;
	}

	getModelPromise(algo) {
		let modelLoaded;
		if (this.modelLoaded[algo]) {
			modelLoaded = this.modelLoaded[algo];
		}
		else {
			if (algo === "posenet") {
				modelLoaded = posenet.load();
				modelLoaded.run = runPosenet;
			} else if (algo === "deeplab") {
				modelLoaded = deeplab.load()
				modelLoaded.run = runDeeplab;
			} else if (algo === "cocossd") {
				modelLoaded = cocoSsd.load();
				modelLoaded.run = runDetect;
			} else if (algo === "bodyPix") {
				modelLoaded = bodyPix.load();
				modelLoaded.run = runbodyPix;
			} else {
				modelLoaded = new Promise( (resolve) => resolve() );
			}
			this.modelLoaded[algo] = modelLoaded;
		} 
		return modelLoaded;
	}
}

customElements.define('webrtc-streamer', WebRTCStreamerElement);
