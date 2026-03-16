
//
// Copyright (c) 2013-2021 Winlin
//
// SPDX-License-Identifier: MIT
//

'use strict';

function SrsError(name, message) {
    this.name = name;
    this.message = message;
    this.stack = (new Error()).stack;
}
SrsError.prototype = Object.create(Error.prototype);
SrsError.prototype.constructor = SrsError;
import RoomClient from "./RoomClient";
// Depends on adapter-7.4.0.min.js from https://github.com/webrtc/adapter
// Async-awat-prmise based SRS RTC Publisher.
function SrsRtcPublisherAsync(constraints) {
    var self = {};

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    self.constraints = constraints
    ;
    self.publish = async function (url) {
        var conf = self.__internal.prepareUrl(url);
        self.pc.addTransceiver("audio", {direction: "sendonly"});
        self.pc.addTransceiver("video", {direction: "sendonly"});
        if (!navigator.mediaDevices && window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
            throw new SrsError('HttpsRequiredError', `Please use HTTPS or localhost to publish, read https://github.com/ossrs/srs/issues/2762#issuecomment-983147576`);
        }
        var stream = await navigator.mediaDevices.getUserMedia(self.constraints);
        console.log('stream',stream.getTracks())
        // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
        stream.getTracks().forEach(function (track) {
            self.pc.addTrack(track);
            // Notify about local track when stream is ok.
            self.ontrack && self.ontrack({track: track});
        })
        var offer = await self.pc.createOffer();
        await self.pc.setLocalDescription(offer);
        var session = await new Promise(function (resolve, reject) {
            // @see https://github.com/rtcdn/rtcdn-draft
            var data = {
                api: conf.apiUrl, tid: conf.tid, streamurl: conf.streamUrl,
                clientip: null, sdp: offer.sdp
            };
            console.log("Generated offer: ", data);
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.readyState !== xhr.DONE) return;
                if (xhr.status !== 200) return reject(xhr);
                const data = JSON.parse(xhr.responseText);
                console.log("Got answer: ", data);
                return data.code ? reject(xhr) : resolve(data);
            }
            xhr.open('POST', conf.apiUrl, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        });
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({type: 'answer', sdp: session.sdp})
        );
        session.simulator = conf.schema + '//' + conf.urlObject.server + ':' + conf.port + '/rtc/v1/nack/';
        return session;
    };

    // Close the publisher.
    self.close = function () {
        self.pc && self.pc.close();
        self.pc = null;
    };

    // The callback when got local stream.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
    self.ontrack = function (event) {
        // Add track to stream of SDK.
        self.stream.addTrack(event.track);
    };

    // Internal APIs.
    self.__internal = {
        defaultPath: '/rtc/v1/publish/',
        prepareUrl: function (webrtcUrl) {
            var urlObject = self.__internal.parse(webrtcUrl);

            // If user specifies the schema, use it as API schema.
            var schema = urlObject.user_query.schema;
            schema = schema ? schema + ':' : window.location.protocol;

            var port = urlObject.port || 1985;
            if (schema === 'https:') {
                port = urlObject.port || 443;
            }

            // @see https://github.com/rtcdn/rtcdn-draft
            var api = urlObject.user_query.play || self.__internal.defaultPath;
            if (api.lastIndexOf('/') !== api.length - 1) {
                api += '/';
            }

            apiUrl = schema + '//' + urlObject.server + ':' + port + api;
            for (var key in urlObject.user_query) {
                if (key !== 'api' && key !== 'play') {
                    apiUrl += '&' + key + '=' + urlObject.user_query[key];
                }
            }
            // Replace /rtc/v1/play/&k=v to /rtc/v1/play/?k=v
            var apiUrl = apiUrl.replace(api + '&', api + '?');

            var streamUrl = urlObject.url;

            return {
                apiUrl: apiUrl, streamUrl: streamUrl, schema: schema, urlObject: urlObject, port: port,
                tid: Number(parseInt(new Date().getTime()*Math.random()*100)).toString(16).slice(0, 7)
            };
        },
        parse: function (url) {
            // @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
            var a = document.createElement("a");
            a.href = url.replace("rtmp://", "http://")
                .replace("webrtc://", "http://")
                .replace("rtc://", "http://");
            var vhost = a.hostname;
            var app = a.pathname.substring(1, a.pathname.lastIndexOf("/"));
            var stream = a.pathname.slice(a.pathname.lastIndexOf("/") + 1);

            // parse the vhost in the params of app, that srs supports.
            app = app.replace("...vhost...", "?vhost=");
            if (app.indexOf("?") >= 0) {
                var params = app.slice(app.indexOf("?"));
                app = app.slice(0, app.indexOf("?"));

                if (params.indexOf("vhost=") > 0) {
                    vhost = params.slice(params.indexOf("vhost=") + "vhost=".length);
                    if (vhost.indexOf("&") > 0) {
                        vhost = vhost.slice(0, vhost.indexOf("&"));
                    }
                }
            }

            // when vhost equals to server, and server is ip,
            // the vhost is __defaultVhost__
            if (a.hostname === vhost) {
                var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                if (re.test(a.hostname)) {
                    vhost = "__defaultVhost__";
                }
            }

            // parse the schema
            var schema = "rtmp";
            if (url.indexOf("://") > 0) {
                schema = url.slice(0, url.indexOf("://"));
            }

            var port = a.port;
            if (!port) {
                // Finger out by webrtc url, if contains http or https port, to overwrite default 1985.
                if (schema === 'webrtc' && url.indexOf(`webrtc://${a.host}:`) === 0) {
                    port = (url.indexOf(`webrtc://${a.host}:80`) === 0) ? 80 : 443;
                }

                // Guess by schema.
                if (schema === 'http') {
                    port = 80;
                } else if (schema === 'https') {
                    port = 443;
                } else if (schema === 'rtmp') {
                    port = 1935;
                }
            }

            var ret = {
                url: url,
                schema: schema,
                server: a.hostname, port: port,
                vhost: vhost, app: app, stream: stream
            };
            self.__internal.fill_query(a.search, ret);

            // For webrtc API, we use 443 if page is https, or schema specified it.
            if (!ret.port) {
                if (schema === 'webrtc' || schema === 'rtc') {
                    if (ret.user_query.schema === 'https') {
                        ret.port = 443;
                    } else if (window.location.href.indexOf('https://') === 0) {
                        ret.port = 443;
                    } else {
                        // For WebRTC, SRS use 1985 as default API port.
                        ret.port = 1985;
                    }
                }
            }

            return ret;
        },
        fill_query: function (query_string, obj) {
            // pure user query object.
            obj.user_query = {};

            if (query_string.length === 0) {
                return;
            }

            // split again for angularjs.
            if (query_string.indexOf("?") >= 0) {
                query_string = query_string.split("?")[1];
            }

            var queries = query_string.split("&");
            for (var i = 0; i < queries.length; i++) {
                var elem = queries[i];

                var query = elem.split("=");
                obj[query[0]] = query[1];
                obj.user_query[query[0]] = query[1];
            }

            // alias domain for vhost.
            if (obj.domain) {
                obj.vhost = obj.domain;
            }
        }
    };

    self.pc = new RTCPeerConnection(null);

    // To keep api consistent between player and publisher.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
    // @see https://webrtc.org/getting-started/media-devices
    self.stream = new MediaStream();

    return self;
}

// Depends on adapter-7.4.0.min.js from https://github.com/webrtc/adapter
// Async-await-promise based SRS RTC Player.
function SrsRtcPlayerAsync(id) {
    let user_id = JSON.parse(localStorage.getItem('userInfo')).userId
    console.log(user_id,'info.user_id',id)
    var self = {};
    self.play = async function(url) {
        var conf = self.__internal.prepareUrl(url);
        self.pc.addTransceiver("audio", {direction: "recvonly"});
        self.pc.addTransceiver("video", {direction: "recvonly"});
        var offer = await self.pc.createOffer();
        await self.pc.setLocalDescription(offer);
        var session = await new Promise(function(resolve, reject) {
            // @see https://github.com/rtcdn/rtcdn-draft
            var data = {
                api: conf.apiUrl, tid: conf.tid, streamurl: conf.streamUrl,
                clientip: null, sdp: offer.sdp
            };
            console.log("Generated offer: ", data);
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.readyState !== xhr.DONE) return;
                if (xhr.status !== 200) return reject(xhr);
                const data = JSON.parse(xhr.responseText);
                console.log("Got answer: ", data);
                return data.code ? reject(xhr) : resolve(data);
            }
            xhr.open('POST', conf.apiUrl, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        });
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({type: 'answer', sdp: session.sdp})
        );
        session.simulator = conf.schema + '//' + conf.urlObject.server + ':' + conf.port + '/rtc/v1/nack/';

        return session;
    };
    // Close the player.
    self.close = function() {
        console.log('关闭了')
        self.pc && self.pc.close();
        self.pc = null;
    };
    // The callback when got remote track.
    // Note that the onaddstream is deprecated, @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onaddstream
    self.ontrack = function (event) {
        // https://webrtc.org/getting-started/remote-streams
        self.stream.addTrack(event.track);
    };
    // Internal APIs.
    self.__internal = {
        defaultPath: '/rtc/v1/play/',
        prepareUrl: function (webrtcUrl) {
            var urlObject = self.__internal.parse(webrtcUrl);

            // If user specifies the schema, use it as API schema.
            var schema = urlObject.user_query.schema;
            schema = schema ? schema + ':' : window.location.protocol;

            var port = urlObject.port || 1985;
            if (schema === 'https:') {
                port = urlObject.port || 443;
            }

            // @see https://github.com/rtcdn/rtcdn-draft
            var api = urlObject.user_query.play || self.__internal.defaultPath;
            if (api.lastIndexOf('/') !== api.length - 1) {
                api += '/';
            }

            apiUrl = schema + '//' + urlObject.server + ':' + port + api;
            for (var key in urlObject.user_query) {
                if (key !== 'api' && key !== 'play') {
                    apiUrl += '&' + key + '=' + urlObject.user_query[key];
                }
            }
            // Replace /rtc/v1/play/&k=v to /rtc/v1/play/?k=v
            var apiUrl = apiUrl.replace(api + '&', api + '?');

            var streamUrl = urlObject.url;

            return {
                apiUrl: apiUrl, streamUrl: streamUrl, schema: schema, urlObject: urlObject, port: port,
                tid: Number(parseInt(new Date().getTime()*Math.random()*100)).toString(16).slice(0, 7)
            };
        },
        parse: function (url) {
            // @see: http://stackoverflow.com/questions/10469575/how-to-use-location-object-to-parse-url-without-redirecting-the-page-in-javascri
            var a = document.createElement("a");
            a.href = url.replace("rtmp://", "http://")
                .replace("webrtc://", "http://")
                .replace("rtc://", "http://");

            var vhost = a.hostname;
            var app = a.pathname.substring(1, a.pathname.lastIndexOf("/"));
            var stream = a.pathname.slice(a.pathname.lastIndexOf("/") + 1);

            // parse the vhost in the params of app, that srs supports.
            app = app.replace("...vhost...", "?vhost=");
            if (app.indexOf("?") >= 0) {
                var params = app.slice(app.indexOf("?"));
                app = app.slice(0, app.indexOf("?"));

                if (params.indexOf("vhost=") > 0) {
                    vhost = params.slice(params.indexOf("vhost=") + "vhost=".length);
                    if (vhost.indexOf("&") > 0) {
                        vhost = vhost.slice(0, vhost.indexOf("&"));
                    }
                }
            }

            // when vhost equals to server, and server is ip,
            // the vhost is __defaultVhost__
            if (a.hostname === vhost) {
                var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                if (re.test(a.hostname)) {
                    vhost = "__defaultVhost__";
                }
            }

            // parse the schema
            var schema = "rtmp";
            if (url.indexOf("://") > 0) {
                schema = url.slice(0, url.indexOf("://"));
            }

            var port = a.port;
            if (!port) {
                // Finger out by webrtc url, if contains http or https port, to overwrite default 1985.
                if (schema === 'webrtc' && url.indexOf(`webrtc://${a.host}:`) === 0) {
                    port = (url.indexOf(`webrtc://${a.host}:80`) === 0) ? 80 : 443;
                }

                // Guess by schema.
                if (schema === 'http') {
                    port = 80;
                } else if (schema === 'https') {
                    port = 443;
                } else if (schema === 'rtmp') {
                    port = 1935;
                }
            }

            var ret = {
                url: url,
                schema: schema,
                server: a.hostname, port: port,
                vhost: vhost, app: app, stream: stream
            };
            self.__internal.fill_query(a.search, ret);

            // For webrtc API, we use 443 if page is https, or schema specified it.
            if (!ret.port) {
                if (schema === 'webrtc' || schema === 'rtc') {
                    if (ret.user_query.schema === 'https') {
                        ret.port = 443;
                    } else if (window.location.href.indexOf('https://') === 0) {
                        ret.port = 443;
                    } else {
                        // For WebRTC, SRS use 1985 as default API port.
                        ret.port = 1985;
                    }
                }
            }

            return ret;
        },
        fill_query: function (query_string, obj) {
            // pure user query object.
            obj.user_query = {};

            if (query_string.length === 0) {
                return;
            }

            // split again for angularjs.
            if (query_string.indexOf("?") >= 0) {
                query_string = query_string.split("?")[1];
            }

            var queries = query_string.split("&");
            for (var i = 0; i < queries.length; i++) {
                var elem = queries[i];

                var query = elem.split("=");
                obj[query[0]] = query[1];
                obj.user_query[query[0]] = query[1];
            }

            // alias domain for vhost.
            if (obj.domain) {
                obj.vhost = obj.domain;
            }
        }
    };
    self.pc = new RTCPeerConnection(null);
    self.pc.addEventListener('connectionstatechange', (event) => {
        if( self.pc.connectionState == 'connected'){
            console.log('time',window.timeInterval)
            if(user_id == parseInt(id)){
                clearInterval(window.timeInterval)
                window.timeInterval = null
            }
            console.log('已连接connected',window.timeInterval)
        }
        if( self.pc.connectionState=='failed'){
            console.log('关闭了failed',window.timeInterval)
        }
        if( self.pc.connectionState === 'disconnected') {
            console.log('网络出错了出错了disconnected',window.timeInterval,event)
            if(user_id == parseInt(id)){
                window.changeStatus()
                window.timeInterval = setInterval(() => {
                console.log('网络出错了，正在重连',window.timeInterval)
                window.joinRoom()
            }, 6000); 
            }
        }
    })
    // Create a stream to add track to the stream, @see https://webrtc.org/getting-started/remote-streams
    self.stream = new MediaStream();

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
    self.pc.ontrack = function(event) {
        if (self.ontrack) {
            self.ontrack(event);
        }
    };

    return self;
}
let sdk = null; // Global handler to do cleanup when republishing.
function startPublish (url,localVideoId,localAudioId) {
    console.log(url,'推流ddd地址',localVideoId,localAudioId)
  // Close PC when user replay.
  if (sdk) {
      sdk.close();
  }
  sdk = new SrsRtcPublisherAsync({
    audio: {deviceId: localAudioId ? {exact: localAudioId} : undefined},
    video: {deviceId: localVideoId ? {exact: localVideoId} : undefined}
    });
    console.log(url,'推流地址',sdk)
  // User should set the stream when publish is done, @see https://webrtc.org/getting-started/media-devices
  // However SRS SDK provides a consist API like https://webrtc.org/getting-started/remote-streams
  // 设置流
  // $('#rtc_media_player').prop('srcObject', sdk.stream);
  // Optional callback, SDK will add track to stream.
  // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };

  // ice 连接事件, 当 ICE 收集状态（即 ICE 代理是否正在主动收集候选项）发生更改时，会发生这种情况。
  sdk.pc.onicegatheringstatechange = function (event) {
      if (sdk.pc.iceGatheringState === "complete") {
          // $('#acodecs').html(SrsRtcFormatSenders(sdk.pc.getSenders(), "audio"));
          // $('#vcodecs').html(SrsRtcFormatSenders(sdk.pc.getSenders(), "video"));
      }
  };
  // 示例 webrtc://192.168.91.130/live/livestream
  // 开始推流
  sdk.publish(url).then(function (session) {
    console.log(session,'session')
  }).catch(function (reason) {
    console.log('reason',reason)
      // Throw by sdk.
      if (reason instanceof SrsError) {
          if (reason.name === 'HttpsRequiredError') {
              console.log(`WebRTC推流必须是HTTPS或者localhost：${reason.name} ${reason.message}`);
          } else {
              alert(`${reason.name} ${reason.message}`);
          }
      }
      if (reason instanceof DOMException) {
          if (reason.name === 'NotFoundError') {
            console.log(`找不到麦克风和摄像头设备：getUserMedia ${reason.name} ${reason.message}`);
          } else if (reason.name === 'NotAllowedError') {
            console.log(`你禁止了网页访问摄像头和麦克风：getUserMedia ${reason.name} ${reason.message}`);
          } else if (['AbortError', 'NotAllowedError', 'NotFoundError', 'NotReadableError', 'OverconstrainedError', 'SecurityError', 'TypeError'].includes(reason.name)) {
            console.log(`getUserMedia ${reason.name} ${reason.message}`);
          }
      }

      sdk.close();
      console.error(reason);
  });
};
function stopPublish() {
    if(sdk){
        sdk.close()
    }
}
export default {
  SrsError,
  SrsRtcPlayerAsync,
  SrsRtcPublisherAsync,
  startPublish,
  stopPublish
}