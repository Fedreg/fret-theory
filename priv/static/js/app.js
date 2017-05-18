(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("phoenix/priv/static/phoenix.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "phoenix");
  (function() {
    (function(exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Phoenix Channels JavaScript client
//
// ## Socket Connection
//
// A single connection is established to the server and
// channels are multiplexed over the connection.
// Connect to the server using the `Socket` class:
//
//     let socket = new Socket("/ws", {params: {userToken: "123"}})
//     socket.connect()
//
// The `Socket` constructor takes the mount point of the socket,
// the authentication params, as well as options that can be found in
// the Socket docs, such as configuring the `LongPoll` transport, and
// heartbeat.
//
// ## Channels
//
// Channels are isolated, concurrent processes on the server that
// subscribe to topics and broker events between the client and server.
// To join a channel, you must provide the topic, and channel params for
// authorization. Here's an example chat room example where `"new_msg"`
// events are listened for, messages are pushed to the server, and
// the channel is joined with ok/error/timeout matches:
//
//     let channel = socket.channel("room:123", {token: roomToken})
//     channel.on("new_msg", msg => console.log("Got message", msg) )
//     $input.onEnter( e => {
//       channel.push("new_msg", {body: e.target.val}, 10000)
//        .receive("ok", (msg) => console.log("created message", msg) )
//        .receive("error", (reasons) => console.log("create failed", reasons) )
//        .receive("timeout", () => console.log("Networking issue...") )
//     })
//     channel.join()
//       .receive("ok", ({messages}) => console.log("catching up", messages) )
//       .receive("error", ({reason}) => console.log("failed join", reason) )
//       .receive("timeout", () => console.log("Networking issue. Still waiting...") )
//
//
// ## Joining
//
// Creating a channel with `socket.channel(topic, params)`, binds the params to
// `channel.params`, which are sent up on `channel.join()`.
// Subsequent rejoins will send up the modified params for
// updating authorization params, or passing up last_message_id information.
// Successful joins receive an "ok" status, while unsuccessful joins
// receive "error".
//
// ## Duplicate Join Subscriptions
//
// While the client may join any number of topics on any number of channels,
// the client may only hold a single subscription for each unique topic at any
// given time. When attempting to create a duplicate subscription,
// the server will close the existing channel, log a warning, and
// spawn a new channel for the topic. The client will have their
// `channel.onClose` callbacks fired for the existing channel, and the new
// channel join will have its receive hooks processed as normal.
//
// ## Pushing Messages
//
// From the previous example, we can see that pushing messages to the server
// can be done with `channel.push(eventName, payload)` and we can optionally
// receive responses from the push. Additionally, we can use
// `receive("timeout", callback)` to abort waiting for our other `receive` hooks
//  and take action after some period of waiting. The default timeout is 5000ms.
//
//
// ## Socket Hooks
//
// Lifecycle events of the multiplexed connection can be hooked into via
// `socket.onError()` and `socket.onClose()` events, ie:
//
//     socket.onError( () => console.log("there was an error with the connection!") )
//     socket.onClose( () => console.log("the connection dropped") )
//
//
// ## Channel Hooks
//
// For each joined channel, you can bind to `onError` and `onClose` events
// to monitor the channel lifecycle, ie:
//
//     channel.onError( () => console.log("there was an error!") )
//     channel.onClose( () => console.log("the channel has gone away gracefully") )
//
// ### onError hooks
//
// `onError` hooks are invoked if the socket connection drops, or the channel
// crashes on the server. In either case, a channel rejoin is attempted
// automatically in an exponential backoff manner.
//
// ### onClose hooks
//
// `onClose` hooks are invoked only in two cases. 1) the channel explicitly
// closed on the server, or 2). The client explicitly closed, by calling
// `channel.leave()`
//
//
// ## Presence
//
// The `Presence` object provides features for syncing presence information
// from the server with the client and handling presences joining and leaving.
//
// ### Syncing initial state from the server
//
// `Presence.syncState` is used to sync the list of presences on the server
// with the client's state. An optional `onJoin` and `onLeave` callback can
// be provided to react to changes in the client's local presences across
// disconnects and reconnects with the server.
//
// `Presence.syncDiff` is used to sync a diff of presence join and leave
// events from the server, as they happen. Like `syncState`, `syncDiff`
// accepts optional `onJoin` and `onLeave` callbacks to react to a user
// joining or leaving from a device.
//
// ### Listing Presences
//
// `Presence.list` is used to return a list of presence information
// based on the local state of metadata. By default, all presence
// metadata is returned, but a `listBy` function can be supplied to
// allow the client to select which metadata to use for a given presence.
// For example, you may have a user online from different devices with a
// a metadata status of "online", but they have set themselves to "away"
// on another device. In this case, they app may choose to use the "away"
// status for what appears on the UI. The example below defines a `listBy`
// function which prioritizes the first metadata which was registered for
// each user. This could be the first tab they opened, or the first device
// they came online from:
//
//     let state = {}
//     state = Presence.syncState(state, stateFromServer)
//     let listBy = (id, {metas: [first, ...rest]}) => {
//       first.count = rest.length + 1 // count of this user's presences
//       first.id = id
//       return first
//     }
//     let onlineUsers = Presence.list(state, listBy)
//
//
// ### Example Usage
//
//     // detect if user has joined for the 1st time or from another tab/device
//     let onJoin = (id, current, newPres) => {
//       if(!current){
//         console.log("user has entered for the first time", newPres)
//       } else {
//         console.log("user additional presence", newPres)
//       }
//     }
//     // detect if user has left from all tabs/devices, or is still present
//     let onLeave = (id, current, leftPres) => {
//       if(current.metas.length === 0){
//         console.log("user has left from all devices", leftPres)
//       } else {
//         console.log("user left from a device", leftPres)
//       }
//     }
//     let presences = {} // client's initial empty presence state
//     // receive initial presence data from server, sent after join
//     myChannel.on("presences", state => {
//       presences = Presence.syncState(presences, state, onJoin, onLeave)
//       displayUsers(Presence.list(presences))
//     })
//     // receive "presence_diff" from server, containing join/leave events
//     myChannel.on("presence_diff", diff => {
//       presences = Presence.syncDiff(presences, diff, onJoin, onLeave)
//       this.setState({users: Presence.list(room.presences, listBy)})
//     })
//
var VSN = "1.0.0";
var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
var DEFAULT_TIMEOUT = 10000;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};

var Push = function () {

  // Initializes the Push
  //
  // channel - The Channel
  // event - The event, for example `"phx_join"`
  // payload - The payload, for example `{user_id: 123}`
  // timeout - The push timeout in milliseconds
  //

  function Push(channel, event, payload, timeout) {
    _classCallCheck(this, Push);

    this.channel = channel;
    this.event = event;
    this.payload = payload || {};
    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }

  _createClass(Push, [{
    key: "resend",
    value: function resend(timeout) {
      this.timeout = timeout;
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
      this.send();
    }
  }, {
    key: "send",
    value: function send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref
      });
    }
  }, {
    key: "receive",
    value: function receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }

      this.recHooks.push({ status: status, callback: callback });
      return this;
    }

    // private

  }, {
    key: "matchReceive",
    value: function matchReceive(_ref) {
      var status = _ref.status;
      var response = _ref.response;
      var ref = _ref.ref;

      this.recHooks.filter(function (h) {
        return h.status === status;
      }).forEach(function (h) {
        return h.callback(response);
      });
    }
  }, {
    key: "cancelRefEvent",
    value: function cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
  }, {
    key: "cancelTimeout",
    value: function cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }, {
    key: "startTimeout",
    value: function startTimeout() {
      var _this = this;

      if (this.timeoutTimer) {
        return;
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);

      this.channel.on(this.refEvent, function (payload) {
        _this.cancelRefEvent();
        _this.cancelTimeout();
        _this.receivedResp = payload;
        _this.matchReceive(payload);
      });

      this.timeoutTimer = setTimeout(function () {
        _this.trigger("timeout", {});
      }, this.timeout);
    }
  }, {
    key: "hasReceived",
    value: function hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
  }, {
    key: "trigger",
    value: function trigger(status, response) {
      this.channel.trigger(this.refEvent, { status: status, response: response });
    }
  }]);

  return Push;
}();

var Channel = exports.Channel = function () {
  function Channel(topic, params, socket) {
    var _this2 = this;

    _classCallCheck(this, Channel);

    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = params || {};
    this.socket = socket;
    this.bindings = [];
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.rejoinTimer = new Timer(function () {
      return _this2.rejoinUntilConnected();
    }, this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", function () {
      _this2.state = CHANNEL_STATES.joined;
      _this2.rejoinTimer.reset();
      _this2.pushBuffer.forEach(function (pushEvent) {
        return pushEvent.send();
      });
      _this2.pushBuffer = [];
    });
    this.onClose(function () {
      _this2.rejoinTimer.reset();
      _this2.socket.log("channel", "close " + _this2.topic + " " + _this2.joinRef());
      _this2.state = CHANNEL_STATES.closed;
      _this2.socket.remove(_this2);
    });
    this.onError(function (reason) {
      if (_this2.isLeaving() || _this2.isClosed()) {
        return;
      }
      _this2.socket.log("channel", "error " + _this2.topic, reason);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", function () {
      if (!_this2.isJoining()) {
        return;
      }
      _this2.socket.log("channel", "timeout " + _this2.topic, _this2.joinPush.timeout);
      _this2.state = CHANNEL_STATES.errored;
      _this2.rejoinTimer.scheduleTimeout();
    });
    this.on(CHANNEL_EVENTS.reply, function (payload, ref) {
      _this2.trigger(_this2.replyEventName(ref), payload);
    });
  }

  _createClass(Channel, [{
    key: "rejoinUntilConnected",
    value: function rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout();
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }
  }, {
    key: "join",
    value: function join() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];

      if (this.joinedOnce) {
        throw "tried to join multiple times. 'join' can only be called a single time per channel instance";
      } else {
        this.joinedOnce = true;
        this.rejoin(timeout);
        return this.joinPush;
      }
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.on(CHANNEL_EVENTS.error, function (reason) {
        return callback(reason);
      });
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      this.bindings.push({ event: event, callback: callback });
    }
  }, {
    key: "off",
    value: function off(event) {
      this.bindings = this.bindings.filter(function (bind) {
        return bind.event !== event;
      });
    }
  }, {
    key: "canPush",
    value: function canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
  }, {
    key: "push",
    value: function push(event, payload) {
      var timeout = arguments.length <= 2 || arguments[2] === undefined ? this.timeout : arguments[2];

      if (!this.joinedOnce) {
        throw "tried to push '" + event + "' to '" + this.topic + "' before joining. Use channel.join() before pushing events";
      }
      var pushEvent = new Push(this, event, payload, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }

      return pushEvent;
    }

    // Leaves the channel
    //
    // Unsubscribes from server events, and
    // instructs channel to terminate on server
    //
    // Triggers onClose() hooks
    //
    // To receive leave acknowledgements, use the a `receive`
    // hook to bind to the server ack, ie:
    //
    //     channel.leave().receive("ok", () => alert("left!") )
    //

  }, {
    key: "leave",
    value: function leave() {
      var _this3 = this;

      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];

      this.state = CHANNEL_STATES.leaving;
      var onClose = function onClose() {
        _this3.socket.log("channel", "leave " + _this3.topic);
        _this3.trigger(CHANNEL_EVENTS.close, "leave", _this3.joinRef());
      };
      var leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", function () {
        return onClose();
      }).receive("timeout", function () {
        return onClose();
      });
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }

      return leavePush;
    }

    // Overridable message hook
    //
    // Receives all events for specialized message handling
    // before dispatching to the channel callbacks.
    //
    // Must return the payload, modified or unmodified

  }, {
    key: "onMessage",
    value: function onMessage(event, payload, ref) {
      return payload;
    }

    // private

  }, {
    key: "isMember",
    value: function isMember(topic) {
      return this.topic === topic;
    }
  }, {
    key: "joinRef",
    value: function joinRef() {
      return this.joinPush.ref;
    }
  }, {
    key: "sendJoin",
    value: function sendJoin(timeout) {
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
  }, {
    key: "rejoin",
    value: function rejoin() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? this.timeout : arguments[0];
      if (this.isLeaving()) {
        return;
      }
      this.sendJoin(timeout);
    }
  }, {
    key: "trigger",
    value: function trigger(event, payload, ref) {
      var close = CHANNEL_EVENTS.close;
      var error = CHANNEL_EVENTS.error;
      var leave = CHANNEL_EVENTS.leave;
      var join = CHANNEL_EVENTS.join;

      if (ref && [close, error, leave, join].indexOf(event) >= 0 && ref !== this.joinRef()) {
        return;
      }
      var handledPayload = this.onMessage(event, payload, ref);
      if (payload && !handledPayload) {
        throw "channel onMessage callbacks must return the payload, modified or unmodified";
      }

      this.bindings.filter(function (bind) {
        return bind.event === event;
      }).map(function (bind) {
        return bind.callback(handledPayload, ref);
      });
    }
  }, {
    key: "replyEventName",
    value: function replyEventName(ref) {
      return "chan_reply_" + ref;
    }
  }, {
    key: "isClosed",
    value: function isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
  }, {
    key: "isErrored",
    value: function isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
  }, {
    key: "isJoined",
    value: function isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
  }, {
    key: "isJoining",
    value: function isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
  }, {
    key: "isLeaving",
    value: function isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  }]);

  return Channel;
}();

var Socket = exports.Socket = function () {

  // Initializes the Socket
  //
  // endPoint - The string WebSocket endpoint, ie, "ws://example.com/ws",
  //                                               "wss://example.com"
  //                                               "/ws" (inherited host & protocol)
  // opts - Optional configuration
  //   transport - The Websocket Transport, for example WebSocket or Phoenix.LongPoll.
  //               Defaults to WebSocket with automatic LongPoll fallback.
  //   timeout - The default timeout in milliseconds to trigger push timeouts.
  //             Defaults `DEFAULT_TIMEOUT`
  //   heartbeatIntervalMs - The millisec interval to send a heartbeat message
  //   reconnectAfterMs - The optional function that returns the millsec
  //                      reconnect interval. Defaults to stepped backoff of:
  //
  //     function(tries){
  //       return [1000, 5000, 10000][tries - 1] || 10000
  //     }
  //
  //   logger - The optional function for specialized logging, ie:
  //     `logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
  //
  //   longpollerTimeout - The maximum timeout of a long poll AJAX request.
  //                        Defaults to 20s (double the server long poll timer).
  //
  //   params - The optional params to pass when connecting
  //
  // For IE8 support use an ES5-shim (https://github.com/es-shims/es5-shim)
  //

  function Socket(endPoint) {
    var _this4 = this;

    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Socket);

    this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || window.WebSocket || LongPoll;
    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 30000;
    this.reconnectAfterMs = opts.reconnectAfterMs || function (tries) {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.logger = opts.logger || function () {}; // noop
    this.longpollerTimeout = opts.longpollerTimeout || 20000;
    this.params = opts.params || {};
    this.endPoint = endPoint + "/" + TRANSPORTS.websocket;
    this.reconnectTimer = new Timer(function () {
      _this4.disconnect(function () {
        return _this4.connect();
      });
    }, this.reconnectAfterMs);
  }

  _createClass(Socket, [{
    key: "protocol",
    value: function protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
  }, {
    key: "endPointURL",
    value: function endPointURL() {
      var uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params), { vsn: VSN });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return this.protocol() + ":" + uri;
      }

      return this.protocol() + "://" + location.host + uri;
    }
  }, {
    key: "disconnect",
    value: function disconnect(callback, code, reason) {
      if (this.conn) {
        this.conn.onclose = function () {}; // noop
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
        this.conn = null;
      }
      callback && callback();
    }

    // params - The params to send when connecting, for example `{user_id: userToken}`

  }, {
    key: "connect",
    value: function connect(params) {
      var _this5 = this;

      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = params;
      }
      if (this.conn) {
        return;
      }

      this.conn = new this.transport(this.endPointURL());
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = function () {
        return _this5.onConnOpen();
      };
      this.conn.onerror = function (error) {
        return _this5.onConnError(error);
      };
      this.conn.onmessage = function (event) {
        return _this5.onConnMessage(event);
      };
      this.conn.onclose = function (event) {
        return _this5.onConnClose(event);
      };
    }

    // Logs the message. Override `this.logger` for specialized logging. noops by default

  }, {
    key: "log",
    value: function log(kind, msg, data) {
      this.logger(kind, msg, data);
    }

    // Registers callbacks for connection state change events
    //
    // Examples
    //
    //    socket.onError(function(error){ alert("An error occurred") })
    //

  }, {
    key: "onOpen",
    value: function onOpen(callback) {
      this.stateChangeCallbacks.open.push(callback);
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      this.stateChangeCallbacks.close.push(callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this.stateChangeCallbacks.error.push(callback);
    }
  }, {
    key: "onMessage",
    value: function onMessage(callback) {
      this.stateChangeCallbacks.message.push(callback);
    }
  }, {
    key: "onConnOpen",
    value: function onConnOpen() {
      var _this6 = this;

      this.log("transport", "connected to " + this.endPointURL(), this.transport.prototype);
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      if (!this.conn.skipHeartbeat) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(function () {
          return _this6.sendHeartbeat();
        }, this.heartbeatIntervalMs);
      }
      this.stateChangeCallbacks.open.forEach(function (callback) {
        return callback();
      });
    }
  }, {
    key: "onConnClose",
    value: function onConnClose(event) {
      this.log("transport", "close", event);
      this.triggerChanError();
      clearInterval(this.heartbeatTimer);
      this.reconnectTimer.scheduleTimeout();
      this.stateChangeCallbacks.close.forEach(function (callback) {
        return callback(event);
      });
    }
  }, {
    key: "onConnError",
    value: function onConnError(error) {
      this.log("transport", error);
      this.triggerChanError();
      this.stateChangeCallbacks.error.forEach(function (callback) {
        return callback(error);
      });
    }
  }, {
    key: "triggerChanError",
    value: function triggerChanError() {
      this.channels.forEach(function (channel) {
        return channel.trigger(CHANNEL_EVENTS.error);
      });
    }
  }, {
    key: "connectionState",
    value: function connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.connectionState() === "open";
    }
  }, {
    key: "remove",
    value: function remove(channel) {
      this.channels = this.channels.filter(function (c) {
        return c.joinRef() !== channel.joinRef();
      });
    }
  }, {
    key: "channel",
    value: function channel(topic) {
      var chanParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
  }, {
    key: "push",
    value: function push(data) {
      var _this7 = this;

      var topic = data.topic;
      var event = data.event;
      var payload = data.payload;
      var ref = data.ref;

      var callback = function callback() {
        return _this7.conn.send(JSON.stringify(data));
      };
      this.log("push", topic + " " + event + " (" + ref + ")", payload);
      if (this.isConnected()) {
        callback();
      } else {
        this.sendBuffer.push(callback);
      }
    }

    // Return the next message ref, accounting for overflows

  }, {
    key: "makeRef",
    value: function makeRef() {
      var newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }

      return this.ref.toString();
    }
  }, {
    key: "sendHeartbeat",
    value: function sendHeartbeat() {
      if (!this.isConnected()) {
        return;
      }
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.makeRef() });
    }
  }, {
    key: "flushSendBuffer",
    value: function flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach(function (callback) {
          return callback();
        });
        this.sendBuffer = [];
      }
    }
  }, {
    key: "onConnMessage",
    value: function onConnMessage(rawMessage) {
      var msg = JSON.parse(rawMessage.data);
      var topic = msg.topic;
      var event = msg.event;
      var payload = msg.payload;
      var ref = msg.ref;

      this.log("receive", (payload.status || "") + " " + topic + " " + event + " " + (ref && "(" + ref + ")" || ""), payload);
      this.channels.filter(function (channel) {
        return channel.isMember(topic);
      }).forEach(function (channel) {
        return channel.trigger(event, payload, ref);
      });
      this.stateChangeCallbacks.message.forEach(function (callback) {
        return callback(msg);
      });
    }
  }]);

  return Socket;
}();

var LongPoll = exports.LongPoll = function () {
  function LongPoll(endPoint) {
    _classCallCheck(this, LongPoll);

    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;
    this.onopen = function () {}; // noop
    this.onerror = function () {}; // noop
    this.onmessage = function () {}; // noop
    this.onclose = function () {}; // noop
    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;

    this.poll();
  }

  _createClass(LongPoll, [{
    key: "normalizeEndpoint",
    value: function normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)\/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
  }, {
    key: "endpointURL",
    value: function endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
  }, {
    key: "closeAndRetry",
    value: function closeAndRetry() {
      this.close();
      this.readyState = SOCKET_STATES.connecting;
    }
  }, {
    key: "ontimeout",
    value: function ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry();
    }
  }, {
    key: "poll",
    value: function poll() {
      var _this8 = this;

      if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
        return;
      }

      Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (resp) {
        if (resp) {
          var status = resp.status;
          var token = resp.token;
          var messages = resp.messages;

          _this8.token = token;
        } else {
          var status = 0;
        }

        switch (status) {
          case 200:
            messages.forEach(function (msg) {
              return _this8.onmessage({ data: JSON.stringify(msg) });
            });
            _this8.poll();
            break;
          case 204:
            _this8.poll();
            break;
          case 410:
            _this8.readyState = SOCKET_STATES.open;
            _this8.onopen();
            _this8.poll();
            break;
          case 0:
          case 500:
            _this8.onerror();
            _this8.closeAndRetry();
            break;
          default:
            throw "unhandled poll status " + status;
        }
      });
    }
  }, {
    key: "send",
    value: function send(body) {
      var _this9 = this;

      Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), function (resp) {
        if (!resp || resp.status !== 200) {
          _this9.onerror(status);
          _this9.closeAndRetry();
        }
      });
    }
  }, {
    key: "close",
    value: function close(code, reason) {
      this.readyState = SOCKET_STATES.closed;
      this.onclose();
    }
  }]);

  return LongPoll;
}();

var Ajax = exports.Ajax = function () {
  function Ajax() {
    _classCallCheck(this, Ajax);
  }

  _createClass(Ajax, null, [{
    key: "request",
    value: function request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (window.XDomainRequest) {
        var req = new XDomainRequest(); // IE8, IE9
        this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        var req = window.XMLHttpRequest ? new XMLHttpRequest() : // IE7+, Firefox, Chrome, Opera, Safari
        new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
        this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
  }, {
    key: "xdomainRequest",
    value: function xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      var _this10 = this;

      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = function () {
        var response = _this10.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      // Work around bug in IE9 that requires an attached onprogress handler
      req.onprogress = function () {};

      req.send(body);
    }
  }, {
    key: "xhrRequest",
    value: function xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      var _this11 = this;

      req.timeout = timeout;
      req.open(method, endPoint, true);
      req.setRequestHeader("Content-Type", accept);
      req.onerror = function () {
        callback && callback(null);
      };
      req.onreadystatechange = function () {
        if (req.readyState === _this11.states.complete && callback) {
          var response = _this11.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }

      req.send(body);
    }
  }, {
    key: "parseJSON",
    value: function parseJSON(resp) {
      return resp && resp !== "" ? JSON.parse(resp) : null;
    }
  }, {
    key: "serialize",
    value: function serialize(obj, parentKey) {
      var queryStr = [];
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        var paramKey = parentKey ? parentKey + "[" + key + "]" : key;
        var paramVal = obj[key];
        if ((typeof paramVal === "undefined" ? "undefined" : _typeof(paramVal)) === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
  }, {
    key: "appendParams",
    value: function appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }

      var prefix = url.match(/\?/) ? "&" : "?";
      return "" + url + prefix + this.serialize(params);
    }
  }]);

  return Ajax;
}();

Ajax.states = { complete: 4 };

var Presence = exports.Presence = {
  syncState: function syncState(currentState, newState, onJoin, onLeave) {
    var _this12 = this;

    var state = this.clone(currentState);
    var joins = {};
    var leaves = {};

    this.map(state, function (key, presence) {
      if (!newState[key]) {
        leaves[key] = presence;
      }
    });
    this.map(newState, function (key, newPresence) {
      var currentPresence = state[key];
      if (currentPresence) {
        (function () {
          var newRefs = newPresence.metas.map(function (m) {
            return m.phx_ref;
          });
          var curRefs = currentPresence.metas.map(function (m) {
            return m.phx_ref;
          });
          var joinedMetas = newPresence.metas.filter(function (m) {
            return curRefs.indexOf(m.phx_ref) < 0;
          });
          var leftMetas = currentPresence.metas.filter(function (m) {
            return newRefs.indexOf(m.phx_ref) < 0;
          });
          if (joinedMetas.length > 0) {
            joins[key] = newPresence;
            joins[key].metas = joinedMetas;
          }
          if (leftMetas.length > 0) {
            leaves[key] = _this12.clone(currentPresence);
            leaves[key].metas = leftMetas;
          }
        })();
      } else {
        joins[key] = newPresence;
      }
    });
    return this.syncDiff(state, { joins: joins, leaves: leaves }, onJoin, onLeave);
  },
  syncDiff: function syncDiff(currentState, _ref2, onJoin, onLeave) {
    var joins = _ref2.joins;
    var leaves = _ref2.leaves;

    var state = this.clone(currentState);
    if (!onJoin) {
      onJoin = function onJoin() {};
    }
    if (!onLeave) {
      onLeave = function onLeave() {};
    }

    this.map(joins, function (key, newPresence) {
      var currentPresence = state[key];
      state[key] = newPresence;
      if (currentPresence) {
        var _state$key$metas;

        (_state$key$metas = state[key].metas).unshift.apply(_state$key$metas, _toConsumableArray(currentPresence.metas));
      }
      onJoin(key, currentPresence, newPresence);
    });
    this.map(leaves, function (key, leftPresence) {
      var currentPresence = state[key];
      if (!currentPresence) {
        return;
      }
      var refsToRemove = leftPresence.metas.map(function (m) {
        return m.phx_ref;
      });
      currentPresence.metas = currentPresence.metas.filter(function (p) {
        return refsToRemove.indexOf(p.phx_ref) < 0;
      });
      onLeave(key, currentPresence, leftPresence);
      if (currentPresence.metas.length === 0) {
        delete state[key];
      }
    });
    return state;
  },
  list: function list(presences, chooser) {
    if (!chooser) {
      chooser = function chooser(key, pres) {
        return pres;
      };
    }

    return this.map(presences, function (key, presence) {
      return chooser(key, presence);
    });
  },

  // private

  map: function map(obj, func) {
    return Object.getOwnPropertyNames(obj).map(function (key) {
      return func(key, obj[key]);
    });
  },
  clone: function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

// Creates a timer that accepts a `timerCalc` function to perform
// calculated timeout retries, such as exponential backoff.
//
// ## Examples
//
//    let reconnectTimer = new Timer(() => this.connect(), function(tries){
//      return [1000, 5000, 10000][tries - 1] || 10000
//    })
//    reconnectTimer.scheduleTimeout() // fires after 1000
//    reconnectTimer.scheduleTimeout() // fires after 5000
//    reconnectTimer.reset()
//    reconnectTimer.scheduleTimeout() // fires after 1000
//

var Timer = function () {
  function Timer(callback, timerCalc) {
    _classCallCheck(this, Timer);

    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }

  _createClass(Timer, [{
    key: "reset",
    value: function reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }

    // Cancels any previous scheduleTimeout and schedules callback

  }, {
    key: "scheduleTimeout",
    value: function scheduleTimeout() {
      var _this13 = this;

      clearTimeout(this.timer);

      this.timer = setTimeout(function () {
        _this13.tries = _this13.tries + 1;
        _this13.callback();
      }, this.timerCalc(this.tries + 1));
    }
  }]);

  return Timer;
}();

})(typeof(exports) === "undefined" ? window.Phoenix = window.Phoenix || {} : exports);
  })();
});

require.register("phoenix_html/priv/static/phoenix_html.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "phoenix_html");
  (function() {
    'use strict';

function isLinkToSubmitParent(element) {
  var isLinkTag = element.tagName === 'A';
  var shouldSubmitParent = element.getAttribute('data-submit') === 'parent';

  return isLinkTag && shouldSubmitParent;
}

function getClosestForm(element) {
  while (element && element !== document && element.nodeType === Node.ELEMENT_NODE) {
    if (element.tagName === 'FORM') {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}

function didHandleSubmitLinkClick(element) {
  while (element && element.getAttribute) {
    if (isLinkToSubmitParent(element)) {
      var message = element.getAttribute('data-confirm');
      if (message === null || confirm(message)) {
        getClosestForm(element).submit();
      }
      return true;
    } else {
      element = element.parentNode;
    }
  }
  return false;
}

window.addEventListener('click', function (event) {
  if (event.target && didHandleSubmitLinkClick(event.target)) {
    event.preventDefault();
    return false;
  }
}, false);
  })();
});

require.register("process/browser.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "process");
  (function() {
    // shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };
  })();
});
require.register("web/elm/Logic/Audio.elm", function(exports, require, module) {

});

;require.register("web/elm/Logic/Routing.elm", function(exports, require, module) {

});

;require.register("web/elm/Logic/Types.elm", function(exports, require, module) {

});

;require.register("web/elm/Main.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/ChordStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/FingerPickStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/HomeStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/MainStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/ModalStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/ScalesStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Styles/StrumStyles.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/Chords.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/FingerPick.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/Fretboard.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/Home.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/MainViews.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/Modal.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/Scales.elm", function(exports, require, module) {

});

;require.register("web/elm/Views/Strum.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/NoRedInk/elm-decode-pipeline/3.0.0/examples/Example.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/NoRedInk/elm-decode-pipeline/3.0.0/src/Json/Decode/Pipeline.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/NoRedInk/elm-decode-pipeline/3.0.0/tests/Main.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/NoRedInk/elm-decode-pipeline/3.0.0/tests/Tests.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/ccapndave/elm-update-extra/2.3.1/src/Update/Extra.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/ccapndave/elm-update-extra/2.3.1/src/Update/Extra/Infix.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/ccapndave/elm-update-extra/2.3.1/test/Counter/Main.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-community/list-extra/6.1.0/src/List/Extra.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-community/list-extra/6.1.0/tests/Main.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-community/list-extra/6.1.0/tests/Tests.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Array.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Basics.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Bitwise.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Char.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Color.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Date.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Debug.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Dict.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Json/Decode.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Json/Encode.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/List.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Maybe.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Array.js", function(exports, require, module) {
'use strict';

//import Native.List //

var _elm_lang$core$Native_Array = function () {

	// A RRB-Tree has two distinct data types.
	// Leaf -> "height"  is always 0
	//         "table"   is an array of elements
	// Node -> "height"  is always greater than 0
	//         "table"   is an array of child nodes
	//         "lengths" is an array of accumulated lengths of the child nodes

	// M is the maximal table size. 32 seems fast. E is the allowed increase
	// of search steps when concatting to find an index. Lower values will
	// decrease balancing, but will increase search steps.
	var M = 32;
	var E = 2;

	// An empty array.
	var empty = {
		ctor: '_Array',
		height: 0,
		table: []
	};

	function get(i, array) {
		if (i < 0 || i >= length(array)) {
			throw new Error('Index ' + i + ' is out of range. Check the length of ' + 'your array first or use getMaybe or getWithDefault.');
		}
		return unsafeGet(i, array);
	}

	function unsafeGet(i, array) {
		for (var x = array.height; x > 0; x--) {
			var slot = i >> x * 5;
			while (array.lengths[slot] <= i) {
				slot++;
			}
			if (slot > 0) {
				i -= array.lengths[slot - 1];
			}
			array = array.table[slot];
		}
		return array.table[i];
	}

	// Sets the value at the index i. Only the nodes leading to i will get
	// copied and updated.
	function set(i, item, array) {
		if (i < 0 || length(array) <= i) {
			return array;
		}
		return unsafeSet(i, item, array);
	}

	function unsafeSet(i, item, array) {
		array = nodeCopy(array);

		if (array.height === 0) {
			array.table[i] = item;
		} else {
			var slot = getSlot(i, array);
			if (slot > 0) {
				i -= array.lengths[slot - 1];
			}
			array.table[slot] = unsafeSet(i, item, array.table[slot]);
		}
		return array;
	}

	function initialize(len, f) {
		if (len <= 0) {
			return empty;
		}
		var h = Math.floor(Math.log(len) / Math.log(M));
		return initialize_(f, h, 0, len);
	}

	function initialize_(f, h, from, to) {
		if (h === 0) {
			var table = new Array((to - from) % (M + 1));
			for (var i = 0; i < table.length; i++) {
				table[i] = f(from + i);
			}
			return {
				ctor: '_Array',
				height: 0,
				table: table
			};
		}

		var step = Math.pow(M, h);
		var table = new Array(Math.ceil((to - from) / step));
		var lengths = new Array(table.length);
		for (var i = 0; i < table.length; i++) {
			table[i] = initialize_(f, h - 1, from + i * step, Math.min(from + (i + 1) * step, to));
			lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
		}
		return {
			ctor: '_Array',
			height: h,
			table: table,
			lengths: lengths
		};
	}

	function fromList(list) {
		if (list.ctor === '[]') {
			return empty;
		}

		// Allocate M sized blocks (table) and write list elements to it.
		var table = new Array(M);
		var nodes = [];
		var i = 0;

		while (list.ctor !== '[]') {
			table[i] = list._0;
			list = list._1;
			i++;

			// table is full, so we can push a leaf containing it into the
			// next node.
			if (i === M) {
				var leaf = {
					ctor: '_Array',
					height: 0,
					table: table
				};
				fromListPush(leaf, nodes);
				table = new Array(M);
				i = 0;
			}
		}

		// Maybe there is something left on the table.
		if (i > 0) {
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table.splice(0, i)
			};
			fromListPush(leaf, nodes);
		}

		// Go through all of the nodes and eventually push them into higher nodes.
		for (var h = 0; h < nodes.length - 1; h++) {
			if (nodes[h].table.length > 0) {
				fromListPush(nodes[h], nodes);
			}
		}

		var head = nodes[nodes.length - 1];
		if (head.height > 0 && head.table.length === 1) {
			return head.table[0];
		} else {
			return head;
		}
	}

	// Push a node into a higher node as a child.
	function fromListPush(toPush, nodes) {
		var h = toPush.height;

		// Maybe the node on this height does not exist.
		if (nodes.length === h) {
			var node = {
				ctor: '_Array',
				height: h + 1,
				table: [],
				lengths: []
			};
			nodes.push(node);
		}

		nodes[h].table.push(toPush);
		var len = length(toPush);
		if (nodes[h].lengths.length > 0) {
			len += nodes[h].lengths[nodes[h].lengths.length - 1];
		}
		nodes[h].lengths.push(len);

		if (nodes[h].table.length === M) {
			fromListPush(nodes[h], nodes);
			nodes[h] = {
				ctor: '_Array',
				height: h + 1,
				table: [],
				lengths: []
			};
		}
	}

	// Pushes an item via push_ to the bottom right of a tree.
	function push(item, a) {
		var pushed = push_(item, a);
		if (pushed !== null) {
			return pushed;
		}

		var newTree = create(item, a.height);
		return siblise(a, newTree);
	}

	// Recursively tries to push an item to the bottom-right most
	// tree possible. If there is no space left for the item,
	// null will be returned.
	function push_(item, a) {
		// Handle resursion stop at leaf level.
		if (a.height === 0) {
			if (a.table.length < M) {
				var newA = {
					ctor: '_Array',
					height: 0,
					table: a.table.slice()
				};
				newA.table.push(item);
				return newA;
			} else {
				return null;
			}
		}

		// Recursively push
		var pushed = push_(item, botRight(a));

		// There was space in the bottom right tree, so the slot will
		// be updated.
		if (pushed !== null) {
			var newA = nodeCopy(a);
			newA.table[newA.table.length - 1] = pushed;
			newA.lengths[newA.lengths.length - 1]++;
			return newA;
		}

		// When there was no space left, check if there is space left
		// for a new slot with a tree which contains only the item
		// at the bottom.
		if (a.table.length < M) {
			var newSlot = create(item, a.height - 1);
			var newA = nodeCopy(a);
			newA.table.push(newSlot);
			newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
			return newA;
		} else {
			return null;
		}
	}

	// Converts an array into a list of elements.
	function toList(a) {
		return toList_(_elm_lang$core$Native_List.Nil, a);
	}

	function toList_(list, a) {
		for (var i = a.table.length - 1; i >= 0; i--) {
			list = a.height === 0 ? _elm_lang$core$Native_List.Cons(a.table[i], list) : toList_(list, a.table[i]);
		}
		return list;
	}

	// Maps a function over the elements of an array.
	function map(f, a) {
		var newA = {
			ctor: '_Array',
			height: a.height,
			table: new Array(a.table.length)
		};
		if (a.height > 0) {
			newA.lengths = a.lengths;
		}
		for (var i = 0; i < a.table.length; i++) {
			newA.table[i] = a.height === 0 ? f(a.table[i]) : map(f, a.table[i]);
		}
		return newA;
	}

	// Maps a function over the elements with their index as first argument.
	function indexedMap(f, a) {
		return indexedMap_(f, a, 0);
	}

	function indexedMap_(f, a, from) {
		var newA = {
			ctor: '_Array',
			height: a.height,
			table: new Array(a.table.length)
		};
		if (a.height > 0) {
			newA.lengths = a.lengths;
		}
		for (var i = 0; i < a.table.length; i++) {
			newA.table[i] = a.height === 0 ? A2(f, from + i, a.table[i]) : indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
		}
		return newA;
	}

	function foldl(f, b, a) {
		if (a.height === 0) {
			for (var i = 0; i < a.table.length; i++) {
				b = A2(f, a.table[i], b);
			}
		} else {
			for (var i = 0; i < a.table.length; i++) {
				b = foldl(f, b, a.table[i]);
			}
		}
		return b;
	}

	function foldr(f, b, a) {
		if (a.height === 0) {
			for (var i = a.table.length; i--;) {
				b = A2(f, a.table[i], b);
			}
		} else {
			for (var i = a.table.length; i--;) {
				b = foldr(f, b, a.table[i]);
			}
		}
		return b;
	}

	// TODO: currently, it slices the right, then the left. This can be
	// optimized.
	function slice(from, to, a) {
		if (from < 0) {
			from += length(a);
		}
		if (to < 0) {
			to += length(a);
		}
		return sliceLeft(from, sliceRight(to, a));
	}

	function sliceRight(to, a) {
		if (to === length(a)) {
			return a;
		}

		// Handle leaf level.
		if (a.height === 0) {
			var newA = { ctor: '_Array', height: 0 };
			newA.table = a.table.slice(0, to);
			return newA;
		}

		// Slice the right recursively.
		var right = getSlot(to, a);
		var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

		// Maybe the a node is not even needed, as sliced contains the whole slice.
		if (right === 0) {
			return sliced;
		}

		// Create new node.
		var newA = {
			ctor: '_Array',
			height: a.height,
			table: a.table.slice(0, right),
			lengths: a.lengths.slice(0, right)
		};
		if (sliced.table.length > 0) {
			newA.table[right] = sliced;
			newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
		}
		return newA;
	}

	function sliceLeft(from, a) {
		if (from === 0) {
			return a;
		}

		// Handle leaf level.
		if (a.height === 0) {
			var newA = { ctor: '_Array', height: 0 };
			newA.table = a.table.slice(from, a.table.length + 1);
			return newA;
		}

		// Slice the left recursively.
		var left = getSlot(from, a);
		var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

		// Maybe the a node is not even needed, as sliced contains the whole slice.
		if (left === a.table.length - 1) {
			return sliced;
		}

		// Create new node.
		var newA = {
			ctor: '_Array',
			height: a.height,
			table: a.table.slice(left, a.table.length + 1),
			lengths: new Array(a.table.length - left)
		};
		newA.table[0] = sliced;
		var len = 0;
		for (var i = 0; i < newA.table.length; i++) {
			len += length(newA.table[i]);
			newA.lengths[i] = len;
		}

		return newA;
	}

	// Appends two trees.
	function append(a, b) {
		if (a.table.length === 0) {
			return b;
		}
		if (b.table.length === 0) {
			return a;
		}

		var c = append_(a, b);

		// Check if both nodes can be crunshed together.
		if (c[0].table.length + c[1].table.length <= M) {
			if (c[0].table.length === 0) {
				return c[1];
			}
			if (c[1].table.length === 0) {
				return c[0];
			}

			// Adjust .table and .lengths
			c[0].table = c[0].table.concat(c[1].table);
			if (c[0].height > 0) {
				var len = length(c[0]);
				for (var i = 0; i < c[1].lengths.length; i++) {
					c[1].lengths[i] += len;
				}
				c[0].lengths = c[0].lengths.concat(c[1].lengths);
			}

			return c[0];
		}

		if (c[0].height > 0) {
			var toRemove = calcToRemove(a, b);
			if (toRemove > E) {
				c = shuffle(c[0], c[1], toRemove);
			}
		}

		return siblise(c[0], c[1]);
	}

	// Returns an array of two nodes; right and left. One node _may_ be empty.
	function append_(a, b) {
		if (a.height === 0 && b.height === 0) {
			return [a, b];
		}

		if (a.height !== 1 || b.height !== 1) {
			if (a.height === b.height) {
				a = nodeCopy(a);
				b = nodeCopy(b);
				var appended = append_(botRight(a), botLeft(b));

				insertRight(a, appended[1]);
				insertLeft(b, appended[0]);
			} else if (a.height > b.height) {
				a = nodeCopy(a);
				var appended = append_(botRight(a), b);

				insertRight(a, appended[0]);
				b = parentise(appended[1], appended[1].height + 1);
			} else {
				b = nodeCopy(b);
				var appended = append_(a, botLeft(b));

				var left = appended[0].table.length === 0 ? 0 : 1;
				var right = left === 0 ? 1 : 0;
				insertLeft(b, appended[left]);
				a = parentise(appended[right], appended[right].height + 1);
			}
		}

		// Check if balancing is needed and return based on that.
		if (a.table.length === 0 || b.table.length === 0) {
			return [a, b];
		}

		var toRemove = calcToRemove(a, b);
		if (toRemove <= E) {
			return [a, b];
		}
		return shuffle(a, b, toRemove);
	}

	// Helperfunctions for append_. Replaces a child node at the side of the parent.
	function insertRight(parent, node) {
		var index = parent.table.length - 1;
		parent.table[index] = node;
		parent.lengths[index] = length(node);
		parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
	}

	function insertLeft(parent, node) {
		if (node.table.length > 0) {
			parent.table[0] = node;
			parent.lengths[0] = length(node);

			var len = length(parent.table[0]);
			for (var i = 1; i < parent.lengths.length; i++) {
				len += length(parent.table[i]);
				parent.lengths[i] = len;
			}
		} else {
			parent.table.shift();
			for (var i = 1; i < parent.lengths.length; i++) {
				parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
			}
			parent.lengths.shift();
		}
	}

	// Returns the extra search steps for E. Refer to the paper.
	function calcToRemove(a, b) {
		var subLengths = 0;
		for (var i = 0; i < a.table.length; i++) {
			subLengths += a.table[i].table.length;
		}
		for (var i = 0; i < b.table.length; i++) {
			subLengths += b.table[i].table.length;
		}

		var toRemove = a.table.length + b.table.length;
		return toRemove - (Math.floor((subLengths - 1) / M) + 1);
	}

	// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
	function get2(a, b, index) {
		return index < a.length ? a[index] : b[index - a.length];
	}

	function set2(a, b, index, value) {
		if (index < a.length) {
			a[index] = value;
		} else {
			b[index - a.length] = value;
		}
	}

	function saveSlot(a, b, index, slot) {
		set2(a.table, b.table, index, slot);

		var l = index === 0 || index === a.lengths.length ? 0 : get2(a.lengths, a.lengths, index - 1);

		set2(a.lengths, b.lengths, index, l + length(slot));
	}

	// Creates a node or leaf with a given length at their arrays for perfomance.
	// Is only used by shuffle.
	function createNode(h, length) {
		if (length < 0) {
			length = 0;
		}
		var a = {
			ctor: '_Array',
			height: h,
			table: new Array(length)
		};
		if (h > 0) {
			a.lengths = new Array(length);
		}
		return a;
	}

	// Returns an array of two balanced nodes.
	function shuffle(a, b, toRemove) {
		var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
		var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

		// Skip the slots with size M. More precise: copy the slot references
		// to the new node
		var read = 0;
		while (get2(a.table, b.table, read).table.length % M === 0) {
			set2(newA.table, newB.table, read, get2(a.table, b.table, read));
			set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
			read++;
		}

		// Pulling items from left to right, caching in a slot before writing
		// it into the new nodes.
		var write = read;
		var slot = new createNode(a.height - 1, 0);
		var from = 0;

		// If the current slot is still containing data, then there will be at
		// least one more write, so we do not break this loop yet.
		while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove) {
			// Find out the max possible items for copying.
			var source = get2(a.table, b.table, read);
			var to = Math.min(M - slot.table.length, source.table.length);

			// Copy and adjust size table.
			slot.table = slot.table.concat(source.table.slice(from, to));
			if (slot.height > 0) {
				var len = slot.lengths.length;
				for (var i = len; i < len + to - from; i++) {
					slot.lengths[i] = length(slot.table[i]);
					slot.lengths[i] += i > 0 ? slot.lengths[i - 1] : 0;
				}
			}

			from += to;

			// Only proceed to next slots[i] if the current one was
			// fully copied.
			if (source.table.length <= to) {
				read++;from = 0;
			}

			// Only create a new slot if the current one is filled up.
			if (slot.table.length === M) {
				saveSlot(newA, newB, write, slot);
				slot = createNode(a.height - 1, 0);
				write++;
			}
		}

		// Cleanup after the loop. Copy the last slot into the new nodes.
		if (slot.table.length > 0) {
			saveSlot(newA, newB, write, slot);
			write++;
		}

		// Shift the untouched slots to the left
		while (read < a.table.length + b.table.length) {
			saveSlot(newA, newB, write, get2(a.table, b.table, read));
			read++;
			write++;
		}

		return [newA, newB];
	}

	// Navigation functions
	function botRight(a) {
		return a.table[a.table.length - 1];
	}
	function botLeft(a) {
		return a.table[0];
	}

	// Copies a node for updating. Note that you should not use this if
	// only updating only one of "table" or "lengths" for performance reasons.
	function nodeCopy(a) {
		var newA = {
			ctor: '_Array',
			height: a.height,
			table: a.table.slice()
		};
		if (a.height > 0) {
			newA.lengths = a.lengths.slice();
		}
		return newA;
	}

	// Returns how many items are in the tree.
	function length(array) {
		if (array.height === 0) {
			return array.table.length;
		} else {
			return array.lengths[array.lengths.length - 1];
		}
	}

	// Calculates in which slot of "table" the item probably is, then
	// find the exact slot via forward searching in  "lengths". Returns the index.
	function getSlot(i, a) {
		var slot = i >> 5 * a.height;
		while (a.lengths[slot] <= i) {
			slot++;
		}
		return slot;
	}

	// Recursively creates a tree with a given height containing
	// only the given item.
	function create(item, h) {
		if (h === 0) {
			return {
				ctor: '_Array',
				height: 0,
				table: [item]
			};
		}
		return {
			ctor: '_Array',
			height: h,
			table: [create(item, h - 1)],
			lengths: [1]
		};
	}

	// Recursively creates a tree that contains the given tree.
	function parentise(tree, h) {
		if (h === tree.height) {
			return tree;
		}

		return {
			ctor: '_Array',
			height: h,
			table: [parentise(tree, h - 1)],
			lengths: [length(tree)]
		};
	}

	// Emphasizes blood brotherhood beneath two trees.
	function siblise(a, b) {
		return {
			ctor: '_Array',
			height: a.height + 1,
			table: [a, b],
			lengths: [length(a), length(a) + length(b)]
		};
	}

	function toJSArray(a) {
		var jsArray = new Array(length(a));
		toJSArray_(jsArray, 0, a);
		return jsArray;
	}

	function toJSArray_(jsArray, i, a) {
		for (var t = 0; t < a.table.length; t++) {
			if (a.height === 0) {
				jsArray[i + t] = a.table[t];
			} else {
				var inc = t === 0 ? 0 : a.lengths[t - 1];
				toJSArray_(jsArray, i + inc, a.table[t]);
			}
		}
	}

	function fromJSArray(jsArray) {
		if (jsArray.length === 0) {
			return empty;
		}
		var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
		return fromJSArray_(jsArray, h, 0, jsArray.length);
	}

	function fromJSArray_(jsArray, h, from, to) {
		if (h === 0) {
			return {
				ctor: '_Array',
				height: 0,
				table: jsArray.slice(from, to)
			};
		}

		var step = Math.pow(M, h);
		var table = new Array(Math.ceil((to - from) / step));
		var lengths = new Array(table.length);
		for (var i = 0; i < table.length; i++) {
			table[i] = fromJSArray_(jsArray, h - 1, from + i * step, Math.min(from + (i + 1) * step, to));
			lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
		}
		return {
			ctor: '_Array',
			height: h,
			table: table,
			lengths: lengths
		};
	}

	return {
		empty: empty,
		fromList: fromList,
		toList: toList,
		initialize: F2(initialize),
		append: F2(append),
		push: F2(push),
		slice: F3(slice),
		get: F2(get),
		set: F3(set),
		map: F2(map),
		indexedMap: F2(indexedMap),
		foldl: F3(foldl),
		foldr: F3(foldr),
		length: length,

		toJSArray: toJSArray,
		fromJSArray: fromJSArray
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Basics.js", function(exports, require, module) {
'use strict';

//import Native.Utils //

var _elm_lang$core$Native_Basics = function () {

	function div(a, b) {
		return a / b | 0;
	}
	function rem(a, b) {
		return a % b;
	}
	function mod(a, b) {
		if (b === 0) {
			throw new Error('Cannot perform mod 0. Division by zero error.');
		}
		var r = a % b;
		var m = a === 0 ? 0 : b > 0 ? a >= 0 ? r : r + b : -mod(-a, -b);

		return m === b ? 0 : m;
	}
	function logBase(base, n) {
		return Math.log(n) / Math.log(base);
	}
	function negate(n) {
		return -n;
	}
	function abs(n) {
		return n < 0 ? -n : n;
	}

	function min(a, b) {
		return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
	}
	function max(a, b) {
		return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
	}
	function clamp(lo, hi, n) {
		return _elm_lang$core$Native_Utils.cmp(n, lo) < 0 ? lo : _elm_lang$core$Native_Utils.cmp(n, hi) > 0 ? hi : n;
	}

	var ord = ['LT', 'EQ', 'GT'];

	function compare(x, y) {
		return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
	}

	function xor(a, b) {
		return a !== b;
	}
	function not(b) {
		return !b;
	}
	function isInfinite(n) {
		return n === Infinity || n === -Infinity;
	}

	function truncate(n) {
		return n | 0;
	}

	function degrees(d) {
		return d * Math.PI / 180;
	}
	function turns(t) {
		return 2 * Math.PI * t;
	}
	function fromPolar(point) {
		var r = point._0;
		var t = point._1;
		return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
	}
	function toPolar(point) {
		var x = point._0;
		var y = point._1;
		return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
	}

	return {
		div: F2(div),
		rem: F2(rem),
		mod: F2(mod),

		pi: Math.PI,
		e: Math.E,
		cos: Math.cos,
		sin: Math.sin,
		tan: Math.tan,
		acos: Math.acos,
		asin: Math.asin,
		atan: Math.atan,
		atan2: F2(Math.atan2),

		degrees: degrees,
		turns: turns,
		fromPolar: fromPolar,
		toPolar: toPolar,

		sqrt: Math.sqrt,
		logBase: F2(logBase),
		negate: negate,
		abs: abs,
		min: F2(min),
		max: F2(max),
		clamp: F3(clamp),
		compare: F2(compare),

		xor: F2(xor),
		not: not,

		truncate: truncate,
		ceiling: Math.ceil,
		floor: Math.floor,
		round: Math.round,
		toFloat: function toFloat(x) {
			return x;
		},
		isNaN: isNaN,
		isInfinite: isInfinite
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Bitwise.js", function(exports, require, module) {
"use strict";

var _elm_lang$core$Native_Bitwise = function () {

	return {
		and: F2(function and(a, b) {
			return a & b;
		}),
		or: F2(function or(a, b) {
			return a | b;
		}),
		xor: F2(function xor(a, b) {
			return a ^ b;
		}),
		complement: function complement(a) {
			return ~a;
		},
		shiftLeftBy: F2(function (offset, a) {
			return a << offset;
		}),
		shiftRightBy: F2(function (offset, a) {
			return a >> offset;
		}),
		shiftRightZfBy: F2(function (offset, a) {
			return a >>> offset;
		})
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Char.js", function(exports, require, module) {
"use strict";

//import Native.Utils //

var _elm_lang$core$Native_Char = function () {

	return {
		fromCode: function fromCode(c) {
			return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c));
		},
		toCode: function toCode(c) {
			return c.charCodeAt(0);
		},
		toUpper: function toUpper(c) {
			return _elm_lang$core$Native_Utils.chr(c.toUpperCase());
		},
		toLower: function toLower(c) {
			return _elm_lang$core$Native_Utils.chr(c.toLowerCase());
		},
		toLocaleUpper: function toLocaleUpper(c) {
			return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase());
		},
		toLocaleLower: function toLocaleLower(c) {
			return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase());
		}
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Date.js", function(exports, require, module) {
'use strict';

//import Result //

var _elm_lang$core$Native_Date = function () {

	function fromString(str) {
		var date = new Date(str);
		return isNaN(date.getTime()) ? _elm_lang$core$Result$Err('Unable to parse \'' + str + '\' as a date. Dates must be in the ISO 8601 format.') : _elm_lang$core$Result$Ok(date);
	}

	var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var monthTable = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return {
		fromString: fromString,
		year: function year(d) {
			return d.getFullYear();
		},
		month: function month(d) {
			return { ctor: monthTable[d.getMonth()] };
		},
		day: function day(d) {
			return d.getDate();
		},
		hour: function hour(d) {
			return d.getHours();
		},
		minute: function minute(d) {
			return d.getMinutes();
		},
		second: function second(d) {
			return d.getSeconds();
		},
		millisecond: function millisecond(d) {
			return d.getMilliseconds();
		},
		toTime: function toTime(d) {
			return d.getTime();
		},
		fromTime: function fromTime(t) {
			return new Date(t);
		},
		dayOfWeek: function dayOfWeek(d) {
			return { ctor: dayTable[d.getDay()] };
		}
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Debug.js", function(exports, require, module) {
'use strict';

//import Native.Utils //

var _elm_lang$core$Native_Debug = function () {

	function log(tag, value) {
		var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
		var process = process || {};
		if (process.stdout) {
			process.stdout.write(msg);
		} else {
			console.log(msg);
		}
		return value;
	}

	function crash(message) {
		throw new Error(message);
	}

	return {
		crash: crash,
		log: F2(log)
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Json.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function () {

	// CORE DECODERS

	function succeed(msg) {
		return {
			ctor: '<decoder>',
			tag: 'succeed',
			msg: msg
		};
	}

	function fail(msg) {
		return {
			ctor: '<decoder>',
			tag: 'fail',
			msg: msg
		};
	}

	function decodePrimitive(tag) {
		return {
			ctor: '<decoder>',
			tag: tag
		};
	}

	function decodeContainer(tag, decoder) {
		return {
			ctor: '<decoder>',
			tag: tag,
			decoder: decoder
		};
	}

	function decodeNull(value) {
		return {
			ctor: '<decoder>',
			tag: 'null',
			value: value
		};
	}

	function decodeField(field, decoder) {
		return {
			ctor: '<decoder>',
			tag: 'field',
			field: field,
			decoder: decoder
		};
	}

	function decodeIndex(index, decoder) {
		return {
			ctor: '<decoder>',
			tag: 'index',
			index: index,
			decoder: decoder
		};
	}

	function decodeKeyValuePairs(decoder) {
		return {
			ctor: '<decoder>',
			tag: 'key-value',
			decoder: decoder
		};
	}

	function mapMany(f, decoders) {
		return {
			ctor: '<decoder>',
			tag: 'map-many',
			func: f,
			decoders: decoders
		};
	}

	function andThen(callback, decoder) {
		return {
			ctor: '<decoder>',
			tag: 'andThen',
			decoder: decoder,
			callback: callback
		};
	}

	function oneOf(decoders) {
		return {
			ctor: '<decoder>',
			tag: 'oneOf',
			decoders: decoders
		};
	}

	// DECODING OBJECTS

	function map1(f, d1) {
		return mapMany(f, [d1]);
	}

	function map2(f, d1, d2) {
		return mapMany(f, [d1, d2]);
	}

	function map3(f, d1, d2, d3) {
		return mapMany(f, [d1, d2, d3]);
	}

	function map4(f, d1, d2, d3, d4) {
		return mapMany(f, [d1, d2, d3, d4]);
	}

	function map5(f, d1, d2, d3, d4, d5) {
		return mapMany(f, [d1, d2, d3, d4, d5]);
	}

	function map6(f, d1, d2, d3, d4, d5, d6) {
		return mapMany(f, [d1, d2, d3, d4, d5, d6]);
	}

	function map7(f, d1, d2, d3, d4, d5, d6, d7) {
		return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
	}

	function map8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
		return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
	}

	// DECODE HELPERS

	function ok(value) {
		return { tag: 'ok', value: value };
	}

	function badPrimitive(type, value) {
		return { tag: 'primitive', type: type, value: value };
	}

	function badIndex(index, nestedProblems) {
		return { tag: 'index', index: index, rest: nestedProblems };
	}

	function badField(field, nestedProblems) {
		return { tag: 'field', field: field, rest: nestedProblems };
	}

	function badIndex(index, nestedProblems) {
		return { tag: 'index', index: index, rest: nestedProblems };
	}

	function badOneOf(problems) {
		return { tag: 'oneOf', problems: problems };
	}

	function bad(msg) {
		return { tag: 'fail', msg: msg };
	}

	function badToString(problem) {
		var context = '_';
		while (problem) {
			switch (problem.tag) {
				case 'primitive':
					return 'Expecting ' + problem.type + (context === '_' ? '' : ' at ' + context) + ' but instead got: ' + jsToString(problem.value);

				case 'index':
					context += '[' + problem.index + ']';
					problem = problem.rest;
					break;

				case 'field':
					context += '.' + problem.field;
					problem = problem.rest;
					break;

				case 'oneOf':
					var problems = problem.problems;
					for (var i = 0; i < problems.length; i++) {
						problems[i] = badToString(problems[i]);
					}
					return 'I ran into the following problems' + (context === '_' ? '' : ' at ' + context) + ':\n\n' + problems.join('\n');

				case 'fail':
					return 'I ran into a `fail` decoder' + (context === '_' ? '' : ' at ' + context) + ': ' + problem.msg;
			}
		}
	}

	function jsToString(value) {
		return value === undefined ? 'undefined' : JSON.stringify(value);
	}

	// DECODE

	function runOnString(decoder, string) {
		var json;
		try {
			json = JSON.parse(string);
		} catch (e) {
			return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
		}
		return run(decoder, json);
	}

	function run(decoder, value) {
		var result = runHelp(decoder, value);
		return result.tag === 'ok' ? _elm_lang$core$Result$Ok(result.value) : _elm_lang$core$Result$Err(badToString(result));
	}

	function runHelp(decoder, value) {
		switch (decoder.tag) {
			case 'bool':
				return typeof value === 'boolean' ? ok(value) : badPrimitive('a Bool', value);

			case 'int':
				if (typeof value !== 'number') {
					return badPrimitive('an Int', value);
				}

				if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
					return ok(value);
				}

				if (isFinite(value) && !(value % 1)) {
					return ok(value);
				}

				return badPrimitive('an Int', value);

			case 'float':
				return typeof value === 'number' ? ok(value) : badPrimitive('a Float', value);

			case 'string':
				return typeof value === 'string' ? ok(value) : value instanceof String ? ok(value + '') : badPrimitive('a String', value);

			case 'null':
				return value === null ? ok(decoder.value) : badPrimitive('null', value);

			case 'value':
				return ok(value);

			case 'list':
				if (!(value instanceof Array)) {
					return badPrimitive('a List', value);
				}

				var list = _elm_lang$core$Native_List.Nil;
				for (var i = value.length; i--;) {
					var result = runHelp(decoder.decoder, value[i]);
					if (result.tag !== 'ok') {
						return badIndex(i, result);
					}
					list = _elm_lang$core$Native_List.Cons(result.value, list);
				}
				return ok(list);

			case 'array':
				if (!(value instanceof Array)) {
					return badPrimitive('an Array', value);
				}

				var len = value.length;
				var array = new Array(len);
				for (var i = len; i--;) {
					var result = runHelp(decoder.decoder, value[i]);
					if (result.tag !== 'ok') {
						return badIndex(i, result);
					}
					array[i] = result.value;
				}
				return ok(_elm_lang$core$Native_Array.fromJSArray(array));

			case 'maybe':
				var result = runHelp(decoder.decoder, value);
				return result.tag === 'ok' ? ok(_elm_lang$core$Maybe$Just(result.value)) : ok(_elm_lang$core$Maybe$Nothing);

			case 'field':
				var field = decoder.field;
				if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || !(field in value)) {
					return badPrimitive('an object with a field named `' + field + '`', value);
				}

				var result = runHelp(decoder.decoder, value[field]);
				return result.tag === 'ok' ? result : badField(field, result);

			case 'index':
				var index = decoder.index;
				if (!(value instanceof Array)) {
					return badPrimitive('an array', value);
				}
				if (index >= value.length) {
					return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
				}

				var result = runHelp(decoder.decoder, value[index]);
				return result.tag === 'ok' ? result : badIndex(index, result);

			case 'key-value':
				if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || value instanceof Array) {
					return badPrimitive('an object', value);
				}

				var keyValuePairs = _elm_lang$core$Native_List.Nil;
				for (var key in value) {
					var result = runHelp(decoder.decoder, value[key]);
					if (result.tag !== 'ok') {
						return badField(key, result);
					}
					var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
					keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
				}
				return ok(keyValuePairs);

			case 'map-many':
				var answer = decoder.func;
				var decoders = decoder.decoders;
				for (var i = 0; i < decoders.length; i++) {
					var result = runHelp(decoders[i], value);
					if (result.tag !== 'ok') {
						return result;
					}
					answer = answer(result.value);
				}
				return ok(answer);

			case 'andThen':
				var result = runHelp(decoder.decoder, value);
				return result.tag !== 'ok' ? result : runHelp(decoder.callback(result.value), value);

			case 'oneOf':
				var errors = [];
				var temp = decoder.decoders;
				while (temp.ctor !== '[]') {
					var result = runHelp(temp._0, value);

					if (result.tag === 'ok') {
						return result;
					}

					errors.push(result);

					temp = temp._1;
				}
				return badOneOf(errors);

			case 'fail':
				return bad(decoder.msg);

			case 'succeed':
				return ok(decoder.msg);
		}
	}

	// EQUALITY

	function equality(a, b) {
		if (a === b) {
			return true;
		}

		if (a.tag !== b.tag) {
			return false;
		}

		switch (a.tag) {
			case 'succeed':
			case 'fail':
				return a.msg === b.msg;

			case 'bool':
			case 'int':
			case 'float':
			case 'string':
			case 'value':
				return true;

			case 'null':
				return a.value === b.value;

			case 'list':
			case 'array':
			case 'maybe':
			case 'key-value':
				return equality(a.decoder, b.decoder);

			case 'field':
				return a.field === b.field && equality(a.decoder, b.decoder);

			case 'index':
				return a.index === b.index && equality(a.decoder, b.decoder);

			case 'map-many':
				if (a.func !== b.func) {
					return false;
				}
				return listEquality(a.decoders, b.decoders);

			case 'andThen':
				return a.callback === b.callback && equality(a.decoder, b.decoder);

			case 'oneOf':
				return listEquality(a.decoders, b.decoders);
		}
	}

	function listEquality(aDecoders, bDecoders) {
		var len = aDecoders.length;
		if (len !== bDecoders.length) {
			return false;
		}
		for (var i = 0; i < len; i++) {
			if (!equality(aDecoders[i], bDecoders[i])) {
				return false;
			}
		}
		return true;
	}

	// ENCODE

	function encode(indentLevel, value) {
		return JSON.stringify(value, null, indentLevel);
	}

	function identity(value) {
		return value;
	}

	function encodeObject(keyValuePairs) {
		var obj = {};
		while (keyValuePairs.ctor !== '[]') {
			var pair = keyValuePairs._0;
			obj[pair._0] = pair._1;
			keyValuePairs = keyValuePairs._1;
		}
		return obj;
	}

	return {
		encode: F2(encode),
		runOnString: F2(runOnString),
		run: F2(run),

		decodeNull: decodeNull,
		decodePrimitive: decodePrimitive,
		decodeContainer: F2(decodeContainer),

		decodeField: F2(decodeField),
		decodeIndex: F2(decodeIndex),

		map1: F2(map1),
		map2: F3(map2),
		map3: F4(map3),
		map4: F5(map4),
		map5: F6(map5),
		map6: F7(map6),
		map7: F8(map7),
		map8: F9(map8),
		decodeKeyValuePairs: decodeKeyValuePairs,

		andThen: F2(andThen),
		fail: fail,
		succeed: succeed,
		oneOf: oneOf,

		identity: identity,
		encodeNull: null,
		encodeArray: _elm_lang$core$Native_Array.toJSArray,
		encodeList: _elm_lang$core$Native_List.toArray,
		encodeObject: encodeObject,

		equality: equality
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/List.js", function(exports, require, module) {
'use strict';

//import Native.Utils //

var _elm_lang$core$Native_List = function () {

	var Nil = { ctor: '[]' };

	function Cons(hd, tl) {
		return { ctor: '::', _0: hd, _1: tl };
	}

	function fromArray(arr) {
		var out = Nil;
		for (var i = arr.length; i--;) {
			out = Cons(arr[i], out);
		}
		return out;
	}

	function toArray(xs) {
		var out = [];
		while (xs.ctor !== '[]') {
			out.push(xs._0);
			xs = xs._1;
		}
		return out;
	}

	function foldr(f, b, xs) {
		var arr = toArray(xs);
		var acc = b;
		for (var i = arr.length; i--;) {
			acc = A2(f, arr[i], acc);
		}
		return acc;
	}

	function map2(f, xs, ys) {
		var arr = [];
		while (xs.ctor !== '[]' && ys.ctor !== '[]') {
			arr.push(A2(f, xs._0, ys._0));
			xs = xs._1;
			ys = ys._1;
		}
		return fromArray(arr);
	}

	function map3(f, xs, ys, zs) {
		var arr = [];
		while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
			arr.push(A3(f, xs._0, ys._0, zs._0));
			xs = xs._1;
			ys = ys._1;
			zs = zs._1;
		}
		return fromArray(arr);
	}

	function map4(f, ws, xs, ys, zs) {
		var arr = [];
		while (ws.ctor !== '[]' && xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
			arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
			ws = ws._1;
			xs = xs._1;
			ys = ys._1;
			zs = zs._1;
		}
		return fromArray(arr);
	}

	function map5(f, vs, ws, xs, ys, zs) {
		var arr = [];
		while (vs.ctor !== '[]' && ws.ctor !== '[]' && xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
			arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
			vs = vs._1;
			ws = ws._1;
			xs = xs._1;
			ys = ys._1;
			zs = zs._1;
		}
		return fromArray(arr);
	}

	function sortBy(f, xs) {
		return fromArray(toArray(xs).sort(function (a, b) {
			return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
		}));
	}

	function sortWith(f, xs) {
		return fromArray(toArray(xs).sort(function (a, b) {
			var ord = f(a)(b).ctor;
			return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
		}));
	}

	return {
		Nil: Nil,
		Cons: Cons,
		cons: F2(Cons),
		toArray: toArray,
		fromArray: fromArray,

		foldr: F3(foldr),

		map2: F3(map2),
		map3: F4(map3),
		map4: F5(map4),
		map5: F6(map5),
		sortBy: F2(sortBy),
		sortWith: F2(sortWith)
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Platform.js", function(exports, require, module) {
'use strict';

//import //

var _elm_lang$core$Native_Platform = function () {

	// PROGRAMS

	function program(impl) {
		return function (flagDecoder) {
			return function (object, moduleName) {
				object['worker'] = function worker(flags) {
					if (typeof flags !== 'undefined') {
						throw new Error('The `' + moduleName + '` module does not need flags.\n' + 'Call ' + moduleName + '.worker() with no arguments and you should be all set!');
					}

					return initialize(impl.init, impl.update, impl.subscriptions, renderer);
				};
			};
		};
	}

	function programWithFlags(impl) {
		return function (flagDecoder) {
			return function (object, moduleName) {
				object['worker'] = function worker(flags) {
					if (typeof flagDecoder === 'undefined') {
						throw new Error('Are you trying to sneak a Never value into Elm? Trickster!\n' + 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n' + 'Use `program` instead if you do not want flags.');
					}

					var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
					if (result.ctor === 'Err') {
						throw new Error(moduleName + '.worker(...) was called with an unexpected argument.\n' + 'I tried to convert it to an Elm value, but ran into this problem:\n\n' + result._0);
					}

					return initialize(impl.init(result._0), impl.update, impl.subscriptions, renderer);
				};
			};
		};
	}

	function renderer(enqueue, _) {
		return function (_) {};
	}

	// HTML TO PROGRAM

	function htmlToProgram(vnode) {
		var emptyBag = batch(_elm_lang$core$Native_List.Nil);
		var noChange = _elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.Tuple0, emptyBag);

		return _elm_lang$virtual_dom$VirtualDom$program({
			init: noChange,
			view: function view(model) {
				return main;
			},
			update: F2(function (msg, model) {
				return noChange;
			}),
			subscriptions: function subscriptions(model) {
				return emptyBag;
			}
		});
	}

	// INITIALIZE A PROGRAM

	function initialize(init, update, subscriptions, renderer) {
		// ambient state
		var managers = {};
		var updateView;

		// init and update state in main process
		var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			var model = init._0;
			updateView = renderer(enqueue, model);
			var cmds = init._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});

		function onMessage(msg, model) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var results = A2(update, msg, model);
				model = results._0;
				updateView(model);
				var cmds = results._1;
				var subs = subscriptions(model);
				dispatchEffects(managers, cmds, subs);
				callback(_elm_lang$core$Native_Scheduler.succeed(model));
			});
		}

		var mainProcess = spawnLoop(initApp, onMessage);

		function enqueue(msg) {
			_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
		}

		var ports = setupEffects(managers, enqueue);

		return ports ? { ports: ports } : {};
	}

	// EFFECT MANAGERS

	var effectManagers = {};

	function setupEffects(managers, callback) {
		var ports;

		// setup all necessary effect managers
		for (var key in effectManagers) {
			var manager = effectManagers[key];

			if (manager.isForeign) {
				ports = ports || {};
				ports[key] = manager.tag === 'cmd' ? setupOutgoingPort(key) : setupIncomingPort(key, callback);
			}

			managers[key] = makeManager(manager, callback);
		}

		return ports;
	}

	function makeManager(info, callback) {
		var router = {
			main: callback,
			self: undefined
		};

		var tag = info.tag;
		var onEffects = info.onEffects;
		var onSelfMsg = info.onSelfMsg;

		function onMessage(msg, state) {
			if (msg.ctor === 'self') {
				return A3(onSelfMsg, router, msg._0, state);
			}

			var fx = msg._0;
			switch (tag) {
				case 'cmd':
					return A3(onEffects, router, fx.cmds, state);

				case 'sub':
					return A3(onEffects, router, fx.subs, state);

				case 'fx':
					return A4(onEffects, router, fx.cmds, fx.subs, state);
			}
		}

		var process = spawnLoop(info.init, onMessage);
		router.self = process;
		return process;
	}

	function sendToApp(router, msg) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			router.main(msg);
			callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	function sendToSelf(router, msg) {
		return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
			ctor: 'self',
			_0: msg
		});
	}

	// HELPER for STATEFUL LOOPS

	function spawnLoop(init, onMessage) {
		var andThen = _elm_lang$core$Native_Scheduler.andThen;

		function loop(state) {
			var handleMsg = _elm_lang$core$Native_Scheduler.receive(function (msg) {
				return onMessage(msg, state);
			});
			return A2(andThen, loop, handleMsg);
		}

		var task = A2(andThen, loop, init);

		return _elm_lang$core$Native_Scheduler.rawSpawn(task);
	}

	// BAGS

	function leaf(home) {
		return function (value) {
			return {
				type: 'leaf',
				home: home,
				value: value
			};
		};
	}

	function batch(list) {
		return {
			type: 'node',
			branches: list
		};
	}

	function map(tagger, bag) {
		return {
			type: 'map',
			tagger: tagger,
			tree: bag
		};
	}

	// PIPE BAGS INTO EFFECT MANAGERS

	function dispatchEffects(managers, cmdBag, subBag) {
		var effectsDict = {};
		gatherEffects(true, cmdBag, effectsDict, null);
		gatherEffects(false, subBag, effectsDict, null);

		for (var home in managers) {
			var fx = home in effectsDict ? effectsDict[home] : {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

			_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
		}
	}

	function gatherEffects(isCmd, bag, effectsDict, taggers) {
		switch (bag.type) {
			case 'leaf':
				var home = bag.home;
				var effect = toEffect(isCmd, home, taggers, bag.value);
				effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
				return;

			case 'node':
				var list = bag.branches;
				while (list.ctor !== '[]') {
					gatherEffects(isCmd, list._0, effectsDict, taggers);
					list = list._1;
				}
				return;

			case 'map':
				gatherEffects(isCmd, bag.tree, effectsDict, {
					tagger: bag.tagger,
					rest: taggers
				});
				return;
		}
	}

	function toEffect(isCmd, home, taggers, value) {
		function applyTaggers(x) {
			var temp = taggers;
			while (temp) {
				x = temp.tagger(x);
				temp = temp.rest;
			}
			return x;
		}

		var map = isCmd ? effectManagers[home].cmdMap : effectManagers[home].subMap;

		return A2(map, applyTaggers, value);
	}

	function insert(isCmd, newEffect, effects) {
		effects = effects || {
			cmds: _elm_lang$core$Native_List.Nil,
			subs: _elm_lang$core$Native_List.Nil
		};
		if (isCmd) {
			effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
			return effects;
		}
		effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
		return effects;
	}

	// PORTS

	function checkPortName(name) {
		if (name in effectManagers) {
			throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
		}
	}

	// OUTGOING PORTS

	function outgoingPort(name, converter) {
		checkPortName(name);
		effectManagers[name] = {
			tag: 'cmd',
			cmdMap: outgoingPortMap,
			converter: converter,
			isForeign: true
		};
		return leaf(name);
	}

	var outgoingPortMap = F2(function cmdMap(tagger, value) {
		return value;
	});

	function setupOutgoingPort(name) {
		var subs = [];
		var converter = effectManagers[name].converter;

		// CREATE MANAGER

		var init = _elm_lang$core$Native_Scheduler.succeed(null);

		function onEffects(router, cmdList, state) {
			while (cmdList.ctor !== '[]') {
				// grab a separate reference to subs in case unsubscribe is called
				var currentSubs = subs;
				var value = converter(cmdList._0);
				for (var i = 0; i < currentSubs.length; i++) {
					currentSubs[i](value);
				}
				cmdList = cmdList._1;
			}
			return init;
		}

		effectManagers[name].init = init;
		effectManagers[name].onEffects = F3(onEffects);

		// PUBLIC API

		function subscribe(callback) {
			subs.push(callback);
		}

		function unsubscribe(callback) {
			// copy subs into a new array in case unsubscribe is called within a
			// subscribed callback
			subs = subs.slice();
			var index = subs.indexOf(callback);
			if (index >= 0) {
				subs.splice(index, 1);
			}
		}

		return {
			subscribe: subscribe,
			unsubscribe: unsubscribe
		};
	}

	// INCOMING PORTS

	function incomingPort(name, converter) {
		checkPortName(name);
		effectManagers[name] = {
			tag: 'sub',
			subMap: incomingPortMap,
			converter: converter,
			isForeign: true
		};
		return leaf(name);
	}

	var incomingPortMap = F2(function subMap(tagger, finalTagger) {
		return function (value) {
			return tagger(finalTagger(value));
		};
	});

	function setupIncomingPort(name, callback) {
		var sentBeforeInit = [];
		var subs = _elm_lang$core$Native_List.Nil;
		var converter = effectManagers[name].converter;
		var currentOnEffects = preInitOnEffects;
		var currentSend = preInitSend;

		// CREATE MANAGER

		var init = _elm_lang$core$Native_Scheduler.succeed(null);

		function preInitOnEffects(router, subList, state) {
			var postInitResult = postInitOnEffects(router, subList, state);

			for (var i = 0; i < sentBeforeInit.length; i++) {
				postInitSend(sentBeforeInit[i]);
			}

			sentBeforeInit = null; // to release objects held in queue
			currentSend = postInitSend;
			currentOnEffects = postInitOnEffects;
			return postInitResult;
		}

		function postInitOnEffects(router, subList, state) {
			subs = subList;
			return init;
		}

		function onEffects(router, subList, state) {
			return currentOnEffects(router, subList, state);
		}

		effectManagers[name].init = init;
		effectManagers[name].onEffects = F3(onEffects);

		// PUBLIC API

		function preInitSend(value) {
			sentBeforeInit.push(value);
		}

		function postInitSend(value) {
			var temp = subs;
			while (temp.ctor !== '[]') {
				callback(temp._0(value));
				temp = temp._1;
			}
		}

		function send(incomingValue) {
			var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
			if (result.ctor === 'Err') {
				throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
			}

			currentSend(result._0);
		}

		return { send: send };
	}

	return {
		// routers
		sendToApp: F2(sendToApp),
		sendToSelf: F2(sendToSelf),

		// global setup
		effectManagers: effectManagers,
		outgoingPort: outgoingPort,
		incomingPort: incomingPort,

		htmlToProgram: htmlToProgram,
		program: program,
		programWithFlags: programWithFlags,
		initialize: initialize,

		// effect bags
		leaf: leaf,
		batch: batch,
		map: F2(map)
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Regex.js", function(exports, require, module) {
'use strict';

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function () {

	function escape(str) {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	function caseInsensitive(re) {
		return new RegExp(re.source, 'gi');
	}
	function regex(raw) {
		return new RegExp(raw, 'g');
	}

	function contains(re, string) {
		return string.match(re) !== null;
	}

	function find(n, re, str) {
		n = n.ctor === 'All' ? Infinity : n._0;
		var out = [];
		var number = 0;
		var string = str;
		var lastIndex = re.lastIndex;
		var prevLastIndex = -1;
		var result;
		while (number++ < n && (result = re.exec(string))) {
			if (prevLastIndex === re.lastIndex) break;
			var i = result.length - 1;
			var subs = new Array(i);
			while (i > 0) {
				var submatch = result[i];
				subs[--i] = submatch === undefined ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(submatch);
			}
			out.push({
				match: result[0],
				submatches: _elm_lang$core$Native_List.fromArray(subs),
				index: result.index,
				number: number
			});
			prevLastIndex = re.lastIndex;
		}
		re.lastIndex = lastIndex;
		return _elm_lang$core$Native_List.fromArray(out);
	}

	function replace(n, re, replacer, string) {
		n = n.ctor === 'All' ? Infinity : n._0;
		var count = 0;
		function jsReplacer(match) {
			if (count++ >= n) {
				return match;
			}
			var i = arguments.length - 3;
			var submatches = new Array(i);
			while (i > 0) {
				var submatch = arguments[i];
				submatches[--i] = submatch === undefined ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(submatch);
			}
			return replacer({
				match: match,
				submatches: _elm_lang$core$Native_List.fromArray(submatches),
				index: arguments[arguments.length - 2],
				number: count
			});
		}
		return string.replace(re, jsReplacer);
	}

	function split(n, re, str) {
		n = n.ctor === 'All' ? Infinity : n._0;
		if (n === Infinity) {
			return _elm_lang$core$Native_List.fromArray(str.split(re));
		}
		var string = str;
		var result;
		var out = [];
		var start = re.lastIndex;
		var restoreLastIndex = re.lastIndex;
		while (n--) {
			if (!(result = re.exec(string))) break;
			out.push(string.slice(start, result.index));
			start = re.lastIndex;
		}
		out.push(string.slice(start));
		re.lastIndex = restoreLastIndex;
		return _elm_lang$core$Native_List.fromArray(out);
	}

	return {
		regex: regex,
		caseInsensitive: caseInsensitive,
		escape: escape,

		contains: F2(contains),
		find: F3(find),
		replace: F4(replace),
		split: F3(split)
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Scheduler.js", function(exports, require, module) {
'use strict';

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function () {

	var MAX_STEPS = 10000;

	// TASKS

	function succeed(value) {
		return {
			ctor: '_Task_succeed',
			value: value
		};
	}

	function fail(error) {
		return {
			ctor: '_Task_fail',
			value: error
		};
	}

	function nativeBinding(callback) {
		return {
			ctor: '_Task_nativeBinding',
			callback: callback,
			cancel: null
		};
	}

	function andThen(callback, task) {
		return {
			ctor: '_Task_andThen',
			callback: callback,
			task: task
		};
	}

	function onError(callback, task) {
		return {
			ctor: '_Task_onError',
			callback: callback,
			task: task
		};
	}

	function receive(callback) {
		return {
			ctor: '_Task_receive',
			callback: callback
		};
	}

	// PROCESSES

	function rawSpawn(task) {
		var process = {
			ctor: '_Process',
			id: _elm_lang$core$Native_Utils.guid(),
			root: task,
			stack: null,
			mailbox: []
		};

		enqueue(process);

		return process;
	}

	function spawn(task) {
		return nativeBinding(function (callback) {
			var process = rawSpawn(task);
			callback(succeed(process));
		});
	}

	function rawSend(process, msg) {
		process.mailbox.push(msg);
		enqueue(process);
	}

	function send(process, msg) {
		return nativeBinding(function (callback) {
			rawSend(process, msg);
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	function kill(process) {
		return nativeBinding(function (callback) {
			var root = process.root;
			if (root.ctor === '_Task_nativeBinding' && root.cancel) {
				root.cancel();
			}

			process.root = null;

			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	function sleep(time) {
		return nativeBinding(function (callback) {
			var id = setTimeout(function () {
				callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
			}, time);

			return function () {
				clearTimeout(id);
			};
		});
	}

	// STEP PROCESSES

	function step(numSteps, process) {
		while (numSteps < MAX_STEPS) {
			var ctor = process.root.ctor;

			if (ctor === '_Task_succeed') {
				while (process.stack && process.stack.ctor === '_Task_onError') {
					process.stack = process.stack.rest;
				}
				if (process.stack === null) {
					break;
				}
				process.root = process.stack.callback(process.root.value);
				process.stack = process.stack.rest;
				++numSteps;
				continue;
			}

			if (ctor === '_Task_fail') {
				while (process.stack && process.stack.ctor === '_Task_andThen') {
					process.stack = process.stack.rest;
				}
				if (process.stack === null) {
					break;
				}
				process.root = process.stack.callback(process.root.value);
				process.stack = process.stack.rest;
				++numSteps;
				continue;
			}

			if (ctor === '_Task_andThen') {
				process.stack = {
					ctor: '_Task_andThen',
					callback: process.root.callback,
					rest: process.stack
				};
				process.root = process.root.task;
				++numSteps;
				continue;
			}

			if (ctor === '_Task_onError') {
				process.stack = {
					ctor: '_Task_onError',
					callback: process.root.callback,
					rest: process.stack
				};
				process.root = process.root.task;
				++numSteps;
				continue;
			}

			if (ctor === '_Task_nativeBinding') {
				process.root.cancel = process.root.callback(function (newRoot) {
					process.root = newRoot;
					enqueue(process);
				});

				break;
			}

			if (ctor === '_Task_receive') {
				var mailbox = process.mailbox;
				if (mailbox.length === 0) {
					break;
				}

				process.root = process.root.callback(mailbox.shift());
				++numSteps;
				continue;
			}

			throw new Error(ctor);
		}

		if (numSteps < MAX_STEPS) {
			return numSteps + 1;
		}
		enqueue(process);

		return numSteps;
	}

	// WORK QUEUE

	var working = false;
	var workQueue = [];

	function enqueue(process) {
		workQueue.push(process);

		if (!working) {
			setTimeout(work, 0);
			working = true;
		}
	}

	function work() {
		var numSteps = 0;
		var process;
		while (numSteps < MAX_STEPS && (process = workQueue.shift())) {
			if (process.root) {
				numSteps = step(numSteps, process);
			}
		}
		if (!process) {
			working = false;
			return;
		}
		setTimeout(work, 0);
	}

	return {
		succeed: succeed,
		fail: fail,
		nativeBinding: nativeBinding,
		andThen: F2(andThen),
		onError: F2(onError),
		receive: receive,

		spawn: spawn,
		kill: kill,
		sleep: sleep,
		send: F2(send),

		rawSpawn: rawSpawn,
		rawSend: rawSend
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/String.js", function(exports, require, module) {
'use strict';

//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function () {

	function isEmpty(str) {
		return str.length === 0;
	}
	function cons(chr, str) {
		return chr + str;
	}
	function uncons(str) {
		var hd = str[0];
		if (hd) {
			return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
		}
		return _elm_lang$core$Maybe$Nothing;
	}
	function append(a, b) {
		return a + b;
	}
	function concat(strs) {
		return _elm_lang$core$Native_List.toArray(strs).join('');
	}
	function length(str) {
		return str.length;
	}
	function map(f, str) {
		var out = str.split('');
		for (var i = out.length; i--;) {
			out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
		}
		return out.join('');
	}
	function filter(pred, str) {
		return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
	}
	function reverse(str) {
		return str.split('').reverse().join('');
	}
	function foldl(f, b, str) {
		var len = str.length;
		for (var i = 0; i < len; ++i) {
			b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
		}
		return b;
	}
	function foldr(f, b, str) {
		for (var i = str.length; i--;) {
			b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
		}
		return b;
	}
	function split(sep, str) {
		return _elm_lang$core$Native_List.fromArray(str.split(sep));
	}
	function join(sep, strs) {
		return _elm_lang$core$Native_List.toArray(strs).join(sep);
	}
	function repeat(n, str) {
		var result = '';
		while (n > 0) {
			if (n & 1) {
				result += str;
			}
			n >>= 1, str += str;
		}
		return result;
	}
	function slice(start, end, str) {
		return str.slice(start, end);
	}
	function left(n, str) {
		return n < 1 ? '' : str.slice(0, n);
	}
	function right(n, str) {
		return n < 1 ? '' : str.slice(-n);
	}
	function dropLeft(n, str) {
		return n < 1 ? str : str.slice(n);
	}
	function dropRight(n, str) {
		return n < 1 ? str : str.slice(0, -n);
	}
	function pad(n, chr, str) {
		var half = (n - str.length) / 2;
		return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
	}
	function padRight(n, chr, str) {
		return str + repeat(n - str.length, chr);
	}
	function padLeft(n, chr, str) {
		return repeat(n - str.length, chr) + str;
	}

	function trim(str) {
		return str.trim();
	}
	function trimLeft(str) {
		return str.replace(/^\s+/, '');
	}
	function trimRight(str) {
		return str.replace(/\s+$/, '');
	}

	function words(str) {
		return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
	}
	function lines(str) {
		return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
	}

	function toUpper(str) {
		return str.toUpperCase();
	}
	function toLower(str) {
		return str.toLowerCase();
	}

	function any(pred, str) {
		for (var i = str.length; i--;) {
			if (pred(_elm_lang$core$Native_Utils.chr(str[i]))) {
				return true;
			}
		}
		return false;
	}
	function all(pred, str) {
		for (var i = str.length; i--;) {
			if (!pred(_elm_lang$core$Native_Utils.chr(str[i]))) {
				return false;
			}
		}
		return true;
	}

	function contains(sub, str) {
		return str.indexOf(sub) > -1;
	}
	function startsWith(sub, str) {
		return str.indexOf(sub) === 0;
	}
	function endsWith(sub, str) {
		return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
	}
	function indexes(sub, str) {
		var subLen = sub.length;

		if (subLen < 1) {
			return _elm_lang$core$Native_List.Nil;
		}

		var i = 0;
		var is = [];

		while ((i = str.indexOf(sub, i)) > -1) {
			is.push(i);
			i = i + subLen;
		}

		return _elm_lang$core$Native_List.fromArray(is);
	}

	function toInt(s) {
		var len = s.length;

		// if empty
		if (len === 0) {
			return intErr(s);
		}

		// if hex
		var c = s[0];
		if (c === '0' && s[1] === 'x') {
			for (var i = 2; i < len; ++i) {
				var c = s[i];
				if ('0' <= c && c <= '9' || 'A' <= c && c <= 'F' || 'a' <= c && c <= 'f') {
					continue;
				}
				return intErr(s);
			}
			return _elm_lang$core$Result$Ok(parseInt(s, 16));
		}

		// is decimal
		if (c > '9' || c < '0' && c !== '-' && c !== '+') {
			return intErr(s);
		}
		for (var i = 1; i < len; ++i) {
			var c = s[i];
			if (c < '0' || '9' < c) {
				return intErr(s);
			}
		}

		return _elm_lang$core$Result$Ok(parseInt(s, 10));
	}

	function intErr(s) {
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
	}

	function toFloat(s) {
		// check if it is a hex, octal, or binary number
		if (s.length === 0 || /[\sxbo]/.test(s)) {
			return floatErr(s);
		}
		var n = +s;
		// faster isNaN check
		return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
	}

	function floatErr(s) {
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
	}

	function toList(str) {
		return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
	}
	function fromList(chars) {
		return _elm_lang$core$Native_List.toArray(chars).join('');
	}

	return {
		isEmpty: isEmpty,
		cons: F2(cons),
		uncons: uncons,
		append: F2(append),
		concat: concat,
		length: length,
		map: F2(map),
		filter: F2(filter),
		reverse: reverse,
		foldl: F3(foldl),
		foldr: F3(foldr),

		split: F2(split),
		join: F2(join),
		repeat: F2(repeat),

		slice: F3(slice),
		left: F2(left),
		right: F2(right),
		dropLeft: F2(dropLeft),
		dropRight: F2(dropRight),

		pad: F3(pad),
		padLeft: F3(padLeft),
		padRight: F3(padRight),

		trim: trim,
		trimLeft: trimLeft,
		trimRight: trimRight,

		words: words,
		lines: lines,

		toUpper: toUpper,
		toLower: toLower,

		any: F2(any),
		all: F2(all),

		contains: F2(contains),
		startsWith: F2(startsWith),
		endsWith: F2(endsWith),
		indexes: F2(indexes),

		toInt: toInt,
		toFloat: toFloat,
		toList: toList,
		fromList: fromList
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Time.js", function(exports, require, module) {
"use strict";

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function () {

	var now = _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
		callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
	});

	function setInterval_(interval, task) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			var id = setInterval(function () {
				_elm_lang$core$Native_Scheduler.rawSpawn(task);
			}, interval);

			return function () {
				clearInterval(id);
			};
		});
	}

	return {
		now: now,
		setInterval_: F2(setInterval_)
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Native/Utils.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//import //

var _elm_lang$core$Native_Utils = function () {

	// COMPARISONS

	function eq(x, y) {
		var stack = [];
		var isEqual = eqHelp(x, y, 0, stack);
		var pair;
		while (isEqual && (pair = stack.pop())) {
			isEqual = eqHelp(pair.x, pair.y, 0, stack);
		}
		return isEqual;
	}

	function eqHelp(x, y, depth, stack) {
		if (depth > 100) {
			stack.push({ x: x, y: y });
			return true;
		}

		if (x === y) {
			return true;
		}

		if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
			if (typeof x === 'function') {
				throw new Error('Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.' + ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#==' + ' which describes why it is this way and what the better version will look like.');
			}
			return false;
		}

		if (x === null || y === null) {
			return false;
		}

		if (x instanceof Date) {
			return x.getTime() === y.getTime();
		}

		if (!('ctor' in x)) {
			for (var key in x) {
				if (!eqHelp(x[key], y[key], depth + 1, stack)) {
					return false;
				}
			}
			return true;
		}

		// convert Dicts and Sets to lists
		if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin') {
			x = _elm_lang$core$Dict$toList(x);
			y = _elm_lang$core$Dict$toList(y);
		}
		if (x.ctor === 'Set_elm_builtin') {
			x = _elm_lang$core$Set$toList(x);
			y = _elm_lang$core$Set$toList(y);
		}

		// check if lists are equal without recursion
		if (x.ctor === '::') {
			var a = x;
			var b = y;
			while (a.ctor === '::' && b.ctor === '::') {
				if (!eqHelp(a._0, b._0, depth + 1, stack)) {
					return false;
				}
				a = a._1;
				b = b._1;
			}
			return a.ctor === b.ctor;
		}

		// check if Arrays are equal
		if (x.ctor === '_Array') {
			var xs = _elm_lang$core$Native_Array.toJSArray(x);
			var ys = _elm_lang$core$Native_Array.toJSArray(y);
			if (xs.length !== ys.length) {
				return false;
			}
			for (var i = 0; i < xs.length; i++) {
				if (!eqHelp(xs[i], ys[i], depth + 1, stack)) {
					return false;
				}
			}
			return true;
		}

		if (!eqHelp(x.ctor, y.ctor, depth + 1, stack)) {
			return false;
		}

		for (var key in x) {
			if (!eqHelp(x[key], y[key], depth + 1, stack)) {
				return false;
			}
		}
		return true;
	}

	// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
	// the particular integer values assigned to LT, EQ, and GT.

	var LT = -1,
	    EQ = 0,
	    GT = 1;

	function cmp(x, y) {
		if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
			return x === y ? EQ : x < y ? LT : GT;
		}

		if (x instanceof String) {
			var a = x.valueOf();
			var b = y.valueOf();
			return a === b ? EQ : a < b ? LT : GT;
		}

		if (x.ctor === '::' || x.ctor === '[]') {
			while (x.ctor === '::' && y.ctor === '::') {
				var ord = cmp(x._0, y._0);
				if (ord !== EQ) {
					return ord;
				}
				x = x._1;
				y = y._1;
			}
			return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
		}

		if (x.ctor.slice(0, 6) === '_Tuple') {
			var ord;
			var n = x.ctor.slice(6) - 0;
			var err = 'cannot compare tuples with more than 6 elements.';
			if (n === 0) return EQ;
			if (n >= 1) {
				ord = cmp(x._0, y._0);if (ord !== EQ) return ord;
				if (n >= 2) {
					ord = cmp(x._1, y._1);if (ord !== EQ) return ord;
					if (n >= 3) {
						ord = cmp(x._2, y._2);if (ord !== EQ) return ord;
						if (n >= 4) {
							ord = cmp(x._3, y._3);if (ord !== EQ) return ord;
							if (n >= 5) {
								ord = cmp(x._4, y._4);if (ord !== EQ) return ord;
								if (n >= 6) {
									ord = cmp(x._5, y._5);if (ord !== EQ) return ord;
									if (n >= 7) throw new Error('Comparison error: ' + err);
								}
							}
						}
					}
				}
			}
			return EQ;
		}

		throw new Error('Comparison error: comparison is only defined on ints, ' + 'floats, times, chars, strings, lists of comparable values, ' + 'and tuples of comparable values.');
	}

	// COMMON VALUES

	var Tuple0 = {
		ctor: '_Tuple0'
	};

	function Tuple2(x, y) {
		return {
			ctor: '_Tuple2',
			_0: x,
			_1: y
		};
	}

	function chr(c) {
		return new String(c);
	}

	// GUID

	var count = 0;
	function guid(_) {
		return count++;
	}

	// RECORDS

	function update(oldRecord, updatedFields) {
		var newRecord = {};

		for (var key in oldRecord) {
			newRecord[key] = oldRecord[key];
		}

		for (var key in updatedFields) {
			newRecord[key] = updatedFields[key];
		}

		return newRecord;
	}

	//// LIST STUFF ////

	var Nil = { ctor: '[]' };

	function Cons(hd, tl) {
		return {
			ctor: '::',
			_0: hd,
			_1: tl
		};
	}

	function append(xs, ys) {
		// append Strings
		if (typeof xs === 'string') {
			return xs + ys;
		}

		// append Lists
		if (xs.ctor === '[]') {
			return ys;
		}
		var root = Cons(xs._0, Nil);
		var curr = root;
		xs = xs._1;
		while (xs.ctor !== '[]') {
			curr._1 = Cons(xs._0, Nil);
			xs = xs._1;
			curr = curr._1;
		}
		curr._1 = ys;
		return root;
	}

	// CRASHES

	function crash(moduleName, region) {
		return function (message) {
			throw new Error('Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n' + 'The message provided by the code author is:\n\n    ' + message);
		};
	}

	function crashCase(moduleName, region, value) {
		return function (message) {
			throw new Error('Ran into a `Debug.crash` in module `' + moduleName + '`\n\n' + 'This was caused by the `case` expression ' + regionToString(region) + '.\n' + 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n' + 'The message provided by the code author is:\n\n    ' + message);
		};
	}

	function regionToString(region) {
		if (region.start.line == region.end.line) {
			return 'on line ' + region.start.line;
		}
		return 'between lines ' + region.start.line + ' and ' + region.end.line;
	}

	// TO STRING

	function toString(v) {
		var type = typeof v === 'undefined' ? 'undefined' : _typeof(v);
		if (type === 'function') {
			return '<function>';
		}

		if (type === 'boolean') {
			return v ? 'True' : 'False';
		}

		if (type === 'number') {
			return v + '';
		}

		if (v instanceof String) {
			return '\'' + addSlashes(v, true) + '\'';
		}

		if (type === 'string') {
			return '"' + addSlashes(v, false) + '"';
		}

		if (v === null) {
			return 'null';
		}

		if (type === 'object' && 'ctor' in v) {
			var ctorStarter = v.ctor.substring(0, 5);

			if (ctorStarter === '_Tupl') {
				var output = [];
				for (var k in v) {
					if (k === 'ctor') continue;
					output.push(toString(v[k]));
				}
				return '(' + output.join(',') + ')';
			}

			if (ctorStarter === '_Task') {
				return '<task>';
			}

			if (v.ctor === '_Array') {
				var list = _elm_lang$core$Array$toList(v);
				return 'Array.fromList ' + toString(list);
			}

			if (v.ctor === '<decoder>') {
				return '<decoder>';
			}

			if (v.ctor === '_Process') {
				return '<process:' + v.id + '>';
			}

			if (v.ctor === '::') {
				var output = '[' + toString(v._0);
				v = v._1;
				while (v.ctor === '::') {
					output += ',' + toString(v._0);
					v = v._1;
				}
				return output + ']';
			}

			if (v.ctor === '[]') {
				return '[]';
			}

			if (v.ctor === 'Set_elm_builtin') {
				return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
			}

			if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin') {
				return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
			}

			var output = '';
			for (var i in v) {
				if (i === 'ctor') continue;
				var str = toString(v[i]);
				var c0 = str[0];
				var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
				output += ' ' + (parenless ? str : '(' + str + ')');
			}
			return v.ctor + output;
		}

		if (type === 'object') {
			if (v instanceof Date) {
				return '<' + v.toString() + '>';
			}

			if (v.elm_web_socket) {
				return '<websocket>';
			}

			var output = [];
			for (var k in v) {
				output.push(k + ' = ' + toString(v[k]));
			}
			if (output.length === 0) {
				return '{}';
			}
			return '{ ' + output.join(', ') + ' }';
		}

		return '<internal structure>';
	}

	function addSlashes(str, isChar) {
		var s = str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
		if (isChar) {
			return s.replace(/\'/g, '\\\'');
		} else {
			return s.replace(/\"/g, '\\"');
		}
	}

	return {
		eq: eq,
		cmp: cmp,
		Tuple0: Tuple0,
		Tuple2: Tuple2,
		chr: chr,
		update: update,
		guid: guid,

		append: F2(append),

		crash: crash,
		crashCase: crashCase,

		toString: toString
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Platform.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Platform/Cmd.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Platform/Sub.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Process.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Random.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Regex.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Result.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Set.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/String.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Task.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Time.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/src/Tuple.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Main.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Array.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Basics.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Bitwise.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Char.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/CodeGen.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Dict.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Equality.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Json.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/List.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Maybe.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Regex.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Result.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/Set.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/core/5.1.1/tests/Test/String.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/dom/1.1.1/src/Dom.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/dom/1.1.1/src/Dom/LowLevel.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/dom/1.1.1/src/Dom/Scroll.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/dom/1.1.1/src/Dom/Size.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/dom/1.1.1/src/Native/Dom.js", function(exports, require, module) {
'use strict';

var _elm_lang$dom$Native_Dom = function () {

	var fakeNode = {
		addEventListener: function addEventListener() {},
		removeEventListener: function removeEventListener() {}
	};

	var onDocument = on(typeof document !== 'undefined' ? document : fakeNode);
	var onWindow = on(typeof window !== 'undefined' ? window : fakeNode);

	function on(node) {
		return function (eventName, decoder, toTask) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {

				function performTask(event) {
					var result = A2(_elm_lang$core$Json_Decode$decodeValue, decoder, event);
					if (result.ctor === 'Ok') {
						_elm_lang$core$Native_Scheduler.rawSpawn(toTask(result._0));
					}
				}

				node.addEventListener(eventName, performTask);

				return function () {
					node.removeEventListener(eventName, performTask);
				};
			});
		};
	}

	var rAF = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (callback) {
		callback();
	};

	function withNode(id, doStuff) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			rAF(function () {
				var node = document.getElementById(id);
				if (node === null) {
					callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NotFound', _0: id }));
					return;
				}
				callback(_elm_lang$core$Native_Scheduler.succeed(doStuff(node)));
			});
		});
	}

	// FOCUS

	function focus(id) {
		return withNode(id, function (node) {
			node.focus();
			return _elm_lang$core$Native_Utils.Tuple0;
		});
	}

	function blur(id) {
		return withNode(id, function (node) {
			node.blur();
			return _elm_lang$core$Native_Utils.Tuple0;
		});
	}

	// SCROLLING

	function getScrollTop(id) {
		return withNode(id, function (node) {
			return node.scrollTop;
		});
	}

	function setScrollTop(id, desiredScrollTop) {
		return withNode(id, function (node) {
			node.scrollTop = desiredScrollTop;
			return _elm_lang$core$Native_Utils.Tuple0;
		});
	}

	function toBottom(id) {
		return withNode(id, function (node) {
			node.scrollTop = node.scrollHeight;
			return _elm_lang$core$Native_Utils.Tuple0;
		});
	}

	function getScrollLeft(id) {
		return withNode(id, function (node) {
			return node.scrollLeft;
		});
	}

	function setScrollLeft(id, desiredScrollLeft) {
		return withNode(id, function (node) {
			node.scrollLeft = desiredScrollLeft;
			return _elm_lang$core$Native_Utils.Tuple0;
		});
	}

	function toRight(id) {
		return withNode(id, function (node) {
			node.scrollLeft = node.scrollWidth;
			return _elm_lang$core$Native_Utils.Tuple0;
		});
	}

	// SIZE

	function width(options, id) {
		return withNode(id, function (node) {
			switch (options.ctor) {
				case 'Content':
					return node.scrollWidth;
				case 'VisibleContent':
					return node.clientWidth;
				case 'VisibleContentWithBorders':
					return node.offsetWidth;
				case 'VisibleContentWithBordersAndMargins':
					var rect = node.getBoundingClientRect();
					return rect.right - rect.left;
			}
		});
	}

	function height(options, id) {
		return withNode(id, function (node) {
			switch (options.ctor) {
				case 'Content':
					return node.scrollHeight;
				case 'VisibleContent':
					return node.clientHeight;
				case 'VisibleContentWithBorders':
					return node.offsetHeight;
				case 'VisibleContentWithBordersAndMargins':
					var rect = node.getBoundingClientRect();
					return rect.bottom - rect.top;
			}
		});
	}

	return {
		onDocument: F3(onDocument),
		onWindow: F3(onWindow),

		focus: focus,
		blur: blur,

		getScrollTop: getScrollTop,
		setScrollTop: F2(setScrollTop),
		getScrollLeft: getScrollLeft,
		setScrollLeft: F2(setScrollLeft),
		toBottom: toBottom,
		toRight: toRight,

		height: F2(height),
		width: F2(width)
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/html/2.0.0/src/Html.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/html/2.0.0/src/Html/Attributes.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/html/2.0.0/src/Html/Events.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/html/2.0.0/src/Html/Keyed.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/html/2.0.0/src/Html/Lazy.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/http/1.0.0/src/Http.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/http/1.0.0/src/Http/Internal.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/http/1.0.0/src/Http/Progress.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/http/1.0.0/src/Native/Http.js", function(exports, require, module) {
'use strict';

var _elm_lang$http$Native_Http = function () {

	// ENCODING AND DECODING

	function encodeUri(string) {
		return encodeURIComponent(string);
	}

	function decodeUri(string) {
		try {
			return _elm_lang$core$Maybe$Just(decodeURIComponent(string));
		} catch (e) {
			return _elm_lang$core$Maybe$Nothing;
		}
	}

	// SEND REQUEST

	function toTask(request, maybeProgress) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			var xhr = new XMLHttpRequest();

			configureProgress(xhr, maybeProgress);

			xhr.addEventListener('error', function () {
				callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NetworkError' }));
			});
			xhr.addEventListener('timeout', function () {
				callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Timeout' }));
			});
			xhr.addEventListener('load', function () {
				callback(handleResponse(xhr, request.expect.responseToResult));
			});

			try {
				xhr.open(request.method, request.url, true);
			} catch (e) {
				return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'BadUrl', _0: request.url }));
			}

			configureRequest(xhr, request);
			send(xhr, request.body);

			return function () {
				xhr.abort();
			};
		});
	}

	function configureProgress(xhr, maybeProgress) {
		if (maybeProgress.ctor === 'Nothing') {
			return;
		}

		xhr.addEventListener('progress', function (event) {
			if (!event.lengthComputable) {
				return;
			}
			_elm_lang$core$Native_Scheduler.rawSpawn(maybeProgress._0({
				bytes: event.loaded,
				bytesExpected: event.total
			}));
		});
	}

	function configureRequest(xhr, request) {
		function setHeader(pair) {
			xhr.setRequestHeader(pair._0, pair._1);
		}

		A2(_elm_lang$core$List$map, setHeader, request.headers);
		xhr.responseType = request.expect.responseType;
		xhr.withCredentials = request.withCredentials;

		if (request.timeout.ctor === 'Just') {
			xhr.timeout = request.timeout._0;
		}
	}

	function send(xhr, body) {
		switch (body.ctor) {
			case 'EmptyBody':
				xhr.send();
				return;

			case 'StringBody':
				xhr.setRequestHeader('Content-Type', body._0);
				xhr.send(body._1);
				return;

			case 'FormDataBody':
				xhr.send(body._0);
				return;
		}
	}

	// RESPONSES

	function handleResponse(xhr, responseToResult) {
		var response = toResponse(xhr);

		if (xhr.status < 200 || 300 <= xhr.status) {
			response.body = xhr.responseText;
			return _elm_lang$core$Native_Scheduler.fail({
				ctor: 'BadStatus',
				_0: response
			});
		}

		var result = responseToResult(response);

		if (result.ctor === 'Ok') {
			return _elm_lang$core$Native_Scheduler.succeed(result._0);
		} else {
			response.body = xhr.responseText;
			return _elm_lang$core$Native_Scheduler.fail({
				ctor: 'BadPayload',
				_0: result._0,
				_1: response
			});
		}
	}

	function toResponse(xhr) {
		return {
			status: { code: xhr.status, message: xhr.statusText },
			headers: parseHeaders(xhr.getAllResponseHeaders()),
			url: xhr.responseURL,
			body: xhr.response
		};
	}

	function parseHeaders(rawHeaders) {
		var headers = _elm_lang$core$Dict$empty;

		if (!rawHeaders) {
			return headers;
		}

		var headerPairs = rawHeaders.split('\r\n');
		for (var i = headerPairs.length; i--;) {
			var headerPair = headerPairs[i];
			var index = headerPair.indexOf(': ');
			if (index > 0) {
				var key = headerPair.substring(0, index);
				var value = headerPair.substring(index + 2);

				headers = A3(_elm_lang$core$Dict$update, key, function (oldValue) {
					if (oldValue.ctor === 'Just') {
						return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
					}
					return _elm_lang$core$Maybe$Just(value);
				}, headers);
			}
		}

		return headers;
	}

	// EXPECTORS

	function expectStringResponse(responseToResult) {
		return {
			responseType: 'text',
			responseToResult: responseToResult
		};
	}

	function mapExpect(func, expect) {
		return {
			responseType: expect.responseType,
			responseToResult: function responseToResult(response) {
				var convertedResponse = expect.responseToResult(response);
				return A2(_elm_lang$core$Result$map, func, convertedResponse);
			}
		};
	}

	// BODY

	function multipart(parts) {
		var formData = new FormData();

		while (parts.ctor !== '[]') {
			var part = parts._0;
			formData.append(part._0, part._1);
			parts = parts._1;
		}

		return { ctor: 'FormDataBody', _0: formData };
	}

	return {
		toTask: F2(toTask),
		expectStringResponse: expectStringResponse,
		mapExpect: F2(mapExpect),
		multipart: multipart,
		encodeUri: encodeUri,
		decodeUri: decodeUri
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/navigation/2.1.0/examples/Example.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/navigation/2.1.0/src/Native/Navigation.js", function(exports, require, module) {
'use strict';

var _elm_lang$navigation$Native_Navigation = function () {

	// FAKE NAVIGATION

	function go(n) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			if (n !== 0) {
				history.go(n);
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	function pushState(url) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			history.pushState({}, '', url);
			callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
		});
	}

	function replaceState(url) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			history.replaceState({}, '', url);
			callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
		});
	}

	// REAL NAVIGATION

	function reloadPage(skipCache) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			document.location.reload(skipCache);
			callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	function setLocation(url) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			try {
				window.location = url;
			} catch (err) {
				// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
				// Other browsers reload the page, so let's be consistent about that.
				document.location.reload(false);
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	// GET LOCATION

	function getLocation() {
		var location = document.location;

		return {
			href: location.href,
			host: location.host,
			hostname: location.hostname,
			protocol: location.protocol,
			origin: location.origin,
			port_: location.port,
			pathname: location.pathname,
			search: location.search,
			hash: location.hash,
			username: location.username,
			password: location.password
		};
	}

	// DETECT IE11 PROBLEMS

	function isInternetExplorer11() {
		return window.navigator.userAgent.indexOf('Trident') !== -1;
	}

	return {
		go: go,
		setLocation: setLocation,
		reloadPage: reloadPage,
		pushState: pushState,
		replaceState: replaceState,
		getLocation: getLocation,
		isInternetExplorer11: isInternetExplorer11
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/navigation/2.1.0/src/Navigation.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/Native/Debug.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _elm_lang$virtual_dom$Native_Debug = function () {

	// IMPORT / EXPORT

	function unsafeCoerce(value) {
		return value;
	}

	var upload = _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
		var element = document.createElement('input');
		element.setAttribute('type', 'file');
		element.setAttribute('accept', 'text/json');
		element.style.display = 'none';
		element.addEventListener('change', function (event) {
			var fileReader = new FileReader();
			fileReader.onload = function (e) {
				callback(_elm_lang$core$Native_Scheduler.succeed(e.target.result));
			};
			fileReader.readAsText(event.target.files[0]);
			document.body.removeChild(element);
		});
		document.body.appendChild(element);
		element.click();
	});

	function download(historyLength, json) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			var fileName = 'history-' + historyLength + '.txt';
			var jsonString = JSON.stringify(json);
			var mime = 'text/plain;charset=utf-8';
			var done = _elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0);

			// for IE10+
			if (navigator.msSaveBlob) {
				navigator.msSaveBlob(new Blob([jsonString], { type: mime }), fileName);
				return callback(done);
			}

			// for HTML5
			var element = document.createElement('a');
			element.setAttribute('href', 'data:' + mime + ',' + encodeURIComponent(jsonString));
			element.setAttribute('download', fileName);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
			callback(done);
		});
	}

	// POPOUT

	function messageToString(value) {
		switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
			case 'boolean':
				return value ? 'True' : 'False';
			case 'number':
				return value + '';
			case 'string':
				return '"' + addSlashes(value, false) + '"';
		}
		if (value instanceof String) {
			return '\'' + addSlashes(value, true) + '\'';
		}
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || !('ctor' in value)) {
			return '…';
		}

		var ctorStarter = value.ctor.substring(0, 5);
		if (ctorStarter === '_Tupl' || ctorStarter === '_Task') {
			return '…';
		}
		if (['_Array', '<decoder>', '_Process', '::', '[]', 'Set_elm_builtin', 'RBNode_elm_builtin', 'RBEmpty_elm_builtin'].indexOf(value.ctor) >= 0) {
			return '…';
		}

		var keys = Object.keys(value);
		switch (keys.length) {
			case 1:
				return value.ctor;
			case 2:
				return value.ctor + ' ' + messageToString(value._0);
			default:
				return value.ctor + ' … ' + messageToString(value[keys[keys.length - 1]]);
		}
	}

	function primitive(str) {
		return { ctor: 'Primitive', _0: str };
	}

	function init(value) {
		var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

		if (type === 'boolean') {
			return {
				ctor: 'Constructor',
				_0: _elm_lang$core$Maybe$Just(value ? 'True' : 'False'),
				_1: true,
				_2: _elm_lang$core$Native_List.Nil
			};
		}

		if (type === 'number') {
			return primitive(value + '');
		}

		if (type === 'string') {
			return { ctor: 'S', _0: '"' + addSlashes(value, false) + '"' };
		}

		if (value instanceof String) {
			return { ctor: 'S', _0: "'" + addSlashes(value, true) + "'" };
		}

		if (value instanceof Date) {
			return primitive('<' + value.toString() + '>');
		}

		if (value === null) {
			return primitive('XXX');
		}

		if (type === 'object' && 'ctor' in value) {
			var ctor = value.ctor;

			if (ctor === '::' || ctor === '[]') {
				return {
					ctor: 'Sequence',
					_0: { ctor: 'ListSeq' },
					_1: true,
					_2: A2(_elm_lang$core$List$map, init, value)
				};
			}

			if (ctor === 'Set_elm_builtin') {
				return {
					ctor: 'Sequence',
					_0: { ctor: 'SetSeq' },
					_1: true,
					_2: A3(_elm_lang$core$Set$foldr, initCons, _elm_lang$core$Native_List.Nil, value)
				};
			}

			if (ctor === 'RBNode_elm_builtin' || ctor == 'RBEmpty_elm_builtin') {
				return {
					ctor: 'Dictionary',
					_0: true,
					_1: A3(_elm_lang$core$Dict$foldr, initKeyValueCons, _elm_lang$core$Native_List.Nil, value)
				};
			}

			if (ctor === '_Array') {
				return {
					ctor: 'Sequence',
					_0: { ctor: 'ArraySeq' },
					_1: true,
					_2: A3(_elm_lang$core$Array$foldr, initCons, _elm_lang$core$Native_List.Nil, value)
				};
			}

			var ctorStarter = value.ctor.substring(0, 5);
			if (ctorStarter === '_Task') {
				return primitive('<task>');
			}

			if (ctor === '<decoder>') {
				return primitive(ctor);
			}

			if (ctor === '_Process') {
				return primitive('<process>');
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i in value) {
				if (i === 'ctor') continue;
				list = _elm_lang$core$Native_List.Cons(init(value[i]), list);
			}
			return {
				ctor: 'Constructor',
				_0: ctorStarter === '_Tupl' ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(ctor),
				_1: true,
				_2: _elm_lang$core$List$reverse(list)
			};
		}

		if (type === 'object') {
			var dict = _elm_lang$core$Dict$empty;
			for (var i in value) {
				dict = A3(_elm_lang$core$Dict$insert, i, init(value[i]), dict);
			}
			return { ctor: 'Record', _0: true, _1: dict };
		}

		return primitive('XXX');
	}

	var initCons = F2(initConsHelp);

	function initConsHelp(value, list) {
		return _elm_lang$core$Native_List.Cons(init(value), list);
	}

	var initKeyValueCons = F3(initKeyValueConsHelp);

	function initKeyValueConsHelp(key, value, list) {
		return _elm_lang$core$Native_List.Cons(_elm_lang$core$Native_Utils.Tuple2(init(key), init(value)), list);
	}

	function addSlashes(str, isChar) {
		var s = str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
		if (isChar) {
			return s.replace(/\'/g, '\\\'');
		} else {
			return s.replace(/\"/g, '\\"');
		}
	}

	return {
		upload: upload,
		download: F2(download),
		unsafeCoerce: unsafeCoerce,
		messageToString: messageToString,
		init: init
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/Native/VirtualDom.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function () {

	var STYLE_KEY = 'STYLE';
	var EVENT_KEY = 'EVENT';
	var ATTR_KEY = 'ATTR';
	var ATTR_NS_KEY = 'ATTR_NS';

	var localDoc = typeof document !== 'undefined' ? document : {};

	////////////  VIRTUAL DOM NODES  ////////////


	function text(string) {
		return {
			type: 'text',
			text: string
		};
	}

	function node(tag) {
		return F2(function (factList, kidList) {
			return nodeHelp(tag, factList, kidList);
		});
	}

	function nodeHelp(tag, factList, kidList) {
		var organized = organizeFacts(factList);
		var namespace = organized.namespace;
		var facts = organized.facts;

		var children = [];
		var descendantsCount = 0;
		while (kidList.ctor !== '[]') {
			var kid = kidList._0;
			descendantsCount += kid.descendantsCount || 0;
			children.push(kid);
			kidList = kidList._1;
		}
		descendantsCount += children.length;

		return {
			type: 'node',
			tag: tag,
			facts: facts,
			children: children,
			namespace: namespace,
			descendantsCount: descendantsCount
		};
	}

	function keyedNode(tag, factList, kidList) {
		var organized = organizeFacts(factList);
		var namespace = organized.namespace;
		var facts = organized.facts;

		var children = [];
		var descendantsCount = 0;
		while (kidList.ctor !== '[]') {
			var kid = kidList._0;
			descendantsCount += kid._1.descendantsCount || 0;
			children.push(kid);
			kidList = kidList._1;
		}
		descendantsCount += children.length;

		return {
			type: 'keyed-node',
			tag: tag,
			facts: facts,
			children: children,
			namespace: namespace,
			descendantsCount: descendantsCount
		};
	}

	function custom(factList, model, impl) {
		var facts = organizeFacts(factList).facts;

		return {
			type: 'custom',
			facts: facts,
			model: model,
			impl: impl
		};
	}

	function map(tagger, node) {
		return {
			type: 'tagger',
			tagger: tagger,
			node: node,
			descendantsCount: 1 + (node.descendantsCount || 0)
		};
	}

	function thunk(func, args, thunk) {
		return {
			type: 'thunk',
			func: func,
			args: args,
			thunk: thunk,
			node: undefined
		};
	}

	function lazy(fn, a) {
		return thunk(fn, [a], function () {
			return fn(a);
		});
	}

	function lazy2(fn, a, b) {
		return thunk(fn, [a, b], function () {
			return A2(fn, a, b);
		});
	}

	function lazy3(fn, a, b, c) {
		return thunk(fn, [a, b, c], function () {
			return A3(fn, a, b, c);
		});
	}

	// FACTS


	function organizeFacts(factList) {
		var namespace,
		    facts = {};

		while (factList.ctor !== '[]') {
			var entry = factList._0;
			var key = entry.key;

			if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY) {
				var subFacts = facts[key] || {};
				subFacts[entry.realKey] = entry.value;
				facts[key] = subFacts;
			} else if (key === STYLE_KEY) {
				var styles = facts[key] || {};
				var styleList = entry.value;
				while (styleList.ctor !== '[]') {
					var style = styleList._0;
					styles[style._0] = style._1;
					styleList = styleList._1;
				}
				facts[key] = styles;
			} else if (key === 'namespace') {
				namespace = entry.value;
			} else if (key === 'className') {
				var classes = facts[key];
				facts[key] = typeof classes === 'undefined' ? entry.value : classes + ' ' + entry.value;
			} else {
				facts[key] = entry.value;
			}
			factList = factList._1;
		}

		return {
			facts: facts,
			namespace: namespace
		};
	}

	////////////  PROPERTIES AND ATTRIBUTES  ////////////


	function style(value) {
		return {
			key: STYLE_KEY,
			value: value
		};
	}

	function property(key, value) {
		return {
			key: key,
			value: value
		};
	}

	function attribute(key, value) {
		return {
			key: ATTR_KEY,
			realKey: key,
			value: value
		};
	}

	function attributeNS(namespace, key, value) {
		return {
			key: ATTR_NS_KEY,
			realKey: key,
			value: {
				value: value,
				namespace: namespace
			}
		};
	}

	function on(name, options, decoder) {
		return {
			key: EVENT_KEY,
			realKey: name,
			value: {
				options: options,
				decoder: decoder
			}
		};
	}

	function equalEvents(a, b) {
		if (a.options !== b.options) {
			if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault) {
				return false;
			}
		}
		return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
	}

	function mapProperty(func, property) {
		if (property.key !== EVENT_KEY) {
			return property;
		}
		return on(property.realKey, property.value.options, A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder));
	}

	////////////  RENDER  ////////////


	function render(vNode, eventNode) {
		switch (vNode.type) {
			case 'thunk':
				if (!vNode.node) {
					vNode.node = vNode.thunk();
				}
				return render(vNode.node, eventNode);

			case 'tagger':
				var subNode = vNode.node;
				var tagger = vNode.tagger;

				while (subNode.type === 'tagger') {
					(typeof tagger === 'undefined' ? 'undefined' : _typeof(tagger)) !== 'object' ? tagger = [tagger, subNode.tagger] : tagger.push(subNode.tagger);

					subNode = subNode.node;
				}

				var subEventRoot = { tagger: tagger, parent: eventNode };
				var domNode = render(subNode, subEventRoot);
				domNode.elm_event_node_ref = subEventRoot;
				return domNode;

			case 'text':
				return localDoc.createTextNode(vNode.text);

			case 'node':
				var domNode = vNode.namespace ? localDoc.createElementNS(vNode.namespace, vNode.tag) : localDoc.createElement(vNode.tag);

				applyFacts(domNode, eventNode, vNode.facts);

				var children = vNode.children;

				for (var i = 0; i < children.length; i++) {
					domNode.appendChild(render(children[i], eventNode));
				}

				return domNode;

			case 'keyed-node':
				var domNode = vNode.namespace ? localDoc.createElementNS(vNode.namespace, vNode.tag) : localDoc.createElement(vNode.tag);

				applyFacts(domNode, eventNode, vNode.facts);

				var children = vNode.children;

				for (var i = 0; i < children.length; i++) {
					domNode.appendChild(render(children[i]._1, eventNode));
				}

				return domNode;

			case 'custom':
				var domNode = vNode.impl.render(vNode.model);
				applyFacts(domNode, eventNode, vNode.facts);
				return domNode;
		}
	}

	////////////  APPLY FACTS  ////////////


	function applyFacts(domNode, eventNode, facts) {
		for (var key in facts) {
			var value = facts[key];

			switch (key) {
				case STYLE_KEY:
					applyStyles(domNode, value);
					break;

				case EVENT_KEY:
					applyEvents(domNode, eventNode, value);
					break;

				case ATTR_KEY:
					applyAttrs(domNode, value);
					break;

				case ATTR_NS_KEY:
					applyAttrsNS(domNode, value);
					break;

				case 'value':
					if (domNode[key] !== value) {
						domNode[key] = value;
					}
					break;

				default:
					domNode[key] = value;
					break;
			}
		}
	}

	function applyStyles(domNode, styles) {
		var domNodeStyle = domNode.style;

		for (var key in styles) {
			domNodeStyle[key] = styles[key];
		}
	}

	function applyEvents(domNode, eventNode, events) {
		var allHandlers = domNode.elm_handlers || {};

		for (var key in events) {
			var handler = allHandlers[key];
			var value = events[key];

			if (typeof value === 'undefined') {
				domNode.removeEventListener(key, handler);
				allHandlers[key] = undefined;
			} else if (typeof handler === 'undefined') {
				var handler = makeEventHandler(eventNode, value);
				domNode.addEventListener(key, handler);
				allHandlers[key] = handler;
			} else {
				handler.info = value;
			}
		}

		domNode.elm_handlers = allHandlers;
	}

	function makeEventHandler(eventNode, info) {
		function eventHandler(event) {
			var info = eventHandler.info;

			var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

			if (value.ctor === 'Ok') {
				var options = info.options;
				if (options.stopPropagation) {
					event.stopPropagation();
				}
				if (options.preventDefault) {
					event.preventDefault();
				}

				var message = value._0;

				var currentEventNode = eventNode;
				while (currentEventNode) {
					var tagger = currentEventNode.tagger;
					if (typeof tagger === 'function') {
						message = tagger(message);
					} else {
						for (var i = tagger.length; i--;) {
							message = tagger[i](message);
						}
					}
					currentEventNode = currentEventNode.parent;
				}
			}
		};

		eventHandler.info = info;

		return eventHandler;
	}

	function applyAttrs(domNode, attrs) {
		for (var key in attrs) {
			var value = attrs[key];
			if (typeof value === 'undefined') {
				domNode.removeAttribute(key);
			} else {
				domNode.setAttribute(key, value);
			}
		}
	}

	function applyAttrsNS(domNode, nsAttrs) {
		for (var key in nsAttrs) {
			var pair = nsAttrs[key];
			var namespace = pair.namespace;
			var value = pair.value;

			if (typeof value === 'undefined') {
				domNode.removeAttributeNS(namespace, key);
			} else {
				domNode.setAttributeNS(namespace, key, value);
			}
		}
	}

	////////////  DIFF  ////////////


	function diff(a, b) {
		var patches = [];
		diffHelp(a, b, patches, 0);
		return patches;
	}

	function makePatch(type, index, data) {
		return {
			index: index,
			type: type,
			data: data,
			domNode: undefined,
			eventNode: undefined
		};
	}

	function diffHelp(a, b, patches, index) {
		if (a === b) {
			return;
		}

		var aType = a.type;
		var bType = b.type;

		// Bail if you run into different types of nodes. Implies that the
		// structure has changed significantly and it's not worth a diff.
		if (aType !== bType) {
			patches.push(makePatch('p-redraw', index, b));
			return;
		}

		// Now we know that both nodes are the same type.
		switch (bType) {
			case 'thunk':
				var aArgs = a.args;
				var bArgs = b.args;
				var i = aArgs.length;
				var same = a.func === b.func && i === bArgs.length;
				while (same && i--) {
					same = aArgs[i] === bArgs[i];
				}
				if (same) {
					b.node = a.node;
					return;
				}
				b.node = b.thunk();
				var subPatches = [];
				diffHelp(a.node, b.node, subPatches, 0);
				if (subPatches.length > 0) {
					patches.push(makePatch('p-thunk', index, subPatches));
				}
				return;

			case 'tagger':
				// gather nested taggers
				var aTaggers = a.tagger;
				var bTaggers = b.tagger;
				var nesting = false;

				var aSubNode = a.node;
				while (aSubNode.type === 'tagger') {
					nesting = true;

					(typeof aTaggers === 'undefined' ? 'undefined' : _typeof(aTaggers)) !== 'object' ? aTaggers = [aTaggers, aSubNode.tagger] : aTaggers.push(aSubNode.tagger);

					aSubNode = aSubNode.node;
				}

				var bSubNode = b.node;
				while (bSubNode.type === 'tagger') {
					nesting = true;

					(typeof bTaggers === 'undefined' ? 'undefined' : _typeof(bTaggers)) !== 'object' ? bTaggers = [bTaggers, bSubNode.tagger] : bTaggers.push(bSubNode.tagger);

					bSubNode = bSubNode.node;
				}

				// Just bail if different numbers of taggers. This implies the
				// structure of the virtual DOM has changed.
				if (nesting && aTaggers.length !== bTaggers.length) {
					patches.push(makePatch('p-redraw', index, b));
					return;
				}

				// check if taggers are "the same"
				if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers) {
					patches.push(makePatch('p-tagger', index, bTaggers));
				}

				// diff everything below the taggers
				diffHelp(aSubNode, bSubNode, patches, index + 1);
				return;

			case 'text':
				if (a.text !== b.text) {
					patches.push(makePatch('p-text', index, b.text));
					return;
				}

				return;

			case 'node':
				// Bail if obvious indicators have changed. Implies more serious
				// structural changes such that it's not worth it to diff.
				if (a.tag !== b.tag || a.namespace !== b.namespace) {
					patches.push(makePatch('p-redraw', index, b));
					return;
				}

				var factsDiff = diffFacts(a.facts, b.facts);

				if (typeof factsDiff !== 'undefined') {
					patches.push(makePatch('p-facts', index, factsDiff));
				}

				diffChildren(a, b, patches, index);
				return;

			case 'keyed-node':
				// Bail if obvious indicators have changed. Implies more serious
				// structural changes such that it's not worth it to diff.
				if (a.tag !== b.tag || a.namespace !== b.namespace) {
					patches.push(makePatch('p-redraw', index, b));
					return;
				}

				var factsDiff = diffFacts(a.facts, b.facts);

				if (typeof factsDiff !== 'undefined') {
					patches.push(makePatch('p-facts', index, factsDiff));
				}

				diffKeyedChildren(a, b, patches, index);
				return;

			case 'custom':
				if (a.impl !== b.impl) {
					patches.push(makePatch('p-redraw', index, b));
					return;
				}

				var factsDiff = diffFacts(a.facts, b.facts);
				if (typeof factsDiff !== 'undefined') {
					patches.push(makePatch('p-facts', index, factsDiff));
				}

				var patch = b.impl.diff(a, b);
				if (patch) {
					patches.push(makePatch('p-custom', index, patch));
					return;
				}

				return;
		}
	}

	// assumes the incoming arrays are the same length
	function pairwiseRefEqual(as, bs) {
		for (var i = 0; i < as.length; i++) {
			if (as[i] !== bs[i]) {
				return false;
			}
		}

		return true;
	}

	// TODO Instead of creating a new diff object, it's possible to just test if
	// there *is* a diff. During the actual patch, do the diff again and make the
	// modifications directly. This way, there's no new allocations. Worth it?
	function diffFacts(a, b, category) {
		var diff;

		// look for changes and removals
		for (var aKey in a) {
			if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY) {
				var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
				if (subDiff) {
					diff = diff || {};
					diff[aKey] = subDiff;
				}
				continue;
			}

			// remove if not in the new facts
			if (!(aKey in b)) {
				diff = diff || {};
				diff[aKey] = typeof category === 'undefined' ? typeof a[aKey] === 'string' ? '' : null : category === STYLE_KEY ? '' : category === EVENT_KEY || category === ATTR_KEY ? undefined : { namespace: a[aKey].namespace, value: undefined };

				continue;
			}

			var aValue = a[aKey];
			var bValue = b[aKey];

			// reference equal, so don't worry about it
			if (aValue === bValue && aKey !== 'value' || category === EVENT_KEY && equalEvents(aValue, bValue)) {
				continue;
			}

			diff = diff || {};
			diff[aKey] = bValue;
		}

		// add new stuff
		for (var bKey in b) {
			if (!(bKey in a)) {
				diff = diff || {};
				diff[bKey] = b[bKey];
			}
		}

		return diff;
	}

	function diffChildren(aParent, bParent, patches, rootIndex) {
		var aChildren = aParent.children;
		var bChildren = bParent.children;

		var aLen = aChildren.length;
		var bLen = bChildren.length;

		// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

		if (aLen > bLen) {
			patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
		} else if (aLen < bLen) {
			patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
		}

		// PAIRWISE DIFF EVERYTHING ELSE

		var index = rootIndex;
		var minLen = aLen < bLen ? aLen : bLen;
		for (var i = 0; i < minLen; i++) {
			index++;
			var aChild = aChildren[i];
			diffHelp(aChild, bChildren[i], patches, index);
			index += aChild.descendantsCount || 0;
		}
	}

	////////////  KEYED DIFF  ////////////


	function diffKeyedChildren(aParent, bParent, patches, rootIndex) {
		var localPatches = [];

		var changes = {}; // Dict String Entry
		var inserts = []; // Array { index : Int, entry : Entry }
		// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

		var aChildren = aParent.children;
		var bChildren = bParent.children;
		var aLen = aChildren.length;
		var bLen = bChildren.length;
		var aIndex = 0;
		var bIndex = 0;

		var index = rootIndex;

		while (aIndex < aLen && bIndex < bLen) {
			var a = aChildren[aIndex];
			var b = bChildren[bIndex];

			var aKey = a._0;
			var bKey = b._0;
			var aNode = a._1;
			var bNode = b._1;

			// check if keys match

			if (aKey === bKey) {
				index++;
				diffHelp(aNode, bNode, localPatches, index);
				index += aNode.descendantsCount || 0;

				aIndex++;
				bIndex++;
				continue;
			}

			// look ahead 1 to detect insertions and removals.

			var aLookAhead = aIndex + 1 < aLen;
			var bLookAhead = bIndex + 1 < bLen;

			if (aLookAhead) {
				var aNext = aChildren[aIndex + 1];
				var aNextKey = aNext._0;
				var aNextNode = aNext._1;
				var oldMatch = bKey === aNextKey;
			}

			if (bLookAhead) {
				var bNext = bChildren[bIndex + 1];
				var bNextKey = bNext._0;
				var bNextNode = bNext._1;
				var newMatch = aKey === bNextKey;
			}

			// swap a and b
			if (aLookAhead && bLookAhead && newMatch && oldMatch) {
				index++;
				diffHelp(aNode, bNextNode, localPatches, index);
				insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
				index += aNode.descendantsCount || 0;

				index++;
				removeNode(changes, localPatches, aKey, aNextNode, index);
				index += aNextNode.descendantsCount || 0;

				aIndex += 2;
				bIndex += 2;
				continue;
			}

			// insert b
			if (bLookAhead && newMatch) {
				index++;
				insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
				diffHelp(aNode, bNextNode, localPatches, index);
				index += aNode.descendantsCount || 0;

				aIndex += 1;
				bIndex += 2;
				continue;
			}

			// remove a
			if (aLookAhead && oldMatch) {
				index++;
				removeNode(changes, localPatches, aKey, aNode, index);
				index += aNode.descendantsCount || 0;

				index++;
				diffHelp(aNextNode, bNode, localPatches, index);
				index += aNextNode.descendantsCount || 0;

				aIndex += 2;
				bIndex += 1;
				continue;
			}

			// remove a, insert b
			if (aLookAhead && bLookAhead && aNextKey === bNextKey) {
				index++;
				removeNode(changes, localPatches, aKey, aNode, index);
				insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
				index += aNode.descendantsCount || 0;

				index++;
				diffHelp(aNextNode, bNextNode, localPatches, index);
				index += aNextNode.descendantsCount || 0;

				aIndex += 2;
				bIndex += 2;
				continue;
			}

			break;
		}

		// eat up any remaining nodes with removeNode and insertNode

		while (aIndex < aLen) {
			index++;
			var a = aChildren[aIndex];
			var aNode = a._1;
			removeNode(changes, localPatches, a._0, aNode, index);
			index += aNode.descendantsCount || 0;
			aIndex++;
		}

		var endInserts;
		while (bIndex < bLen) {
			endInserts = endInserts || [];
			var b = bChildren[bIndex];
			insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
			bIndex++;
		}

		if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined') {
			patches.push(makePatch('p-reorder', rootIndex, {
				patches: localPatches,
				inserts: inserts,
				endInserts: endInserts
			}));
		}
	}

	////////////  CHANGES FROM KEYED DIFF  ////////////


	var POSTFIX = '_elmW6BL';

	function insertNode(changes, localPatches, key, vnode, bIndex, inserts) {
		var entry = changes[key];

		// never seen this key before
		if (typeof entry === 'undefined') {
			entry = {
				tag: 'insert',
				vnode: vnode,
				index: bIndex,
				data: undefined
			};

			inserts.push({ index: bIndex, entry: entry });
			changes[key] = entry;

			return;
		}

		// this key was removed earlier, a match!
		if (entry.tag === 'remove') {
			inserts.push({ index: bIndex, entry: entry });

			entry.tag = 'move';
			var subPatches = [];
			diffHelp(entry.vnode, vnode, subPatches, entry.index);
			entry.index = bIndex;
			entry.data.data = {
				patches: subPatches,
				entry: entry
			};

			return;
		}

		// this key has already been inserted or moved, a duplicate!
		insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
	}

	function removeNode(changes, localPatches, key, vnode, index) {
		var entry = changes[key];

		// never seen this key before
		if (typeof entry === 'undefined') {
			var patch = makePatch('p-remove', index, undefined);
			localPatches.push(patch);

			changes[key] = {
				tag: 'remove',
				vnode: vnode,
				index: index,
				data: patch
			};

			return;
		}

		// this key was inserted earlier, a match!
		if (entry.tag === 'insert') {
			entry.tag = 'move';
			var subPatches = [];
			diffHelp(vnode, entry.vnode, subPatches, index);

			var patch = makePatch('p-remove', index, {
				patches: subPatches,
				entry: entry
			});
			localPatches.push(patch);

			return;
		}

		// this key has already been removed or moved, a duplicate!
		removeNode(changes, localPatches, key + POSTFIX, vnode, index);
	}

	////////////  ADD DOM NODES  ////////////
	//
	// Each DOM node has an "index" assigned in order of traversal. It is important
	// to minimize our crawl over the actual DOM, so these indexes (along with the
	// descendantsCount of virtual nodes) let us skip touching entire subtrees of
	// the DOM if we know there are no patches there.


	function addDomNodes(domNode, vNode, patches, eventNode) {
		addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
	}

	// assumes `patches` is non-empty and indexes increase monotonically.
	function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode) {
		var patch = patches[i];
		var index = patch.index;

		while (index === low) {
			var patchType = patch.type;

			if (patchType === 'p-thunk') {
				addDomNodes(domNode, vNode.node, patch.data, eventNode);
			} else if (patchType === 'p-reorder') {
				patch.domNode = domNode;
				patch.eventNode = eventNode;

				var subPatches = patch.data.patches;
				if (subPatches.length > 0) {
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			} else if (patchType === 'p-remove') {
				patch.domNode = domNode;
				patch.eventNode = eventNode;

				var data = patch.data;
				if (typeof data !== 'undefined') {
					data.entry.data = domNode;
					var subPatches = data.patches;
					if (subPatches.length > 0) {
						addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
					}
				}
			} else {
				patch.domNode = domNode;
				patch.eventNode = eventNode;
			}

			i++;

			if (!(patch = patches[i]) || (index = patch.index) > high) {
				return i;
			}
		}

		switch (vNode.type) {
			case 'tagger':
				var subNode = vNode.node;

				while (subNode.type === "tagger") {
					subNode = subNode.node;
				}

				return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

			case 'node':
				var vChildren = vNode.children;
				var childNodes = domNode.childNodes;
				for (var j = 0; j < vChildren.length; j++) {
					low++;
					var vChild = vChildren[j];
					var nextLow = low + (vChild.descendantsCount || 0);
					if (low <= index && index <= nextLow) {
						i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
						if (!(patch = patches[i]) || (index = patch.index) > high) {
							return i;
						}
					}
					low = nextLow;
				}
				return i;

			case 'keyed-node':
				var vChildren = vNode.children;
				var childNodes = domNode.childNodes;
				for (var j = 0; j < vChildren.length; j++) {
					low++;
					var vChild = vChildren[j]._1;
					var nextLow = low + (vChild.descendantsCount || 0);
					if (low <= index && index <= nextLow) {
						i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
						if (!(patch = patches[i]) || (index = patch.index) > high) {
							return i;
						}
					}
					low = nextLow;
				}
				return i;

			case 'text':
			case 'thunk':
				throw new Error('should never traverse `text` or `thunk` nodes like this');
		}
	}

	////////////  APPLY PATCHES  ////////////


	function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode) {
		if (patches.length === 0) {
			return rootDomNode;
		}

		addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
		return applyPatchesHelp(rootDomNode, patches);
	}

	function applyPatchesHelp(rootDomNode, patches) {
		for (var i = 0; i < patches.length; i++) {
			var patch = patches[i];
			var localDomNode = patch.domNode;
			var newNode = applyPatch(localDomNode, patch);
			if (localDomNode === rootDomNode) {
				rootDomNode = newNode;
			}
		}
		return rootDomNode;
	}

	function applyPatch(domNode, patch) {
		switch (patch.type) {
			case 'p-redraw':
				return applyPatchRedraw(domNode, patch.data, patch.eventNode);

			case 'p-facts':
				applyFacts(domNode, patch.eventNode, patch.data);
				return domNode;

			case 'p-text':
				domNode.replaceData(0, domNode.length, patch.data);
				return domNode;

			case 'p-thunk':
				return applyPatchesHelp(domNode, patch.data);

			case 'p-tagger':
				if (typeof domNode.elm_event_node_ref !== 'undefined') {
					domNode.elm_event_node_ref.tagger = patch.data;
				} else {
					domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
				}
				return domNode;

			case 'p-remove-last':
				var i = patch.data;
				while (i--) {
					domNode.removeChild(domNode.lastChild);
				}
				return domNode;

			case 'p-append':
				var newNodes = patch.data;
				for (var i = 0; i < newNodes.length; i++) {
					domNode.appendChild(render(newNodes[i], patch.eventNode));
				}
				return domNode;

			case 'p-remove':
				var data = patch.data;
				if (typeof data === 'undefined') {
					domNode.parentNode.removeChild(domNode);
					return domNode;
				}
				var entry = data.entry;
				if (typeof entry.index !== 'undefined') {
					domNode.parentNode.removeChild(domNode);
				}
				entry.data = applyPatchesHelp(domNode, data.patches);
				return domNode;

			case 'p-reorder':
				return applyPatchReorder(domNode, patch);

			case 'p-custom':
				var impl = patch.data;
				return impl.applyPatch(domNode, impl.data);

			default:
				throw new Error('Ran into an unknown patch!');
		}
	}

	function applyPatchRedraw(domNode, vNode, eventNode) {
		var parentNode = domNode.parentNode;
		var newNode = render(vNode, eventNode);

		if (typeof newNode.elm_event_node_ref === 'undefined') {
			newNode.elm_event_node_ref = domNode.elm_event_node_ref;
		}

		if (parentNode && newNode !== domNode) {
			parentNode.replaceChild(newNode, domNode);
		}
		return newNode;
	}

	function applyPatchReorder(domNode, patch) {
		var data = patch.data;

		// remove end inserts
		var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

		// removals
		domNode = applyPatchesHelp(domNode, data.patches);

		// inserts
		var inserts = data.inserts;
		for (var i = 0; i < inserts.length; i++) {
			var insert = inserts[i];
			var entry = insert.entry;
			var node = entry.tag === 'move' ? entry.data : render(entry.vnode, patch.eventNode);
			domNode.insertBefore(node, domNode.childNodes[insert.index]);
		}

		// add end inserts
		if (typeof frag !== 'undefined') {
			domNode.appendChild(frag);
		}

		return domNode;
	}

	function applyPatchReorderEndInsertsHelp(endInserts, patch) {
		if (typeof endInserts === 'undefined') {
			return;
		}

		var frag = localDoc.createDocumentFragment();
		for (var i = 0; i < endInserts.length; i++) {
			var insert = endInserts[i];
			var entry = insert.entry;
			frag.appendChild(entry.tag === 'move' ? entry.data : render(entry.vnode, patch.eventNode));
		}
		return frag;
	}

	// PROGRAMS

	var program = makeProgram(checkNoFlags);
	var programWithFlags = makeProgram(checkYesFlags);

	function makeProgram(flagChecker) {
		return F2(function (debugWrap, impl) {
			return function (flagDecoder) {
				return function (object, moduleName, debugMetadata) {
					var checker = flagChecker(flagDecoder, moduleName);
					if (typeof debugMetadata === 'undefined') {
						normalSetup(impl, object, moduleName, checker);
					} else {
						debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
					}
				};
			};
		});
	}

	function staticProgram(vNode) {
		var nothing = _elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.Tuple0, _elm_lang$core$Platform_Cmd$none);
		return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
			init: nothing,
			view: function view() {
				return vNode;
			},
			update: F2(function () {
				return nothing;
			}),
			subscriptions: function subscriptions() {
				return _elm_lang$core$Platform_Sub$none;
			}
		})();
	}

	// FLAG CHECKERS

	function checkNoFlags(flagDecoder, moduleName) {
		return function (init, flags, domNode) {
			if (typeof flags === 'undefined') {
				return init;
			}

			var errorMessage = 'The `' + moduleName + '` module does not need flags.\n' + 'Initialize it with no arguments and you should be all set!';

			crash(errorMessage, domNode);
		};
	}

	function checkYesFlags(flagDecoder, moduleName) {
		return function (init, flags, domNode) {
			if (typeof flagDecoder === 'undefined') {
				var errorMessage = 'Are you trying to sneak a Never value into Elm? Trickster!\n' + 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n' + 'Use `program` instead if you do not want flags.';

				crash(errorMessage, domNode);
			}

			var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
			if (result.ctor === 'Ok') {
				return init(result._0);
			}

			var errorMessage = 'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n' + 'I tried to convert it to an Elm value, but ran into this problem:\n\n' + result._0;

			crash(errorMessage, domNode);
		};
	}

	function crash(errorMessage, domNode) {
		if (domNode) {
			domNode.innerHTML = '<div style="padding-left:1em;">' + '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>' + '<pre style="padding-left:1em;">' + errorMessage + '</pre>' + '</div>';
		}

		throw new Error(errorMessage);
	}

	//  NORMAL SETUP

	function normalSetup(impl, object, moduleName, flagChecker) {
		object['embed'] = function embed(node, flags) {
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			}

			return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, node), impl.update, impl.subscriptions, normalRenderer(node, impl.view));
		};

		object['fullscreen'] = function fullscreen(flags) {
			return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, document.body), impl.update, impl.subscriptions, normalRenderer(document.body, impl.view));
		};
	}

	function normalRenderer(parentNode, view) {
		return function (tagger, initialModel) {
			var eventNode = { tagger: tagger, parent: undefined };
			var initialVirtualNode = view(initialModel);
			var domNode = render(initialVirtualNode, eventNode);
			parentNode.appendChild(domNode);
			return makeStepper(domNode, view, initialVirtualNode, eventNode);
		};
	}

	// STEPPER

	var rAF = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (callback) {
		setTimeout(callback, 1000 / 60);
	};

	function makeStepper(domNode, view, initialVirtualNode, eventNode) {
		var state = 'NO_REQUEST';
		var currNode = initialVirtualNode;
		var nextModel;

		function updateIfNeeded() {
			switch (state) {
				case 'NO_REQUEST':
					throw new Error('Unexpected draw callback.\n' + 'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.');

				case 'PENDING_REQUEST':
					rAF(updateIfNeeded);
					state = 'EXTRA_REQUEST';

					var nextNode = view(nextModel);
					var patches = diff(currNode, nextNode);
					domNode = applyPatches(domNode, currNode, patches, eventNode);
					currNode = nextNode;

					return;

				case 'EXTRA_REQUEST':
					state = 'NO_REQUEST';
					return;
			}
		}

		return function stepper(model) {
			if (state === 'NO_REQUEST') {
				rAF(updateIfNeeded);
			}
			state = 'PENDING_REQUEST';
			nextModel = model;
		};
	}

	// DEBUG SETUP

	function debugSetup(impl, object, moduleName, flagChecker) {
		object['fullscreen'] = function fullscreen(flags) {
			var popoutRef = { doc: undefined };
			return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, document.body), impl.update(scrollTask(popoutRef)), impl.subscriptions, debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut));
		};

		object['embed'] = function fullscreen(node, flags) {
			var popoutRef = { doc: undefined };
			return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, node), impl.update(scrollTask(popoutRef)), impl.subscriptions, debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut));
		};
	}

	function scrollTask(popoutRef) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			var doc = popoutRef.doc;
			if (doc) {
				var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
				if (msgs) {
					msgs.scrollTop = msgs.scrollHeight;
				}
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
		});
	}

	function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut) {
		return function (tagger, initialModel) {
			var appEventNode = { tagger: tagger, parent: undefined };
			var eventNode = { tagger: tagger, parent: undefined };

			// make normal stepper
			var appVirtualNode = view(initialModel);
			var appNode = render(appVirtualNode, appEventNode);
			parentNode.appendChild(appNode);
			var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

			// make overlay stepper
			var overVirtualNode = viewIn(initialModel)._1;
			var overNode = render(overVirtualNode, eventNode);
			parentNode.appendChild(overNode);
			var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
			var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

			// make debugger stepper
			var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

			return function stepper(model) {
				appStepper(model);
				overStepper(model);
				debugStepper(model);
			};
		};
	}

	function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef) {
		var curr;
		var domNode;

		return function stepper(model) {
			if (!model.isDebuggerOpen) {
				return;
			}

			if (!popoutRef.doc) {
				curr = view(model);
				domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
				return;
			}

			// switch to document of popout
			localDoc = popoutRef.doc;

			var next = view(model);
			var patches = diff(curr, next);
			domNode = applyPatches(domNode, curr, patches, eventNode);
			curr = next;

			// switch back to normal document
			localDoc = document;
		};
	}

	function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode) {
		var w = 900;
		var h = 360;
		var x = screen.width - w;
		var y = screen.height - h;
		var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

		// switch to window document
		localDoc = debugWindow.document;

		popoutRef.doc = localDoc;
		localDoc.title = 'Debugger - ' + moduleName;
		localDoc.body.style.margin = '0';
		localDoc.body.style.padding = '0';
		var domNode = render(virtualNode, eventNode);
		localDoc.body.appendChild(domNode);

		localDoc.addEventListener('keydown', function (event) {
			if (event.metaKey && event.which === 82) {
				window.location.reload();
			}
			if (event.which === 38) {
				eventNode.tagger({ ctor: 'Up' });
				event.preventDefault();
			}
			if (event.which === 40) {
				eventNode.tagger({ ctor: 'Down' });
				event.preventDefault();
			}
		});

		function close() {
			popoutRef.doc = undefined;
			debugWindow.close();
		}
		window.addEventListener('unload', close);
		debugWindow.addEventListener('unload', function () {
			popoutRef.doc = undefined;
			window.removeEventListener('unload', close);
			eventNode.tagger({ ctor: 'Close' });
		});

		// switch back to the normal document
		localDoc = document;

		return domNode;
	}

	// BLOCK EVENTS

	function wrapViewIn(appEventNode, overlayNode, viewIn) {
		var ignorer = makeIgnorer(overlayNode);
		var blocking = 'Normal';
		var overflow;

		var normalTagger = appEventNode.tagger;
		var blockTagger = function blockTagger() {};

		return function (model) {
			var tuple = viewIn(model);
			var newBlocking = tuple._0.ctor;
			appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
			if (blocking !== newBlocking) {
				traverse('removeEventListener', ignorer, blocking);
				traverse('addEventListener', ignorer, newBlocking);

				if (blocking === 'Normal') {
					overflow = document.body.style.overflow;
					document.body.style.overflow = 'hidden';
				}

				if (newBlocking === 'Normal') {
					document.body.style.overflow = overflow;
				}

				blocking = newBlocking;
			}
			return tuple._1;
		};
	}

	function traverse(verbEventListener, ignorer, blocking) {
		switch (blocking) {
			case 'Normal':
				return;

			case 'Pause':
				return traverseHelp(verbEventListener, ignorer, mostEvents);

			case 'Message':
				return traverseHelp(verbEventListener, ignorer, allEvents);
		}
	}

	function traverseHelp(verbEventListener, handler, eventNames) {
		for (var i = 0; i < eventNames.length; i++) {
			document.body[verbEventListener](eventNames[i], handler, true);
		}
	}

	function makeIgnorer(overlayNode) {
		return function (event) {
			if (event.type === 'keydown' && event.metaKey && event.which === 82) {
				return;
			}

			var isScroll = event.type === 'scroll' || event.type === 'wheel';

			var node = event.target;
			while (node !== null) {
				if (node.className === 'elm-overlay-message-details' && isScroll) {
					return;
				}

				if (node === overlayNode && !isScroll) {
					return;
				}
				node = node.parentNode;
			}

			event.stopPropagation();
			event.preventDefault();
		};
	}

	var mostEvents = ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave', 'touchstart', 'touchend', 'touchcancel', 'touchmove', 'pointerdown', 'pointerup', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'pointermove', 'pointercancel', 'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop', 'keyup', 'keydown', 'keypress', 'input', 'change', 'focus', 'blur'];

	var allEvents = mostEvents.concat('wheel', 'scroll');

	return {
		node: node,
		text: text,
		custom: custom,
		map: F2(map),

		on: F3(on),
		style: style,
		property: F2(property),
		attribute: F2(attribute),
		attributeNS: F3(attributeNS),
		mapProperty: F2(mapProperty),

		lazy: F2(lazy),
		lazy2: F3(lazy2),
		lazy3: F4(lazy3),
		keyedNode: F3(keyedNode),

		program: program,
		programWithFlags: programWithFlags,
		staticProgram: staticProgram
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/Debug.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/Expando.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/Helpers.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/History.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/Metadata.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/Overlay.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/src/VirtualDom/Report.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/tests/Native/TestHelpers.js", function(exports, require, module) {
"use strict";

Elm.Native.TestHelpers = {};
Elm.Native.TestHelpers.make = function (localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.TestHelpers = localRuntime.Native.TestHelpers || {};
	if (localRuntime.Native.TestHelpers.values) {
		return localRuntime.Native.TestHelpers.values;
	}

	var VirtualDom = Elm.Native.VirtualDom.make(localRuntime);

	function unsafeRecordCallCount(f) {
		function wrapper(a) {
			wrapper.__elm_test_call_count += 1;
			return f(a);
		}
		wrapper.__elm_test_call_count = 0;
		return wrapper;
	}

	function unsafeQueryCallCount(f) {
		if (f.__elm_test_call_count === undefined) {
			return -1;
		}
		return f.__elm_test_call_count;
	}

	Elm.Native.TestHelpers.values = {
		unsafeRecordCallCount: unsafeRecordCallCount,
		unsafeQueryCallCount: unsafeQueryCallCount,
		updateAndReplace: F3(VirtualDom.updateAndReplace)
	};
	return localRuntime.Native.TestHelpers.values = Elm.Native.TestHelpers.values;
};
});

require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/tests/TestCases/Lazy.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/tests/TestHelpers.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/virtual-dom/2.0.4/tests/TestMain.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/websocket/1.0.2/src/Native/WebSocket.js", function(exports, require, module) {
'use strict';

var _elm_lang$websocket$Native_WebSocket = function () {

	function open(url, settings) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			try {
				var socket = new WebSocket(url);
				socket.elm_web_socket = true;
			} catch (err) {
				return callback(_elm_lang$core$Native_Scheduler.fail({
					ctor: err.name === 'SecurityError' ? 'BadSecurity' : 'BadArgs',
					_0: err.message
				}));
			}

			socket.addEventListener("open", function (event) {
				callback(_elm_lang$core$Native_Scheduler.succeed(socket));
			});

			socket.addEventListener("message", function (event) {
				_elm_lang$core$Native_Scheduler.rawSpawn(A2(settings.onMessage, socket, event.data));
			});

			socket.addEventListener("close", function (event) {
				_elm_lang$core$Native_Scheduler.rawSpawn(settings.onClose({
					code: event.code,
					reason: event.reason,
					wasClean: event.wasClean
				}));
			});

			return function () {
				if (socket && socket.close) {
					socket.close();
				}
			};
		});
	}

	function send(socket, string) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			var result = socket.readyState === WebSocket.OPEN ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just({ ctor: 'NotOpen' });

			try {
				socket.send(string);
			} catch (err) {
				result = _elm_lang$core$Maybe$Just({ ctor: 'BadString' });
			}

			callback(_elm_lang$core$Native_Scheduler.succeed(result));
		});
	}

	function close(code, reason, socket) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			try {
				socket.close(code, reason);
			} catch (err) {
				return callback(_elm_lang$core$Native_Scheduler.fail(_elm_lang$core$Maybe$Just({
					ctor: err.name === 'SyntaxError' ? 'BadReason' : 'BadCode'
				})));
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Maybe$Nothing));
		});
	}

	function bytesQueued(socket) {
		return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			callback(_elm_lang$core$Native_Scheduler.succeed(socket.bufferedAmount));
		});
	}

	return {
		open: F2(open),
		send: F2(send),
		close: F3(close),
		bytesQueued: bytesQueued
	};
}();
});

require.register("web/elm/elm-stuff/packages/elm-lang/websocket/1.0.2/src/WebSocket.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/elm-lang/websocket/1.0.2/src/WebSocket/LowLevel.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/evancz/elm-markdown/3.0.2/src/Markdown.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/evancz/elm-markdown/3.0.2/src/Native/Markdown.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _evancz$elm_markdown$Native_Markdown = function () {

	// VIRTUAL-DOM WIDGETS

	function toHtml(options, factList, rawMarkdown) {
		var model = {
			options: options,
			markdown: rawMarkdown
		};
		return _elm_lang$virtual_dom$Native_VirtualDom.custom(factList, model, implementation);
	}

	// WIDGET IMPLEMENTATION

	var implementation = {
		render: render,
		diff: diff
	};

	function render(model) {
		var html = marked(model.markdown, formatOptions(model.options));
		var div = document.createElement('div');
		div.innerHTML = html;
		return div;
	}

	function diff(a, b) {

		if (a.model.markdown === b.model.markdown && a.model.options === b.model.options) {
			return null;
		}

		return {
			applyPatch: applyPatch,
			data: marked(b.model.markdown, formatOptions(b.model.options))
		};
	}

	function applyPatch(domNode, data) {
		domNode.innerHTML = data;
		return domNode;
	}

	// ACTUAL MARKDOWN PARSER

	var marked = function () {
		// catch the `marked` object regardless of the outer environment.
		// (ex. a CommonJS module compatible environment.)
		// note that this depends on marked's implementation of environment detection.
		var module = {};
		var exports = module.exports = {};

		/**
   * marked - a markdown parser
   * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
   * https://github.com/chjj/marked
   * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
   */
		(function () {
			var block = { newline: /^\n+/, code: /^( {4}[^\n]+\n*)+/, fences: noop, hr: /^( *[-*_]){3,} *(?:\n+|$)/, heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/, nptable: noop, lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/, blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/, list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/, html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/, def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/, table: noop, paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/, text: /^[^\n]+/ };block.bullet = /(?:[*+-]|\d+\.)/;block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item = replace(block.item, "gm")(/bull/g, block.bullet)();block.list = replace(block.list)(/bull/g, block.bullet)("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def", "\\n+(?=" + block.def.source + ")")();block.blockquote = replace(block.blockquote)("def", block.def)();block._tag = "(?!(?:" + "a|em|strong|small|s|cite|q|dfn|abbr|data|time|code" + "|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo" + "|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html = replace(block.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();block.paragraph = replace(block.paragraph)("hr", block.hr)("heading", block.heading)("lheading", block.lheading)("blockquote", block.blockquote)("tag", "<" + block._tag)("def", block.def)();block.normal = merge({}, block);block.gfm = merge({}, block.normal, { fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/, paragraph: /^/, heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/ });block.gfm.paragraph = replace(block.paragraph)("(?!", "(?!" + block.gfm.fences.source.replace("\\1", "\\2") + "|" + block.list.source.replace("\\1", "\\3") + "|")();block.tables = merge({}, block.gfm, { nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/, table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/ });function Lexer(options) {
				this.tokens = [];this.tokens.links = {};this.options = options || marked.defaults;this.rules = block.normal;if (this.options.gfm) {
					if (this.options.tables) {
						this.rules = block.tables;
					} else {
						this.rules = block.gfm;
					}
				}
			}Lexer.rules = block;Lexer.lex = function (src, options) {
				var lexer = new Lexer(options);return lexer.lex(src);
			};Lexer.prototype.lex = function (src) {
				src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n");return this.token(src, true);
			};Lexer.prototype.token = function (src, top, bq) {
				var src = src.replace(/^ +$/gm, ""),
				    next,
				    loose,
				    cap,
				    bull,
				    b,
				    item,
				    space,
				    i,
				    l;while (src) {
					if (cap = this.rules.newline.exec(src)) {
						src = src.substring(cap[0].length);if (cap[0].length > 1) {
							this.tokens.push({ type: "space" });
						}
					}if (cap = this.rules.code.exec(src)) {
						src = src.substring(cap[0].length);cap = cap[0].replace(/^ {4}/gm, "");this.tokens.push({ type: "code", text: !this.options.pedantic ? cap.replace(/\n+$/, "") : cap });continue;
					}if (cap = this.rules.fences.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "code", lang: cap[2], text: cap[3] || "" });continue;
					}if (cap = this.rules.heading.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "heading", depth: cap[1].length, text: cap[2] });continue;
					}if (top && (cap = this.rules.nptable.exec(src))) {
						src = src.substring(cap[0].length);item = { type: "table", header: cap[1].replace(/^ *| *\| *$/g, "").split(/ *\| */), align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */), cells: cap[3].replace(/\n$/, "").split("\n") };for (i = 0; i < item.align.length; i++) {
							if (/^ *-+: *$/.test(item.align[i])) {
								item.align[i] = "right";
							} else if (/^ *:-+: *$/.test(item.align[i])) {
								item.align[i] = "center";
							} else if (/^ *:-+ *$/.test(item.align[i])) {
								item.align[i] = "left";
							} else {
								item.align[i] = null;
							}
						}for (i = 0; i < item.cells.length; i++) {
							item.cells[i] = item.cells[i].split(/ *\| */);
						}this.tokens.push(item);continue;
					}if (cap = this.rules.lheading.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "heading", depth: cap[2] === "=" ? 1 : 2, text: cap[1] });continue;
					}if (cap = this.rules.hr.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "hr" });continue;
					}if (cap = this.rules.blockquote.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "blockquote_start" });cap = cap[0].replace(/^ *> ?/gm, "");this.token(cap, top, true);this.tokens.push({ type: "blockquote_end" });continue;
					}if (cap = this.rules.list.exec(src)) {
						src = src.substring(cap[0].length);bull = cap[2];this.tokens.push({ type: "list_start", ordered: bull.length > 1 });cap = cap[0].match(this.rules.item);next = false;l = cap.length;i = 0;for (; i < l; i++) {
							item = cap[i];space = item.length;item = item.replace(/^ *([*+-]|\d+\.) +/, "");if (~item.indexOf("\n ")) {
								space -= item.length;item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
							}if (this.options.smartLists && i !== l - 1) {
								b = block.bullet.exec(cap[i + 1])[0];if (bull !== b && !(bull.length > 1 && b.length > 1)) {
									src = cap.slice(i + 1).join("\n") + src;i = l - 1;
								}
							}loose = next || /\n\n(?!\s*$)/.test(item);if (i !== l - 1) {
								next = item.charAt(item.length - 1) === "\n";if (!loose) loose = next;
							}this.tokens.push({ type: loose ? "loose_item_start" : "list_item_start" });this.token(item, false, bq);this.tokens.push({ type: "list_item_end" });
						}this.tokens.push({ type: "list_end" });continue;
					}if (cap = this.rules.html.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: this.options.sanitize ? "paragraph" : "html", pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"), text: cap[0] });continue;
					}if (!bq && top && (cap = this.rules.def.exec(src))) {
						src = src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()] = { href: cap[2], title: cap[3] };continue;
					}if (top && (cap = this.rules.table.exec(src))) {
						src = src.substring(cap[0].length);item = { type: "table", header: cap[1].replace(/^ *| *\| *$/g, "").split(/ *\| */), align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */), cells: cap[3].replace(/(?: *\| *)?\n$/, "").split("\n") };for (i = 0; i < item.align.length; i++) {
							if (/^ *-+: *$/.test(item.align[i])) {
								item.align[i] = "right";
							} else if (/^ *:-+: *$/.test(item.align[i])) {
								item.align[i] = "center";
							} else if (/^ *:-+ *$/.test(item.align[i])) {
								item.align[i] = "left";
							} else {
								item.align[i] = null;
							}
						}for (i = 0; i < item.cells.length; i++) {
							item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
						}this.tokens.push(item);continue;
					}if (top && (cap = this.rules.paragraph.exec(src))) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "paragraph", text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1] });continue;
					}if (cap = this.rules.text.exec(src)) {
						src = src.substring(cap[0].length);this.tokens.push({ type: "text", text: cap[0] });continue;
					}if (src) {
						throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
					}
				}return this.tokens;
			};var inline = { escape: /^\\([\\`*{}\[\]()#+\-.!_>])/, autolink: /^<([^ >]+(@|:\/)[^ >]+)>/, url: noop, tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/, link: /^!?\[(inside)\]\(href\)/, reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/, nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/, strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/, em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/, code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/, br: /^ {2,}\n(?!\s*$)/, del: noop, text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/ };inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link = replace(inline.link)("inside", inline._inside)("href", inline._href)();inline.reflink = replace(inline.reflink)("inside", inline._inside)();inline.normal = merge({}, inline);inline.pedantic = merge({}, inline.normal, { strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/, em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/ });inline.gfm = merge({}, inline.normal, { escape: replace(inline.escape)("])", "~|])")(), url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/, del: /^~~(?=\S)([\s\S]*?\S)~~/, text: replace(inline.text)("]|", "~]|")("|", "|https?://|")() });inline.breaks = merge({}, inline.gfm, { br: replace(inline.br)("{2,}", "*")(), text: replace(inline.gfm.text)("{2,}", "*")() });function InlineLexer(links, options) {
				this.options = options || marked.defaults;this.links = links;this.rules = inline.normal;this.renderer = this.options.renderer || new Renderer();this.renderer.options = this.options;if (!this.links) {
					throw new Error("Tokens array requires a `links` property.");
				}if (this.options.gfm) {
					if (this.options.breaks) {
						this.rules = inline.breaks;
					} else {
						this.rules = inline.gfm;
					}
				} else if (this.options.pedantic) {
					this.rules = inline.pedantic;
				}
			}InlineLexer.rules = inline;InlineLexer.output = function (src, links, options) {
				var inline = new InlineLexer(links, options);return inline.output(src);
			};InlineLexer.prototype.output = function (src) {
				var out = "",
				    link,
				    text,
				    href,
				    cap;while (src) {
					if (cap = this.rules.escape.exec(src)) {
						src = src.substring(cap[0].length);out += cap[1];continue;
					}if (cap = this.rules.autolink.exec(src)) {
						src = src.substring(cap[0].length);if (cap[2] === "@") {
							text = cap[1].charAt(6) === ":" ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);href = this.mangle("mailto:") + text;
						} else {
							text = escape(cap[1]);href = text;
						}out += this.renderer.link(href, null, text);continue;
					}if (!this.inLink && (cap = this.rules.url.exec(src))) {
						src = src.substring(cap[0].length);text = escape(cap[1]);href = text;out += this.renderer.link(href, null, text);continue;
					}if (cap = this.rules.tag.exec(src)) {
						if (!this.inLink && /^<a /i.test(cap[0])) {
							this.inLink = true;
						} else if (this.inLink && /^<\/a>/i.test(cap[0])) {
							this.inLink = false;
						}src = src.substring(cap[0].length);out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];continue;
					}if (cap = this.rules.link.exec(src)) {
						src = src.substring(cap[0].length);this.inLink = true;out += this.outputLink(cap, { href: cap[2], title: cap[3] });this.inLink = false;continue;
					}if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
						src = src.substring(cap[0].length);link = (cap[2] || cap[1]).replace(/\s+/g, " ");link = this.links[link.toLowerCase()];if (!link || !link.href) {
							out += cap[0].charAt(0);src = cap[0].substring(1) + src;continue;
						}this.inLink = true;out += this.outputLink(cap, link);this.inLink = false;continue;
					}if (cap = this.rules.strong.exec(src)) {
						src = src.substring(cap[0].length);out += this.renderer.strong(this.output(cap[2] || cap[1]));continue;
					}if (cap = this.rules.em.exec(src)) {
						src = src.substring(cap[0].length);out += this.renderer.em(this.output(cap[2] || cap[1]));continue;
					}if (cap = this.rules.code.exec(src)) {
						src = src.substring(cap[0].length);out += this.renderer.codespan(escape(cap[2], true));continue;
					}if (cap = this.rules.br.exec(src)) {
						src = src.substring(cap[0].length);out += this.renderer.br();continue;
					}if (cap = this.rules.del.exec(src)) {
						src = src.substring(cap[0].length);out += this.renderer.del(this.output(cap[1]));continue;
					}if (cap = this.rules.text.exec(src)) {
						src = src.substring(cap[0].length);out += this.renderer.text(escape(this.smartypants(cap[0])));continue;
					}if (src) {
						throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
					}
				}return out;
			};InlineLexer.prototype.outputLink = function (cap, link) {
				var href = escape(link.href),
				    title = link.title ? escape(link.title) : null;return cap[0].charAt(0) !== "!" ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
			};InlineLexer.prototype.smartypants = function (text) {
				if (!this.options.smartypants) return text;return text.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014\/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
			};InlineLexer.prototype.mangle = function (text) {
				if (!this.options.mangle) return text;var out = "",
				    l = text.length,
				    i = 0,
				    ch;for (; i < l; i++) {
					ch = text.charCodeAt(i);if (Math.random() > .5) {
						ch = "x" + ch.toString(16);
					}out += "&#" + ch + ";";
				}return out;
			};function Renderer(options) {
				this.options = options || {};
			}Renderer.prototype.code = function (code, lang, escaped) {
				if (this.options.highlight) {
					var out = this.options.highlight(code, lang);if (out != null && out !== code) {
						escaped = true;code = out;
					}
				}if (!lang) {
					return "<pre><code>" + (escaped ? code : escape(code, true)) + "\n</code></pre>";
				}return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "\n</code></pre>\n";
			};Renderer.prototype.blockquote = function (quote) {
				return "<blockquote>\n" + quote + "</blockquote>\n";
			};Renderer.prototype.html = function (html) {
				return html;
			};Renderer.prototype.heading = function (text, level, raw) {
				return "<h" + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, "-") + '">' + text + "</h" + level + ">\n";
			};Renderer.prototype.hr = function () {
				return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
			};Renderer.prototype.list = function (body, ordered) {
				var type = ordered ? "ol" : "ul";return "<" + type + ">\n" + body + "</" + type + ">\n";
			};Renderer.prototype.listitem = function (text) {
				return "<li>" + text + "</li>\n";
			};Renderer.prototype.paragraph = function (text) {
				return "<p>" + text + "</p>\n";
			};Renderer.prototype.table = function (header, body) {
				return "<table>\n" + "<thead>\n" + header + "</thead>\n" + "<tbody>\n" + body + "</tbody>\n" + "</table>\n";
			};Renderer.prototype.tablerow = function (content) {
				return "<tr>\n" + content + "</tr>\n";
			};Renderer.prototype.tablecell = function (content, flags) {
				var type = flags.header ? "th" : "td";var tag = flags.align ? "<" + type + ' style="text-align:' + flags.align + '">' : "<" + type + ">";return tag + content + "</" + type + ">\n";
			};Renderer.prototype.strong = function (text) {
				return "<strong>" + text + "</strong>";
			};Renderer.prototype.em = function (text) {
				return "<em>" + text + "</em>";
			};Renderer.prototype.codespan = function (text) {
				return "<code>" + text + "</code>";
			};Renderer.prototype.br = function () {
				return this.options.xhtml ? "<br/>" : "<br>";
			};Renderer.prototype.del = function (text) {
				return "<del>" + text + "</del>";
			};Renderer.prototype.link = function (href, title, text) {
				if (this.options.sanitize) {
					try {
						var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, "").toLowerCase();
					} catch (e) {
						return "";
					}if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
						return "";
					}
				}var out = '<a href="' + href + '"';if (title) {
					out += ' title="' + title + '"';
				}out += ">" + text + "</a>";return out;
			};Renderer.prototype.image = function (href, title, text) {
				var out = '<img src="' + href + '" alt="' + text + '"';if (title) {
					out += ' title="' + title + '"';
				}out += this.options.xhtml ? "/>" : ">";return out;
			};Renderer.prototype.text = function (text) {
				return text;
			};function Parser(options) {
				this.tokens = [];this.token = null;this.options = options || marked.defaults;this.options.renderer = this.options.renderer || new Renderer();this.renderer = this.options.renderer;this.renderer.options = this.options;
			}Parser.parse = function (src, options, renderer) {
				var parser = new Parser(options, renderer);return parser.parse(src);
			};Parser.prototype.parse = function (src) {
				this.inline = new InlineLexer(src.links, this.options, this.renderer);this.tokens = src.reverse();var out = "";while (this.next()) {
					out += this.tok();
				}return out;
			};Parser.prototype.next = function () {
				return this.token = this.tokens.pop();
			};Parser.prototype.peek = function () {
				return this.tokens[this.tokens.length - 1] || 0;
			};Parser.prototype.parseText = function () {
				var body = this.token.text;while (this.peek().type === "text") {
					body += "\n" + this.next().text;
				}return this.inline.output(body);
			};Parser.prototype.tok = function () {
				switch (this.token.type) {case "space":
						{
							return "";
						}case "hr":
						{
							return this.renderer.hr();
						}case "heading":
						{
							return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
						}case "code":
						{
							return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
						}case "table":
						{
							var header = "",
							    body = "",
							    i,
							    row,
							    cell,
							    flags,
							    j;cell = "";for (i = 0; i < this.token.header.length; i++) {
								flags = { header: true, align: this.token.align[i] };cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
							}header += this.renderer.tablerow(cell);for (i = 0; i < this.token.cells.length; i++) {
								row = this.token.cells[i];cell = "";for (j = 0; j < row.length; j++) {
									cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
								}body += this.renderer.tablerow(cell);
							}return this.renderer.table(header, body);
						}case "blockquote_start":
						{
							var body = "";while (this.next().type !== "blockquote_end") {
								body += this.tok();
							}return this.renderer.blockquote(body);
						}case "list_start":
						{
							var body = "",
							    ordered = this.token.ordered;while (this.next().type !== "list_end") {
								body += this.tok();
							}return this.renderer.list(body, ordered);
						}case "list_item_start":
						{
							var body = "";while (this.next().type !== "list_item_end") {
								body += this.token.type === "text" ? this.parseText() : this.tok();
							}return this.renderer.listitem(body);
						}case "loose_item_start":
						{
							var body = "";while (this.next().type !== "list_item_end") {
								body += this.tok();
							}return this.renderer.listitem(body);
						}case "html":
						{
							var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;return this.renderer.html(html);
						}case "paragraph":
						{
							return this.renderer.paragraph(this.inline.output(this.token.text));
						}case "text":
						{
							return this.renderer.paragraph(this.parseText());
						}}
			};function escape(html, encode) {
				return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
			}function unescape(html) {
				return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function (_, n) {
					n = n.toLowerCase();if (n === "colon") return ":";if (n.charAt(0) === "#") {
						return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
					}return "";
				});
			}function replace(regex, opt) {
				regex = regex.source;opt = opt || "";return function self(name, val) {
					if (!name) return new RegExp(regex, opt);val = val.source || val;val = val.replace(/(^|[^\[])\^/g, "$1");regex = regex.replace(name, val);return self;
				};
			}function noop() {}noop.exec = noop;function merge(obj) {
				var i = 1,
				    target,
				    key;for (; i < arguments.length; i++) {
					target = arguments[i];for (key in target) {
						if (Object.prototype.hasOwnProperty.call(target, key)) {
							obj[key] = target[key];
						}
					}
				}return obj;
			}function marked(src, opt, callback) {
				if (callback || typeof opt === "function") {
					if (!callback) {
						callback = opt;opt = null;
					}opt = merge({}, marked.defaults, opt || {});var highlight = opt.highlight,
					    tokens,
					    pending,
					    i = 0;try {
						tokens = Lexer.lex(src, opt);
					} catch (e) {
						return callback(e);
					}pending = tokens.length;var done = function done(err) {
						if (err) {
							opt.highlight = highlight;return callback(err);
						}var out;try {
							out = Parser.parse(tokens, opt);
						} catch (e) {
							err = e;
						}opt.highlight = highlight;return err ? callback(err) : callback(null, out);
					};if (!highlight || highlight.length < 3) {
						return done();
					}delete opt.highlight;if (!pending) return done();for (; i < tokens.length; i++) {
						(function (token) {
							if (token.type !== "code") {
								return --pending || done();
							}return highlight(token.text, token.lang, function (err, code) {
								if (err) return done(err);if (code == null || code === token.text) {
									return --pending || done();
								}token.text = code;token.escaped = true;--pending || done();
							});
						})(tokens[i]);
					}return;
				}try {
					if (opt) opt = merge({}, marked.defaults, opt);return Parser.parse(Lexer.lex(src, opt), opt);
				} catch (e) {
					e.message += "\nPlease report this to https://github.com/chjj/marked.";if ((opt || marked.defaults).silent) {
						return "<p>An error occured:</p><pre>" + escape(e.message + "", true) + "</pre>";
					}throw e;
				}
			}marked.options = marked.setOptions = function (opt) {
				merge(marked.defaults, opt);return marked;
			};marked.defaults = { gfm: true, tables: true, breaks: false, pedantic: false, sanitize: false, sanitizer: null, mangle: true, smartLists: false, silent: false, highlight: null, langPrefix: "lang-", smartypants: false, headerPrefix: "", renderer: new Renderer(), xhtml: false };marked.Parser = Parser;marked.parser = Parser.parse;marked.Renderer = Renderer;marked.Lexer = Lexer;marked.lexer = Lexer.lex;marked.InlineLexer = InlineLexer;marked.inlineLexer = InlineLexer.output;marked.parse = marked;if (typeof module !== "undefined" && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
				module.exports = marked;
			} else if (typeof define === "function" && define.amd) {
				define(function () {
					return marked;
				});
			} else {
				this.marked = marked;
			}
		}).call(function () {
			return this || (typeof window !== "undefined" ? window : global);
		}());

		return module.exports;
	}();

	// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

	function formatOptions(options) {
		function toHighlight(code, lang) {
			if (!lang && options.defaultHighlighting.ctor === 'Just') {
				lang = options.defaultHighlighting._0;
			}

			if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0) {
				return hljs.highlight(lang, code, true).value;
			}

			return code;
		}

		var gfm = options.githubFlavored;
		if (gfm.ctor === 'Just') {
			return {
				highlight: toHighlight,
				gfm: true,
				tables: gfm._0.tables,
				breaks: gfm._0.breaks,
				sanitize: options.sanitize,
				smartypants: options.smartypants
			};
		}

		return {
			highlight: toHighlight,
			gfm: false,
			tables: false,
			breaks: false,
			sanitize: options.sanitize,
			smartypants: options.smartypants
		};
	}

	// EXPORTS

	return {
		toHtml: F3(toHtml)
	};
}();
});

require.register("web/elm/elm-stuff/packages/evancz/url-parser/2.0.1/examples/Example.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/evancz/url-parser/2.0.1/src/UrlParser.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/examples/Chat.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/examples/Presence.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/src/Phoenix/Channel.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/src/Phoenix/Helpers.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/src/Phoenix/Presence.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/src/Phoenix/Push.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/src/Phoenix/Socket.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/fbonetti/elm-phoenix-socket/2.2.0/tests/Tests.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/identicalsnowflake/elm-dynamic-style/2.0.0/DynamicStyle.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/jinjor/elm-inline-hover/1.0.2/src/InlineHover.elm", function(exports, require, module) {

});

;require.register("web/elm/elm-stuff/packages/jinjor/elm-inline-hover/1.0.2/test/Main.elm", function(exports, require, module) {

});

;require.register("web/static/js/app.js", function(exports, require, module) {
'use strict';

require('phoenix_html');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  const elmDiv = document.querySelector('#main');
//  Elm.Main.embed(elmDiv)
// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
var elmDiv = document.getElementById('elm-app');

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

var app = _main2.default.Main.embed(elmDiv);

app.ports.send.subscribe(play);

var ctx = new (window.webkitAudioContext || window.AudioContext)();

function play(args) {
    var note = args.note;
    var waveType = args.waveType;
    var hz = note.frequency;
    var octave = note.octave / 4;
    var sustain = note.sustain;
    var osc = void 0,
        osc2 = void 0,
        osc3 = void 0,
        osc4 = void 0;
    var gainNode = void 0,
        gainNode2 = void 0;

    // Oscillator 1
    osc = ctx.createOscillator();
    gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.0;
    gainNode.gain.setTargetAtTime(0.25, ctx.currentTime, 0.01);
    gainNode.gain.setTargetAtTime(0.0, ctx.currentTime + sustain, 0.001);
    osc.frequency.value = hz * octave;
    osc.type = waveType;
    osc.start();
    osc.stop(ctx.currentTime + sustain + 0.01);

    // Oscillator 2 (Octave Higher)
    osc2 = ctx.createOscillator();
    gainNode2 = ctx.createGain();
    osc2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    gainNode2.gain.value = 0.0;
    gainNode2.gain.setTargetAtTime(0.15, ctx.currentTime, 0.01);
    gainNode2.gain.setTargetAtTime(0.0, ctx.currentTime + sustain, 0.001);
    osc2.frequency.value = hz * octave * 2;
    osc2.type = waveType;
    osc2.start();
    osc2.stop(ctx.currentTime + sustain + 0.01);
}
});

;require.register("web/static/js/main.js", function(exports, require, module) {

(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		return '<function>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$singleton = function (value) {
	return {
		ctor: '::',
		_0: value,
		_1: {ctor: '[]'}
	};
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _elm_lang$core$Native_List.fromArray(is);
}


function toInt(s)
{
	var len = s.length;

	// if empty
	if (len === 0)
	{
		return intErr(s);
	}

	// if hex
	var c = s[0];
	if (c === '0' && s[1] === 'x')
	{
		for (var i = 2; i < len; ++i)
		{
			var c = s[i];
			if (('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f'))
			{
				continue;
			}
			return intErr(s);
		}
		return _elm_lang$core$Result$Ok(parseInt(s, 16));
	}

	// is decimal
	if (c > '9' || (c < '0' && c !== '-' && c !== '+'))
	{
		return intErr(s);
	}
	for (var i = 1; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return intErr(s);
		}
	}

	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function intErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
}


function toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return floatErr(s);
	}
	var n = +s;
	// faster isNaN check
	return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
}

function floatErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
}


function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(value)
	{
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		currentSend(result._0);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode = _elm_lang$core$Json_Decode$succeed;
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$resolve = _elm_lang$core$Json_Decode$andThen(_elm_lang$core$Basics$identity);
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom = _elm_lang$core$Json_Decode$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded = function (_p0) {
	return _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom(
		_elm_lang$core$Json_Decode$succeed(_p0));
};
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return _elm_lang$core$Json_Decode$oneOf(
				{
					ctor: '::',
					_0: decoder,
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Json_Decode$null(fallback),
						_1: {ctor: '[]'}
					}
				});
		};
		var handleResult = function (input) {
			var _p1 = A2(_elm_lang$core$Json_Decode$decodeValue, pathDecoder, input);
			if (_p1.ctor === 'Ok') {
				var _p2 = A2(
					_elm_lang$core$Json_Decode$decodeValue,
					nullOr(valDecoder),
					_p1._0);
				if (_p2.ctor === 'Ok') {
					return _elm_lang$core$Json_Decode$succeed(_p2._0);
				} else {
					return _elm_lang$core$Json_Decode$fail(_p2._0);
				}
			} else {
				return _elm_lang$core$Json_Decode$succeed(fallback);
			}
		};
		return A2(_elm_lang$core$Json_Decode$andThen, handleResult, _elm_lang$core$Json_Decode$value);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalAt = F4(
	function (path, valDecoder, fallback, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder,
				A2(_elm_lang$core$Json_Decode$at, path, _elm_lang$core$Json_Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder,
				A2(_elm_lang$core$Json_Decode$field, key, _elm_lang$core$Json_Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A2(_elm_lang$core$Json_Decode$at, path, valDecoder),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A2(_elm_lang$core$Json_Decode$field, key, valDecoder),
			decoder);
	});

var _ccapndave$elm_update_extra$Update_Extra_Infix$pipeUpdate = F2(
	function (_p0, update) {
		var _p1 = _p0;
		var _p2 = update(_p1._0);
		var model_ = _p2._0;
		var cmd_ = _p2._1;
		return {
			ctor: '_Tuple2',
			_0: model_,
			_1: _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: _p1._1,
					_1: {
						ctor: '::',
						_0: cmd_,
						_1: {ctor: '[]'}
					}
				})
		};
	});
var _ccapndave$elm_update_extra$Update_Extra_Infix_ops = _ccapndave$elm_update_extra$Update_Extra_Infix_ops || {};
_ccapndave$elm_update_extra$Update_Extra_Infix_ops[':>'] = _ccapndave$elm_update_extra$Update_Extra_Infix$pipeUpdate;

var _elm_lang$core$Set$foldr = F3(
	function (f, b, _p0) {
		var _p1 = _p0;
		return A3(
			_elm_lang$core$Dict$foldr,
			F3(
				function (k, _p2, b) {
					return A2(f, k, b);
				}),
			b,
			_p1._0);
	});
var _elm_lang$core$Set$foldl = F3(
	function (f, b, _p3) {
		var _p4 = _p3;
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, _p5, b) {
					return A2(f, k, b);
				}),
			b,
			_p4._0);
	});
var _elm_lang$core$Set$toList = function (_p6) {
	var _p7 = _p6;
	return _elm_lang$core$Dict$keys(_p7._0);
};
var _elm_lang$core$Set$size = function (_p8) {
	var _p9 = _p8;
	return _elm_lang$core$Dict$size(_p9._0);
};
var _elm_lang$core$Set$member = F2(
	function (k, _p10) {
		var _p11 = _p10;
		return A2(_elm_lang$core$Dict$member, k, _p11._0);
	});
var _elm_lang$core$Set$isEmpty = function (_p12) {
	var _p13 = _p12;
	return _elm_lang$core$Dict$isEmpty(_p13._0);
};
var _elm_lang$core$Set$Set_elm_builtin = function (a) {
	return {ctor: 'Set_elm_builtin', _0: a};
};
var _elm_lang$core$Set$empty = _elm_lang$core$Set$Set_elm_builtin(_elm_lang$core$Dict$empty);
var _elm_lang$core$Set$singleton = function (k) {
	return _elm_lang$core$Set$Set_elm_builtin(
		A2(
			_elm_lang$core$Dict$singleton,
			k,
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Set$insert = F2(
	function (k, _p14) {
		var _p15 = _p14;
		return _elm_lang$core$Set$Set_elm_builtin(
			A3(
				_elm_lang$core$Dict$insert,
				k,
				{ctor: '_Tuple0'},
				_p15._0));
	});
var _elm_lang$core$Set$fromList = function (xs) {
	return A3(_elm_lang$core$List$foldl, _elm_lang$core$Set$insert, _elm_lang$core$Set$empty, xs);
};
var _elm_lang$core$Set$map = F2(
	function (f, s) {
		return _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				f,
				_elm_lang$core$Set$toList(s)));
	});
var _elm_lang$core$Set$remove = F2(
	function (k, _p16) {
		var _p17 = _p16;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$remove, k, _p17._0));
	});
var _elm_lang$core$Set$union = F2(
	function (_p19, _p18) {
		var _p20 = _p19;
		var _p21 = _p18;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$union, _p20._0, _p21._0));
	});
var _elm_lang$core$Set$intersect = F2(
	function (_p23, _p22) {
		var _p24 = _p23;
		var _p25 = _p22;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$intersect, _p24._0, _p25._0));
	});
var _elm_lang$core$Set$diff = F2(
	function (_p27, _p26) {
		var _p28 = _p27;
		var _p29 = _p26;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$diff, _p28._0, _p29._0));
	});
var _elm_lang$core$Set$filter = F2(
	function (p, _p30) {
		var _p31 = _p30;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(
				_elm_lang$core$Dict$filter,
				F2(
					function (k, _p32) {
						return p(k);
					}),
				_p31._0));
	});
var _elm_lang$core$Set$partition = F2(
	function (p, _p33) {
		var _p34 = _p33;
		var _p35 = A2(
			_elm_lang$core$Dict$partition,
			F2(
				function (k, _p36) {
					return p(k);
				}),
			_p34._0);
		var p1 = _p35._0;
		var p2 = _p35._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Set$Set_elm_builtin(p1),
			_1: _elm_lang$core$Set$Set_elm_builtin(p2)
		};
	});

var _elm_community$list_extra$List_Extra$greedyGroupsOfWithStep = F3(
	function (size, step, xs) {
		var okayXs = _elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$List$length(xs),
			0) > 0;
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(size, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, size, xs);
		return (okayArgs && okayXs) ? {
			ctor: '::',
			_0: group,
			_1: A3(_elm_community$list_extra$List_Extra$greedyGroupsOfWithStep, size, step, xs_)
		} : {ctor: '[]'};
	});
var _elm_community$list_extra$List_Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3(_elm_community$list_extra$List_Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var _elm_community$list_extra$List_Extra$groupsOfWithStep = F3(
	function (size, step, xs) {
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(size, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, size, xs);
		var okayLength = _elm_lang$core$Native_Utils.eq(
			size,
			_elm_lang$core$List$length(group));
		return (okayArgs && okayLength) ? {
			ctor: '::',
			_0: group,
			_1: A3(_elm_community$list_extra$List_Extra$groupsOfWithStep, size, step, xs_)
		} : {ctor: '[]'};
	});
var _elm_community$list_extra$List_Extra$groupsOf = F2(
	function (size, xs) {
		return A3(_elm_community$list_extra$List_Extra$groupsOfWithStep, size, size, xs);
	});
var _elm_community$list_extra$List_Extra$zip5 = _elm_lang$core$List$map5(
	F5(
		function (v0, v1, v2, v3, v4) {
			return {ctor: '_Tuple5', _0: v0, _1: v1, _2: v2, _3: v3, _4: v4};
		}));
var _elm_community$list_extra$List_Extra$zip4 = _elm_lang$core$List$map4(
	F4(
		function (v0, v1, v2, v3) {
			return {ctor: '_Tuple4', _0: v0, _1: v1, _2: v2, _3: v3};
		}));
var _elm_community$list_extra$List_Extra$zip3 = _elm_lang$core$List$map3(
	F3(
		function (v0, v1, v2) {
			return {ctor: '_Tuple3', _0: v0, _1: v1, _2: v2};
		}));
var _elm_community$list_extra$List_Extra$zip = _elm_lang$core$List$map2(
	F2(
		function (v0, v1) {
			return {ctor: '_Tuple2', _0: v0, _1: v1};
		}));
var _elm_community$list_extra$List_Extra$isPrefixOf = F2(
	function (prefix, xs) {
		var _p0 = {ctor: '_Tuple2', _0: prefix, _1: xs};
		if (_p0._0.ctor === '[]') {
			return true;
		} else {
			if (_p0._1.ctor === '[]') {
				return false;
			} else {
				return _elm_lang$core$Native_Utils.eq(_p0._0._0, _p0._1._0) && A2(_elm_community$list_extra$List_Extra$isPrefixOf, _p0._0._1, _p0._1._1);
			}
		}
	});
var _elm_community$list_extra$List_Extra$isSuffixOf = F2(
	function (suffix, xs) {
		return A2(
			_elm_community$list_extra$List_Extra$isPrefixOf,
			_elm_lang$core$List$reverse(suffix),
			_elm_lang$core$List$reverse(xs));
	});
var _elm_community$list_extra$List_Extra$selectSplit = function (xs) {
	var _p1 = xs;
	if (_p1.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p5 = _p1._1;
		var _p4 = _p1._0;
		return {
			ctor: '::',
			_0: {
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _p4,
				_2: _p5
			},
			_1: A2(
				_elm_lang$core$List$map,
				function (_p2) {
					var _p3 = _p2;
					return {
						ctor: '_Tuple3',
						_0: {ctor: '::', _0: _p4, _1: _p3._0},
						_1: _p3._1,
						_2: _p3._2
					};
				},
				_elm_community$list_extra$List_Extra$selectSplit(_p5))
		};
	}
};
var _elm_community$list_extra$List_Extra$select = function (xs) {
	var _p6 = xs;
	if (_p6.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p10 = _p6._1;
		var _p9 = _p6._0;
		return {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _p9, _1: _p10},
			_1: A2(
				_elm_lang$core$List$map,
				function (_p7) {
					var _p8 = _p7;
					return {
						ctor: '_Tuple2',
						_0: _p8._0,
						_1: {ctor: '::', _0: _p9, _1: _p8._1}
					};
				},
				_elm_community$list_extra$List_Extra$select(_p10))
		};
	}
};
var _elm_community$list_extra$List_Extra$tailsHelp = F2(
	function (e, list) {
		var _p11 = list;
		if (_p11.ctor === '::') {
			var _p12 = _p11._0;
			return {
				ctor: '::',
				_0: {ctor: '::', _0: e, _1: _p12},
				_1: {ctor: '::', _0: _p12, _1: _p11._1}
			};
		} else {
			return {ctor: '[]'};
		}
	});
var _elm_community$list_extra$List_Extra$tails = A2(
	_elm_lang$core$List$foldr,
	_elm_community$list_extra$List_Extra$tailsHelp,
	{
		ctor: '::',
		_0: {ctor: '[]'},
		_1: {ctor: '[]'}
	});
var _elm_community$list_extra$List_Extra$isInfixOf = F2(
	function (infix, xs) {
		return A2(
			_elm_lang$core$List$any,
			_elm_community$list_extra$List_Extra$isPrefixOf(infix),
			_elm_community$list_extra$List_Extra$tails(xs));
	});
var _elm_community$list_extra$List_Extra$inits = A2(
	_elm_lang$core$List$foldr,
	F2(
		function (e, acc) {
			return {
				ctor: '::',
				_0: {ctor: '[]'},
				_1: A2(
					_elm_lang$core$List$map,
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})(e),
					acc)
			};
		}),
	{
		ctor: '::',
		_0: {ctor: '[]'},
		_1: {ctor: '[]'}
	});
var _elm_community$list_extra$List_Extra$groupWhileTransitively = F2(
	function (cmp, xs_) {
		var _p13 = xs_;
		if (_p13.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p13._1.ctor === '[]') {
				return {
					ctor: '::',
					_0: {
						ctor: '::',
						_0: _p13._0,
						_1: {ctor: '[]'}
					},
					_1: {ctor: '[]'}
				};
			} else {
				var _p15 = _p13._0;
				var _p14 = A2(_elm_community$list_extra$List_Extra$groupWhileTransitively, cmp, _p13._1);
				if (_p14.ctor === '::') {
					return A2(cmp, _p15, _p13._1._0) ? {
						ctor: '::',
						_0: {ctor: '::', _0: _p15, _1: _p14._0},
						_1: _p14._1
					} : {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: _p15,
							_1: {ctor: '[]'}
						},
						_1: _p14
					};
				} else {
					return {ctor: '[]'};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$stripPrefix = F2(
	function (prefix, xs) {
		var step = F2(
			function (e, m) {
				var _p16 = m;
				if (_p16.ctor === 'Nothing') {
					return _elm_lang$core$Maybe$Nothing;
				} else {
					if (_p16._0.ctor === '[]') {
						return _elm_lang$core$Maybe$Nothing;
					} else {
						return _elm_lang$core$Native_Utils.eq(e, _p16._0._0) ? _elm_lang$core$Maybe$Just(_p16._0._1) : _elm_lang$core$Maybe$Nothing;
					}
				}
			});
		return A3(
			_elm_lang$core$List$foldl,
			step,
			_elm_lang$core$Maybe$Just(xs),
			prefix);
	});
var _elm_community$list_extra$List_Extra$dropWhileRight = function (p) {
	return A2(
		_elm_lang$core$List$foldr,
		F2(
			function (x, xs) {
				return (p(x) && _elm_lang$core$List$isEmpty(xs)) ? {ctor: '[]'} : {ctor: '::', _0: x, _1: xs};
			}),
		{ctor: '[]'});
};
var _elm_community$list_extra$List_Extra$takeWhileRight = function (p) {
	var step = F2(
		function (x, _p17) {
			var _p18 = _p17;
			var _p19 = _p18._0;
			return (p(x) && _p18._1) ? {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: x, _1: _p19},
				_1: true
			} : {ctor: '_Tuple2', _0: _p19, _1: false};
		});
	return function (_p20) {
		return _elm_lang$core$Tuple$first(
			A3(
				_elm_lang$core$List$foldr,
				step,
				{
					ctor: '_Tuple2',
					_0: {ctor: '[]'},
					_1: true
				},
				_p20));
	};
};
var _elm_community$list_extra$List_Extra$splitAt = F2(
	function (n, xs) {
		return {
			ctor: '_Tuple2',
			_0: A2(_elm_lang$core$List$take, n, xs),
			_1: A2(_elm_lang$core$List$drop, n, xs)
		};
	});
var _elm_community$list_extra$List_Extra$groupsOfVarying_ = F3(
	function (listOflengths, list, accu) {
		groupsOfVarying_:
		while (true) {
			var _p21 = {ctor: '_Tuple2', _0: listOflengths, _1: list};
			if (((_p21.ctor === '_Tuple2') && (_p21._0.ctor === '::')) && (_p21._1.ctor === '::')) {
				var _p22 = A2(_elm_community$list_extra$List_Extra$splitAt, _p21._0._0, list);
				var head = _p22._0;
				var tail = _p22._1;
				var _v11 = _p21._0._1,
					_v12 = tail,
					_v13 = {ctor: '::', _0: head, _1: accu};
				listOflengths = _v11;
				list = _v12;
				accu = _v13;
				continue groupsOfVarying_;
			} else {
				return _elm_lang$core$List$reverse(accu);
			}
		}
	});
var _elm_community$list_extra$List_Extra$groupsOfVarying = F2(
	function (listOflengths, list) {
		return A3(
			_elm_community$list_extra$List_Extra$groupsOfVarying_,
			listOflengths,
			list,
			{ctor: '[]'});
	});
var _elm_community$list_extra$List_Extra$unfoldr = F2(
	function (f, seed) {
		var _p23 = f(seed);
		if (_p23.ctor === 'Nothing') {
			return {ctor: '[]'};
		} else {
			return {
				ctor: '::',
				_0: _p23._0._0,
				_1: A2(_elm_community$list_extra$List_Extra$unfoldr, f, _p23._0._1)
			};
		}
	});
var _elm_community$list_extra$List_Extra$scanr1 = F2(
	function (f, xs_) {
		var _p24 = xs_;
		if (_p24.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p24._1.ctor === '[]') {
				return {
					ctor: '::',
					_0: _p24._0,
					_1: {ctor: '[]'}
				};
			} else {
				var _p25 = A2(_elm_community$list_extra$List_Extra$scanr1, f, _p24._1);
				if (_p25.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, _p24._0, _p25._0),
						_1: _p25
					};
				} else {
					return {ctor: '[]'};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$scanr = F3(
	function (f, acc, xs_) {
		var _p26 = xs_;
		if (_p26.ctor === '[]') {
			return {
				ctor: '::',
				_0: acc,
				_1: {ctor: '[]'}
			};
		} else {
			var _p27 = A3(_elm_community$list_extra$List_Extra$scanr, f, acc, _p26._1);
			if (_p27.ctor === '::') {
				return {
					ctor: '::',
					_0: A2(f, _p26._0, _p27._0),
					_1: _p27
				};
			} else {
				return {ctor: '[]'};
			}
		}
	});
var _elm_community$list_extra$List_Extra$scanl1 = F2(
	function (f, xs_) {
		var _p28 = xs_;
		if (_p28.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			return A3(_elm_lang$core$List$scanl, f, _p28._0, _p28._1);
		}
	});
var _elm_community$list_extra$List_Extra$indexedFoldr = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _p29) {
				var _p30 = _p29;
				var _p31 = _p30._0;
				return {
					ctor: '_Tuple2',
					_0: _p31 - 1,
					_1: A3(func, _p31, x, _p30._1)
				};
			});
		return _elm_lang$core$Tuple$second(
			A3(
				_elm_lang$core$List$foldr,
				step,
				{
					ctor: '_Tuple2',
					_0: _elm_lang$core$List$length(list) - 1,
					_1: acc
				},
				list));
	});
var _elm_community$list_extra$List_Extra$indexedFoldl = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _p32) {
				var _p33 = _p32;
				var _p34 = _p33._0;
				return {
					ctor: '_Tuple2',
					_0: _p34 + 1,
					_1: A3(func, _p34, x, _p33._1)
				};
			});
		return _elm_lang$core$Tuple$second(
			A3(
				_elm_lang$core$List$foldl,
				step,
				{ctor: '_Tuple2', _0: 0, _1: acc},
				list));
	});
var _elm_community$list_extra$List_Extra$foldr1 = F2(
	function (f, xs) {
		var mf = F2(
			function (x, m) {
				return _elm_lang$core$Maybe$Just(
					function () {
						var _p35 = m;
						if (_p35.ctor === 'Nothing') {
							return x;
						} else {
							return A2(f, x, _p35._0);
						}
					}());
			});
		return A3(_elm_lang$core$List$foldr, mf, _elm_lang$core$Maybe$Nothing, xs);
	});
var _elm_community$list_extra$List_Extra$foldl1 = F2(
	function (f, xs) {
		var mf = F2(
			function (x, m) {
				return _elm_lang$core$Maybe$Just(
					function () {
						var _p36 = m;
						if (_p36.ctor === 'Nothing') {
							return x;
						} else {
							return A2(f, _p36._0, x);
						}
					}());
			});
		return A3(_elm_lang$core$List$foldl, mf, _elm_lang$core$Maybe$Nothing, xs);
	});
var _elm_community$list_extra$List_Extra$interweaveHelp = F3(
	function (l1, l2, acc) {
		interweaveHelp:
		while (true) {
			var _p37 = {ctor: '_Tuple2', _0: l1, _1: l2};
			_v24_1:
			do {
				if (_p37._0.ctor === '::') {
					if (_p37._1.ctor === '::') {
						var _v25 = _p37._0._1,
							_v26 = _p37._1._1,
							_v27 = A2(
							_elm_lang$core$Basics_ops['++'],
							acc,
							{
								ctor: '::',
								_0: _p37._0._0,
								_1: {
									ctor: '::',
									_0: _p37._1._0,
									_1: {ctor: '[]'}
								}
							});
						l1 = _v25;
						l2 = _v26;
						acc = _v27;
						continue interweaveHelp;
					} else {
						break _v24_1;
					}
				} else {
					if (_p37._1.ctor === '[]') {
						break _v24_1;
					} else {
						return A2(_elm_lang$core$Basics_ops['++'], acc, _p37._1);
					}
				}
			} while(false);
			return A2(_elm_lang$core$Basics_ops['++'], acc, _p37._0);
		}
	});
var _elm_community$list_extra$List_Extra$interweave = F2(
	function (l1, l2) {
		return A3(
			_elm_community$list_extra$List_Extra$interweaveHelp,
			l1,
			l2,
			{ctor: '[]'});
	});
var _elm_community$list_extra$List_Extra$permutations = function (xs_) {
	var _p38 = xs_;
	if (_p38.ctor === '[]') {
		return {
			ctor: '::',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		};
	} else {
		var f = function (_p39) {
			var _p40 = _p39;
			return A2(
				_elm_lang$core$List$map,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					})(_p40._0),
				_elm_community$list_extra$List_Extra$permutations(_p40._1));
		};
		return A2(
			_elm_lang$core$List$concatMap,
			f,
			_elm_community$list_extra$List_Extra$select(_p38));
	}
};
var _elm_community$list_extra$List_Extra$isPermutationOf = F2(
	function (permut, xs) {
		return A2(
			_elm_lang$core$List$member,
			permut,
			_elm_community$list_extra$List_Extra$permutations(xs));
	});
var _elm_community$list_extra$List_Extra$subsequencesNonEmpty = function (xs) {
	var _p41 = xs;
	if (_p41.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p42 = _p41._0;
		var f = F2(
			function (ys, r) {
				return {
					ctor: '::',
					_0: ys,
					_1: {
						ctor: '::',
						_0: {ctor: '::', _0: _p42, _1: ys},
						_1: r
					}
				};
			});
		return {
			ctor: '::',
			_0: {
				ctor: '::',
				_0: _p42,
				_1: {ctor: '[]'}
			},
			_1: A3(
				_elm_lang$core$List$foldr,
				f,
				{ctor: '[]'},
				_elm_community$list_extra$List_Extra$subsequencesNonEmpty(_p41._1))
		};
	}
};
var _elm_community$list_extra$List_Extra$subsequences = function (xs) {
	return {
		ctor: '::',
		_0: {ctor: '[]'},
		_1: _elm_community$list_extra$List_Extra$subsequencesNonEmpty(xs)
	};
};
var _elm_community$list_extra$List_Extra$isSubsequenceOf = F2(
	function (subseq, xs) {
		return A2(
			_elm_lang$core$List$member,
			subseq,
			_elm_community$list_extra$List_Extra$subsequences(xs));
	});
var _elm_community$list_extra$List_Extra$transpose = function (ll) {
	transpose:
	while (true) {
		var _p43 = ll;
		if (_p43.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p43._0.ctor === '[]') {
				var _v32 = _p43._1;
				ll = _v32;
				continue transpose;
			} else {
				var _p44 = _p43._1;
				var tails = A2(_elm_lang$core$List$filterMap, _elm_lang$core$List$tail, _p44);
				var heads = A2(_elm_lang$core$List$filterMap, _elm_lang$core$List$head, _p44);
				return {
					ctor: '::',
					_0: {ctor: '::', _0: _p43._0._0, _1: heads},
					_1: _elm_community$list_extra$List_Extra$transpose(
						{ctor: '::', _0: _p43._0._1, _1: tails})
				};
			}
		}
	}
};
var _elm_community$list_extra$List_Extra$intercalate = function (xs) {
	return function (_p45) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$intersperse, xs, _p45));
	};
};
var _elm_community$list_extra$List_Extra$filterNot = F2(
	function (pred, list) {
		return A2(
			_elm_lang$core$List$filter,
			function (_p46) {
				return !pred(_p46);
			},
			list);
	});
var _elm_community$list_extra$List_Extra$removeAt = F2(
	function (index, l) {
		if (_elm_lang$core$Native_Utils.cmp(index, 0) < 0) {
			return l;
		} else {
			var tail = _elm_lang$core$List$tail(
				A2(_elm_lang$core$List$drop, index, l));
			var head = A2(_elm_lang$core$List$take, index, l);
			var _p47 = tail;
			if (_p47.ctor === 'Nothing') {
				return l;
			} else {
				return A2(_elm_lang$core$List$append, head, _p47._0);
			}
		}
	});
var _elm_community$list_extra$List_Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_p49, _p48) {
				var _p50 = _p49;
				var _p51 = _p48;
				var result = A2(pred, _p50._0, _p51._0);
				var _p52 = result;
				if (_p52.ctor === 'EQ') {
					return A2(_elm_lang$core$Basics$compare, _p50._1, _p51._1);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, a) {
					return {ctor: '_Tuple2', _0: a, _1: i};
				}),
			list);
		return A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Tuple$first,
			A2(_elm_lang$core$List$sortWith, predWithIndex, listWithIndex));
	});
var _elm_community$list_extra$List_Extra$setAt = F3(
	function (index, value, l) {
		if (_elm_lang$core$Native_Utils.cmp(index, 0) < 0) {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var tail = _elm_lang$core$List$tail(
				A2(_elm_lang$core$List$drop, index, l));
			var head = A2(_elm_lang$core$List$take, index, l);
			var _p53 = tail;
			if (_p53.ctor === 'Nothing') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				return _elm_lang$core$Maybe$Just(
					A2(
						_elm_lang$core$List$append,
						head,
						{ctor: '::', _0: value, _1: _p53._0}));
			}
		}
	});
var _elm_community$list_extra$List_Extra$remove = F2(
	function (x, xs) {
		var _p54 = xs;
		if (_p54.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p56 = _p54._1;
			var _p55 = _p54._0;
			return _elm_lang$core$Native_Utils.eq(x, _p55) ? _p56 : {
				ctor: '::',
				_0: _p55,
				_1: A2(_elm_community$list_extra$List_Extra$remove, x, _p56)
			};
		}
	});
var _elm_community$list_extra$List_Extra$updateIfIndex = F3(
	function (predicate, update, list) {
		return A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, x) {
					return predicate(i) ? update(x) : x;
				}),
			list);
	});
var _elm_community$list_extra$List_Extra$updateAt = F3(
	function (index, update, list) {
		return ((_elm_lang$core$Native_Utils.cmp(index, 0) < 0) || (_elm_lang$core$Native_Utils.cmp(
			index,
			_elm_lang$core$List$length(list)) > -1)) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
			A3(
				_elm_community$list_extra$List_Extra$updateIfIndex,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(index),
				update,
				list));
	});
var _elm_community$list_extra$List_Extra$updateIf = F3(
	function (predicate, update, list) {
		return A2(
			_elm_lang$core$List$map,
			function (item) {
				return predicate(item) ? update(item) : item;
			},
			list);
	});
var _elm_community$list_extra$List_Extra$replaceIf = F3(
	function (predicate, replacement, list) {
		return A3(
			_elm_community$list_extra$List_Extra$updateIf,
			predicate,
			_elm_lang$core$Basics$always(replacement),
			list);
	});
var _elm_community$list_extra$List_Extra$findIndices = function (p) {
	return function (_p57) {
		return A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Tuple$first,
			A2(
				_elm_lang$core$List$filter,
				function (_p58) {
					var _p59 = _p58;
					return p(_p59._1);
				},
				A2(
					_elm_lang$core$List$indexedMap,
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						}),
					_p57)));
	};
};
var _elm_community$list_extra$List_Extra$findIndex = function (p) {
	return function (_p60) {
		return _elm_lang$core$List$head(
			A2(_elm_community$list_extra$List_Extra$findIndices, p, _p60));
	};
};
var _elm_community$list_extra$List_Extra$splitWhen = F2(
	function (predicate, list) {
		return A2(
			_elm_lang$core$Maybe$map,
			function (i) {
				return A2(_elm_community$list_extra$List_Extra$splitAt, i, list);
			},
			A2(_elm_community$list_extra$List_Extra$findIndex, predicate, list));
	});
var _elm_community$list_extra$List_Extra$elemIndices = function (x) {
	return _elm_community$list_extra$List_Extra$findIndices(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(x));
};
var _elm_community$list_extra$List_Extra$elemIndex = function (x) {
	return _elm_community$list_extra$List_Extra$findIndex(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(x));
};
var _elm_community$list_extra$List_Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			var _p61 = list;
			if (_p61.ctor === '[]') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p62 = _p61._0;
				if (predicate(_p62)) {
					return _elm_lang$core$Maybe$Just(_p62);
				} else {
					var _v41 = predicate,
						_v42 = _p61._1;
					predicate = _v41;
					list = _v42;
					continue find;
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$notMember = function (x) {
	return function (_p63) {
		return !A2(_elm_lang$core$List$member, x, _p63);
	};
};
var _elm_community$list_extra$List_Extra$andThen = _elm_lang$core$List$concatMap;
var _elm_community$list_extra$List_Extra$lift2 = F3(
	function (f, la, lb) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return {
							ctor: '::',
							_0: A2(f, a, b),
							_1: {ctor: '[]'}
						};
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$lift3 = F4(
	function (f, la, lb, lc) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return A2(
							_elm_community$list_extra$List_Extra$andThen,
							function (c) {
								return {
									ctor: '::',
									_0: A3(f, a, b, c),
									_1: {ctor: '[]'}
								};
							},
							lc);
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$lift4 = F5(
	function (f, la, lb, lc, ld) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return A2(
							_elm_community$list_extra$List_Extra$andThen,
							function (c) {
								return A2(
									_elm_community$list_extra$List_Extra$andThen,
									function (d) {
										return {
											ctor: '::',
											_0: A4(f, a, b, c, d),
											_1: {ctor: '[]'}
										};
									},
									ld);
							},
							lc);
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$andMap = F2(
	function (l, fl) {
		return A3(
			_elm_lang$core$List$map2,
			F2(
				function (x, y) {
					return x(y);
				}),
			fl,
			l);
	});
var _elm_community$list_extra$List_Extra$uniqueHelp = F3(
	function (f, existing, remaining) {
		uniqueHelp:
		while (true) {
			var _p64 = remaining;
			if (_p64.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p66 = _p64._1;
				var _p65 = _p64._0;
				var computedFirst = f(_p65);
				if (A2(_elm_lang$core$Set$member, computedFirst, existing)) {
					var _v44 = f,
						_v45 = existing,
						_v46 = _p66;
					f = _v44;
					existing = _v45;
					remaining = _v46;
					continue uniqueHelp;
				} else {
					return {
						ctor: '::',
						_0: _p65,
						_1: A3(
							_elm_community$list_extra$List_Extra$uniqueHelp,
							f,
							A2(_elm_lang$core$Set$insert, computedFirst, existing),
							_p66)
					};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$uniqueBy = F2(
	function (f, list) {
		return A3(_elm_community$list_extra$List_Extra$uniqueHelp, f, _elm_lang$core$Set$empty, list);
	});
var _elm_community$list_extra$List_Extra$allDifferentBy = F2(
	function (f, list) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(list),
			_elm_lang$core$List$length(
				A2(_elm_community$list_extra$List_Extra$uniqueBy, f, list)));
	});
var _elm_community$list_extra$List_Extra$allDifferent = function (list) {
	return A2(_elm_community$list_extra$List_Extra$allDifferentBy, _elm_lang$core$Basics$identity, list);
};
var _elm_community$list_extra$List_Extra$unique = function (list) {
	return A3(_elm_community$list_extra$List_Extra$uniqueHelp, _elm_lang$core$Basics$identity, _elm_lang$core$Set$empty, list);
};
var _elm_community$list_extra$List_Extra$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			var _p67 = list;
			if (_p67.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				if (predicate(_p67._0)) {
					var _v48 = predicate,
						_v49 = _p67._1;
					predicate = _v48;
					list = _v49;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				var _p68 = list;
				if (_p68.ctor === '[]') {
					return _elm_lang$core$List$reverse(memo);
				} else {
					var _p69 = _p68._0;
					if (predicate(_p69)) {
						var _v51 = {ctor: '::', _0: _p69, _1: memo},
							_v52 = _p68._1;
						memo = _v51;
						list = _v52;
						continue takeWhileMemo;
					} else {
						return _elm_lang$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(
		{ctor: '[]'});
};
var _elm_community$list_extra$List_Extra$span = F2(
	function (p, xs) {
		return {
			ctor: '_Tuple2',
			_0: A2(_elm_community$list_extra$List_Extra$takeWhile, p, xs),
			_1: A2(_elm_community$list_extra$List_Extra$dropWhile, p, xs)
		};
	});
var _elm_community$list_extra$List_Extra$break = function (p) {
	return _elm_community$list_extra$List_Extra$span(
		function (_p70) {
			return !p(_p70);
		});
};
var _elm_community$list_extra$List_Extra$groupWhile = F2(
	function (eq, xs_) {
		var _p71 = xs_;
		if (_p71.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p73 = _p71._0;
			var _p72 = A2(
				_elm_community$list_extra$List_Extra$span,
				eq(_p73),
				_p71._1);
			var ys = _p72._0;
			var zs = _p72._1;
			return {
				ctor: '::',
				_0: {ctor: '::', _0: _p73, _1: ys},
				_1: A2(_elm_community$list_extra$List_Extra$groupWhile, eq, zs)
			};
		}
	});
var _elm_community$list_extra$List_Extra$group = _elm_community$list_extra$List_Extra$groupWhile(
	F2(
		function (x, y) {
			return _elm_lang$core$Native_Utils.eq(x, y);
		}));
var _elm_community$list_extra$List_Extra$minimumBy = F2(
	function (f, ls) {
		var minBy = F2(
			function (x, _p74) {
				var _p75 = _p74;
				var _p76 = _p75._1;
				var fx = f(x);
				return (_elm_lang$core$Native_Utils.cmp(fx, _p76) < 0) ? {ctor: '_Tuple2', _0: x, _1: fx} : {ctor: '_Tuple2', _0: _p75._0, _1: _p76};
			});
		var _p77 = ls;
		if (_p77.ctor === '::') {
			if (_p77._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p77._0);
			} else {
				var _p78 = _p77._0;
				return _elm_lang$core$Maybe$Just(
					_elm_lang$core$Tuple$first(
						A3(
							_elm_lang$core$List$foldl,
							minBy,
							{
								ctor: '_Tuple2',
								_0: _p78,
								_1: f(_p78)
							},
							_p77._1)));
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$list_extra$List_Extra$maximumBy = F2(
	function (f, ls) {
		var maxBy = F2(
			function (x, _p79) {
				var _p80 = _p79;
				var _p81 = _p80._1;
				var fx = f(x);
				return (_elm_lang$core$Native_Utils.cmp(fx, _p81) > 0) ? {ctor: '_Tuple2', _0: x, _1: fx} : {ctor: '_Tuple2', _0: _p80._0, _1: _p81};
			});
		var _p82 = ls;
		if (_p82.ctor === '::') {
			if (_p82._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p82._0);
			} else {
				var _p83 = _p82._0;
				return _elm_lang$core$Maybe$Just(
					_elm_lang$core$Tuple$first(
						A3(
							_elm_lang$core$List$foldl,
							maxBy,
							{
								ctor: '_Tuple2',
								_0: _p83,
								_1: f(_p83)
							},
							_p82._1)));
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$list_extra$List_Extra$uncons = function (xs) {
	var _p84 = xs;
	if (_p84.ctor === '[]') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Maybe$Just(
			{ctor: '_Tuple2', _0: _p84._0, _1: _p84._1});
	}
};
var _elm_community$list_extra$List_Extra$swapAt = F3(
	function (index1, index2, l) {
		swapAt:
		while (true) {
			if (_elm_lang$core$Native_Utils.eq(index1, index2)) {
				return _elm_lang$core$Maybe$Just(l);
			} else {
				if (_elm_lang$core$Native_Utils.cmp(index1, index2) > 0) {
					var _v59 = index2,
						_v60 = index1,
						_v61 = l;
					index1 = _v59;
					index2 = _v60;
					l = _v61;
					continue swapAt;
				} else {
					if (_elm_lang$core$Native_Utils.cmp(index1, 0) < 0) {
						return _elm_lang$core$Maybe$Nothing;
					} else {
						var _p85 = A2(_elm_community$list_extra$List_Extra$splitAt, index1, l);
						var part1 = _p85._0;
						var tail1 = _p85._1;
						var _p86 = A2(_elm_community$list_extra$List_Extra$splitAt, index2 - index1, tail1);
						var head2 = _p86._0;
						var tail2 = _p86._1;
						return A3(
							_elm_lang$core$Maybe$map2,
							F2(
								function (_p88, _p87) {
									var _p89 = _p88;
									var _p90 = _p87;
									return _elm_lang$core$List$concat(
										{
											ctor: '::',
											_0: part1,
											_1: {
												ctor: '::',
												_0: {ctor: '::', _0: _p90._0, _1: _p89._1},
												_1: {
													ctor: '::',
													_0: {ctor: '::', _0: _p89._0, _1: _p90._1},
													_1: {ctor: '[]'}
												}
											}
										});
								}),
							_elm_community$list_extra$List_Extra$uncons(head2),
							_elm_community$list_extra$List_Extra$uncons(tail2));
					}
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$iterate = F2(
	function (f, x) {
		var _p91 = f(x);
		if (_p91.ctor === 'Just') {
			return {
				ctor: '::',
				_0: x,
				_1: A2(_elm_community$list_extra$List_Extra$iterate, f, _p91._0)
			};
		} else {
			return {
				ctor: '::',
				_0: x,
				_1: {ctor: '[]'}
			};
		}
	});
var _elm_community$list_extra$List_Extra$getAt = F2(
	function (idx, xs) {
		return (_elm_lang$core$Native_Utils.cmp(idx, 0) < 0) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$List$head(
			A2(_elm_lang$core$List$drop, idx, xs));
	});
var _elm_community$list_extra$List_Extra_ops = _elm_community$list_extra$List_Extra_ops || {};
_elm_community$list_extra$List_Extra_ops['!!'] = _elm_lang$core$Basics$flip(_elm_community$list_extra$List_Extra$getAt);
var _elm_community$list_extra$List_Extra$init = function () {
	var maybe = F2(
		function (d, f) {
			return function (_p92) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					d,
					A2(_elm_lang$core$Maybe$map, f, _p92));
			};
		});
	return A2(
		_elm_lang$core$List$foldr,
		function (x) {
			return function (_p93) {
				return _elm_lang$core$Maybe$Just(
					A3(
						maybe,
						{ctor: '[]'},
						F2(
							function (x, y) {
								return {ctor: '::', _0: x, _1: y};
							})(x),
						_p93));
			};
		},
		_elm_lang$core$Maybe$Nothing);
}();
var _elm_community$list_extra$List_Extra$last = _elm_community$list_extra$List_Extra$foldl1(
	_elm_lang$core$Basics$flip(_elm_lang$core$Basics$always));

var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
var _elm_lang$core$Task$spawnCmd = F2(
	function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(
			A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Platform$sendToApp(router),
				_p1._0));
	});
var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
var _elm_lang$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			_elm_lang$core$Task$onError,
			function (_p2) {
				return _elm_lang$core$Task$fail(
					convert(_p2));
			},
			task);
	});
var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return _elm_lang$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var _elm_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return _elm_lang$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return _elm_lang$core$Task$succeed(
									A3(func, a, b, c));
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map4 = F5(
	function (func, taskA, taskB, taskC, taskD) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return _elm_lang$core$Task$succeed(
											A4(func, a, b, c, d));
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map5 = F6(
	function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return A2(
											_elm_lang$core$Task$andThen,
											function (e) {
												return _elm_lang$core$Task$succeed(
													A5(func, a, b, c, d, e));
											},
											taskE);
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$sequence = function (tasks) {
	var _p3 = tasks;
	if (_p3.ctor === '[]') {
		return _elm_lang$core$Task$succeed(
			{ctor: '[]'});
	} else {
		return A3(
			_elm_lang$core$Task$map2,
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			_p3._0,
			_elm_lang$core$Task$sequence(_p3._1));
	}
};
var _elm_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			_elm_lang$core$Task$map,
			function (_p4) {
				return {ctor: '_Tuple0'};
			},
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Task$spawnCmd(router),
					commands)));
	});
var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed(
	{ctor: '_Tuple0'});
var _elm_lang$core$Task$onSelfMsg = F3(
	function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	});
var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
var _elm_lang$core$Task$Perform = function (a) {
	return {ctor: 'Perform', _0: a};
};
var _elm_lang$core$Task$perform = F2(
	function (toMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(_elm_lang$core$Task$map, toMessage, task)));
	});
var _elm_lang$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(
					_elm_lang$core$Task$onError,
					function (_p8) {
						return _elm_lang$core$Task$succeed(
							resultToMessage(
								_elm_lang$core$Result$Err(_p8)));
					},
					A2(
						_elm_lang$core$Task$andThen,
						function (_p9) {
							return _elm_lang$core$Task$succeed(
								resultToMessage(
									_elm_lang$core$Result$Ok(_p9)));
						},
						task))));
	});
var _elm_lang$core$Task$cmdMap = F2(
	function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(
			A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Task'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap};

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function() {

var now = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
});

function setInterval_(interval, task)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var id = setInterval(function() {
			_elm_lang$core$Native_Scheduler.rawSpawn(task);
		}, interval);

		return function() { clearInterval(id); };
	});
}

return {
	now: now,
	setInterval_: F2(setInterval_)
};

}();
var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
var _elm_lang$core$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			var spawnRest = function (id) {
				return A3(
					_elm_lang$core$Time$spawnHelp,
					router,
					_p0._1,
					A3(_elm_lang$core$Dict$insert, _p1, id, processes));
			};
			var spawnTimer = _elm_lang$core$Native_Scheduler.spawn(
				A2(
					_elm_lang$core$Time$setInterval,
					_p1,
					A2(_elm_lang$core$Platform$sendToSelf, router, _p1)));
			return A2(_elm_lang$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var _elm_lang$core$Time$addMySub = F2(
	function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{
					ctor: '::',
					_0: _p6,
					_1: {ctor: '[]'}
				},
				state);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{ctor: '::', _0: _p6, _1: _p4._0},
				state);
		}
	});
var _elm_lang$core$Time$inMilliseconds = function (t) {
	return t;
};
var _elm_lang$core$Time$millisecond = 1;
var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
var _elm_lang$core$Time$inHours = function (t) {
	return t / _elm_lang$core$Time$hour;
};
var _elm_lang$core$Time$inMinutes = function (t) {
	return t / _elm_lang$core$Time$minute;
};
var _elm_lang$core$Time$inSeconds = function (t) {
	return t / _elm_lang$core$Time$second;
};
var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
var _elm_lang$core$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var tellTaggers = function (time) {
				return _elm_lang$core$Task$sequence(
					A2(
						_elm_lang$core$List$map,
						function (tagger) {
							return A2(
								_elm_lang$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						_p7._0));
			};
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p8) {
					return _elm_lang$core$Task$succeed(state);
				},
				A2(_elm_lang$core$Task$andThen, tellTaggers, _elm_lang$core$Time$now));
		}
	});
var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
var _elm_lang$core$Time$State = F2(
	function (a, b) {
		return {taggers: a, processes: b};
	});
var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(
	A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$core$Time$onEffects = F3(
	function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(
			function (_p12, id, _p11) {
				var _p13 = _p11;
				return {
					ctor: '_Tuple3',
					_0: _p13._0,
					_1: _p13._1,
					_2: A2(
						_elm_lang$core$Task$andThen,
						function (_p14) {
							return _p13._2;
						},
						_elm_lang$core$Native_Scheduler.kill(id))
				};
			});
		var bothStep = F4(
			function (interval, taggers, id, _p15) {
				var _p16 = _p15;
				return {
					ctor: '_Tuple3',
					_0: _p16._0,
					_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
					_2: _p16._2
				};
			});
		var leftStep = F3(
			function (interval, taggers, _p17) {
				var _p18 = _p17;
				return {
					ctor: '_Tuple3',
					_0: {ctor: '::', _0: interval, _1: _p18._0},
					_1: _p18._1,
					_2: _p18._2
				};
			});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			_p10.processes,
			{
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _elm_lang$core$Dict$empty,
				_2: _elm_lang$core$Task$succeed(
					{ctor: '_Tuple0'})
			});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(
			_elm_lang$core$Task$andThen,
			function (newProcesses) {
				return _elm_lang$core$Task$succeed(
					A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
			},
			A2(
				_elm_lang$core$Task$andThen,
				function (_p20) {
					return A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var _elm_lang$core$Time$Every = F2(
	function (a, b) {
		return {ctor: 'Every', _0: a, _1: b};
	});
var _elm_lang$core$Time$every = F2(
	function (interval, tagger) {
		return _elm_lang$core$Time$subscription(
			A2(_elm_lang$core$Time$Every, interval, tagger));
	});
var _elm_lang$core$Time$subMap = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return A2(
			_elm_lang$core$Time$Every,
			_p22._0,
			function (_p23) {
				return f(
					_p22._1(_p23));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Time'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap};

var _elm_lang$core$Process$kill = _elm_lang$core$Native_Scheduler.kill;
var _elm_lang$core$Process$sleep = _elm_lang$core$Native_Scheduler.sleep;
var _elm_lang$core$Process$spawn = _elm_lang$core$Native_Scheduler.spawn;

var _elm_lang$core$Random$onSelfMsg = F3(
	function (_p1, _p0, seed) {
		return _elm_lang$core$Task$succeed(seed);
	});
var _elm_lang$core$Random$magicNum8 = 2147483562;
var _elm_lang$core$Random$range = function (_p2) {
	return {ctor: '_Tuple2', _0: 0, _1: _elm_lang$core$Random$magicNum8};
};
var _elm_lang$core$Random$magicNum7 = 2147483399;
var _elm_lang$core$Random$magicNum6 = 2147483563;
var _elm_lang$core$Random$magicNum5 = 3791;
var _elm_lang$core$Random$magicNum4 = 40692;
var _elm_lang$core$Random$magicNum3 = 52774;
var _elm_lang$core$Random$magicNum2 = 12211;
var _elm_lang$core$Random$magicNum1 = 53668;
var _elm_lang$core$Random$magicNum0 = 40014;
var _elm_lang$core$Random$step = F2(
	function (_p3, seed) {
		var _p4 = _p3;
		return _p4._0(seed);
	});
var _elm_lang$core$Random$onEffects = F3(
	function (router, commands, seed) {
		var _p5 = commands;
		if (_p5.ctor === '[]') {
			return _elm_lang$core$Task$succeed(seed);
		} else {
			var _p6 = A2(_elm_lang$core$Random$step, _p5._0._0, seed);
			var value = _p6._0;
			var newSeed = _p6._1;
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p7) {
					return A3(_elm_lang$core$Random$onEffects, router, _p5._1, newSeed);
				},
				A2(_elm_lang$core$Platform$sendToApp, router, value));
		}
	});
var _elm_lang$core$Random$listHelp = F4(
	function (list, n, generate, seed) {
		listHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 1) < 0) {
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$List$reverse(list),
					_1: seed
				};
			} else {
				var _p8 = generate(seed);
				var value = _p8._0;
				var newSeed = _p8._1;
				var _v2 = {ctor: '::', _0: value, _1: list},
					_v3 = n - 1,
					_v4 = generate,
					_v5 = newSeed;
				list = _v2;
				n = _v3;
				generate = _v4;
				seed = _v5;
				continue listHelp;
			}
		}
	});
var _elm_lang$core$Random$minInt = -2147483648;
var _elm_lang$core$Random$maxInt = 2147483647;
var _elm_lang$core$Random$iLogBase = F2(
	function (b, i) {
		return (_elm_lang$core$Native_Utils.cmp(i, b) < 0) ? 1 : (1 + A2(_elm_lang$core$Random$iLogBase, b, (i / b) | 0));
	});
var _elm_lang$core$Random$command = _elm_lang$core$Native_Platform.leaf('Random');
var _elm_lang$core$Random$Generator = function (a) {
	return {ctor: 'Generator', _0: a};
};
var _elm_lang$core$Random$list = F2(
	function (n, _p9) {
		var _p10 = _p9;
		return _elm_lang$core$Random$Generator(
			function (seed) {
				return A4(
					_elm_lang$core$Random$listHelp,
					{ctor: '[]'},
					n,
					_p10._0,
					seed);
			});
	});
var _elm_lang$core$Random$map = F2(
	function (func, _p11) {
		var _p12 = _p11;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p13 = _p12._0(seed0);
				var a = _p13._0;
				var seed1 = _p13._1;
				return {
					ctor: '_Tuple2',
					_0: func(a),
					_1: seed1
				};
			});
	});
var _elm_lang$core$Random$map2 = F3(
	function (func, _p15, _p14) {
		var _p16 = _p15;
		var _p17 = _p14;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p18 = _p16._0(seed0);
				var a = _p18._0;
				var seed1 = _p18._1;
				var _p19 = _p17._0(seed1);
				var b = _p19._0;
				var seed2 = _p19._1;
				return {
					ctor: '_Tuple2',
					_0: A2(func, a, b),
					_1: seed2
				};
			});
	});
var _elm_lang$core$Random$pair = F2(
	function (genA, genB) {
		return A3(
			_elm_lang$core$Random$map2,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			genA,
			genB);
	});
var _elm_lang$core$Random$map3 = F4(
	function (func, _p22, _p21, _p20) {
		var _p23 = _p22;
		var _p24 = _p21;
		var _p25 = _p20;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p26 = _p23._0(seed0);
				var a = _p26._0;
				var seed1 = _p26._1;
				var _p27 = _p24._0(seed1);
				var b = _p27._0;
				var seed2 = _p27._1;
				var _p28 = _p25._0(seed2);
				var c = _p28._0;
				var seed3 = _p28._1;
				return {
					ctor: '_Tuple2',
					_0: A3(func, a, b, c),
					_1: seed3
				};
			});
	});
var _elm_lang$core$Random$map4 = F5(
	function (func, _p32, _p31, _p30, _p29) {
		var _p33 = _p32;
		var _p34 = _p31;
		var _p35 = _p30;
		var _p36 = _p29;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p37 = _p33._0(seed0);
				var a = _p37._0;
				var seed1 = _p37._1;
				var _p38 = _p34._0(seed1);
				var b = _p38._0;
				var seed2 = _p38._1;
				var _p39 = _p35._0(seed2);
				var c = _p39._0;
				var seed3 = _p39._1;
				var _p40 = _p36._0(seed3);
				var d = _p40._0;
				var seed4 = _p40._1;
				return {
					ctor: '_Tuple2',
					_0: A4(func, a, b, c, d),
					_1: seed4
				};
			});
	});
var _elm_lang$core$Random$map5 = F6(
	function (func, _p45, _p44, _p43, _p42, _p41) {
		var _p46 = _p45;
		var _p47 = _p44;
		var _p48 = _p43;
		var _p49 = _p42;
		var _p50 = _p41;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p51 = _p46._0(seed0);
				var a = _p51._0;
				var seed1 = _p51._1;
				var _p52 = _p47._0(seed1);
				var b = _p52._0;
				var seed2 = _p52._1;
				var _p53 = _p48._0(seed2);
				var c = _p53._0;
				var seed3 = _p53._1;
				var _p54 = _p49._0(seed3);
				var d = _p54._0;
				var seed4 = _p54._1;
				var _p55 = _p50._0(seed4);
				var e = _p55._0;
				var seed5 = _p55._1;
				return {
					ctor: '_Tuple2',
					_0: A5(func, a, b, c, d, e),
					_1: seed5
				};
			});
	});
var _elm_lang$core$Random$andThen = F2(
	function (callback, _p56) {
		var _p57 = _p56;
		return _elm_lang$core$Random$Generator(
			function (seed) {
				var _p58 = _p57._0(seed);
				var result = _p58._0;
				var newSeed = _p58._1;
				var _p59 = callback(result);
				var genB = _p59._0;
				return genB(newSeed);
			});
	});
var _elm_lang$core$Random$State = F2(
	function (a, b) {
		return {ctor: 'State', _0: a, _1: b};
	});
var _elm_lang$core$Random$initState = function (seed) {
	var s = A2(_elm_lang$core$Basics$max, seed, 0 - seed);
	var q = (s / (_elm_lang$core$Random$magicNum6 - 1)) | 0;
	var s2 = A2(_elm_lang$core$Basics_ops['%'], q, _elm_lang$core$Random$magicNum7 - 1);
	var s1 = A2(_elm_lang$core$Basics_ops['%'], s, _elm_lang$core$Random$magicNum6 - 1);
	return A2(_elm_lang$core$Random$State, s1 + 1, s2 + 1);
};
var _elm_lang$core$Random$next = function (_p60) {
	var _p61 = _p60;
	var _p63 = _p61._1;
	var _p62 = _p61._0;
	var k2 = (_p63 / _elm_lang$core$Random$magicNum3) | 0;
	var rawState2 = (_elm_lang$core$Random$magicNum4 * (_p63 - (k2 * _elm_lang$core$Random$magicNum3))) - (k2 * _elm_lang$core$Random$magicNum5);
	var newState2 = (_elm_lang$core$Native_Utils.cmp(rawState2, 0) < 0) ? (rawState2 + _elm_lang$core$Random$magicNum7) : rawState2;
	var k1 = (_p62 / _elm_lang$core$Random$magicNum1) | 0;
	var rawState1 = (_elm_lang$core$Random$magicNum0 * (_p62 - (k1 * _elm_lang$core$Random$magicNum1))) - (k1 * _elm_lang$core$Random$magicNum2);
	var newState1 = (_elm_lang$core$Native_Utils.cmp(rawState1, 0) < 0) ? (rawState1 + _elm_lang$core$Random$magicNum6) : rawState1;
	var z = newState1 - newState2;
	var newZ = (_elm_lang$core$Native_Utils.cmp(z, 1) < 0) ? (z + _elm_lang$core$Random$magicNum8) : z;
	return {
		ctor: '_Tuple2',
		_0: newZ,
		_1: A2(_elm_lang$core$Random$State, newState1, newState2)
	};
};
var _elm_lang$core$Random$split = function (_p64) {
	var _p65 = _p64;
	var _p68 = _p65._1;
	var _p67 = _p65._0;
	var _p66 = _elm_lang$core$Tuple$second(
		_elm_lang$core$Random$next(_p65));
	var t1 = _p66._0;
	var t2 = _p66._1;
	var new_s2 = _elm_lang$core$Native_Utils.eq(_p68, 1) ? (_elm_lang$core$Random$magicNum7 - 1) : (_p68 - 1);
	var new_s1 = _elm_lang$core$Native_Utils.eq(_p67, _elm_lang$core$Random$magicNum6 - 1) ? 1 : (_p67 + 1);
	return {
		ctor: '_Tuple2',
		_0: A2(_elm_lang$core$Random$State, new_s1, t2),
		_1: A2(_elm_lang$core$Random$State, t1, new_s2)
	};
};
var _elm_lang$core$Random$Seed = function (a) {
	return {ctor: 'Seed', _0: a};
};
var _elm_lang$core$Random$int = F2(
	function (a, b) {
		return _elm_lang$core$Random$Generator(
			function (_p69) {
				var _p70 = _p69;
				var _p75 = _p70._0;
				var base = 2147483561;
				var f = F3(
					function (n, acc, state) {
						f:
						while (true) {
							var _p71 = n;
							if (_p71 === 0) {
								return {ctor: '_Tuple2', _0: acc, _1: state};
							} else {
								var _p72 = _p75.next(state);
								var x = _p72._0;
								var nextState = _p72._1;
								var _v27 = n - 1,
									_v28 = x + (acc * base),
									_v29 = nextState;
								n = _v27;
								acc = _v28;
								state = _v29;
								continue f;
							}
						}
					});
				var _p73 = (_elm_lang$core$Native_Utils.cmp(a, b) < 0) ? {ctor: '_Tuple2', _0: a, _1: b} : {ctor: '_Tuple2', _0: b, _1: a};
				var lo = _p73._0;
				var hi = _p73._1;
				var k = (hi - lo) + 1;
				var n = A2(_elm_lang$core$Random$iLogBase, base, k);
				var _p74 = A3(f, n, 1, _p75.state);
				var v = _p74._0;
				var nextState = _p74._1;
				return {
					ctor: '_Tuple2',
					_0: lo + A2(_elm_lang$core$Basics_ops['%'], v, k),
					_1: _elm_lang$core$Random$Seed(
						_elm_lang$core$Native_Utils.update(
							_p75,
							{state: nextState}))
				};
			});
	});
var _elm_lang$core$Random$bool = A2(
	_elm_lang$core$Random$map,
	F2(
		function (x, y) {
			return _elm_lang$core$Native_Utils.eq(x, y);
		})(1),
	A2(_elm_lang$core$Random$int, 0, 1));
var _elm_lang$core$Random$float = F2(
	function (a, b) {
		return _elm_lang$core$Random$Generator(
			function (seed) {
				var _p76 = A2(
					_elm_lang$core$Random$step,
					A2(_elm_lang$core$Random$int, _elm_lang$core$Random$minInt, _elm_lang$core$Random$maxInt),
					seed);
				var number = _p76._0;
				var newSeed = _p76._1;
				var negativeOneToOne = _elm_lang$core$Basics$toFloat(number) / _elm_lang$core$Basics$toFloat(_elm_lang$core$Random$maxInt - _elm_lang$core$Random$minInt);
				var _p77 = (_elm_lang$core$Native_Utils.cmp(a, b) < 0) ? {ctor: '_Tuple2', _0: a, _1: b} : {ctor: '_Tuple2', _0: b, _1: a};
				var lo = _p77._0;
				var hi = _p77._1;
				var scaled = ((lo + hi) / 2) + ((hi - lo) * negativeOneToOne);
				return {ctor: '_Tuple2', _0: scaled, _1: newSeed};
			});
	});
var _elm_lang$core$Random$initialSeed = function (n) {
	return _elm_lang$core$Random$Seed(
		{
			state: _elm_lang$core$Random$initState(n),
			next: _elm_lang$core$Random$next,
			split: _elm_lang$core$Random$split,
			range: _elm_lang$core$Random$range
		});
};
var _elm_lang$core$Random$init = A2(
	_elm_lang$core$Task$andThen,
	function (t) {
		return _elm_lang$core$Task$succeed(
			_elm_lang$core$Random$initialSeed(
				_elm_lang$core$Basics$round(t)));
	},
	_elm_lang$core$Time$now);
var _elm_lang$core$Random$Generate = function (a) {
	return {ctor: 'Generate', _0: a};
};
var _elm_lang$core$Random$generate = F2(
	function (tagger, generator) {
		return _elm_lang$core$Random$command(
			_elm_lang$core$Random$Generate(
				A2(_elm_lang$core$Random$map, tagger, generator)));
	});
var _elm_lang$core$Random$cmdMap = F2(
	function (func, _p78) {
		var _p79 = _p78;
		return _elm_lang$core$Random$Generate(
			A2(_elm_lang$core$Random$map, func, _p79._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Random'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Random$init, onEffects: _elm_lang$core$Random$onEffects, onSelfMsg: _elm_lang$core$Random$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Random$cmdMap};

var _elm_lang$dom$Native_Dom = function() {

var fakeNode = {
	addEventListener: function() {},
	removeEventListener: function() {}
};

var onDocument = on(typeof document !== 'undefined' ? document : fakeNode);
var onWindow = on(typeof window !== 'undefined' ? window : fakeNode);

function on(node)
{
	return function(eventName, decoder, toTask)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {

			function performTask(event)
			{
				var result = A2(_elm_lang$core$Json_Decode$decodeValue, decoder, event);
				if (result.ctor === 'Ok')
				{
					_elm_lang$core$Native_Scheduler.rawSpawn(toTask(result._0));
				}
			}

			node.addEventListener(eventName, performTask);

			return function()
			{
				node.removeEventListener(eventName, performTask);
			};
		});
	};
}

var rAF = typeof requestAnimationFrame !== 'undefined'
	? requestAnimationFrame
	: function(callback) { callback(); };

function withNode(id, doStuff)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		rAF(function()
		{
			var node = document.getElementById(id);
			if (node === null)
			{
				callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NotFound', _0: id }));
				return;
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(doStuff(node)));
		});
	});
}


// FOCUS

function focus(id)
{
	return withNode(id, function(node) {
		node.focus();
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function blur(id)
{
	return withNode(id, function(node) {
		node.blur();
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}


// SCROLLING

function getScrollTop(id)
{
	return withNode(id, function(node) {
		return node.scrollTop;
	});
}

function setScrollTop(id, desiredScrollTop)
{
	return withNode(id, function(node) {
		node.scrollTop = desiredScrollTop;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function toBottom(id)
{
	return withNode(id, function(node) {
		node.scrollTop = node.scrollHeight;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function getScrollLeft(id)
{
	return withNode(id, function(node) {
		return node.scrollLeft;
	});
}

function setScrollLeft(id, desiredScrollLeft)
{
	return withNode(id, function(node) {
		node.scrollLeft = desiredScrollLeft;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function toRight(id)
{
	return withNode(id, function(node) {
		node.scrollLeft = node.scrollWidth;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}


// SIZE

function width(options, id)
{
	return withNode(id, function(node) {
		switch (options.ctor)
		{
			case 'Content':
				return node.scrollWidth;
			case 'VisibleContent':
				return node.clientWidth;
			case 'VisibleContentWithBorders':
				return node.offsetWidth;
			case 'VisibleContentWithBordersAndMargins':
				var rect = node.getBoundingClientRect();
				return rect.right - rect.left;
		}
	});
}

function height(options, id)
{
	return withNode(id, function(node) {
		switch (options.ctor)
		{
			case 'Content':
				return node.scrollHeight;
			case 'VisibleContent':
				return node.clientHeight;
			case 'VisibleContentWithBorders':
				return node.offsetHeight;
			case 'VisibleContentWithBordersAndMargins':
				var rect = node.getBoundingClientRect();
				return rect.bottom - rect.top;
		}
	});
}

return {
	onDocument: F3(onDocument),
	onWindow: F3(onWindow),

	focus: focus,
	blur: blur,

	getScrollTop: getScrollTop,
	setScrollTop: F2(setScrollTop),
	getScrollLeft: getScrollLeft,
	setScrollLeft: F2(setScrollLeft),
	toBottom: toBottom,
	toRight: toRight,

	height: F2(height),
	width: F2(width)
};

}();

var _elm_lang$dom$Dom_LowLevel$onWindow = _elm_lang$dom$Native_Dom.onWindow;
var _elm_lang$dom$Dom_LowLevel$onDocument = _elm_lang$dom$Native_Dom.onDocument;

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';

var localDoc = typeof document !== 'undefined' ? document : {};


////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function keyedNode(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid._1.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'keyed-node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: undefined
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else if (key === 'className')
		{
			var classes = facts[key];
			facts[key] = typeof classes === 'undefined'
				? entry.value
				: classes + ' ' + entry.value;
		}
 		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (a.options !== b.options)
	{
		if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}


function mapProperty(func, property)
{
	if (property.key !== EVENT_KEY)
	{
		return property;
	}
	return on(
		property.realKey,
		property.value.options,
		A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder)
	);
}


////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;

			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}

			var subEventRoot = { tagger: tagger, parent: eventNode };
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return localDoc.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'keyed-node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i]._1, eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: undefined,
		eventNode: undefined
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'keyed-node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffKeyedChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  KEYED DIFF  ////////////


function diffKeyedChildren(aParent, bParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var aChildren = aParent.children;
	var bChildren = bParent.children;
	var aLen = aChildren.length;
	var bLen = bChildren.length;
	var aIndex = 0;
	var bIndex = 0;

	var index = rootIndex;

	while (aIndex < aLen && bIndex < bLen)
	{
		var a = aChildren[aIndex];
		var b = bChildren[bIndex];

		var aKey = a._0;
		var bKey = b._0;
		var aNode = a._1;
		var bNode = b._1;

		// check if keys match

		if (aKey === bKey)
		{
			index++;
			diffHelp(aNode, bNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex++;
			bIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var aLookAhead = aIndex + 1 < aLen;
		var bLookAhead = bIndex + 1 < bLen;

		if (aLookAhead)
		{
			var aNext = aChildren[aIndex + 1];
			var aNextKey = aNext._0;
			var aNextNode = aNext._1;
			var oldMatch = bKey === aNextKey;
		}

		if (bLookAhead)
		{
			var bNext = bChildren[bIndex + 1];
			var bNextKey = bNext._0;
			var bNextNode = bNext._1;
			var newMatch = aKey === bNextKey;
		}


		// swap a and b
		if (aLookAhead && bLookAhead && newMatch && oldMatch)
		{
			index++;
			diffHelp(aNode, bNextNode, localPatches, index);
			insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			removeNode(changes, localPatches, aKey, aNextNode, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		// insert b
		if (bLookAhead && newMatch)
		{
			index++;
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			diffHelp(aNode, bNextNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex += 1;
			bIndex += 2;
			continue;
		}

		// remove a
		if (aLookAhead && oldMatch)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 1;
			continue;
		}

		// remove a, insert b
		if (aLookAhead && bLookAhead && aNextKey === bNextKey)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNextNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (aIndex < aLen)
	{
		index++;
		var a = aChildren[aIndex];
		var aNode = a._1;
		removeNode(changes, localPatches, a._0, aNode, index);
		index += aNode.descendantsCount || 0;
		aIndex++;
	}

	var endInserts;
	while (bIndex < bLen)
	{
		endInserts = endInserts || [];
		var b = bChildren[bIndex];
		insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
		bIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined')
	{
		patches.push(makePatch('p-reorder', rootIndex, {
			patches: localPatches,
			inserts: inserts,
			endInserts: endInserts
		}));
	}
}



////////////  CHANGES FROM KEYED DIFF  ////////////


var POSTFIX = '_elmW6BL';


function insertNode(changes, localPatches, key, vnode, bIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		entry = {
			tag: 'insert',
			vnode: vnode,
			index: bIndex,
			data: undefined
		};

		inserts.push({ index: bIndex, entry: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.tag === 'remove')
	{
		inserts.push({ index: bIndex, entry: entry });

		entry.tag = 'move';
		var subPatches = [];
		diffHelp(entry.vnode, vnode, subPatches, entry.index);
		entry.index = bIndex;
		entry.data.data = {
			patches: subPatches,
			entry: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
}


function removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		var patch = makePatch('p-remove', index, undefined);
		localPatches.push(patch);

		changes[key] = {
			tag: 'remove',
			vnode: vnode,
			index: index,
			data: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.tag === 'insert')
	{
		entry.tag = 'move';
		var subPatches = [];
		diffHelp(vnode, entry.vnode, subPatches, index);

		var patch = makePatch('p-remove', index, {
			patches: subPatches,
			entry: entry
		});
		localPatches.push(patch);

		return;
	}

	// this key has already been removed or moved, a duplicate!
	removeNode(changes, localPatches, key + POSTFIX, vnode, index);
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else if (patchType === 'p-reorder')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var subPatches = patch.data.patches;
			if (subPatches.length > 0)
			{
				addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 'p-remove')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var data = patch.data;
			if (typeof data !== 'undefined')
			{
				data.entry.data = domNode;
				var subPatches = data.patches;
				if (subPatches.length > 0)
				{
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;

			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}

			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'keyed-node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j]._1;
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return applyPatchRedraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			if (typeof domNode.elm_event_node_ref !== 'undefined')
			{
				domNode.elm_event_node_ref.tagger = patch.data;
			}
			else
			{
				domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
			}
			return domNode;

		case 'p-remove-last':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-append':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-remove':
			var data = patch.data;
			if (typeof data === 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.entry;
			if (typeof entry.index !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.data = applyPatchesHelp(domNode, data.patches);
			return domNode;

		case 'p-reorder':
			return applyPatchReorder(domNode, patch);

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function applyPatchReorder(domNode, patch)
{
	var data = patch.data;

	// remove end inserts
	var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

	// removals
	domNode = applyPatchesHelp(domNode, data.patches);

	// inserts
	var inserts = data.inserts;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.entry;
		var node = entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode);
		domNode.insertBefore(node, domNode.childNodes[insert.index]);
	}

	// add end inserts
	if (typeof frag !== 'undefined')
	{
		domNode.appendChild(frag);
	}

	return domNode;
}


function applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (typeof endInserts === 'undefined')
	{
		return;
	}

	var frag = localDoc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.entry;
		frag.appendChild(entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode)
		);
	}
	return frag;
}


// PROGRAMS

var program = makeProgram(checkNoFlags);
var programWithFlags = makeProgram(checkYesFlags);

function makeProgram(flagChecker)
{
	return F2(function(debugWrap, impl)
	{
		return function(flagDecoder)
		{
			return function(object, moduleName, debugMetadata)
			{
				var checker = flagChecker(flagDecoder, moduleName);
				if (typeof debugMetadata === 'undefined')
				{
					normalSetup(impl, object, moduleName, checker);
				}
				else
				{
					debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
				}
			};
		};
	});
}

function staticProgram(vNode)
{
	var nothing = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		_elm_lang$core$Platform_Cmd$none
	);
	return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
		init: nothing,
		view: function() { return vNode; },
		update: F2(function() { return nothing; }),
		subscriptions: function() { return _elm_lang$core$Platform_Sub$none; }
	})();
}


// FLAG CHECKERS

function checkNoFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flags === 'undefined')
		{
			return init;
		}

		var errorMessage =
			'The `' + moduleName + '` module does not need flags.\n'
			+ 'Initialize it with no arguments and you should be all set!';

		crash(errorMessage, domNode);
	};
}

function checkYesFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flagDecoder === 'undefined')
		{
			var errorMessage =
				'Are you trying to sneak a Never value into Elm? Trickster!\n'
				+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
				+ 'Use `program` instead if you do not want flags.'

			crash(errorMessage, domNode);
		}

		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Ok')
		{
			return init(result._0);
		}

		var errorMessage =
			'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n'
			+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
			+ result._0;

		crash(errorMessage, domNode);
	};
}

function crash(errorMessage, domNode)
{
	if (domNode)
	{
		domNode.innerHTML =
			'<div style="padding-left:1em;">'
			+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
			+ '<pre style="padding-left:1em;">' + errorMessage + '</pre>'
			+ '</div>';
	}

	throw new Error(errorMessage);
}


//  NORMAL SETUP

function normalSetup(impl, object, moduleName, flagChecker)
{
	object['embed'] = function embed(node, flags)
	{
		while (node.lastChild)
		{
			node.removeChild(node.lastChild);
		}

		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update,
			impl.subscriptions,
			normalRenderer(node, impl.view)
		);
	};

	object['fullscreen'] = function fullscreen(flags)
	{
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update,
			impl.subscriptions,
			normalRenderer(document.body, impl.view)
		);
	};
}

function normalRenderer(parentNode, view)
{
	return function(tagger, initialModel)
	{
		var eventNode = { tagger: tagger, parent: undefined };
		var initialVirtualNode = view(initialModel);
		var domNode = render(initialVirtualNode, eventNode);
		parentNode.appendChild(domNode);
		return makeStepper(domNode, view, initialVirtualNode, eventNode);
	};
}


// STEPPER

var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };

function makeStepper(domNode, view, initialVirtualNode, eventNode)
{
	var state = 'NO_REQUEST';
	var currNode = initialVirtualNode;
	var nextModel;

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var nextNode = view(nextModel);
				var patches = diff(currNode, nextNode);
				domNode = applyPatches(domNode, currNode, patches, eventNode);
				currNode = nextNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return function stepper(model)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextModel = model;
	};
}


// DEBUG SETUP

function debugSetup(impl, object, moduleName, flagChecker)
{
	object['fullscreen'] = function fullscreen(flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};

	object['embed'] = function fullscreen(node, flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};
}

function scrollTask(popoutRef)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var doc = popoutRef.doc;
		if (doc)
		{
			var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
			if (msgs)
			{
				msgs.scrollTop = msgs.scrollHeight;
			}
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut)
{
	return function(tagger, initialModel)
	{
		var appEventNode = { tagger: tagger, parent: undefined };
		var eventNode = { tagger: tagger, parent: undefined };

		// make normal stepper
		var appVirtualNode = view(initialModel);
		var appNode = render(appVirtualNode, appEventNode);
		parentNode.appendChild(appNode);
		var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

		// make overlay stepper
		var overVirtualNode = viewIn(initialModel)._1;
		var overNode = render(overVirtualNode, eventNode);
		parentNode.appendChild(overNode);
		var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
		var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

		// make debugger stepper
		var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

		return function stepper(model)
		{
			appStepper(model);
			overStepper(model);
			debugStepper(model);
		}
	};
}

function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef)
{
	var curr;
	var domNode;

	return function stepper(model)
	{
		if (!model.isDebuggerOpen)
		{
			return;
		}

		if (!popoutRef.doc)
		{
			curr = view(model);
			domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
			return;
		}

		// switch to document of popout
		localDoc = popoutRef.doc;

		var next = view(model);
		var patches = diff(curr, next);
		domNode = applyPatches(domNode, curr, patches, eventNode);
		curr = next;

		// switch back to normal document
		localDoc = document;
	};
}

function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode)
{
	var w = 900;
	var h = 360;
	var x = screen.width - w;
	var y = screen.height - h;
	var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

	// switch to window document
	localDoc = debugWindow.document;

	popoutRef.doc = localDoc;
	localDoc.title = 'Debugger - ' + moduleName;
	localDoc.body.style.margin = '0';
	localDoc.body.style.padding = '0';
	var domNode = render(virtualNode, eventNode);
	localDoc.body.appendChild(domNode);

	localDoc.addEventListener('keydown', function(event) {
		if (event.metaKey && event.which === 82)
		{
			window.location.reload();
		}
		if (event.which === 38)
		{
			eventNode.tagger({ ctor: 'Up' });
			event.preventDefault();
		}
		if (event.which === 40)
		{
			eventNode.tagger({ ctor: 'Down' });
			event.preventDefault();
		}
	});

	function close()
	{
		popoutRef.doc = undefined;
		debugWindow.close();
	}
	window.addEventListener('unload', close);
	debugWindow.addEventListener('unload', function() {
		popoutRef.doc = undefined;
		window.removeEventListener('unload', close);
		eventNode.tagger({ ctor: 'Close' });
	});

	// switch back to the normal document
	localDoc = document;

	return domNode;
}


// BLOCK EVENTS

function wrapViewIn(appEventNode, overlayNode, viewIn)
{
	var ignorer = makeIgnorer(overlayNode);
	var blocking = 'Normal';
	var overflow;

	var normalTagger = appEventNode.tagger;
	var blockTagger = function() {};

	return function(model)
	{
		var tuple = viewIn(model);
		var newBlocking = tuple._0.ctor;
		appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
		if (blocking !== newBlocking)
		{
			traverse('removeEventListener', ignorer, blocking);
			traverse('addEventListener', ignorer, newBlocking);

			if (blocking === 'Normal')
			{
				overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}

			if (newBlocking === 'Normal')
			{
				document.body.style.overflow = overflow;
			}

			blocking = newBlocking;
		}
		return tuple._1;
	}
}

function traverse(verbEventListener, ignorer, blocking)
{
	switch(blocking)
	{
		case 'Normal':
			return;

		case 'Pause':
			return traverseHelp(verbEventListener, ignorer, mostEvents);

		case 'Message':
			return traverseHelp(verbEventListener, ignorer, allEvents);
	}
}

function traverseHelp(verbEventListener, handler, eventNames)
{
	for (var i = 0; i < eventNames.length; i++)
	{
		document.body[verbEventListener](eventNames[i], handler, true);
	}
}

function makeIgnorer(overlayNode)
{
	return function(event)
	{
		if (event.type === 'keydown' && event.metaKey && event.which === 82)
		{
			return;
		}

		var isScroll = event.type === 'scroll' || event.type === 'wheel';

		var node = event.target;
		while (node !== null)
		{
			if (node.className === 'elm-overlay-message-details' && isScroll)
			{
				return;
			}

			if (node === overlayNode && !isScroll)
			{
				return;
			}
			node = node.parentNode;
		}

		event.stopPropagation();
		event.preventDefault();
	}
}

var mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var allEvents = mostEvents.concat('wheel', 'scroll');


return {
	node: node,
	text: text,
	custom: custom,
	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),
	mapProperty: F2(mapProperty),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),
	keyedNode: F3(keyedNode),

	program: program,
	programWithFlags: programWithFlags,
	staticProgram: staticProgram
};

}();

var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
};
var _elm_lang$virtual_dom$VirtualDom$program = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
};
var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
var _elm_lang$html$Html$beginnerProgram = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$program(
		{
			init: A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_p1.model,
				{ctor: '[]'}),
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p1.update, msg, model),
						{ctor: '[]'});
				}),
			view: _p1.view,
			subscriptions: function (_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'maxlength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'colspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rowspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type_ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _elm_lang$http$Native_Http = function() {


// ENCODING AND DECODING

function encodeUri(string)
{
	return encodeURIComponent(string);
}

function decodeUri(string)
{
	try
	{
		return _elm_lang$core$Maybe$Just(decodeURIComponent(string));
	}
	catch(e)
	{
		return _elm_lang$core$Maybe$Nothing;
	}
}


// SEND REQUEST

function toTask(request, maybeProgress)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NetworkError' }));
		});
		xhr.addEventListener('timeout', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Timeout' }));
		});
		xhr.addEventListener('load', function() {
			callback(handleResponse(xhr, request.expect.responseToResult));
		});

		try
		{
			xhr.open(request.method, request.url, true);
		}
		catch (e)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'BadUrl', _0: request.url }));
		}

		configureRequest(xhr, request);
		send(xhr, request.body);

		return function() { xhr.abort(); };
	});
}

function configureProgress(xhr, maybeProgress)
{
	if (maybeProgress.ctor === 'Nothing')
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_elm_lang$core$Native_Scheduler.rawSpawn(maybeProgress._0({
			bytes: event.loaded,
			bytesExpected: event.total
		}));
	});
}

function configureRequest(xhr, request)
{
	function setHeader(pair)
	{
		xhr.setRequestHeader(pair._0, pair._1);
	}

	A2(_elm_lang$core$List$map, setHeader, request.headers);
	xhr.responseType = request.expect.responseType;
	xhr.withCredentials = request.withCredentials;

	if (request.timeout.ctor === 'Just')
	{
		xhr.timeout = request.timeout._0;
	}
}

function send(xhr, body)
{
	switch (body.ctor)
	{
		case 'EmptyBody':
			xhr.send();
			return;

		case 'StringBody':
			xhr.setRequestHeader('Content-Type', body._0);
			xhr.send(body._1);
			return;

		case 'FormDataBody':
			xhr.send(body._0);
			return;
	}
}


// RESPONSES

function handleResponse(xhr, responseToResult)
{
	var response = toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadStatus',
			_0: response
		});
	}

	var result = responseToResult(response);

	if (result.ctor === 'Ok')
	{
		return _elm_lang$core$Native_Scheduler.succeed(result._0);
	}
	else
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadPayload',
			_0: result._0,
			_1: response
		});
	}
}

function toResponse(xhr)
{
	return {
		status: { code: xhr.status, message: xhr.statusText },
		headers: parseHeaders(xhr.getAllResponseHeaders()),
		url: xhr.responseURL,
		body: xhr.response
	};
}

function parseHeaders(rawHeaders)
{
	var headers = _elm_lang$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(_elm_lang$core$Dict$update, key, function(oldValue) {
				if (oldValue.ctor === 'Just')
				{
					return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
				}
				return _elm_lang$core$Maybe$Just(value);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function expectStringResponse(responseToResult)
{
	return {
		responseType: 'text',
		responseToResult: responseToResult
	};
}

function mapExpect(func, expect)
{
	return {
		responseType: expect.responseType,
		responseToResult: function(response) {
			var convertedResponse = expect.responseToResult(response);
			return A2(_elm_lang$core$Result$map, func, convertedResponse);
		}
	};
}


// BODY

function multipart(parts)
{
	var formData = new FormData();

	while (parts.ctor !== '[]')
	{
		var part = parts._0;
		formData.append(part._0, part._1);
		parts = parts._1;
	}

	return { ctor: 'FormDataBody', _0: formData };
}

return {
	toTask: F2(toTask),
	expectStringResponse: expectStringResponse,
	mapExpect: F2(mapExpect),
	multipart: multipart,
	encodeUri: encodeUri,
	decodeUri: decodeUri
};

}();

var _elm_lang$http$Http_Internal$map = F2(
	function (func, request) {
		return _elm_lang$core$Native_Utils.update(
			request,
			{
				expect: A2(_elm_lang$http$Native_Http.mapExpect, func, request.expect)
			});
	});
var _elm_lang$http$Http_Internal$RawRequest = F7(
	function (a, b, c, d, e, f, g) {
		return {method: a, headers: b, url: c, body: d, expect: e, timeout: f, withCredentials: g};
	});
var _elm_lang$http$Http_Internal$Request = function (a) {
	return {ctor: 'Request', _0: a};
};
var _elm_lang$http$Http_Internal$Expect = {ctor: 'Expect'};
var _elm_lang$http$Http_Internal$FormDataBody = {ctor: 'FormDataBody'};
var _elm_lang$http$Http_Internal$StringBody = F2(
	function (a, b) {
		return {ctor: 'StringBody', _0: a, _1: b};
	});
var _elm_lang$http$Http_Internal$EmptyBody = {ctor: 'EmptyBody'};
var _elm_lang$http$Http_Internal$Header = F2(
	function (a, b) {
		return {ctor: 'Header', _0: a, _1: b};
	});

var _elm_lang$http$Http$decodeUri = _elm_lang$http$Native_Http.decodeUri;
var _elm_lang$http$Http$encodeUri = _elm_lang$http$Native_Http.encodeUri;
var _elm_lang$http$Http$expectStringResponse = _elm_lang$http$Native_Http.expectStringResponse;
var _elm_lang$http$Http$expectJson = function (decoder) {
	return _elm_lang$http$Http$expectStringResponse(
		function (response) {
			return A2(_elm_lang$core$Json_Decode$decodeString, decoder, response.body);
		});
};
var _elm_lang$http$Http$expectString = _elm_lang$http$Http$expectStringResponse(
	function (response) {
		return _elm_lang$core$Result$Ok(response.body);
	});
var _elm_lang$http$Http$multipartBody = _elm_lang$http$Native_Http.multipart;
var _elm_lang$http$Http$stringBody = _elm_lang$http$Http_Internal$StringBody;
var _elm_lang$http$Http$jsonBody = function (value) {
	return A2(
		_elm_lang$http$Http_Internal$StringBody,
		'application/json',
		A2(_elm_lang$core$Json_Encode$encode, 0, value));
};
var _elm_lang$http$Http$emptyBody = _elm_lang$http$Http_Internal$EmptyBody;
var _elm_lang$http$Http$header = _elm_lang$http$Http_Internal$Header;
var _elm_lang$http$Http$request = _elm_lang$http$Http_Internal$Request;
var _elm_lang$http$Http$post = F3(
	function (url, body, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'POST',
				headers: {ctor: '[]'},
				url: url,
				body: body,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$get = F2(
	function (url, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'GET',
				headers: {ctor: '[]'},
				url: url,
				body: _elm_lang$http$Http$emptyBody,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$getString = function (url) {
	return _elm_lang$http$Http$request(
		{
			method: 'GET',
			headers: {ctor: '[]'},
			url: url,
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectString,
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
};
var _elm_lang$http$Http$toTask = function (_p0) {
	var _p1 = _p0;
	return A2(_elm_lang$http$Native_Http.toTask, _p1._0, _elm_lang$core$Maybe$Nothing);
};
var _elm_lang$http$Http$send = F2(
	function (resultToMessage, request) {
		return A2(
			_elm_lang$core$Task$attempt,
			resultToMessage,
			_elm_lang$http$Http$toTask(request));
	});
var _elm_lang$http$Http$Response = F4(
	function (a, b, c, d) {
		return {url: a, status: b, headers: c, body: d};
	});
var _elm_lang$http$Http$BadPayload = F2(
	function (a, b) {
		return {ctor: 'BadPayload', _0: a, _1: b};
	});
var _elm_lang$http$Http$BadStatus = function (a) {
	return {ctor: 'BadStatus', _0: a};
};
var _elm_lang$http$Http$NetworkError = {ctor: 'NetworkError'};
var _elm_lang$http$Http$Timeout = {ctor: 'Timeout'};
var _elm_lang$http$Http$BadUrl = function (a) {
	return {ctor: 'BadUrl', _0: a};
};
var _elm_lang$http$Http$StringPart = F2(
	function (a, b) {
		return {ctor: 'StringPart', _0: a, _1: b};
	});
var _elm_lang$http$Http$stringPart = _elm_lang$http$Http$StringPart;

var _elm_lang$navigation$Native_Navigation = function() {


// FAKE NAVIGATION

function go(n)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		if (n !== 0)
		{
			history.go(n);
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function pushState(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		history.pushState({}, '', url);
		callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
	});
}

function replaceState(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		history.replaceState({}, '', url);
		callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
	});
}


// REAL NAVIGATION

function reloadPage(skipCache)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		document.location.reload(skipCache);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function setLocation(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		try
		{
			window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			document.location.reload(false);
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


// GET LOCATION

function getLocation()
{
	var location = document.location;

	return {
		href: location.href,
		host: location.host,
		hostname: location.hostname,
		protocol: location.protocol,
		origin: location.origin,
		port_: location.port,
		pathname: location.pathname,
		search: location.search,
		hash: location.hash,
		username: location.username,
		password: location.password
	};
}


// DETECT IE11 PROBLEMS

function isInternetExplorer11()
{
	return window.navigator.userAgent.indexOf('Trident') !== -1;
}


return {
	go: go,
	setLocation: setLocation,
	reloadPage: reloadPage,
	pushState: pushState,
	replaceState: replaceState,
	getLocation: getLocation,
	isInternetExplorer11: isInternetExplorer11
};

}();

var _elm_lang$navigation$Navigation$replaceState = _elm_lang$navigation$Native_Navigation.replaceState;
var _elm_lang$navigation$Navigation$pushState = _elm_lang$navigation$Native_Navigation.pushState;
var _elm_lang$navigation$Navigation$go = _elm_lang$navigation$Native_Navigation.go;
var _elm_lang$navigation$Navigation$reloadPage = _elm_lang$navigation$Native_Navigation.reloadPage;
var _elm_lang$navigation$Navigation$setLocation = _elm_lang$navigation$Native_Navigation.setLocation;
var _elm_lang$navigation$Navigation_ops = _elm_lang$navigation$Navigation_ops || {};
_elm_lang$navigation$Navigation_ops['&>'] = F2(
	function (task1, task2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p0) {
				return task2;
			},
			task1);
	});
var _elm_lang$navigation$Navigation$notify = F3(
	function (router, subs, location) {
		var send = function (_p1) {
			var _p2 = _p1;
			return A2(
				_elm_lang$core$Platform$sendToApp,
				router,
				_p2._0(location));
		};
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Task$sequence(
				A2(_elm_lang$core$List$map, send, subs)),
			_elm_lang$core$Task$succeed(
				{ctor: '_Tuple0'}));
	});
var _elm_lang$navigation$Navigation$cmdHelp = F3(
	function (router, subs, cmd) {
		var _p3 = cmd;
		switch (_p3.ctor) {
			case 'Jump':
				return _elm_lang$navigation$Navigation$go(_p3._0);
			case 'New':
				return A2(
					_elm_lang$core$Task$andThen,
					A2(_elm_lang$navigation$Navigation$notify, router, subs),
					_elm_lang$navigation$Navigation$pushState(_p3._0));
			case 'Modify':
				return A2(
					_elm_lang$core$Task$andThen,
					A2(_elm_lang$navigation$Navigation$notify, router, subs),
					_elm_lang$navigation$Navigation$replaceState(_p3._0));
			case 'Visit':
				return _elm_lang$navigation$Navigation$setLocation(_p3._0);
			default:
				return _elm_lang$navigation$Navigation$reloadPage(_p3._0);
		}
	});
var _elm_lang$navigation$Navigation$killPopWatcher = function (popWatcher) {
	var _p4 = popWatcher;
	if (_p4.ctor === 'Normal') {
		return _elm_lang$core$Process$kill(_p4._0);
	} else {
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Process$kill(_p4._0),
			_elm_lang$core$Process$kill(_p4._1));
	}
};
var _elm_lang$navigation$Navigation$onSelfMsg = F3(
	function (router, location, state) {
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			A3(_elm_lang$navigation$Navigation$notify, router, state.subs, location),
			_elm_lang$core$Task$succeed(state));
	});
var _elm_lang$navigation$Navigation$subscription = _elm_lang$core$Native_Platform.leaf('Navigation');
var _elm_lang$navigation$Navigation$command = _elm_lang$core$Native_Platform.leaf('Navigation');
var _elm_lang$navigation$Navigation$Location = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return {href: a, host: b, hostname: c, protocol: d, origin: e, port_: f, pathname: g, search: h, hash: i, username: j, password: k};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$navigation$Navigation$State = F2(
	function (a, b) {
		return {subs: a, popWatcher: b};
	});
var _elm_lang$navigation$Navigation$init = _elm_lang$core$Task$succeed(
	A2(
		_elm_lang$navigation$Navigation$State,
		{ctor: '[]'},
		_elm_lang$core$Maybe$Nothing));
var _elm_lang$navigation$Navigation$Reload = function (a) {
	return {ctor: 'Reload', _0: a};
};
var _elm_lang$navigation$Navigation$reload = _elm_lang$navigation$Navigation$command(
	_elm_lang$navigation$Navigation$Reload(false));
var _elm_lang$navigation$Navigation$reloadAndSkipCache = _elm_lang$navigation$Navigation$command(
	_elm_lang$navigation$Navigation$Reload(true));
var _elm_lang$navigation$Navigation$Visit = function (a) {
	return {ctor: 'Visit', _0: a};
};
var _elm_lang$navigation$Navigation$load = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Visit(url));
};
var _elm_lang$navigation$Navigation$Modify = function (a) {
	return {ctor: 'Modify', _0: a};
};
var _elm_lang$navigation$Navigation$modifyUrl = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Modify(url));
};
var _elm_lang$navigation$Navigation$New = function (a) {
	return {ctor: 'New', _0: a};
};
var _elm_lang$navigation$Navigation$newUrl = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$New(url));
};
var _elm_lang$navigation$Navigation$Jump = function (a) {
	return {ctor: 'Jump', _0: a};
};
var _elm_lang$navigation$Navigation$back = function (n) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Jump(0 - n));
};
var _elm_lang$navigation$Navigation$forward = function (n) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Jump(n));
};
var _elm_lang$navigation$Navigation$cmdMap = F2(
	function (_p5, myCmd) {
		var _p6 = myCmd;
		switch (_p6.ctor) {
			case 'Jump':
				return _elm_lang$navigation$Navigation$Jump(_p6._0);
			case 'New':
				return _elm_lang$navigation$Navigation$New(_p6._0);
			case 'Modify':
				return _elm_lang$navigation$Navigation$Modify(_p6._0);
			case 'Visit':
				return _elm_lang$navigation$Navigation$Visit(_p6._0);
			default:
				return _elm_lang$navigation$Navigation$Reload(_p6._0);
		}
	});
var _elm_lang$navigation$Navigation$Monitor = function (a) {
	return {ctor: 'Monitor', _0: a};
};
var _elm_lang$navigation$Navigation$program = F2(
	function (locationToMessage, stuff) {
		var init = stuff.init(
			_elm_lang$navigation$Native_Navigation.getLocation(
				{ctor: '_Tuple0'}));
		var subs = function (model) {
			return _elm_lang$core$Platform_Sub$batch(
				{
					ctor: '::',
					_0: _elm_lang$navigation$Navigation$subscription(
						_elm_lang$navigation$Navigation$Monitor(locationToMessage)),
					_1: {
						ctor: '::',
						_0: stuff.subscriptions(model),
						_1: {ctor: '[]'}
					}
				});
		};
		return _elm_lang$html$Html$program(
			{init: init, view: stuff.view, update: stuff.update, subscriptions: subs});
	});
var _elm_lang$navigation$Navigation$programWithFlags = F2(
	function (locationToMessage, stuff) {
		var init = function (flags) {
			return A2(
				stuff.init,
				flags,
				_elm_lang$navigation$Native_Navigation.getLocation(
					{ctor: '_Tuple0'}));
		};
		var subs = function (model) {
			return _elm_lang$core$Platform_Sub$batch(
				{
					ctor: '::',
					_0: _elm_lang$navigation$Navigation$subscription(
						_elm_lang$navigation$Navigation$Monitor(locationToMessage)),
					_1: {
						ctor: '::',
						_0: stuff.subscriptions(model),
						_1: {ctor: '[]'}
					}
				});
		};
		return _elm_lang$html$Html$programWithFlags(
			{init: init, view: stuff.view, update: stuff.update, subscriptions: subs});
	});
var _elm_lang$navigation$Navigation$subMap = F2(
	function (func, _p7) {
		var _p8 = _p7;
		return _elm_lang$navigation$Navigation$Monitor(
			function (_p9) {
				return func(
					_p8._0(_p9));
			});
	});
var _elm_lang$navigation$Navigation$InternetExplorer = F2(
	function (a, b) {
		return {ctor: 'InternetExplorer', _0: a, _1: b};
	});
var _elm_lang$navigation$Navigation$Normal = function (a) {
	return {ctor: 'Normal', _0: a};
};
var _elm_lang$navigation$Navigation$spawnPopWatcher = function (router) {
	var reportLocation = function (_p10) {
		return A2(
			_elm_lang$core$Platform$sendToSelf,
			router,
			_elm_lang$navigation$Native_Navigation.getLocation(
				{ctor: '_Tuple0'}));
	};
	return _elm_lang$navigation$Native_Navigation.isInternetExplorer11(
		{ctor: '_Tuple0'}) ? A3(
		_elm_lang$core$Task$map2,
		_elm_lang$navigation$Navigation$InternetExplorer,
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'popstate', _elm_lang$core$Json_Decode$value, reportLocation)),
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'hashchange', _elm_lang$core$Json_Decode$value, reportLocation))) : A2(
		_elm_lang$core$Task$map,
		_elm_lang$navigation$Navigation$Normal,
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'popstate', _elm_lang$core$Json_Decode$value, reportLocation)));
};
var _elm_lang$navigation$Navigation$onEffects = F4(
	function (router, cmds, subs, _p11) {
		var _p12 = _p11;
		var _p15 = _p12.popWatcher;
		var stepState = function () {
			var _p13 = {ctor: '_Tuple2', _0: subs, _1: _p15};
			_v6_2:
			do {
				if (_p13._0.ctor === '[]') {
					if (_p13._1.ctor === 'Just') {
						return A2(
							_elm_lang$navigation$Navigation_ops['&>'],
							_elm_lang$navigation$Navigation$killPopWatcher(_p13._1._0),
							_elm_lang$core$Task$succeed(
								A2(_elm_lang$navigation$Navigation$State, subs, _elm_lang$core$Maybe$Nothing)));
					} else {
						break _v6_2;
					}
				} else {
					if (_p13._1.ctor === 'Nothing') {
						return A2(
							_elm_lang$core$Task$map,
							function (_p14) {
								return A2(
									_elm_lang$navigation$Navigation$State,
									subs,
									_elm_lang$core$Maybe$Just(_p14));
							},
							_elm_lang$navigation$Navigation$spawnPopWatcher(router));
					} else {
						break _v6_2;
					}
				}
			} while(false);
			return _elm_lang$core$Task$succeed(
				A2(_elm_lang$navigation$Navigation$State, subs, _p15));
		}();
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					A2(_elm_lang$navigation$Navigation$cmdHelp, router, subs),
					cmds)),
			stepState);
	});
_elm_lang$core$Native_Platform.effectManagers['Navigation'] = {pkg: 'elm-lang/navigation', init: _elm_lang$navigation$Navigation$init, onEffects: _elm_lang$navigation$Navigation$onEffects, onSelfMsg: _elm_lang$navigation$Navigation$onSelfMsg, tag: 'fx', cmdMap: _elm_lang$navigation$Navigation$cmdMap, subMap: _elm_lang$navigation$Navigation$subMap};

var _elm_lang$websocket$Native_WebSocket = function() {

function open(url, settings)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		try
		{
			var socket = new WebSocket(url);
			socket.elm_web_socket = true;
		}
		catch(err)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail({
				ctor: err.name === 'SecurityError' ? 'BadSecurity' : 'BadArgs',
				_0: err.message
			}));
		}

		socket.addEventListener("open", function(event) {
			callback(_elm_lang$core$Native_Scheduler.succeed(socket));
		});

		socket.addEventListener("message", function(event) {
			_elm_lang$core$Native_Scheduler.rawSpawn(A2(settings.onMessage, socket, event.data));
		});

		socket.addEventListener("close", function(event) {
			_elm_lang$core$Native_Scheduler.rawSpawn(settings.onClose({
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean
			}));
		});

		return function()
		{
			if (socket && socket.close)
			{
				socket.close();
			}
		};
	});
}

function send(socket, string)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var result =
			socket.readyState === WebSocket.OPEN
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just({ ctor: 'NotOpen' });

		try
		{
			socket.send(string);
		}
		catch(err)
		{
			result = _elm_lang$core$Maybe$Just({ ctor: 'BadString' });
		}

		callback(_elm_lang$core$Native_Scheduler.succeed(result));
	});
}

function close(code, reason, socket)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		try
		{
			socket.close(code, reason);
		}
		catch(err)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail(_elm_lang$core$Maybe$Just({
				ctor: err.name === 'SyntaxError' ? 'BadReason' : 'BadCode'
			})));
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Maybe$Nothing));
	});
}

function bytesQueued(socket)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		callback(_elm_lang$core$Native_Scheduler.succeed(socket.bufferedAmount));
	});
}

return {
	open: F2(open),
	send: F2(send),
	close: F3(close),
	bytesQueued: bytesQueued
};

}();

var _elm_lang$websocket$WebSocket_LowLevel$bytesQueued = _elm_lang$websocket$Native_WebSocket.bytesQueued;
var _elm_lang$websocket$WebSocket_LowLevel$send = _elm_lang$websocket$Native_WebSocket.send;
var _elm_lang$websocket$WebSocket_LowLevel$closeWith = _elm_lang$websocket$Native_WebSocket.close;
var _elm_lang$websocket$WebSocket_LowLevel$close = function (socket) {
	return A2(
		_elm_lang$core$Task$map,
		_elm_lang$core$Basics$always(
			{ctor: '_Tuple0'}),
		A3(_elm_lang$websocket$WebSocket_LowLevel$closeWith, 1000, '', socket));
};
var _elm_lang$websocket$WebSocket_LowLevel$open = _elm_lang$websocket$Native_WebSocket.open;
var _elm_lang$websocket$WebSocket_LowLevel$Settings = F2(
	function (a, b) {
		return {onMessage: a, onClose: b};
	});
var _elm_lang$websocket$WebSocket_LowLevel$WebSocket = {ctor: 'WebSocket'};
var _elm_lang$websocket$WebSocket_LowLevel$BadArgs = {ctor: 'BadArgs'};
var _elm_lang$websocket$WebSocket_LowLevel$BadSecurity = {ctor: 'BadSecurity'};
var _elm_lang$websocket$WebSocket_LowLevel$BadReason = {ctor: 'BadReason'};
var _elm_lang$websocket$WebSocket_LowLevel$BadCode = {ctor: 'BadCode'};
var _elm_lang$websocket$WebSocket_LowLevel$BadString = {ctor: 'BadString'};
var _elm_lang$websocket$WebSocket_LowLevel$NotOpen = {ctor: 'NotOpen'};

var _elm_lang$websocket$WebSocket$closeConnection = function (connection) {
	var _p0 = connection;
	if (_p0.ctor === 'Opening') {
		return _elm_lang$core$Process$kill(_p0._1);
	} else {
		return _elm_lang$websocket$WebSocket_LowLevel$close(_p0._0);
	}
};
var _elm_lang$websocket$WebSocket$after = function (backoff) {
	return (_elm_lang$core$Native_Utils.cmp(backoff, 1) < 0) ? _elm_lang$core$Task$succeed(
		{ctor: '_Tuple0'}) : _elm_lang$core$Process$sleep(
		_elm_lang$core$Basics$toFloat(
			10 * Math.pow(2, backoff)));
};
var _elm_lang$websocket$WebSocket$removeQueue = F2(
	function (name, state) {
		return _elm_lang$core$Native_Utils.update(
			state,
			{
				queues: A2(_elm_lang$core$Dict$remove, name, state.queues)
			});
	});
var _elm_lang$websocket$WebSocket$updateSocket = F3(
	function (name, connection, state) {
		return _elm_lang$core$Native_Utils.update(
			state,
			{
				sockets: A3(_elm_lang$core$Dict$insert, name, connection, state.sockets)
			});
	});
var _elm_lang$websocket$WebSocket$add = F2(
	function (value, maybeList) {
		var _p1 = maybeList;
		if (_p1.ctor === 'Nothing') {
			return _elm_lang$core$Maybe$Just(
				{
					ctor: '::',
					_0: value,
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Maybe$Just(
				{ctor: '::', _0: value, _1: _p1._0});
		}
	});
var _elm_lang$websocket$WebSocket$buildSubDict = F2(
	function (subs, dict) {
		buildSubDict:
		while (true) {
			var _p2 = subs;
			if (_p2.ctor === '[]') {
				return dict;
			} else {
				if (_p2._0.ctor === 'Listen') {
					var _v3 = _p2._1,
						_v4 = A3(
						_elm_lang$core$Dict$update,
						_p2._0._0,
						_elm_lang$websocket$WebSocket$add(_p2._0._1),
						dict);
					subs = _v3;
					dict = _v4;
					continue buildSubDict;
				} else {
					var _v5 = _p2._1,
						_v6 = A3(
						_elm_lang$core$Dict$update,
						_p2._0._0,
						function (_p3) {
							return _elm_lang$core$Maybe$Just(
								A2(
									_elm_lang$core$Maybe$withDefault,
									{ctor: '[]'},
									_p3));
						},
						dict);
					subs = _v5;
					dict = _v6;
					continue buildSubDict;
				}
			}
		}
	});
var _elm_lang$websocket$WebSocket_ops = _elm_lang$websocket$WebSocket_ops || {};
_elm_lang$websocket$WebSocket_ops['&>'] = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p4) {
				return t2;
			},
			t1);
	});
var _elm_lang$websocket$WebSocket$sendMessagesHelp = F3(
	function (cmds, socketsDict, queuesDict) {
		sendMessagesHelp:
		while (true) {
			var _p5 = cmds;
			if (_p5.ctor === '[]') {
				return _elm_lang$core$Task$succeed(queuesDict);
			} else {
				var _p9 = _p5._1;
				var _p8 = _p5._0._0;
				var _p7 = _p5._0._1;
				var _p6 = A2(_elm_lang$core$Dict$get, _p8, socketsDict);
				if ((_p6.ctor === 'Just') && (_p6._0.ctor === 'Connected')) {
					return A2(
						_elm_lang$websocket$WebSocket_ops['&>'],
						A2(_elm_lang$websocket$WebSocket_LowLevel$send, _p6._0._0, _p7),
						A3(_elm_lang$websocket$WebSocket$sendMessagesHelp, _p9, socketsDict, queuesDict));
				} else {
					var _v9 = _p9,
						_v10 = socketsDict,
						_v11 = A3(
						_elm_lang$core$Dict$update,
						_p8,
						_elm_lang$websocket$WebSocket$add(_p7),
						queuesDict);
					cmds = _v9;
					socketsDict = _v10;
					queuesDict = _v11;
					continue sendMessagesHelp;
				}
			}
		}
	});
var _elm_lang$websocket$WebSocket$subscription = _elm_lang$core$Native_Platform.leaf('WebSocket');
var _elm_lang$websocket$WebSocket$command = _elm_lang$core$Native_Platform.leaf('WebSocket');
var _elm_lang$websocket$WebSocket$State = F3(
	function (a, b, c) {
		return {sockets: a, queues: b, subs: c};
	});
var _elm_lang$websocket$WebSocket$init = _elm_lang$core$Task$succeed(
	A3(_elm_lang$websocket$WebSocket$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$websocket$WebSocket$Send = F2(
	function (a, b) {
		return {ctor: 'Send', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$send = F2(
	function (url, message) {
		return _elm_lang$websocket$WebSocket$command(
			A2(_elm_lang$websocket$WebSocket$Send, url, message));
	});
var _elm_lang$websocket$WebSocket$cmdMap = F2(
	function (_p11, _p10) {
		var _p12 = _p10;
		return A2(_elm_lang$websocket$WebSocket$Send, _p12._0, _p12._1);
	});
var _elm_lang$websocket$WebSocket$KeepAlive = function (a) {
	return {ctor: 'KeepAlive', _0: a};
};
var _elm_lang$websocket$WebSocket$keepAlive = function (url) {
	return _elm_lang$websocket$WebSocket$subscription(
		_elm_lang$websocket$WebSocket$KeepAlive(url));
};
var _elm_lang$websocket$WebSocket$Listen = F2(
	function (a, b) {
		return {ctor: 'Listen', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$listen = F2(
	function (url, tagger) {
		return _elm_lang$websocket$WebSocket$subscription(
			A2(_elm_lang$websocket$WebSocket$Listen, url, tagger));
	});
var _elm_lang$websocket$WebSocket$subMap = F2(
	function (func, sub) {
		var _p13 = sub;
		if (_p13.ctor === 'Listen') {
			return A2(
				_elm_lang$websocket$WebSocket$Listen,
				_p13._0,
				function (_p14) {
					return func(
						_p13._1(_p14));
				});
		} else {
			return _elm_lang$websocket$WebSocket$KeepAlive(_p13._0);
		}
	});
var _elm_lang$websocket$WebSocket$Connected = function (a) {
	return {ctor: 'Connected', _0: a};
};
var _elm_lang$websocket$WebSocket$Opening = F2(
	function (a, b) {
		return {ctor: 'Opening', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$BadOpen = function (a) {
	return {ctor: 'BadOpen', _0: a};
};
var _elm_lang$websocket$WebSocket$GoodOpen = F2(
	function (a, b) {
		return {ctor: 'GoodOpen', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$Die = function (a) {
	return {ctor: 'Die', _0: a};
};
var _elm_lang$websocket$WebSocket$Receive = F2(
	function (a, b) {
		return {ctor: 'Receive', _0: a, _1: b};
	});
var _elm_lang$websocket$WebSocket$open = F2(
	function (name, router) {
		return A2(
			_elm_lang$websocket$WebSocket_LowLevel$open,
			name,
			{
				onMessage: F2(
					function (_p15, msg) {
						return A2(
							_elm_lang$core$Platform$sendToSelf,
							router,
							A2(_elm_lang$websocket$WebSocket$Receive, name, msg));
					}),
				onClose: function (details) {
					return A2(
						_elm_lang$core$Platform$sendToSelf,
						router,
						_elm_lang$websocket$WebSocket$Die(name));
				}
			});
	});
var _elm_lang$websocket$WebSocket$attemptOpen = F3(
	function (router, backoff, name) {
		var badOpen = function (_p16) {
			return A2(
				_elm_lang$core$Platform$sendToSelf,
				router,
				_elm_lang$websocket$WebSocket$BadOpen(name));
		};
		var goodOpen = function (ws) {
			return A2(
				_elm_lang$core$Platform$sendToSelf,
				router,
				A2(_elm_lang$websocket$WebSocket$GoodOpen, name, ws));
		};
		var actuallyAttemptOpen = A2(
			_elm_lang$core$Task$onError,
			badOpen,
			A2(
				_elm_lang$core$Task$andThen,
				goodOpen,
				A2(_elm_lang$websocket$WebSocket$open, name, router)));
		return _elm_lang$core$Process$spawn(
			A2(
				_elm_lang$websocket$WebSocket_ops['&>'],
				_elm_lang$websocket$WebSocket$after(backoff),
				actuallyAttemptOpen));
	});
var _elm_lang$websocket$WebSocket$onEffects = F4(
	function (router, cmds, subs, state) {
		var newSubs = A2(_elm_lang$websocket$WebSocket$buildSubDict, subs, _elm_lang$core$Dict$empty);
		var cleanup = function (newQueues) {
			var rightStep = F3(
				function (name, connection, getNewSockets) {
					return A2(
						_elm_lang$websocket$WebSocket_ops['&>'],
						_elm_lang$websocket$WebSocket$closeConnection(connection),
						getNewSockets);
				});
			var bothStep = F4(
				function (name, _p17, connection, getNewSockets) {
					return A2(
						_elm_lang$core$Task$map,
						A2(_elm_lang$core$Dict$insert, name, connection),
						getNewSockets);
				});
			var leftStep = F3(
				function (name, _p18, getNewSockets) {
					return A2(
						_elm_lang$core$Task$andThen,
						function (newSockets) {
							return A2(
								_elm_lang$core$Task$andThen,
								function (pid) {
									return _elm_lang$core$Task$succeed(
										A3(
											_elm_lang$core$Dict$insert,
											name,
											A2(_elm_lang$websocket$WebSocket$Opening, 0, pid),
											newSockets));
								},
								A3(_elm_lang$websocket$WebSocket$attemptOpen, router, 0, name));
						},
						getNewSockets);
				});
			var newEntries = A2(
				_elm_lang$core$Dict$union,
				newQueues,
				A2(
					_elm_lang$core$Dict$map,
					F2(
						function (k, v) {
							return {ctor: '[]'};
						}),
					newSubs));
			var collectNewSockets = A6(
				_elm_lang$core$Dict$merge,
				leftStep,
				bothStep,
				rightStep,
				newEntries,
				state.sockets,
				_elm_lang$core$Task$succeed(_elm_lang$core$Dict$empty));
			return A2(
				_elm_lang$core$Task$andThen,
				function (newSockets) {
					return _elm_lang$core$Task$succeed(
						A3(_elm_lang$websocket$WebSocket$State, newSockets, newQueues, newSubs));
				},
				collectNewSockets);
		};
		var sendMessagesGetNewQueues = A3(_elm_lang$websocket$WebSocket$sendMessagesHelp, cmds, state.sockets, state.queues);
		return A2(_elm_lang$core$Task$andThen, cleanup, sendMessagesGetNewQueues);
	});
var _elm_lang$websocket$WebSocket$onSelfMsg = F3(
	function (router, selfMsg, state) {
		var _p19 = selfMsg;
		switch (_p19.ctor) {
			case 'Receive':
				var sends = A2(
					_elm_lang$core$List$map,
					function (tagger) {
						return A2(
							_elm_lang$core$Platform$sendToApp,
							router,
							tagger(_p19._1));
					},
					A2(
						_elm_lang$core$Maybe$withDefault,
						{ctor: '[]'},
						A2(_elm_lang$core$Dict$get, _p19._0, state.subs)));
				return A2(
					_elm_lang$websocket$WebSocket_ops['&>'],
					_elm_lang$core$Task$sequence(sends),
					_elm_lang$core$Task$succeed(state));
			case 'Die':
				var _p21 = _p19._0;
				var _p20 = A2(_elm_lang$core$Dict$get, _p21, state.sockets);
				if (_p20.ctor === 'Nothing') {
					return _elm_lang$core$Task$succeed(state);
				} else {
					return A2(
						_elm_lang$core$Task$andThen,
						function (pid) {
							return _elm_lang$core$Task$succeed(
								A3(
									_elm_lang$websocket$WebSocket$updateSocket,
									_p21,
									A2(_elm_lang$websocket$WebSocket$Opening, 0, pid),
									state));
						},
						A3(_elm_lang$websocket$WebSocket$attemptOpen, router, 0, _p21));
				}
			case 'GoodOpen':
				var _p24 = _p19._1;
				var _p23 = _p19._0;
				var _p22 = A2(_elm_lang$core$Dict$get, _p23, state.queues);
				if (_p22.ctor === 'Nothing') {
					return _elm_lang$core$Task$succeed(
						A3(
							_elm_lang$websocket$WebSocket$updateSocket,
							_p23,
							_elm_lang$websocket$WebSocket$Connected(_p24),
							state));
				} else {
					return A3(
						_elm_lang$core$List$foldl,
						F2(
							function (msg, task) {
								return A2(
									_elm_lang$websocket$WebSocket_ops['&>'],
									A2(_elm_lang$websocket$WebSocket_LowLevel$send, _p24, msg),
									task);
							}),
						_elm_lang$core$Task$succeed(
							A2(
								_elm_lang$websocket$WebSocket$removeQueue,
								_p23,
								A3(
									_elm_lang$websocket$WebSocket$updateSocket,
									_p23,
									_elm_lang$websocket$WebSocket$Connected(_p24),
									state))),
						_p22._0);
				}
			default:
				var _p27 = _p19._0;
				var _p25 = A2(_elm_lang$core$Dict$get, _p27, state.sockets);
				if (_p25.ctor === 'Nothing') {
					return _elm_lang$core$Task$succeed(state);
				} else {
					if (_p25._0.ctor === 'Opening') {
						var _p26 = _p25._0._0;
						return A2(
							_elm_lang$core$Task$andThen,
							function (pid) {
								return _elm_lang$core$Task$succeed(
									A3(
										_elm_lang$websocket$WebSocket$updateSocket,
										_p27,
										A2(_elm_lang$websocket$WebSocket$Opening, _p26 + 1, pid),
										state));
							},
							A3(_elm_lang$websocket$WebSocket$attemptOpen, router, _p26 + 1, _p27));
					} else {
						return _elm_lang$core$Task$succeed(state);
					}
				}
		}
	});
_elm_lang$core$Native_Platform.effectManagers['WebSocket'] = {pkg: 'elm-lang/websocket', init: _elm_lang$websocket$WebSocket$init, onEffects: _elm_lang$websocket$WebSocket$onEffects, onSelfMsg: _elm_lang$websocket$WebSocket$onSelfMsg, tag: 'fx', cmdMap: _elm_lang$websocket$WebSocket$cmdMap, subMap: _elm_lang$websocket$WebSocket$subMap};

var _evancz$elm_markdown$Native_Markdown = function() {


// VIRTUAL-DOM WIDGETS

function toHtml(options, factList, rawMarkdown)
{
	var model = {
		options: options,
		markdown: rawMarkdown
	};
	return _elm_lang$virtual_dom$Native_VirtualDom.custom(factList, model, implementation);
}


// WIDGET IMPLEMENTATION

var implementation = {
	render: render,
	diff: diff
};

function render(model)
{
	var html = marked(model.markdown, formatOptions(model.options));
	var div = document.createElement('div');
	div.innerHTML = html;
	return div;
}

function diff(a, b)
{
	
	if (a.model.markdown === b.model.markdown && a.model.options === b.model.options)
	{
		return null;
	}

	return {
		applyPatch: applyPatch,
		data: marked(b.model.markdown, formatOptions(b.model.options))
	};
}

function applyPatch(domNode, data)
{
	domNode.innerHTML = data;
	return domNode;
}


// ACTUAL MARKDOWN PARSER

var marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && options.defaultHighlighting.ctor === 'Just')
		{
			lang = options.defaultHighlighting._0;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.githubFlavored;
	if (gfm.ctor === 'Just')
	{
		return {
			highlight: toHighlight,
			gfm: true,
			tables: gfm._0.tables,
			breaks: gfm._0.breaks,
			sanitize: options.sanitize,
			smartypants: options.smartypants
		};
	}

	return {
		highlight: toHighlight,
		gfm: false,
		tables: false,
		breaks: false,
		sanitize: options.sanitize,
		smartypants: options.smartypants
	};
}


// EXPORTS

return {
	toHtml: F3(toHtml)
};

}();

var _evancz$elm_markdown$Markdown$toHtmlWith = _evancz$elm_markdown$Native_Markdown.toHtml;
var _evancz$elm_markdown$Markdown$defaultOptions = {
	githubFlavored: _elm_lang$core$Maybe$Just(
		{tables: false, breaks: false}),
	defaultHighlighting: _elm_lang$core$Maybe$Nothing,
	sanitize: false,
	smartypants: false
};
var _evancz$elm_markdown$Markdown$toHtml = F2(
	function (attrs, string) {
		return A3(_evancz$elm_markdown$Native_Markdown.toHtml, _evancz$elm_markdown$Markdown$defaultOptions, attrs, string);
	});
var _evancz$elm_markdown$Markdown$Options = F4(
	function (a, b, c, d) {
		return {githubFlavored: a, defaultHighlighting: b, sanitize: c, smartypants: d};
	});

var _evancz$url_parser$UrlParser$toKeyValuePair = function (segment) {
	var _p0 = A2(_elm_lang$core$String$split, '=', segment);
	if (((_p0.ctor === '::') && (_p0._1.ctor === '::')) && (_p0._1._1.ctor === '[]')) {
		return A3(
			_elm_lang$core$Maybe$map2,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			_elm_lang$http$Http$decodeUri(_p0._0),
			_elm_lang$http$Http$decodeUri(_p0._1._0));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _evancz$url_parser$UrlParser$parseParams = function (queryString) {
	return _elm_lang$core$Dict$fromList(
		A2(
			_elm_lang$core$List$filterMap,
			_evancz$url_parser$UrlParser$toKeyValuePair,
			A2(
				_elm_lang$core$String$split,
				'&',
				A2(_elm_lang$core$String$dropLeft, 1, queryString))));
};
var _evancz$url_parser$UrlParser$splitUrl = function (url) {
	var _p1 = A2(_elm_lang$core$String$split, '/', url);
	if ((_p1.ctor === '::') && (_p1._0 === '')) {
		return _p1._1;
	} else {
		return _p1;
	}
};
var _evancz$url_parser$UrlParser$parseHelp = function (states) {
	parseHelp:
	while (true) {
		var _p2 = states;
		if (_p2.ctor === '[]') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var _p4 = _p2._0;
			var _p3 = _p4.unvisited;
			if (_p3.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p4.value);
			} else {
				if ((_p3._0 === '') && (_p3._1.ctor === '[]')) {
					return _elm_lang$core$Maybe$Just(_p4.value);
				} else {
					var _v4 = _p2._1;
					states = _v4;
					continue parseHelp;
				}
			}
		}
	}
};
var _evancz$url_parser$UrlParser$parse = F3(
	function (_p5, url, params) {
		var _p6 = _p5;
		return _evancz$url_parser$UrlParser$parseHelp(
			_p6._0(
				{
					visited: {ctor: '[]'},
					unvisited: _evancz$url_parser$UrlParser$splitUrl(url),
					params: params,
					value: _elm_lang$core$Basics$identity
				}));
	});
var _evancz$url_parser$UrlParser$parseHash = F2(
	function (parser, location) {
		return A3(
			_evancz$url_parser$UrlParser$parse,
			parser,
			A2(_elm_lang$core$String$dropLeft, 1, location.hash),
			_evancz$url_parser$UrlParser$parseParams(location.search));
	});
var _evancz$url_parser$UrlParser$parsePath = F2(
	function (parser, location) {
		return A3(
			_evancz$url_parser$UrlParser$parse,
			parser,
			location.pathname,
			_evancz$url_parser$UrlParser$parseParams(location.search));
	});
var _evancz$url_parser$UrlParser$intParamHelp = function (maybeValue) {
	var _p7 = maybeValue;
	if (_p7.ctor === 'Nothing') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Result$toMaybe(
			_elm_lang$core$String$toInt(_p7._0));
	}
};
var _evancz$url_parser$UrlParser$mapHelp = F2(
	function (func, _p8) {
		var _p9 = _p8;
		return {
			visited: _p9.visited,
			unvisited: _p9.unvisited,
			params: _p9.params,
			value: func(_p9.value)
		};
	});
var _evancz$url_parser$UrlParser$State = F4(
	function (a, b, c, d) {
		return {visited: a, unvisited: b, params: c, value: d};
	});
var _evancz$url_parser$UrlParser$Parser = function (a) {
	return {ctor: 'Parser', _0: a};
};
var _evancz$url_parser$UrlParser$s = function (str) {
	return _evancz$url_parser$UrlParser$Parser(
		function (_p10) {
			var _p11 = _p10;
			var _p12 = _p11.unvisited;
			if (_p12.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p13 = _p12._0;
				return _elm_lang$core$Native_Utils.eq(_p13, str) ? {
					ctor: '::',
					_0: A4(
						_evancz$url_parser$UrlParser$State,
						{ctor: '::', _0: _p13, _1: _p11.visited},
						_p12._1,
						_p11.params,
						_p11.value),
					_1: {ctor: '[]'}
				} : {ctor: '[]'};
			}
		});
};
var _evancz$url_parser$UrlParser$custom = F2(
	function (tipe, stringToSomething) {
		return _evancz$url_parser$UrlParser$Parser(
			function (_p14) {
				var _p15 = _p14;
				var _p16 = _p15.unvisited;
				if (_p16.ctor === '[]') {
					return {ctor: '[]'};
				} else {
					var _p18 = _p16._0;
					var _p17 = stringToSomething(_p18);
					if (_p17.ctor === 'Ok') {
						return {
							ctor: '::',
							_0: A4(
								_evancz$url_parser$UrlParser$State,
								{ctor: '::', _0: _p18, _1: _p15.visited},
								_p16._1,
								_p15.params,
								_p15.value(_p17._0)),
							_1: {ctor: '[]'}
						};
					} else {
						return {ctor: '[]'};
					}
				}
			});
	});
var _evancz$url_parser$UrlParser$string = A2(_evancz$url_parser$UrlParser$custom, 'STRING', _elm_lang$core$Result$Ok);
var _evancz$url_parser$UrlParser$int = A2(_evancz$url_parser$UrlParser$custom, 'NUMBER', _elm_lang$core$String$toInt);
var _evancz$url_parser$UrlParser_ops = _evancz$url_parser$UrlParser_ops || {};
_evancz$url_parser$UrlParser_ops['</>'] = F2(
	function (_p20, _p19) {
		var _p21 = _p20;
		var _p22 = _p19;
		return _evancz$url_parser$UrlParser$Parser(
			function (state) {
				return A2(
					_elm_lang$core$List$concatMap,
					_p22._0,
					_p21._0(state));
			});
	});
var _evancz$url_parser$UrlParser$map = F2(
	function (subValue, _p23) {
		var _p24 = _p23;
		return _evancz$url_parser$UrlParser$Parser(
			function (_p25) {
				var _p26 = _p25;
				return A2(
					_elm_lang$core$List$map,
					_evancz$url_parser$UrlParser$mapHelp(_p26.value),
					_p24._0(
						{visited: _p26.visited, unvisited: _p26.unvisited, params: _p26.params, value: subValue}));
			});
	});
var _evancz$url_parser$UrlParser$oneOf = function (parsers) {
	return _evancz$url_parser$UrlParser$Parser(
		function (state) {
			return A2(
				_elm_lang$core$List$concatMap,
				function (_p27) {
					var _p28 = _p27;
					return _p28._0(state);
				},
				parsers);
		});
};
var _evancz$url_parser$UrlParser$top = _evancz$url_parser$UrlParser$Parser(
	function (state) {
		return {
			ctor: '::',
			_0: state,
			_1: {ctor: '[]'}
		};
	});
var _evancz$url_parser$UrlParser_ops = _evancz$url_parser$UrlParser_ops || {};
_evancz$url_parser$UrlParser_ops['<?>'] = F2(
	function (_p30, _p29) {
		var _p31 = _p30;
		var _p32 = _p29;
		return _evancz$url_parser$UrlParser$Parser(
			function (state) {
				return A2(
					_elm_lang$core$List$concatMap,
					_p32._0,
					_p31._0(state));
			});
	});
var _evancz$url_parser$UrlParser$QueryParser = function (a) {
	return {ctor: 'QueryParser', _0: a};
};
var _evancz$url_parser$UrlParser$customParam = F2(
	function (key, func) {
		return _evancz$url_parser$UrlParser$QueryParser(
			function (_p33) {
				var _p34 = _p33;
				var _p35 = _p34.params;
				return {
					ctor: '::',
					_0: A4(
						_evancz$url_parser$UrlParser$State,
						_p34.visited,
						_p34.unvisited,
						_p35,
						_p34.value(
							func(
								A2(_elm_lang$core$Dict$get, key, _p35)))),
					_1: {ctor: '[]'}
				};
			});
	});
var _evancz$url_parser$UrlParser$stringParam = function (name) {
	return A2(_evancz$url_parser$UrlParser$customParam, name, _elm_lang$core$Basics$identity);
};
var _evancz$url_parser$UrlParser$intParam = function (name) {
	return A2(_evancz$url_parser$UrlParser$customParam, name, _evancz$url_parser$UrlParser$intParamHelp);
};

var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$emptyPayload = _elm_lang$core$Json_Encode$object(
	{ctor: '[]'});
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$maybeInt = function (maybe) {
	var _p0 = maybe;
	if (_p0.ctor === 'Just') {
		return _elm_lang$core$Json_Encode$int(_p0._0);
	} else {
		return _elm_lang$core$Json_Encode$null;
	}
};
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageEncoder = function (_p1) {
	var _p2 = _p1;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'event',
				_1: _elm_lang$core$Json_Encode$string(_p2.event)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'topic',
					_1: _elm_lang$core$Json_Encode$string(_p2.topic)
				},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'payload', _1: _p2.payload},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'ref',
							_1: _fbonetti$elm_phoenix_socket$Phoenix_Helpers$maybeInt(_p2.ref)
						},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$encodeMessage = function (_p3) {
	return A2(
		_elm_lang$core$Json_Encode$encode,
		0,
		_fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageEncoder(_p3));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$nullOrInt = _elm_lang$core$Json_Decode$oneOf(
	{
		ctor: '::',
		_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
		_1: {
			ctor: '::',
			_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$int),
			_1: {ctor: '[]'}
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$Message = F4(
	function (a, b, c, d) {
		return {event: a, topic: b, payload: c, ref: d};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageDecoder = A5(
	_elm_lang$core$Json_Decode$map4,
	_fbonetti$elm_phoenix_socket$Phoenix_Helpers$Message,
	A2(_elm_lang$core$Json_Decode$field, 'event', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'topic', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'payload', _elm_lang$core$Json_Decode$value),
	A2(_elm_lang$core$Json_Decode$field, 'ref', _fbonetti$elm_phoenix_socket$Phoenix_Helpers$nullOrInt));

var _fbonetti$elm_phoenix_socket$Phoenix_Channel$setState = F2(
	function (state, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{state: state});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$map = F2(
	function (fn, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onClose: A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return function (_p0) {
								return x(
									y(_p0));
							};
						})(fn),
					channel.onClose),
				onError: A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return function (_p1) {
								return x(
									y(_p1));
							};
						})(fn),
					channel.onError),
				onJoin: A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return function (_p2) {
								return x(
									y(_p2));
							};
						})(fn),
					channel.onJoin),
				onJoinError: A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return function (_p3) {
								return x(
									y(_p3));
							};
						})(fn),
					channel.onJoinError)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onJoinError = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onJoinError: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onJoin = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onJoin: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onClose = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onClose: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$onError = F2(
	function (valueToMsg, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{
				onError: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$withPayload = F2(
	function (payload, channel) {
		return _elm_lang$core$Native_Utils.update(
			channel,
			{payload: payload});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Channel = F9(
	function (a, b, c, d, e, f, g, h, i) {
		return {name: a, payload: b, state: c, onClose: d, onError: e, onJoin: f, onJoinError: g, joinRef: h, leaveRef: i};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Leaving = {ctor: 'Leaving'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining = {ctor: 'Joining'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined = {ctor: 'Joined'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Errored = {ctor: 'Errored'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$Closed = {ctor: 'Closed'};
var _fbonetti$elm_phoenix_socket$Phoenix_Channel$init = function (name) {
	return {name: name, payload: _fbonetti$elm_phoenix_socket$Phoenix_Helpers$emptyPayload, state: _fbonetti$elm_phoenix_socket$Phoenix_Channel$Closed, onClose: _elm_lang$core$Maybe$Nothing, onError: _elm_lang$core$Maybe$Nothing, onJoin: _elm_lang$core$Maybe$Nothing, onJoinError: _elm_lang$core$Maybe$Nothing, joinRef: -1, leaveRef: -1};
};

var _fbonetti$elm_phoenix_socket$Phoenix_Push$map = F2(
	function (fn, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{
				onOk: A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return function (_p0) {
								return x(
									y(_p0));
							};
						})(fn),
					push.onOk),
				onError: A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return function (_p1) {
								return x(
									y(_p1));
							};
						})(fn),
					push.onError)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$onError = F2(
	function (valueToMsg, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{
				onError: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$onOk = F2(
	function (valueToMsg, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{
				onOk: _elm_lang$core$Maybe$Just(valueToMsg)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload = F2(
	function (payload, push) {
		return _elm_lang$core$Native_Utils.update(
			push,
			{payload: payload});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$Push = F5(
	function (a, b, c, d, e) {
		return {event: a, channel: b, payload: c, onOk: d, onError: e};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Push$init = F2(
	function (event, channel) {
		return A5(_fbonetti$elm_phoenix_socket$Phoenix_Push$Push, event, channel, _fbonetti$elm_phoenix_socket$Phoenix_Helpers$emptyPayload, _elm_lang$core$Maybe$Nothing, _elm_lang$core$Maybe$Nothing);
	});

var _fbonetti$elm_phoenix_socket$Phoenix_Socket$map = F2(
	function (fn, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{
				channels: A2(
					_elm_lang$core$Dict$map,
					F2(
						function (_p0, channel) {
							return A2(_fbonetti$elm_phoenix_socket$Phoenix_Channel$map, fn, channel);
						}),
					socket.channels),
				events: A2(
					_elm_lang$core$Dict$map,
					F2(
						function (_p1, event) {
							return function (_p2) {
								return fn(
									event(_p2));
							};
						}),
					socket.events),
				pushes: A2(
					_elm_lang$core$Dict$map,
					F2(
						function (_p3, push) {
							return A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$map, fn, push);
						}),
					socket.pushes)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$replyDecoder = A3(
	_elm_lang$core$Json_Decode$map2,
	F2(
		function (v0, v1) {
			return {ctor: '_Tuple2', _0: v0, _1: v1};
		}),
	A2(_elm_lang$core$Json_Decode$field, 'status', _elm_lang$core$Json_Decode$string),
	A2(_elm_lang$core$Json_Decode$field, 'response', _elm_lang$core$Json_Decode$value));
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$decodeMessage = function (_p4) {
	return _elm_lang$core$Result$toMaybe(
		A2(_elm_lang$core$Json_Decode$decodeString, _fbonetti$elm_phoenix_socket$Phoenix_Helpers$messageDecoder, _p4));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$debugIfEnabled = function (socket) {
	return socket.debug ? _elm_lang$core$Debug$log('phx_message') : _elm_lang$core$Basics$identity;
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$phoenixMessages = function (socket) {
	return A2(_elm_lang$websocket$WebSocket$listen, socket.path, _fbonetti$elm_phoenix_socket$Phoenix_Socket$decodeMessage);
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$mapAll = F2(
	function (fn, internalMsg) {
		var _p5 = internalMsg;
		if (_p5.ctor === 'ExternalMsg') {
			return _p5._0;
		} else {
			return fn(internalMsg);
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$sendMessage = F2(
	function (path, message) {
		return A2(
			_elm_lang$websocket$WebSocket$send,
			path,
			_fbonetti$elm_phoenix_socket$Phoenix_Helpers$encodeMessage(message));
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$send = F4(
	function (_p6, event, channel, payload) {
		var _p7 = _p6;
		return A2(
			_fbonetti$elm_phoenix_socket$Phoenix_Socket$sendMessage,
			_p7.path,
			A4(
				_fbonetti$elm_phoenix_socket$Phoenix_Helpers$Message,
				event,
				channel,
				payload,
				_elm_lang$core$Maybe$Just(_p7.ref)));
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$off = F3(
	function (eventName, channelName, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{
				events: A2(
					_elm_lang$core$Dict$remove,
					{ctor: '_Tuple2', _0: eventName, _1: channelName},
					socket.events)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$on = F4(
	function (eventName, channelName, onReceive, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{
				events: A3(
					_elm_lang$core$Dict$insert,
					{ctor: '_Tuple2', _0: eventName, _1: channelName},
					onReceive,
					socket.events)
			});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$push = F2(
	function (push_, socket) {
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				socket,
				{
					pushes: A3(_elm_lang$core$Dict$insert, socket.ref, push_, socket.pushes),
					ref: socket.ref + 1
				}),
			_1: A4(_fbonetti$elm_phoenix_socket$Phoenix_Socket$send, socket, push_.event, push_.channel, push_.payload)
		};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeat = function (socket) {
	var push_ = A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'heartbeat', 'phoenix');
	return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, socket);
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$leave = F2(
	function (channelName, socket) {
		var _p8 = A2(_elm_lang$core$Dict$get, channelName, socket.channels);
		if (_p8.ctor === 'Just') {
			var _p9 = _p8._0;
			if (_elm_lang$core$Native_Utils.eq(_p9.state, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining) || _elm_lang$core$Native_Utils.eq(_p9.state, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined)) {
				var channel_ = _elm_lang$core$Native_Utils.update(
					_p9,
					{state: _fbonetti$elm_phoenix_socket$Phoenix_Channel$Leaving, leaveRef: socket.ref});
				var socket_ = _elm_lang$core$Native_Utils.update(
					socket,
					{
						channels: A3(_elm_lang$core$Dict$insert, channelName, channel_, socket.channels)
					});
				var push_ = A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'phx_leave', _p9.name);
				return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, socket_);
			} else {
				return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
			}
		} else {
			return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$joinChannel = F2(
	function (channel, socket) {
		var channel_ = _elm_lang$core$Native_Utils.update(
			channel,
			{state: _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining, joinRef: socket.ref});
		var socket_ = _elm_lang$core$Native_Utils.update(
			socket,
			{
				channels: A3(_elm_lang$core$Dict$insert, channel.name, channel_, socket.channels)
			});
		var push_ = A5(_fbonetti$elm_phoenix_socket$Phoenix_Push$Push, 'phx_join', channel.name, channel.payload, channel.onJoin, channel.onJoinError);
		return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, socket_);
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$join = F2(
	function (channel, socket) {
		var _p10 = A2(_elm_lang$core$Dict$get, channel.name, socket.channels);
		if (_p10.ctor === 'Just') {
			var _p11 = _p10._0.state;
			return (_elm_lang$core$Native_Utils.eq(_p11, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined) || _elm_lang$core$Native_Utils.eq(_p11, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joining)) ? {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none} : A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$joinChannel, channel, socket);
		} else {
			return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$joinChannel, channel, socket);
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$withoutHeartbeat = function (socket) {
	return _elm_lang$core$Native_Utils.update(
		socket,
		{withoutHeartbeat: true});
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$withHeartbeatInterval = F2(
	function (intervalSeconds, socket) {
		return _elm_lang$core$Native_Utils.update(
			socket,
			{heartbeatIntervalSeconds: intervalSeconds});
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$withDebug = function (socket) {
	return _elm_lang$core$Native_Utils.update(
		socket,
		{debug: true});
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$update = F2(
	function (msg, socket) {
		var _p12 = msg;
		switch (_p12.ctor) {
			case 'ChannelErrored':
				var channels = A3(
					_elm_lang$core$Dict$update,
					_p12._0,
					_elm_lang$core$Maybe$map(
						_fbonetti$elm_phoenix_socket$Phoenix_Channel$setState(_fbonetti$elm_phoenix_socket$Phoenix_Channel$Errored)),
					socket.channels);
				var socket_ = _elm_lang$core$Native_Utils.update(
					socket,
					{channels: channels});
				return {ctor: '_Tuple2', _0: socket_, _1: _elm_lang$core$Platform_Cmd$none};
			case 'ChannelClosed':
				var _p15 = _p12._0;
				var _p13 = A2(_elm_lang$core$Dict$get, _p15, socket.channels);
				if (_p13.ctor === 'Just') {
					var _p14 = _p13._0;
					var pushes = A2(_elm_lang$core$Dict$remove, _p14.joinRef, socket.pushes);
					var channels = A3(
						_elm_lang$core$Dict$insert,
						_p15,
						A2(_fbonetti$elm_phoenix_socket$Phoenix_Channel$setState, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Closed, _p14),
						socket.channels);
					var socket_ = _elm_lang$core$Native_Utils.update(
						socket,
						{channels: channels, pushes: pushes});
					return {ctor: '_Tuple2', _0: socket_, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'ChannelJoined':
				var _p18 = _p12._0;
				var _p16 = A2(_elm_lang$core$Dict$get, _p18, socket.channels);
				if (_p16.ctor === 'Just') {
					var _p17 = _p16._0;
					var pushes = A2(_elm_lang$core$Dict$remove, _p17.joinRef, socket.pushes);
					var channels = A3(
						_elm_lang$core$Dict$insert,
						_p18,
						A2(_fbonetti$elm_phoenix_socket$Phoenix_Channel$setState, _fbonetti$elm_phoenix_socket$Phoenix_Channel$Joined, _p17),
						socket.channels);
					var socket_ = _elm_lang$core$Native_Utils.update(
						socket,
						{channels: channels, pushes: pushes});
					return {ctor: '_Tuple2', _0: socket_, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'Heartbeat':
				return _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeat(socket);
			default:
				return {ctor: '_Tuple2', _0: socket, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$init = function (path) {
	return {
		path: path,
		debug: false,
		channels: _elm_lang$core$Dict$fromList(
			{ctor: '[]'}),
		events: _elm_lang$core$Dict$fromList(
			{ctor: '[]'}),
		pushes: _elm_lang$core$Dict$fromList(
			{ctor: '[]'}),
		ref: 0,
		heartbeatIntervalSeconds: 30,
		withoutHeartbeat: false
	};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$Socket = F8(
	function (a, b, c, d, e, f, g, h) {
		return {path: a, debug: b, channels: c, events: d, pushes: e, ref: f, heartbeatIntervalSeconds: g, withoutHeartbeat: h};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$Heartbeat = function (a) {
	return {ctor: 'Heartbeat', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeatSubscription = function (socket) {
	return socket.withoutHeartbeat ? _elm_lang$core$Platform_Sub$none : A2(_elm_lang$core$Time$every, _elm_lang$core$Time$second * socket.heartbeatIntervalSeconds, _fbonetti$elm_phoenix_socket$Phoenix_Socket$Heartbeat);
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ReceiveReply = F2(
	function (a, b) {
		return {ctor: 'ReceiveReply', _0: a, _1: b};
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelJoined = function (a) {
	return {ctor: 'ChannelJoined', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelClosed = function (a) {
	return {ctor: 'ChannelClosed', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelErrored = function (a) {
	return {ctor: 'ChannelErrored', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg = function (a) {
	return {ctor: 'ExternalMsg', _0: a};
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp = {ctor: 'NoOp'};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$handleInternalPhxReply = F2(
	function (socket, message) {
		var msg = A2(
			_elm_lang$core$Maybe$andThen,
			function (_p19) {
				var _p20 = _p19;
				return A2(
					_elm_lang$core$Maybe$andThen,
					function (ref) {
						return A2(
							_elm_lang$core$Maybe$andThen,
							function (channel) {
								return _elm_lang$core$Native_Utils.eq(_p20._0, 'ok') ? (_elm_lang$core$Native_Utils.eq(ref, channel.joinRef) ? _elm_lang$core$Maybe$Just(
									_fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelJoined(message.topic)) : (_elm_lang$core$Native_Utils.eq(ref, channel.leaveRef) ? _elm_lang$core$Maybe$Just(
									_fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelClosed(message.topic)) : _elm_lang$core$Maybe$Nothing)) : _elm_lang$core$Maybe$Nothing;
							},
							A2(_elm_lang$core$Dict$get, message.topic, socket.channels));
					},
					message.ref);
			},
			_elm_lang$core$Result$toMaybe(
				A2(_elm_lang$core$Json_Decode$decodeValue, _fbonetti$elm_phoenix_socket$Phoenix_Socket$replyDecoder, message.payload)));
		return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$mapInternalMsgs = F2(
	function (socket, maybeMessage) {
		var _p21 = maybeMessage;
		if (_p21.ctor === 'Just') {
			var _p23 = _p21._0;
			var message = socket.debug ? A2(_elm_lang$core$Debug$log, 'Phoenix message', _p23) : _p23;
			var _p22 = message.event;
			switch (_p22) {
				case 'phx_reply':
					return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$handleInternalPhxReply, socket, message);
				case 'phx_error':
					return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelErrored(message.topic);
				case 'phx_close':
					return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ChannelClosed(message.topic);
				default:
					return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
			}
		} else {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$internalMsgs = function (socket) {
	return A2(
		_elm_lang$core$Platform_Sub$map,
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$mapInternalMsgs(socket),
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$phoenixMessages(socket));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$handlePhxReply = F2(
	function (socket, message) {
		var msg = A2(
			_elm_lang$core$Maybe$andThen,
			function (_p24) {
				var _p25 = _p24;
				var _p29 = _p25._1;
				return A2(
					_elm_lang$core$Maybe$andThen,
					function (ref) {
						return A2(
							_elm_lang$core$Maybe$andThen,
							function (push) {
								var _p26 = _p25._0;
								switch (_p26) {
									case 'ok':
										return A2(
											_elm_lang$core$Maybe$map,
											function (f) {
												return function (_p27) {
													return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
														f(_p27));
												}(_p29);
											},
											push.onOk);
									case 'error':
										return A2(
											_elm_lang$core$Maybe$map,
											function (f) {
												return function (_p28) {
													return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
														f(_p28));
												}(_p29);
											},
											push.onError);
									default:
										return _elm_lang$core$Maybe$Nothing;
								}
							},
							A2(_elm_lang$core$Dict$get, ref, socket.pushes));
					},
					message.ref);
			},
			_elm_lang$core$Result$toMaybe(
				A2(_elm_lang$core$Json_Decode$decodeValue, _fbonetti$elm_phoenix_socket$Phoenix_Socket$replyDecoder, message.payload)));
		return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$handleEvent = F2(
	function (socket, message) {
		var _p30 = A2(
			_elm_lang$core$Dict$get,
			{ctor: '_Tuple2', _0: message.event, _1: message.topic},
			socket.events);
		if (_p30.ctor === 'Just') {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
				_p30._0(message.payload));
		} else {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$mapExternalMsgs = F2(
	function (socket, maybeMessage) {
		var _p31 = maybeMessage;
		if (_p31.ctor === 'Just') {
			var _p35 = _p31._0;
			var _p32 = _p35.event;
			switch (_p32) {
				case 'phx_reply':
					return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$handlePhxReply, socket, _p35);
				case 'phx_error':
					var channel = A2(_elm_lang$core$Dict$get, _p35.topic, socket.channels);
					var onError = A2(
						_elm_lang$core$Maybe$andThen,
						function (_) {
							return _.onError;
						},
						channel);
					var msg = A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return function (_p33) {
								return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
									f(_p33));
							}(_p35.payload);
						},
						onError);
					return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
				case 'phx_close':
					var channel = A2(_elm_lang$core$Dict$get, _p35.topic, socket.channels);
					var onClose = A2(
						_elm_lang$core$Maybe$andThen,
						function (_) {
							return _.onClose;
						},
						channel);
					var msg = A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return function (_p34) {
								return _fbonetti$elm_phoenix_socket$Phoenix_Socket$ExternalMsg(
									f(_p34));
							}(_p35.payload);
						},
						onClose);
					return A2(_elm_lang$core$Maybe$withDefault, _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp, msg);
				default:
					return A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$handleEvent, socket, _p35);
			}
		} else {
			return _fbonetti$elm_phoenix_socket$Phoenix_Socket$NoOp;
		}
	});
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$externalMsgs = function (socket) {
	return A2(
		_elm_lang$core$Platform_Sub$map,
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$mapExternalMsgs(socket),
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$phoenixMessages(socket));
};
var _fbonetti$elm_phoenix_socket$Phoenix_Socket$listen = F2(
	function (socket, fn) {
		return function (_p36) {
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_fbonetti$elm_phoenix_socket$Phoenix_Socket$mapAll(fn),
				_elm_lang$core$Platform_Sub$batch(_p36));
		}(
			{
				ctor: '::',
				_0: _fbonetti$elm_phoenix_socket$Phoenix_Socket$internalMsgs(socket),
				_1: {
					ctor: '::',
					_0: _fbonetti$elm_phoenix_socket$Phoenix_Socket$externalMsgs(socket),
					_1: {
						ctor: '::',
						_0: _fbonetti$elm_phoenix_socket$Phoenix_Socket$heartbeatSubscription(socket),
						_1: {ctor: '[]'}
					}
				}
			});
	});

var _jinjor$elm_inline_hover$InlineHover$isValidChars = function (list) {
	isValidChars:
	while (true) {
		var _p0 = list;
		if (_p0.ctor === '::') {
			var _p1 = _p0._0;
			if (_elm_lang$core$Char$isLower(_p1) || _elm_lang$core$Native_Utils.eq(
				_p1,
				_elm_lang$core$Native_Utils.chr('-'))) {
				var _v1 = _p0._1;
				list = _v1;
				continue isValidChars;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
};
var _jinjor$elm_inline_hover$InlineHover$isValidKey = function (s) {
	return (!_elm_lang$core$Native_Utils.eq(s, '')) && (A2(
		_elm_lang$core$List$any,
		_elm_lang$core$Char$isLower,
		_elm_lang$core$String$toList(s)) && A2(
		_elm_lang$core$List$all,
		function (c) {
			return _elm_lang$core$Char$isLower(c) || _elm_lang$core$Native_Utils.eq(
				c,
				_elm_lang$core$Native_Utils.chr('-'));
		},
		_elm_lang$core$String$toList(s)));
};
var _jinjor$elm_inline_hover$InlineHover$toCamelCase = function (s) {
	return _elm_lang$core$String$fromList(
		_elm_lang$core$List$reverse(
			_elm_lang$core$Tuple$second(
				A3(
					_elm_lang$core$List$foldl,
					F2(
						function (c, _p2) {
							var _p3 = _p2;
							var _p4 = _p3._1;
							return _elm_lang$core$Native_Utils.eq(
								c,
								_elm_lang$core$Native_Utils.chr('-')) ? {ctor: '_Tuple2', _0: true, _1: _p4} : (_p3._0 ? {
								ctor: '_Tuple2',
								_0: false,
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Char$toUpper(c),
									_1: _p4
								}
							} : {
								ctor: '_Tuple2',
								_0: false,
								_1: {ctor: '::', _0: c, _1: _p4}
							});
						}),
					{
						ctor: '_Tuple2',
						_0: false,
						_1: {ctor: '[]'}
					},
					_elm_lang$core$String$toList(s)))));
};
var _jinjor$elm_inline_hover$InlineHover$enterEach = function (_p5) {
	var _p6 = _p5;
	var _p8 = _p6._0;
	var escapedValue = function (_p7) {
		return A2(
			_elm_lang$core$String$join,
			'\"',
			A2(_elm_lang$core$String$split, '\'', _p7));
	}(_p6._1);
	var keyCamel = _jinjor$elm_inline_hover$InlineHover$toCamelCase(_p8);
	return A2(
		_elm_lang$core$Basics_ops['++'],
		'this.setAttribute(\'data-hover-',
		A2(
			_elm_lang$core$Basics_ops['++'],
			_p8,
			A2(
				_elm_lang$core$Basics_ops['++'],
				'\', this.style.',
				A2(
					_elm_lang$core$Basics_ops['++'],
					keyCamel,
					A2(
						_elm_lang$core$Basics_ops['++'],
						'||\'\');',
						A2(
							_elm_lang$core$Basics_ops['++'],
							'this.style.',
							A2(
								_elm_lang$core$Basics_ops['++'],
								keyCamel,
								A2(
									_elm_lang$core$Basics_ops['++'],
									'=\'',
									A2(_elm_lang$core$Basics_ops['++'], escapedValue, '\'')))))))));
};
var _jinjor$elm_inline_hover$InlineHover$leaveEach = function (_p9) {
	var _p10 = _p9;
	var _p11 = _p10._0;
	var keyCamel = _jinjor$elm_inline_hover$InlineHover$toCamelCase(_p11);
	return A2(
		_elm_lang$core$Basics_ops['++'],
		'this.style.',
		A2(
			_elm_lang$core$Basics_ops['++'],
			keyCamel,
			A2(
				_elm_lang$core$Basics_ops['++'],
				'=this.getAttribute(\'data-hover-',
				A2(_elm_lang$core$Basics_ops['++'], _p11, '\')||\'\';'))));
};
var _jinjor$elm_inline_hover$InlineHover$hover = F4(
	function (styles, tag, attrs, children) {
		var validStyles = A2(
			_elm_lang$core$List$filter,
			function (_p12) {
				var _p13 = _p12;
				return _jinjor$elm_inline_hover$InlineHover$isValidKey(_p13._0);
			},
			styles);
		var enter = A2(
			_elm_lang$html$Html_Attributes$attribute,
			'onmouseenter',
			A2(
				_elm_lang$core$String$join,
				';',
				A2(_elm_lang$core$List$map, _jinjor$elm_inline_hover$InlineHover$enterEach, validStyles)));
		var leave = A2(
			_elm_lang$html$Html_Attributes$attribute,
			'onmouseleave',
			A2(
				_elm_lang$core$String$join,
				';',
				A2(_elm_lang$core$List$map, _jinjor$elm_inline_hover$InlineHover$leaveEach, validStyles)));
		return A2(
			tag,
			{
				ctor: '::',
				_0: enter,
				_1: {ctor: '::', _0: leave, _1: attrs}
			},
			children);
	});

var _user$project$Logic_Types$Model = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return function (o) {
															return {route: a, musKey: b, index: c, currentChord: d, displayedChords: e, notePosition: f, showAccidental: g, sliderValue: h, navMenuOpen: i, pitchShift: j, modalOpen: k, strumArrow: l, strumGroupNumber: m, fingerPickPattern: n, phxSocket: o};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Logic_Types$Dot = F3(
	function (a, b, c) {
		return {tint: a, stringNo: b, fretNo: c};
	});
var _user$project$Logic_Types$ChordChartData = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return {i: a, ii: b, iii: c, iv: d, v: e, vi: f, vii: g, i7: h, iv7: i, v7: j, vi7: k, bars: l, names: m, key: n};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Logic_Types$ChordAudioData = F7(
	function (a, b, c, d, e, f, g) {
		return {i: a, ii: b, iii: c, iv: d, v: e, vi: f, vii: g};
	});
var _user$project$Logic_Types$ScaleData = F6(
	function (a, b, c, d, e, f) {
		return {e: a, b: b, g: c, d: d, a: e, e6: f};
	});
var _user$project$Logic_Types$ScaleSchemaData = F6(
	function (a, b, c, d, e, f) {
		return {one: a, two: b, three: c, four: d, five: e, six: f};
	});
var _user$project$Logic_Types$Note = F3(
	function (a, b, c) {
		return {frequency: a, octave: b, sustain: c};
	});
var _user$project$Logic_Types$PlayBundle = F2(
	function (a, b) {
		return {note: a, waveType: b};
	});
var _user$project$Logic_Types$PhoenixMsg = function (a) {
	return {ctor: 'PhoenixMsg', _0: a};
};
var _user$project$Logic_Types$ReceiveMessage = function (a) {
	return {ctor: 'ReceiveMessage', _0: a};
};
var _user$project$Logic_Types$SendMessage = function (a) {
	return {ctor: 'SendMessage', _0: a};
};
var _user$project$Logic_Types$JoinChannel = {ctor: 'JoinChannel'};
var _user$project$Logic_Types$Randomize = F2(
	function (a, b) {
		return {ctor: 'Randomize', _0: a, _1: b};
	});
var _user$project$Logic_Types$FingerPickPatternBuilderB = function (a) {
	return {ctor: 'FingerPickPatternBuilderB', _0: a};
};
var _user$project$Logic_Types$FingerPickPatternBuilderA = function (a) {
	return {ctor: 'FingerPickPatternBuilderA', _0: a};
};
var _user$project$Logic_Types$StrumArrowDirection = function (a) {
	return {ctor: 'StrumArrowDirection', _0: a};
};
var _user$project$Logic_Types$ChangeStrumGroupNumber = function (a) {
	return {ctor: 'ChangeStrumGroupNumber', _0: a};
};
var _user$project$Logic_Types$ShowModal = {ctor: 'ShowModal'};
var _user$project$Logic_Types$ShowNavMenu = {ctor: 'ShowNavMenu'};
var _user$project$Logic_Types$NoOp = {ctor: 'NoOp'};
var _user$project$Logic_Types$ChangeSliderValue = function (a) {
	return {ctor: 'ChangeSliderValue', _0: a};
};
var _user$project$Logic_Types$DrawNote = F3(
	function (a, b, c) {
		return {ctor: 'DrawNote', _0: a, _1: b, _2: c};
	});
var _user$project$Logic_Types$NewUrl = function (a) {
	return {ctor: 'NewUrl', _0: a};
};
var _user$project$Logic_Types$OnLocationChange = function (a) {
	return {ctor: 'OnLocationChange', _0: a};
};
var _user$project$Logic_Types$ResetIndex = {ctor: 'ResetIndex'};
var _user$project$Logic_Types$Play = F2(
	function (a, b) {
		return {ctor: 'Play', _0: a, _1: b};
	});
var _user$project$Logic_Types$SendNotes = {ctor: 'SendNotes'};
var _user$project$Logic_Types$ChangeKey = function (a) {
	return {ctor: 'ChangeKey', _0: a};
};
var _user$project$Logic_Types$FingerPickingPage = {ctor: 'FingerPickingPage'};
var _user$project$Logic_Types$StrummingPage = {ctor: 'StrummingPage'};
var _user$project$Logic_Types$HomePage = {ctor: 'HomePage'};
var _user$project$Logic_Types$NotFoundPage = {ctor: 'NotFoundPage'};
var _user$project$Logic_Types$FretboardPage = function (a) {
	return {ctor: 'FretboardPage', _0: a};
};
var _user$project$Logic_Types$ScalesPage = function (a) {
	return {ctor: 'ScalesPage', _0: a};
};
var _user$project$Logic_Types$ChordsPage = function (a) {
	return {ctor: 'ChordsPage', _0: a};
};

var _user$project$Logic_Audio$frequencies = function (note) {
	var _p0 = note;
	switch (_p0) {
		case 'c':
			return 130.81;
		case 'c#':
			return 139.0;
		case 'd':
			return 146.83;
		case 'd#':
			return 156.0;
		case 'e':
			return 164.81;
		case 'f':
			return 174.61;
		case 'f#':
			return 185.0;
		case 'g':
			return 196.0;
		case 'g#':
			return 208.0;
		case 'a':
			return 220.0;
		case 'a#':
			return 233.0;
		case 'b':
			return 246.94;
		case 'r':
			return 0.0;
		default:
			return 0.0;
	}
};
var _user$project$Logic_Audio$octave = function (num) {
	var _p1 = num;
	if (_p1 === 1) {
		return 1;
	} else {
		return Math.pow(2, num - 1);
	}
};
var _user$project$Logic_Audio$sustain = function (duration) {
	var _p2 = duration;
	switch (_p2) {
		case 'w':
			return 4.0;
		case 'h':
			return 2.0;
		case 'q':
			return 1.0;
		case 'e':
			return 0.5;
		case 's':
			return 0.25;
		case 'w.':
			return 6.0;
		case 'h.':
			return 3.0;
		case 'q.':
			return 1.5;
		case 'e.':
			return 0.75;
		case 's.':
			return 0.375;
		default:
			return 0.0;
	}
};
var _user$project$Logic_Audio$noteSorter = function (string) {
	var _p3 = _elm_lang$core$String$length(string);
	switch (_p3) {
		case 3:
			return A3(
				_user$project$Logic_Types$Note,
				_user$project$Logic_Audio$frequencies(
					A3(_elm_lang$core$String$slice, 0, 1, string)),
				_user$project$Logic_Audio$octave(
					A2(
						_elm_lang$core$Result$withDefault,
						0,
						_elm_lang$core$String$toInt(
							A3(_elm_lang$core$String$slice, 1, 2, string)))),
				_user$project$Logic_Audio$sustain(
					A3(_elm_lang$core$String$slice, 2, 3, string)));
		case 4:
			return _elm_lang$core$Native_Utils.eq(
				A3(_elm_lang$core$String$slice, 1, 2, string),
				'#') ? A3(
				_user$project$Logic_Types$Note,
				_user$project$Logic_Audio$frequencies(
					A3(_elm_lang$core$String$slice, 0, 2, string)),
				_user$project$Logic_Audio$octave(
					A2(
						_elm_lang$core$Result$withDefault,
						0,
						_elm_lang$core$String$toInt(
							A3(_elm_lang$core$String$slice, 2, 3, string)))),
				_user$project$Logic_Audio$sustain(
					A3(_elm_lang$core$String$slice, 3, 4, string))) : A3(
				_user$project$Logic_Types$Note,
				_user$project$Logic_Audio$frequencies(
					A3(_elm_lang$core$String$slice, 0, 1, string)),
				_user$project$Logic_Audio$octave(
					A2(
						_elm_lang$core$Result$withDefault,
						0,
						_elm_lang$core$String$toInt(
							A3(_elm_lang$core$String$slice, 1, 2, string)))),
				_user$project$Logic_Audio$sustain(
					A3(_elm_lang$core$String$slice, 2, 4, string)));
		case 5:
			return A3(
				_user$project$Logic_Types$Note,
				_user$project$Logic_Audio$frequencies(
					A3(_elm_lang$core$String$slice, 0, 2, string)),
				_user$project$Logic_Audio$octave(
					A2(
						_elm_lang$core$Result$withDefault,
						0,
						_elm_lang$core$String$toInt(
							A3(_elm_lang$core$String$slice, 2, 3, string)))),
				_user$project$Logic_Audio$sustain(
					A3(_elm_lang$core$String$slice, 3, 5, string)));
		default:
			return A3(_user$project$Logic_Types$Note, 0.0, 0, 0.0);
	}
};
var _user$project$Logic_Audio$stringToNote = F2(
	function (chord, n) {
		stringToNote:
		while (true) {
			var note = A2(
				_elm_lang$core$Maybe$withDefault,
				'c0s',
				A2(_elm_community$list_extra$List_Extra$getAt, n, chord));
			var computedNote = _user$project$Logic_Audio$noteSorter(note);
			var chordList = {ctor: '[]'};
			if (_elm_lang$core$Native_Utils.cmp(
				n,
				_elm_lang$core$List$length(chord)) < 0) {
				return {ctor: '::', _0: computedNote, _1: chordList};
			} else {
				var _v4 = chord,
					_v5 = n + 1;
				chord = _v4;
				n = _v5;
				continue stringToNote;
			}
		}
	});
var _user$project$Logic_Audio$scales = function (scale) {
	var _p4 = scale;
	switch (_p4) {
		case 'major':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd3s',
					_1: {
						ctor: '::',
						_0: 'e3s',
						_1: {
							ctor: '::',
							_0: 'f3s',
							_1: {
								ctor: '::',
								_0: 'g3s',
								_1: {
									ctor: '::',
									_0: 'a3s',
									_1: {
										ctor: '::',
										_0: 'b3s',
										_1: {
											ctor: '::',
											_0: 'c4s',
											_1: {
												ctor: '::',
												_0: 'd4s',
												_1: {
													ctor: '::',
													_0: 'e4s',
													_1: {
														ctor: '::',
														_0: 'f4s',
														_1: {
															ctor: '::',
															_0: 'g4s',
															_1: {
																ctor: '::',
																_0: 'a4s',
																_1: {
																	ctor: '::',
																	_0: 'b4s',
																	_1: {
																		ctor: '::',
																		_0: 'c5s',
																		_1: {
																			ctor: '::',
																			_0: 'd5s',
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		case 'minor':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd3s',
					_1: {
						ctor: '::',
						_0: 'd#3s',
						_1: {
							ctor: '::',
							_0: 'f3s',
							_1: {
								ctor: '::',
								_0: 'g3s',
								_1: {
									ctor: '::',
									_0: 'g#3s',
									_1: {
										ctor: '::',
										_0: 'a#3s',
										_1: {
											ctor: '::',
											_0: 'c4s',
											_1: {
												ctor: '::',
												_0: 'd4s',
												_1: {
													ctor: '::',
													_0: 'd#4s',
													_1: {
														ctor: '::',
														_0: 'f4s',
														_1: {
															ctor: '::',
															_0: 'g4s',
															_1: {
																ctor: '::',
																_0: 'g#4s',
																_1: {
																	ctor: '::',
																	_0: 'a#4s',
																	_1: {
																		ctor: '::',
																		_0: 'c5s',
																		_1: {
																			ctor: '::',
																			_0: 'd5s',
																			_1: {
																				ctor: '::',
																				_0: 'd#5s',
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		case 'majPentatonic':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd3s',
					_1: {
						ctor: '::',
						_0: 'e3s',
						_1: {
							ctor: '::',
							_0: 'g3s',
							_1: {
								ctor: '::',
								_0: 'a3s',
								_1: {
									ctor: '::',
									_0: 'c4s',
									_1: {
										ctor: '::',
										_0: 'd4s',
										_1: {
											ctor: '::',
											_0: 'e4s',
											_1: {
												ctor: '::',
												_0: 'g4s',
												_1: {
													ctor: '::',
													_0: 'a4s',
													_1: {
														ctor: '::',
														_0: 'c5s',
														_1: {
															ctor: '::',
															_0: 'd5s',
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		case 'minPentatonic':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd#3s',
					_1: {
						ctor: '::',
						_0: 'f3s',
						_1: {
							ctor: '::',
							_0: 'g3s',
							_1: {
								ctor: '::',
								_0: 'a#3s',
								_1: {
									ctor: '::',
									_0: 'c4s',
									_1: {
										ctor: '::',
										_0: 'd#4s',
										_1: {
											ctor: '::',
											_0: 'f4s',
											_1: {
												ctor: '::',
												_0: 'g4s',
												_1: {
													ctor: '::',
													_0: 'a#4s',
													_1: {
														ctor: '::',
														_0: 'c5s',
														_1: {
															ctor: '::',
															_0: 'd#5s',
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		case 'lydian':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd3s',
					_1: {
						ctor: '::',
						_0: 'e3s',
						_1: {
							ctor: '::',
							_0: 'f#3s',
							_1: {
								ctor: '::',
								_0: 'g3s',
								_1: {
									ctor: '::',
									_0: 'a3s',
									_1: {
										ctor: '::',
										_0: 'b3s',
										_1: {
											ctor: '::',
											_0: 'c4s',
											_1: {
												ctor: '::',
												_0: 'd4s',
												_1: {
													ctor: '::',
													_0: 'e4s',
													_1: {
														ctor: '::',
														_0: 'f#4s',
														_1: {
															ctor: '::',
															_0: 'g4s',
															_1: {
																ctor: '::',
																_0: 'a4s',
																_1: {
																	ctor: '::',
																	_0: 'b4s',
																	_1: {
																		ctor: '::',
																		_0: 'c5s',
																		_1: {
																			ctor: '::',
																			_0: 'd5s',
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		case 'mixolydian':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd3s',
					_1: {
						ctor: '::',
						_0: 'e3s',
						_1: {
							ctor: '::',
							_0: 'f3s',
							_1: {
								ctor: '::',
								_0: 'g3s',
								_1: {
									ctor: '::',
									_0: 'a3s',
									_1: {
										ctor: '::',
										_0: 'a#3s',
										_1: {
											ctor: '::',
											_0: 'c4s',
											_1: {
												ctor: '::',
												_0: 'd4s',
												_1: {
													ctor: '::',
													_0: 'e4s',
													_1: {
														ctor: '::',
														_0: 'f4s',
														_1: {
															ctor: '::',
															_0: 'g4s',
															_1: {
																ctor: '::',
																_0: 'a4s',
																_1: {
																	ctor: '::',
																	_0: 'a#4s',
																	_1: {
																		ctor: '::',
																		_0: 'c5s',
																		_1: {
																			ctor: '::',
																			_0: 'd5s',
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		case 'dorian':
			return {
				ctor: '::',
				_0: 'c3s',
				_1: {
					ctor: '::',
					_0: 'd3s',
					_1: {
						ctor: '::',
						_0: 'd#3s',
						_1: {
							ctor: '::',
							_0: 'f3s',
							_1: {
								ctor: '::',
								_0: 'g3s',
								_1: {
									ctor: '::',
									_0: 'a3s',
									_1: {
										ctor: '::',
										_0: 'a#3s',
										_1: {
											ctor: '::',
											_0: 'c4s',
											_1: {
												ctor: '::',
												_0: 'd4s',
												_1: {
													ctor: '::',
													_0: 'd#4s',
													_1: {
														ctor: '::',
														_0: 'f4s',
														_1: {
															ctor: '::',
															_0: 'g4s',
															_1: {
																ctor: '::',
																_0: 'a4s',
																_1: {
																	ctor: '::',
																	_0: 'a#4s',
																	_1: {
																		ctor: '::',
																		_0: 'c5s',
																		_1: {
																			ctor: '::',
																			_0: 'd5s',
																			_1: {
																				ctor: '::',
																				_0: 'd#5s',
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		default:
			return {ctor: '[]'};
	}
};
var _user$project$Logic_Audio$notes = function (key) {
	var _p5 = key;
	switch (_p5) {
		case 'C':
			return {
				i: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'G':
			return {
				i: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'D':
			return {
				i: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'a2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'A':
			return {
				i: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'g#3q',
					_1: {
						ctor: '::',
						_0: 'c#4q',
						_1: {
							ctor: '::',
							_0: 'e4q',
							_1: {
								ctor: '::',
								_0: 'g#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'a2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'E':
			return {
				i: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'a2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'g#3q',
					_1: {
						ctor: '::',
						_0: 'c#4q',
						_1: {
							ctor: '::',
							_0: 'e4q',
							_1: {
								ctor: '::',
								_0: 'g#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'B':
			return {
				i: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'F#':
			return {
				i: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'b3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'g#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'Db':
			return {
				i: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'g#3q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#4q',
							_1: {
								ctor: '::',
								_0: 'b#3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'Ab':
			return {
				i: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'g4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'g3q',
					_1: {
						ctor: '::',
						_0: 'c#4q',
						_1: {
							ctor: '::',
							_0: 'e4q',
							_1: {
								ctor: '::',
								_0: 'a#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'Eb':
			return {
				i: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'g4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'd2q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {
										ctor: '::',
										_0: 'a#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'Bb':
			return {
				i: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'a4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'g4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'F':
			return {
				i: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'd2q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				}
			};
		case 'a':
			return {
				i: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'e':
			return {
				i: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'f#2',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				}
			};
		case 'b':
			return {
				i: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'a2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'd3q',
							_1: {
								ctor: '::',
								_0: 'g3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'f#':
			return {
				i: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'a2q',
						_1: {
							ctor: '::',
							_0: 'c#3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'c#q3',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'c#':
			return {
				i: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'g#':
			return {
				i: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'c2q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c3q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'c#q3',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'e2q',
					_1: {
						ctor: '::',
						_0: 'b2q',
						_1: {
							ctor: '::',
							_0: 'e3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'b3q',
									_1: {
										ctor: '::',
										_0: 'e4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'd#':
			return {
				i: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'b3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'g#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'b3q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {
										ctor: '::',
										_0: 'a#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'b2q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'f#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'bb':
			return {
				i: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {
										ctor: '::',
										_0: 'a#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'f#3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'c4q',
						_1: {
							ctor: '::',
							_0: 'f4q',
							_1: {
								ctor: '::',
								_0: 'g#4q',
								_1: {
									ctor: '::',
									_0: 'c5q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'f#2q',
					_1: {
						ctor: '::',
						_0: 'c#3q',
						_1: {
							ctor: '::',
							_0: 'f#3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'c#4q',
									_1: {
										ctor: '::',
										_0: 'f#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'f':
			return {
				i: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'g3q',
					_1: {
						ctor: '::',
						_0: 'c#4q',
						_1: {
							ctor: '::',
							_0: 'e4q',
							_1: {
								ctor: '::',
								_0: 'a#5q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'c#4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'c#3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'c#4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {
									ctor: '::',
									_0: 'g#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'g4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'c':
			return {
				i: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'g#3q',
						_1: {
							ctor: '::',
							_0: 'b3q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'g4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'g#3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'g#2q',
					_1: {
						ctor: '::',
						_0: 'd#3q',
						_1: {
							ctor: '::',
							_0: 'g#3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'd#4q',
									_1: {
										ctor: '::',
										_0: 'g#4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		case 'g':
			return {
				i: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'f#4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'g3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'd#4q',
								_1: {
									ctor: '::',
									_0: 'g4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'd#3q',
					_1: {
						ctor: '::',
						_0: 'a#3q',
						_1: {
							ctor: '::',
							_0: 'd#4q',
							_1: {
								ctor: '::',
								_0: 'g4q',
								_1: {
									ctor: '::',
									_0: 'a#4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'f2q',
					_1: {
						ctor: '::',
						_0: 'c3q',
						_1: {
							ctor: '::',
							_0: 'f3q',
							_1: {
								ctor: '::',
								_0: 'a3q',
								_1: {
									ctor: '::',
									_0: 'c4q',
									_1: {
										ctor: '::',
										_0: 'f4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
		case 'd':
			return {
				i: {
					ctor: '::',
					_0: 'd3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'd4q',
							_1: {
								ctor: '::',
								_0: 'f4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				ii: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'e5q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				iii: {
					ctor: '::',
					_0: 'f3q',
					_1: {
						ctor: '::',
						_0: 'a3q',
						_1: {
							ctor: '::',
							_0: 'c4q',
							_1: {
								ctor: '::',
								_0: 'e4q',
								_1: {ctor: '[]'}
							}
						}
					}
				},
				iv: {
					ctor: '::',
					_0: 'g2q',
					_1: {
						ctor: '::',
						_0: 'd3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'a#3q',
								_1: {
									ctor: '::',
									_0: 'd4q',
									_1: {
										ctor: '::',
										_0: 'g4q',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				},
				v: {
					ctor: '::',
					_0: 'a2q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'a3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vi: {
					ctor: '::',
					_0: 'a#2q',
					_1: {
						ctor: '::',
						_0: 'f3q',
						_1: {
							ctor: '::',
							_0: 'a#3q',
							_1: {
								ctor: '::',
								_0: 'd4q',
								_1: {
									ctor: '::',
									_0: 'f4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				vii: {
					ctor: '::',
					_0: 'c3q',
					_1: {
						ctor: '::',
						_0: 'e3q',
						_1: {
							ctor: '::',
							_0: 'g3q',
							_1: {
								ctor: '::',
								_0: 'c4q',
								_1: {
									ctor: '::',
									_0: 'e4q',
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			};
		default:
			return {
				i: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				},
				ii: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				},
				iii: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				},
				iv: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				},
				v: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				},
				vi: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				},
				vii: {
					ctor: '::',
					_0: '',
					_1: {ctor: '[]'}
				}
			};
	}
};

var _user$project$Logic_Routing$fingerPickingPath = '#fingerpicking/';
var _user$project$Logic_Routing$homePath = '#home/';
var _user$project$Logic_Routing$strummingPath = '#strumming/';
var _user$project$Logic_Routing$fretboardPath = function (key) {
	return A2(_elm_lang$core$Basics_ops['++'], '#fretboard/', key);
};
var _user$project$Logic_Routing$scalesPath = function (key) {
	return A2(_elm_lang$core$Basics_ops['++'], '#scales/', key);
};
var _user$project$Logic_Routing$chordsPath = function (key) {
	return A2(_elm_lang$core$Basics_ops['++'], '#chords/', key);
};
var _user$project$Logic_Routing$modelUpdateOnHash = F2(
	function (model, location) {
		var _p0 = model.route;
		switch (_p0.ctor) {
			case 'ChordsPage':
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('chords'),
						_evancz$url_parser$UrlParser$string),
					location);
			case 'ScalesPage':
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('scales'),
						_evancz$url_parser$UrlParser$string),
					location);
			case 'FretboardPage':
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('fretboard'),
						_evancz$url_parser$UrlParser$string),
					location);
			case 'StrummingPage':
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('strum'),
						_evancz$url_parser$UrlParser$string),
					location);
			case 'FingerPickingPage':
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('fingerpicking'),
						_evancz$url_parser$UrlParser$string),
					location);
			case 'HomePage':
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('home'),
						_evancz$url_parser$UrlParser$string),
					location);
			default:
				return A2(
					_evancz$url_parser$UrlParser$parseHash,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s(''),
						_evancz$url_parser$UrlParser$string),
					location);
		}
	});
var _user$project$Logic_Routing$matchers = _evancz$url_parser$UrlParser$oneOf(
	{
		ctor: '::',
		_0: A2(
			_evancz$url_parser$UrlParser$map,
			_user$project$Logic_Types$HomePage,
			_evancz$url_parser$UrlParser$s('home')),
		_1: {
			ctor: '::',
			_0: A2(
				_evancz$url_parser$UrlParser$map,
				_user$project$Logic_Types$ChordsPage,
				A2(
					_evancz$url_parser$UrlParser_ops['</>'],
					_evancz$url_parser$UrlParser$s('chords'),
					_evancz$url_parser$UrlParser$string)),
			_1: {
				ctor: '::',
				_0: A2(
					_evancz$url_parser$UrlParser$map,
					_user$project$Logic_Types$ScalesPage,
					A2(
						_evancz$url_parser$UrlParser_ops['</>'],
						_evancz$url_parser$UrlParser$s('scales'),
						_evancz$url_parser$UrlParser$string)),
				_1: {
					ctor: '::',
					_0: A2(
						_evancz$url_parser$UrlParser$map,
						_user$project$Logic_Types$FretboardPage,
						A2(
							_evancz$url_parser$UrlParser_ops['</>'],
							_evancz$url_parser$UrlParser$s('fretboard'),
							_evancz$url_parser$UrlParser$string)),
					_1: {
						ctor: '::',
						_0: A2(
							_evancz$url_parser$UrlParser$map,
							_user$project$Logic_Types$StrummingPage,
							_evancz$url_parser$UrlParser$s('strumming')),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$url_parser$UrlParser$map,
								_user$project$Logic_Types$FingerPickingPage,
								_evancz$url_parser$UrlParser$s('fingerpicking')),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Logic_Routing$parseLocation = function (location) {
	var _p1 = A2(_evancz$url_parser$UrlParser$parseHash, _user$project$Logic_Routing$matchers, location);
	if (_p1.ctor === 'Just') {
		return _p1._0;
	} else {
		return _user$project$Logic_Types$NotFoundPage;
	}
};

var _user$project$Styles_FretboardStyles$hrLedgerStyleLo = F2(
	function (notePosition, offset) {
		var pos = notePosition;
		var visibility = (_elm_lang$core$Native_Utils.cmp(pos, offset + 20.0) < 0) ? '1' : '0';
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'bottom',
						_1: A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(offset),
							'px')
					},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'left', _1: '45%'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '50px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 auto'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'padding', _1: '10px'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'opacity', _1: visibility},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderTop', _1: '0.1rem solid #444'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'transition', _1: 'opacity 0.5s ease'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '0'},
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Styles_FretboardStyles$hrLedgerStyleHi = F2(
	function (notePosition, offset) {
		var pos = notePosition;
		var visibility = (_elm_lang$core$Native_Utils.cmp(pos, offset) > 0) ? '1' : '0';
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'bottom',
						_1: A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(offset),
							'px')
					},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'left', _1: '45%'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '50px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 auto'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'padding', _1: '10px'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'opacity', _1: visibility},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderTop', _1: '0.1rem solid #444'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'transition', _1: 'opacity 0.5s ease'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '0'},
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Styles_FretboardStyles$hrStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '280px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 auto'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'padding', _1: '10px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'borderTop', _1: '0.1rem solid #444'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_FretboardStyles$notationAccidentalStyle = F2(
	function (offset, visibility) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '28px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'marginBottom', _1: '-10px'},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'bottom',
								_1: A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(offset - 3),
									'px')
							},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'left', _1: '44%'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'opacity', _1: visibility},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.5s ease'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '1'},
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Styles_FretboardStyles$notationNoteStyle = function (offset) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '18px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'height', _1: '18px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '9px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'bottom',
								_1: A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(offset),
									'px')
							},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'left', _1: '50%'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: '#03a9f4'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.5s ease'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '1'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'boxShadow', _1: '3px 3px 15px rgba*0,0,0,0.9)'},
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Styles_FretboardStyles$notationClefStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'bottom', _1: '50px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'left', _1: '40px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'height', _1: '100px'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_FretboardStyles$notationContainerStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '350px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'padding', _1: '50px 10px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'margin', _1: '70px auto'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Styles_FretboardStyles$noteGroupStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'postion', _1: 'relative'},
		_1: {ctor: '[]'}
	});
var _user$project$Styles_FretboardStyles$fretNumberStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '100px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'marginBottom', _1: '-70px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'padding', _1: '5px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'textTransform', _1: 'uppercase'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_FretboardStyles$fretBlankStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'color', _1: 'rgba(0,0,0,0)'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '100px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'padding', _1: '5px'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_FretboardStyles$fretNoteStyle = F2(
	function (color, bgCol) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'width', _1: '100px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'padding', _1: '14px 5px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'textTransform', _1: 'uppercase'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'color', _1: color},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '18px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'borderBottom', _1: '1px solid #aaa'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderCollapse', _1: 'collapse'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.4s ease'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: bgCol},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '1'},
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Styles_FretboardStyles$fretboardStringStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
		_1: {ctor: '[]'}
	});
var _user$project$Styles_FretboardStyles$fretboardContainerStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'margin', _1: '50px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '90%'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_FretboardStyles$fretboardTitleStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '18px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'left'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'margin', _1: '100px 0 30px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#666'},
					_1: {ctor: '[]'}
				}
			}
		}
	});

var _user$project$Views_Fretboard$chromaticNotesListFlat = {
	ctor: '::',
	_0: 'c',
	_1: {
		ctor: '::',
		_0: 'db',
		_1: {
			ctor: '::',
			_0: 'd',
			_1: {
				ctor: '::',
				_0: 'eb',
				_1: {
					ctor: '::',
					_0: 'e',
					_1: {
						ctor: '::',
						_0: 'f',
						_1: {
							ctor: '::',
							_0: 'gb',
							_1: {
								ctor: '::',
								_0: 'g',
								_1: {
									ctor: '::',
									_0: 'ab',
									_1: {
										ctor: '::',
										_0: 'a',
										_1: {
											ctor: '::',
											_0: 'bb',
											_1: {
												ctor: '::',
												_0: 'b',
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$chromaticNotesList = {
	ctor: '::',
	_0: 'c',
	_1: {
		ctor: '::',
		_0: 'c#',
		_1: {
			ctor: '::',
			_0: 'd',
			_1: {
				ctor: '::',
				_0: 'd#',
				_1: {
					ctor: '::',
					_0: 'e',
					_1: {
						ctor: '::',
						_0: 'f',
						_1: {
							ctor: '::',
							_0: 'f#',
							_1: {
								ctor: '::',
								_0: 'g',
								_1: {
									ctor: '::',
									_0: 'g#',
									_1: {
										ctor: '::',
										_0: 'a',
										_1: {
											ctor: '::',
											_0: 'a#',
											_1: {
												ctor: '::',
												_0: 'b',
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$notesInKey = function (key) {
	var inserter = function (n) {
		var a = (_elm_lang$core$Native_Utils.cmp(n, 11) > 0) ? (n - 12) : n;
		return A2(
			_elm_lang$core$Maybe$withDefault,
			'c',
			A2(_elm_community$list_extra$List_Extra$getAt, a, _user$project$Views_Fretboard$chromaticNotesList));
	};
	var intervalListMinor = {
		ctor: '::',
		_0: 0,
		_1: {
			ctor: '::',
			_0: 2,
			_1: {
				ctor: '::',
				_0: 3,
				_1: {
					ctor: '::',
					_0: 5,
					_1: {
						ctor: '::',
						_0: 7,
						_1: {
							ctor: '::',
							_0: 8,
							_1: {
								ctor: '::',
								_0: 10,
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	};
	var intervalListMajor = {
		ctor: '::',
		_0: 0,
		_1: {
			ctor: '::',
			_0: 2,
			_1: {
				ctor: '::',
				_0: 4,
				_1: {
					ctor: '::',
					_0: 5,
					_1: {
						ctor: '::',
						_0: 7,
						_1: {
							ctor: '::',
							_0: 9,
							_1: {
								ctor: '::',
								_0: 11,
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	};
	var noteList = {ctor: '[]'};
	var index = function () {
		if (_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$String$length(key),
			2) && _elm_lang$core$Native_Utils.eq(
			A3(_elm_lang$core$String$slice, 1, 2, key),
			'b')) {
			var newIndex = _elm_lang$core$String$toLower(
				A3(_elm_lang$core$String$slice, 0, 1, key));
			return A2(
				_elm_lang$core$Maybe$withDefault,
				0,
				A2(_elm_community$list_extra$List_Extra$elemIndex, newIndex, _user$project$Views_Fretboard$chromaticNotesListFlat)) - 1;
		} else {
			return A2(
				_elm_lang$core$Maybe$withDefault,
				0,
				A2(
					_elm_community$list_extra$List_Extra$elemIndex,
					_elm_lang$core$String$toLower(key),
					_user$project$Views_Fretboard$chromaticNotesList));
		}
	}();
	var mapper = _elm_lang$core$List$map(
		function (a) {
			return inserter(index + a);
		});
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$String$toUpper(key),
		key) ? A2(
		_elm_lang$core$Basics_ops['++'],
		noteList,
		mapper(intervalListMajor)) : A2(
		_elm_lang$core$Basics_ops['++'],
		noteList,
		mapper(intervalListMinor));
};
var _user$project$Views_Fretboard$noteFretPos = function (index) {
	var num = A2(
		_elm_lang$core$Result$withDefault,
		0,
		_elm_lang$core$String$toInt(index));
	return _elm_lang$core$Basics$toFloat(num) * 10.25;
};
var _user$project$Views_Fretboard$noteStringPos = function (stringNo) {
	var num = A2(
		_elm_lang$core$Result$withDefault,
		0,
		_elm_lang$core$String$toInt(stringNo));
	var _p0 = num;
	switch (_p0) {
		case 6:
			return -8.0;
		case 5:
			return 22.0;
		case 4:
			return 52.0;
		case 3:
			return 82.0;
		case 2:
			return 104.0;
		case 1:
			return 136.0;
		default:
			return 0.0;
	}
};
var _user$project$Views_Fretboard$fretNotation = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_FretboardStyles$notationContainerStyle,
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_FretboardStyles$notationNoteStyle(model.notePosition),
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: A2(_user$project$Styles_FretboardStyles$notationAccidentalStyle, model.notePosition, model.showAccidental),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('#'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$hr,
						{
							ctor: '::',
							_0: _user$project$Styles_FretboardStyles$hrStyle,
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$hr,
							{
								ctor: '::',
								_0: _user$project$Styles_FretboardStyles$hrStyle,
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$hr,
								{
									ctor: '::',
									_0: _user$project$Styles_FretboardStyles$hrStyle,
									_1: {ctor: '[]'}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$hr,
									{
										ctor: '::',
										_0: _user$project$Styles_FretboardStyles$hrStyle,
										_1: {ctor: '[]'}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$hr,
										{
											ctor: '::',
											_0: _user$project$Styles_FretboardStyles$hrStyle,
											_1: {ctor: '[]'}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$hr,
											{
												ctor: '::',
												_0: A2(_user$project$Styles_FretboardStyles$hrLedgerStyleHi, model.notePosition, 195.0),
												_1: {ctor: '[]'}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$hr,
												{
													ctor: '::',
													_0: A2(_user$project$Styles_FretboardStyles$hrLedgerStyleHi, model.notePosition, 175.0),
													_1: {ctor: '[]'}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$hr,
													{
														ctor: '::',
														_0: A2(_user$project$Styles_FretboardStyles$hrLedgerStyleHi, model.notePosition, 155.0),
														_1: {ctor: '[]'}
													},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$hr,
														{
															ctor: '::',
															_0: A2(_user$project$Styles_FretboardStyles$hrLedgerStyleLo, model.notePosition, 30.0),
															_1: {ctor: '[]'}
														},
														{ctor: '[]'}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$hr,
															{
																ctor: '::',
																_0: A2(_user$project$Styles_FretboardStyles$hrLedgerStyleLo, model.notePosition, 10.0),
																_1: {ctor: '[]'}
															},
															{ctor: '[]'}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$hr,
																{
																	ctor: '::',
																	_0: A2(_user$project$Styles_FretboardStyles$hrLedgerStyleLo, model.notePosition, -10.0),
																	_1: {ctor: '[]'}
																},
																{ctor: '[]'}),
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Fretboard$stringe = {
	ctor: '::',
	_0: '1/0/e/1',
	_1: {
		ctor: '::',
		_0: '1/1/f',
		_1: {
			ctor: '::',
			_0: '1/1/f#',
			_1: {
				ctor: '::',
				_0: '1/2/g',
				_1: {
					ctor: '::',
					_0: '1/2/g#',
					_1: {
						ctor: '::',
						_0: '1/3/a',
						_1: {
							ctor: '::',
							_0: '1/3/a#',
							_1: {
								ctor: '::',
								_0: '1/4/b/1',
								_1: {
									ctor: '::',
									_0: '1/5/c',
									_1: {
										ctor: '::',
										_0: '1/5/c#',
										_1: {
											ctor: '::',
											_0: '1/6/d',
											_1: {
												ctor: '::',
												_0: '1/6/d#',
												_1: {
													ctor: '::',
													_0: '1/7/e',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$stringB = {
	ctor: '::',
	_0: '2/0/b/1',
	_1: {
		ctor: '::',
		_0: '2/1/c',
		_1: {
			ctor: '::',
			_0: '2/1/c#',
			_1: {
				ctor: '::',
				_0: '2/2/d/',
				_1: {
					ctor: '::',
					_0: '2/2/d#',
					_1: {
						ctor: '::',
						_0: '2/3/e',
						_1: {
							ctor: '::',
							_0: '2/4/f',
							_1: {
								ctor: '::',
								_0: '2/4/f#/1',
								_1: {
									ctor: '::',
									_0: '2/5/g',
									_1: {
										ctor: '::',
										_0: '2/5/g#',
										_1: {
											ctor: '::',
											_0: '2/6/a',
											_1: {
												ctor: '::',
												_0: '2/6/a#',
												_1: {
													ctor: '::',
													_0: '2/7/b',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$stringG = {
	ctor: '::',
	_0: '3/0/g/1',
	_1: {
		ctor: '::',
		_0: '3/0/g#',
		_1: {
			ctor: '::',
			_0: '3/1/a',
			_1: {
				ctor: '::',
				_0: '3/1/a#',
				_1: {
					ctor: '::',
					_0: '3/2/b',
					_1: {
						ctor: '::',
						_0: '3/3/c',
						_1: {
							ctor: '::',
							_0: '3/3/c#',
							_1: {
								ctor: '::',
								_0: '3/4/d/1',
								_1: {
									ctor: '::',
									_0: '3/4/d#',
									_1: {
										ctor: '::',
										_0: '3/5/e',
										_1: {
											ctor: '::',
											_0: '3/6/f',
											_1: {
												ctor: '::',
												_0: '3/6/f#',
												_1: {
													ctor: '::',
													_0: '3/7/g',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$stringD = {
	ctor: '::',
	_0: '4/0/d/1',
	_1: {
		ctor: '::',
		_0: '4/0/d#',
		_1: {
			ctor: '::',
			_0: '4/1/e',
			_1: {
				ctor: '::',
				_0: '4/2/f',
				_1: {
					ctor: '::',
					_0: '4/2/f#',
					_1: {
						ctor: '::',
						_0: '4/3/g',
						_1: {
							ctor: '::',
							_0: '4/3/g#',
							_1: {
								ctor: '::',
								_0: '4/4/a/1',
								_1: {
									ctor: '::',
									_0: '4/4/a#',
									_1: {
										ctor: '::',
										_0: '4/5/b',
										_1: {
											ctor: '::',
											_0: '4/6/c',
											_1: {
												ctor: '::',
												_0: '4/6/c#',
												_1: {
													ctor: '::',
													_0: '4/7/d',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$stringA = {
	ctor: '::',
	_0: '5/0/a/1',
	_1: {
		ctor: '::',
		_0: '5/0/a#',
		_1: {
			ctor: '::',
			_0: '5/1/b',
			_1: {
				ctor: '::',
				_0: '5/2/c',
				_1: {
					ctor: '::',
					_0: '5/2/c#',
					_1: {
						ctor: '::',
						_0: '5/3/d',
						_1: {
							ctor: '::',
							_0: '5/3/d#',
							_1: {
								ctor: '::',
								_0: '5/4/e/1',
								_1: {
									ctor: '::',
									_0: '5/5/f',
									_1: {
										ctor: '::',
										_0: '5/5/f#',
										_1: {
											ctor: '::',
											_0: '5/6/g',
											_1: {
												ctor: '::',
												_0: '5/6/g#',
												_1: {
													ctor: '::',
													_0: '5/7/a',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$stringE = {
	ctor: '::',
	_0: '6/0/e/1',
	_1: {
		ctor: '::',
		_0: '6/1/f',
		_1: {
			ctor: '::',
			_0: '6/1/f#',
			_1: {
				ctor: '::',
				_0: '6/2/g',
				_1: {
					ctor: '::',
					_0: '6/2/g#',
					_1: {
						ctor: '::',
						_0: '6/3/a',
						_1: {
							ctor: '::',
							_0: '6/3/a#',
							_1: {
								ctor: '::',
								_0: '6/4/b/1',
								_1: {
									ctor: '::',
									_0: '6/5/c',
									_1: {
										ctor: '::',
										_0: '6/5/c#',
										_1: {
											ctor: '::',
											_0: '6/6/d',
											_1: {
												ctor: '::',
												_0: '6/6/d#',
												_1: {
													ctor: '::',
													_0: '6/7/e',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Fretboard$fretNumbers = A2(_elm_lang$core$List$range, 0, 12);
var _user$project$Views_Fretboard$fretboardPage = function (model) {
	var blank = function (note) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_FretboardStyles$fretBlankStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(note),
				_1: {ctor: '[]'}
			});
	};
	var fretNumberMarkers = function (num) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_FretboardStyles$fretNumberStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(num)),
				_1: {ctor: '[]'}
			});
	};
	var highlight = {
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'background-color', _1: '#03a9f4'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'transform', _1: 'scale(1.5, 1.5)'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'color', _1: '#fff'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'z-index', _1: '2'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '50px'},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	};
	var frets = function (info) {
		var stringData = A2(_elm_lang$core$String$split, '/', info);
		var index = A2(
			_elm_lang$core$Maybe$withDefault,
			'0',
			A2(_elm_community$list_extra$List_Extra$getAt, 1, stringData));
		var stringNo = A2(
			_elm_lang$core$Maybe$withDefault,
			'0',
			A2(_elm_community$list_extra$List_Extra$getAt, 0, stringData));
		var note = A2(
			_elm_lang$core$Maybe$withDefault,
			'0',
			A2(_elm_community$list_extra$List_Extra$getAt, 2, stringData));
		var sharp = function () {
			var _p1 = _elm_lang$core$String$length(note);
			switch (_p1) {
				case 1:
					return '0';
				case 2:
					return '1';
				default:
					return '0';
			}
		}();
		var fretColor = _elm_lang$core$Native_Utils.eq(
			note,
			A2(
				_elm_lang$core$Maybe$withDefault,
				'c',
				A2(
					_elm_community$list_extra$List_Extra$getAt,
					0,
					_user$project$Views_Fretboard$notesInKey(model.musKey)))) ? '#DDD' : (_elm_lang$core$Native_Utils.eq(
			A2(
				_elm_lang$core$Maybe$withDefault,
				'0',
				A2(_elm_community$list_extra$List_Extra$getAt, 3, stringData)),
			'1') ? '#EEE' : '');
		return A2(
			_elm_lang$core$List$member,
			note,
			_user$project$Views_Fretboard$notesInKey(model.musKey)) ? A4(
			_jinjor$elm_inline_hover$InlineHover$hover,
			highlight,
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: A2(_user$project$Styles_FretboardStyles$fretNoteStyle, '#000', fretColor),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						A3(_user$project$Logic_Types$DrawNote, index, stringNo, sharp)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(note),
				_1: {ctor: '[]'}
			}) : A4(
			_jinjor$elm_inline_hover$InlineHover$hover,
			highlight,
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: A2(_user$project$Styles_FretboardStyles$fretNoteStyle, '#f5f6f5', fretColor),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						A3(_user$project$Logic_Types$DrawNote, index, stringNo, sharp)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(note),
				_1: {ctor: '[]'}
			});
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_FretboardStyles$fretboardContainerStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_FretboardStyles$fretboardTitleStyle,
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								A2(_elm_lang$core$Basics_ops['++'], 'KEY OF ', model.musKey)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								frets,
								_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringE))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									frets,
									_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringA))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										frets,
										_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringD))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											frets,
											_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringG))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												frets,
												_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringB))),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
													_1: {ctor: '[]'}
												},
												A2(
													_elm_lang$core$List$map,
													frets,
													_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringe))),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{
														ctor: '::',
														_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
														_1: {ctor: '[]'}
													},
													A2(
														_elm_lang$core$List$map,
														blank,
														_elm_lang$core$List$reverse(_user$project$Views_Fretboard$stringe))),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$div,
														{
															ctor: '::',
															_0: _user$project$Styles_FretboardStyles$fretboardStringStyle,
															_1: {ctor: '[]'}
														},
														A2(
															_elm_lang$core$List$map,
															fretNumberMarkers,
															_elm_lang$core$List$reverse(_user$project$Views_Fretboard$fretNumbers))),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Fretboard$fretNotation(model),
				_1: {ctor: '[]'}
			}
		});
};

var _user$project$Styles_ChordStyles$soloOnLinkStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'color', _1: '#aaa'},
		_1: {ctor: '[]'}
	});
var _user$project$Styles_ChordStyles$soloOnTextStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '18px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'paddingBottom', _1: '50px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'color', _1: '#A8A7A7'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'textDecoration', _1: 'inherit'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$soloOnNumberStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '25px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Styles_ChordStyles$fretMarkerStyle = function (dot) {
	if (_elm_lang$core$Native_Utils.eq(dot.tint, 'bar')) {
		var stringHeight = A2(
			_elm_lang$core$Result$withDefault,
			-15,
			_elm_lang$core$String$toInt(dot.stringNo));
		var barSize = A2(
			_elm_lang$core$Basics_ops['++'],
			_elm_lang$core$Basics$toString(160 - stringHeight),
			'px');
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.5s ease'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'top',
							_1: A2(_elm_lang$core$Basics_ops['++'], dot.stringNo, 'px')
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'right',
								_1: A2(_elm_lang$core$Basics_ops['++'], dot.fretNo, 'px')
							},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'width', _1: '15px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'height', _1: barSize},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '7px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: '#677077'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'color', _1: 'rgba(0,0,0,0)'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '10'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'boxShadow', _1: '5px 5px 10px rgba(0,0,0,0.25)'},
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	} else {
		if (_elm_lang$core$Native_Utils.eq(dot.fretNo, '-30')) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.5s ease'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'top',
								_1: A2(_elm_lang$core$Basics_ops['++'], dot.stringNo, 'px')
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'right',
									_1: A2(_elm_lang$core$Basics_ops['++'], dot.fretNo, 'px')
								},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'width', _1: '15px'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'height', _1: '25px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '7px'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: 'rgba(0,0,0,0)'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'color', _1: '#777'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'textTransform', _1: 'uppercase'},
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				});
		} else {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.5s ease'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'top',
								_1: A2(_elm_lang$core$Basics_ops['++'], dot.stringNo, 'px')
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'right',
									_1: A2(_elm_lang$core$Basics_ops['++'], dot.fretNo, 'px')
								},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'width', _1: '15px'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'height', _1: '25px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '7px'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: dot.tint},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'boxShadow', _1: '5px 5px 10px rgba(0,0,0,0.25)'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'color', _1: 'rgba(0,0,0,0)'},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '5'},
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				});
		}
	}
};
var _user$project$Styles_ChordStyles$fingerChartTextStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'padding', _1: '15px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'lineHeight', _1: '9px'},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Styles_ChordStyles$fingerChartDotStyle = function (col) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '15px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'height', _1: '25px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '7px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: col},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$Styles_ChordStyles$fingerChartStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'flexDirection', _1: 'column'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'top', _1: '100px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'left', _1: '20px'},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$chordFunctionStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'color', _1: '#999'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'marginLeft', _1: '150px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 auto'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$chordNameStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'color', _1: '#000'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '25px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'marginLeft', _1: '150px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 auto'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$fretStyle = function (fret) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'top', _1: '0'},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'right',
						_1: A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(43 * fret),
							'px')
					},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'height', _1: '150px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'borderRight', _1: '1px solid #607d8b'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$Styles_ChordStyles$chartContainerStyle = function (direction) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'margin', _1: '25px auto'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'flexDirection', _1: direction},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.3s ease'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		});
};
var _user$project$Styles_ChordStyles$nutStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '10px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'height', _1: '151px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: '#333'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'borderBottom', _1: '1px solid #333'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'boxShadow', _1: '5px 10px 20px  rgba(0,0,0,0.25)'},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$stringStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '180px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'height', _1: '30px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'borderBottom', _1: '1px solid #607d8b'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_ChordStyles$chartStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '180px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'height', _1: '151px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'border', _1: '1px solid #607d8b'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'borderTopLeftRadius', _1: '10px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'borderBottomLeftRadius', _1: '10px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'boxShadow', _1: '0 10px 20px rgba(0,0,0,0.25)'},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$chordBarPosStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '-15px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'right', _1: '30%'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.3s ease'},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Styles_ChordStyles$chordsPageStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '95vw'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: '125px'},
				_1: {ctor: '[]'}
			}
		}
	});

var _user$project$Views_Chords$startKey = {
	i: '06x353242030121010',
	ii: '06x05x040232423111',
	iii: '060152242030020010',
	iv: '06x06x343232121010',
	v: '263152040030323413',
	vi: '06x050242332121010',
	vii: '06x15224343432301x',
	i7: '06x353242433121010',
	iv7: '06x05x142334223414',
	v7: '363252040030020111',
	vi7: '06x050242030121010',
	names: {
		ctor: '::',
		_0: 'C',
		_1: {
			ctor: '::',
			_0: 'Dm',
			_1: {
				ctor: '::',
				_0: 'Em',
				_1: {
					ctor: '::',
					_0: 'F',
					_1: {
						ctor: '::',
						_0: 'G',
						_1: {
							ctor: '::',
							_0: 'Am',
							_1: {
								ctor: '::',
								_0: 'Bdim7',
								_1: {
									ctor: '::',
									_0: 'CM7',
									_1: {
										ctor: '::',
										_0: 'FM7',
										_1: {
											ctor: '::',
											_0: 'G7',
											_1: {
												ctor: '::',
												_0: 'Am7',
												_1: {
													ctor: '::',
													_0: '5',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	bars: {
		ctor: '::',
		_0: '',
		_1: {
			ctor: '::',
			_0: '',
			_1: {
				ctor: '::',
				_0: '',
				_1: {
					ctor: '::',
					_0: '',
					_1: {
						ctor: '::',
						_0: '',
						_1: {
							ctor: '::',
							_0: '',
							_1: {
								ctor: '::',
								_0: '',
								_1: {
									ctor: '::',
									_0: '',
									_1: {
										ctor: '::',
										_0: '3',
										_1: {
											ctor: '::',
											_0: '',
											_1: {
												ctor: '::',
												_0: '',
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	key: 'C'
};
var _user$project$Views_Chords$keyList = {
	ctor: '::',
	_0: 'C',
	_1: {
		ctor: '::',
		_0: 'G',
		_1: {
			ctor: '::',
			_0: 'D',
			_1: {
				ctor: '::',
				_0: 'A',
				_1: {
					ctor: '::',
					_0: 'E',
					_1: {
						ctor: '::',
						_0: 'B',
						_1: {
							ctor: '::',
							_0: 'F#',
							_1: {
								ctor: '::',
								_0: 'Db',
								_1: {
									ctor: '::',
									_0: 'Ab',
									_1: {
										ctor: '::',
										_0: 'Eb',
										_1: {
											ctor: '::',
											_0: 'Bb',
											_1: {
												ctor: '::',
												_0: 'F',
												_1: {
													ctor: '::',
													_0: 'a',
													_1: {
														ctor: '::',
														_0: 'e',
														_1: {
															ctor: '::',
															_0: 'b',
															_1: {
																ctor: '::',
																_0: 'f#',
																_1: {
																	ctor: '::',
																	_0: 'c#',
																	_1: {
																		ctor: '::',
																		_0: 'g#',
																		_1: {
																			ctor: '::',
																			_0: 'd#',
																			_1: {
																				ctor: '::',
																				_0: 'bb',
																				_1: {
																					ctor: '::',
																					_0: 'f',
																					_1: {
																						ctor: '::',
																						_0: 'c',
																						_1: {
																							ctor: '::',
																							_0: 'g',
																							_1: {
																								ctor: '::',
																								_0: 'd',
																								_1: {ctor: '[]'}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Chords$keyListMinor = {
	ctor: '::',
	_0: 'a',
	_1: {
		ctor: '::',
		_0: 'e',
		_1: {
			ctor: '::',
			_0: 'b',
			_1: {
				ctor: '::',
				_0: 'f#',
				_1: {
					ctor: '::',
					_0: 'c#',
					_1: {
						ctor: '::',
						_0: 'g#',
						_1: {
							ctor: '::',
							_0: 'd#',
							_1: {
								ctor: '::',
								_0: 'bb',
								_1: {
									ctor: '::',
									_0: 'f',
									_1: {
										ctor: '::',
										_0: 'c',
										_1: {
											ctor: '::',
											_0: 'g',
											_1: {
												ctor: '::',
												_0: 'd',
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Chords$keyListMajor = {
	ctor: '::',
	_0: 'C',
	_1: {
		ctor: '::',
		_0: 'G',
		_1: {
			ctor: '::',
			_0: 'D',
			_1: {
				ctor: '::',
				_0: 'A',
				_1: {
					ctor: '::',
					_0: 'E',
					_1: {
						ctor: '::',
						_0: 'B',
						_1: {
							ctor: '::',
							_0: 'F#',
							_1: {
								ctor: '::',
								_0: 'Db',
								_1: {
									ctor: '::',
									_0: 'Ab',
									_1: {
										ctor: '::',
										_0: 'Eb',
										_1: {
											ctor: '::',
											_0: 'Bb',
											_1: {
												ctor: '::',
												_0: 'F',
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Views_Chords$chordChart = function (chord) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ChordStyles$chartContainerStyle('row'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ChordStyles$chartStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ChordStyles$stringStyle,
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ChordStyles$stringStyle,
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ChordStyles$stringStyle,
									_1: {ctor: '[]'}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ChordStyles$stringStyle,
										_1: {ctor: '[]'}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ChordStyles$fretStyle(1),
											_1: {ctor: '[]'}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ChordStyles$fretStyle(2),
												_1: {ctor: '[]'}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _user$project$Styles_ChordStyles$fretStyle(3),
													_1: {ctor: '[]'}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: chord,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_ChordStyles$nutStyle,
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Views_Chords$chordBarPosition = F2(
	function (index, key) {
		var barPosition = A2(_elm_community$list_extra$List_Extra$getAt, index, key.bars);
		return (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$String$length(
				A2(_elm_lang$core$Maybe$withDefault, '', barPosition)),
			0) > 0) ? A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_ChordStyles$chordBarPosStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'Fret ',
						A3(
							_elm_lang$core$String$slice,
							1,
							2,
							_elm_lang$core$Basics$toString(
								A2(_elm_lang$core$Maybe$withDefault, '', barPosition))))),
				_1: {ctor: '[]'}
			}) : A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{ctor: '[]'});
	});
var _user$project$Views_Chords$chordFunction = F2(
	function (num, key) {
		return _elm_lang$html$Html$text(
			A2(
				_elm_lang$core$Maybe$withDefault,
				'0',
				A2(_elm_community$list_extra$List_Extra$getAt, num, key.names)));
	});
var _user$project$Views_Chords$fretNo = function (fret) {
	var _p0 = fret;
	switch (_p0) {
		case '0':
			return '-30';
		case '1':
			return '15';
		case '2':
			return '58';
		case '3':
			return '102';
		case '4':
			return '145';
		default:
			return '-30';
	}
};
var _user$project$Views_Chords$stringNo = function (string) {
	var _p1 = string;
	switch (_p1) {
		case '1':
			return '135';
		case '2':
			return '105';
		case '3':
			return '75';
		case '4':
			return '45';
		case '5':
			return '15';
		case '6':
			return '-15';
		default:
			return '';
	}
};
var _user$project$Views_Chords$fingerNo = function (finger) {
	var _p2 = finger;
	switch (_p2) {
		case 'b':
			return 'bar';
		case '1':
			return '#677077';
		case '2':
			return '#B5B5B6';
		case '3':
			return '#333';
		case '4':
			return '#03a9f4';
		default:
			return 'none';
	}
};
var _user$project$Views_Chords$chordBuilder = function (chord) {
	var string = F2(
		function (a, b) {
			return A3(_elm_lang$core$String$slice, a, b, chord);
		});
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ChordStyles$fretMarkerStyle(
						A3(
							_user$project$Logic_Types$Dot,
							_user$project$Views_Chords$fingerNo(
								A2(string, 0, 1)),
							_user$project$Views_Chords$stringNo(
								A2(string, 1, 2)),
							_user$project$Views_Chords$fretNo(
								A2(string, 2, 3)))),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(
						A2(string, 2, 3)),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_ChordStyles$fretMarkerStyle(
							A3(
								_user$project$Logic_Types$Dot,
								_user$project$Views_Chords$fingerNo(
									A2(string, 3, 4)),
								_user$project$Views_Chords$stringNo(
									A2(string, 4, 5)),
								_user$project$Views_Chords$fretNo(
									A2(string, 5, 6)))),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							A2(string, 5, 6)),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ChordStyles$fretMarkerStyle(
								A3(
									_user$project$Logic_Types$Dot,
									_user$project$Views_Chords$fingerNo(
										A2(string, 6, 7)),
									_user$project$Views_Chords$stringNo(
										A2(string, 7, 8)),
									_user$project$Views_Chords$fretNo(
										A2(string, 8, 9)))),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								A2(string, 8, 9)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ChordStyles$fretMarkerStyle(
									A3(
										_user$project$Logic_Types$Dot,
										_user$project$Views_Chords$fingerNo(
											A2(string, 9, 10)),
										_user$project$Views_Chords$stringNo(
											A2(string, 10, 11)),
										_user$project$Views_Chords$fretNo(
											A2(string, 11, 12)))),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(
									A2(string, 11, 12)),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ChordStyles$fretMarkerStyle(
										A3(
											_user$project$Logic_Types$Dot,
											_user$project$Views_Chords$fingerNo(
												A2(string, 12, 13)),
											_user$project$Views_Chords$stringNo(
												A2(string, 13, 14)),
											_user$project$Views_Chords$fretNo(
												A2(string, 14, 15)))),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(
										A2(string, 14, 15)),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ChordStyles$fretMarkerStyle(
											A3(
												_user$project$Logic_Types$Dot,
												_user$project$Views_Chords$fingerNo(
													A2(string, 15, 16)),
												_user$project$Views_Chords$stringNo(
													A2(string, 16, 17)),
												_user$project$Views_Chords$fretNo(
													A2(string, 17, 18)))),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(
											A2(string, 17, 18)),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Chords$fingerChart = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _user$project$Styles_ChordStyles$fingerChartStyle,
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$style(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_ChordStyles$fingerChartDotStyle(
							_user$project$Views_Chords$fingerNo('1')),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ChordStyles$fingerChartTextStyle,
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Pointer'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ChordStyles$fingerChartDotStyle(
									_user$project$Views_Chords$fingerNo('2')),
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ChordStyles$fingerChartTextStyle,
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Middle'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ChordStyles$fingerChartDotStyle(
											_user$project$Views_Chords$fingerNo('3')),
										_1: {ctor: '[]'}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ChordStyles$fingerChartTextStyle,
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Ring'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ChordStyles$fingerChartDotStyle(
													_user$project$Views_Chords$fingerNo('4')),
												_1: {ctor: '[]'}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _user$project$Styles_ChordStyles$fingerChartTextStyle,
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Pinky'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Views_Chords$chordChartModel = F5(
	function (model, index, name, accessor1, accessor2) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_ChordStyles$chartContainerStyle('column'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						A2(
							_user$project$Logic_Types$Play,
							accessor1(
								_user$project$Logic_Audio$notes(model.musKey)),
							0)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(_user$project$Views_Chords$chordBarPosition, index, model.displayedChords),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: _user$project$Views_Chords$chordChart(
						_user$project$Views_Chords$chordBuilder(
							accessor2(model.displayedChords))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ChordStyles$chordNameStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(_user$project$Views_Chords$chordFunction, index, model.displayedChords),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ChordStyles$chordFunctionStyle,
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(name),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Views_Chords$chordsPage = function (model) {
	var keyOptions = function (key) {
		return A2(
			_elm_lang$html$Html$option,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$value(key),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(key),
				_1: {ctor: '[]'}
			});
	};
	var soloFretMin = A2(
		_elm_lang$core$Maybe$withDefault,
		'0',
		A2(_elm_community$list_extra$List_Extra$getAt, 11, model.displayedChords.names));
	var soloFretMaj = _elm_lang$core$Basics$toString(
		A2(
			_elm_lang$core$Basics_ops['%'],
			A2(
				_elm_lang$core$Result$withDefault,
				0,
				_elm_lang$core$String$toInt(soloFretMin)) + 3,
			12));
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ChordStyles$chordsPageStyle,
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _user$project$Views_Chords$fingerChart,
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_ChordStyles$chartContainerStyle('row'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A5(
							_user$project$Views_Chords$chordChartModel,
							model,
							0,
							'I',
							function (_) {
								return _.i;
							},
							function (_) {
								return _.i;
							}),
						_1: {
							ctor: '::',
							_0: A5(
								_user$project$Views_Chords$chordChartModel,
								model,
								3,
								'IV',
								function (_) {
									return _.iv;
								},
								function (_) {
									return _.iv;
								}),
							_1: {
								ctor: '::',
								_0: A5(
									_user$project$Views_Chords$chordChartModel,
									model,
									4,
									'V',
									function (_) {
										return _.v;
									},
									function (_) {
										return _.v;
									}),
								_1: {
									ctor: '::',
									_0: A5(
										_user$project$Views_Chords$chordChartModel,
										model,
										5,
										'VI',
										function (_) {
											return _.vi;
										},
										function (_) {
											return _.vi;
										}),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ChordStyles$chartContainerStyle('row'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A5(
								_user$project$Views_Chords$chordChartModel,
								model,
								1,
								'II',
								function (_) {
									return _.ii;
								},
								function (_) {
									return _.ii;
								}),
							_1: {
								ctor: '::',
								_0: A5(
									_user$project$Views_Chords$chordChartModel,
									model,
									2,
									'III',
									function (_) {
										return _.iii;
									},
									function (_) {
										return _.iii;
									}),
								_1: {
									ctor: '::',
									_0: A5(
										_user$project$Views_Chords$chordChartModel,
										model,
										6,
										'VII',
										function (_) {
											return _.vii;
										},
										function (_) {
											return _.vii;
										}),
									_1: {ctor: '[]'}
								}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h4,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('7th CHORDS'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ChordStyles$chartContainerStyle('row'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A5(
										_user$project$Views_Chords$chordChartModel,
										model,
										7,
										'I7',
										function (_) {
											return _.i;
										},
										function (_) {
											return _.i7;
										}),
									_1: {
										ctor: '::',
										_0: A5(
											_user$project$Views_Chords$chordChartModel,
											model,
											8,
											'IV7',
											function (_) {
												return _.iv;
											},
											function (_) {
												return _.iv7;
											}),
										_1: {
											ctor: '::',
											_0: A5(
												_user$project$Views_Chords$chordChartModel,
												model,
												9,
												'V7',
												function (_) {
													return _.v;
												},
												function (_) {
													return _.v7;
												}),
											_1: {
												ctor: '::',
												_0: A5(
													_user$project$Views_Chords$chordChartModel,
													model,
													10,
													'VI7',
													function (_) {
														return _.vi;
													},
													function (_) {
														return _.vi7;
													}),
												_1: {ctor: '[]'}
											}
										}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ChordStyles$soloOnTextStyle,
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('SOLO ON FRET: '),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$span,
												{
													ctor: '::',
													_0: _user$project$Styles_ChordStyles$soloOnNumberStyle,
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(soloFretMin),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$a,
													{
														ctor: '::',
														_0: _user$project$Styles_ChordStyles$soloOnLinkStyle,
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$href(
																_user$project$Logic_Routing$scalesPath(model.musKey)),
															_1: {ctor: '[]'}
														}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text(' (MINOR SCALE), OR FRET: '),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$span,
														{
															ctor: '::',
															_0: _user$project$Styles_ChordStyles$soloOnNumberStyle,
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text(soloFretMaj),
															_1: {ctor: '[]'}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$a,
															{
																ctor: '::',
																_0: _user$project$Styles_ChordStyles$soloOnLinkStyle,
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$href(
																		_user$project$Logic_Routing$scalesPath(model.musKey)),
																	_1: {ctor: '[]'}
																}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text(' (MAJOR SCALE)'),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		});
};

var _user$project$Styles_ScalesStyles$scalePageStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'flexDirection', _1: 'row'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'flexWrap', _1: 'wrap'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'justifyContent', _1: 'center'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_ScalesStyles$fretNumberGroupStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'paddingRight', _1: '10px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '18px'},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Styles_ScalesStyles$fretNumberStyle = function (margin) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'margin',
					_1: A2(_elm_lang$core$Basics_ops['++'], '5px ', margin)
				},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#000'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '1'},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$Styles_ScalesStyles$stringContainerStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '12px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'left', _1: '25px'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_ScalesStyles$stringStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '600px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'borderBottom', _1: '1px solid #ccc'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'marginTop', _1: '32px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '0'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_ScalesStyles$scaleContainerStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '650px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'margin', _1: '30px 0'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_ScalesStyles$scaleTitleStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'marginLeft', _1: '25px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
				_1: {ctor: '[]'}
			}
		}
	});

var _user$project$Views_Scales$dorianMode = {
	e: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	},
	b: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	},
	g: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	d: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	a: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Views_Scales$mixolydianMode = {
	e: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	b: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	},
	g: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	d: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	a: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	}
};
var _user$project$Views_Scales$lydianMode = {
	e: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	b: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	g: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {ctor: '[]'}
		}
	},
	d: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	a: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	}
};
var _user$project$Views_Scales$minorPentatonicMode = {
	e: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 11,
			_1: {ctor: '[]'}
		}
	},
	b: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 11,
			_1: {ctor: '[]'}
		}
	},
	g: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	d: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	a: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 11,
			_1: {ctor: '[]'}
		}
	}
};
var _user$project$Views_Scales$majorPentatonicMode = {
	e: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	b: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	g: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	d: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	a: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	}
};
var _user$project$Views_Scales$aeolianMode = {
	e: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	},
	b: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	},
	g: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	d: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 12,
				_1: {ctor: '[]'}
			}
		}
	},
	a: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {
				ctor: '::',
				_0: 11,
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Views_Scales$ionianMode = {
	e: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	b: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	},
	g: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	d: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 9,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	a: {
		ctor: '::',
		_0: 7,
		_1: {
			ctor: '::',
			_0: 8,
			_1: {
				ctor: '::',
				_0: 10,
				_1: {ctor: '[]'}
			}
		}
	},
	e6: {
		ctor: '::',
		_0: 8,
		_1: {
			ctor: '::',
			_0: 10,
			_1: {ctor: '[]'}
		}
	}
};
var _user$project$Views_Scales$scaleNameMinor = F2(
	function (model, scaleName) {
		var playOver = A2(
			_elm_lang$core$Basics_ops['++'],
			'play over ',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_elm_lang$core$String$toUpper(model.musKey),
				'min'));
		var slicer = A2(_elm_lang$core$String$slice, 0, 1);
		var index = A2(
			_elm_lang$core$Maybe$withDefault,
			0,
			A2(_elm_community$list_extra$List_Extra$elemIndex, model.musKey, _user$project$Views_Chords$keyList));
		return _elm_lang$core$Native_Utils.eq(
			slicer(
				_elm_lang$core$String$toLower(model.musKey)),
			slicer(model.musKey)) ? A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							A2(
								_elm_lang$core$Basics_ops['++'],
								_elm_lang$core$String$toUpper(
									slicer(model.musKey)),
								A3(_elm_lang$core$String$slice, 1, 2, model.musKey))),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#444'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								A2(_elm_lang$core$Basics_ops['++'], ' ', scaleName)),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'color', _1: '#aaa'},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(playOver),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}
			}) : A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							_elm_lang$core$String$toUpper(
								A2(
									_elm_lang$core$Maybe$withDefault,
									'a',
									A2(_elm_community$list_extra$List_Extra$getAt, index + 12, _user$project$Views_Chords$keyList)))),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#444'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(scaleName),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'color', _1: '#aaa'},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(' , relative minor'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Views_Scales$scaleNameMajor = F4(
	function (model, scaleName, modifiedNotes, matchingChord) {
		var playOver = A2(
			_elm_lang$core$Basics_ops['++'],
			' play over ',
			A2(_elm_lang$core$Basics_ops['++'], model.musKey, matchingChord));
		var slicer = A2(_elm_lang$core$String$slice, 0, 1);
		var index = A2(
			_elm_lang$core$Maybe$withDefault,
			0,
			A2(_elm_community$list_extra$List_Extra$elemIndex, model.musKey, _user$project$Views_Chords$keyList));
		return _elm_lang$core$Native_Utils.eq(
			slicer(
				_elm_lang$core$String$toUpper(model.musKey)),
			slicer(model.musKey)) ? A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(model.musKey),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#444'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(scaleName),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(modifiedNotes),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$span,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$style(
										{
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'color', _1: '#aaa'},
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(playOver),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			}) : A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							A2(
								_elm_lang$core$Maybe$withDefault,
								'C',
								A2(_elm_community$list_extra$List_Extra$getAt, index - 12, _user$project$Views_Chords$keyList))),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#444'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(scaleName),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$span,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(modifiedNotes),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$span,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$style(
										{
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'color', _1: '#aaa'},
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(', relative major'),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Views_Scales$fretOffset = function (model) {
	var _p0 = model.musKey;
	switch (_p0) {
		case 'C':
			return 0;
		case 'G':
			return -5;
		case 'D':
			return 2;
		case 'A':
			return -3;
		case 'E':
			return 4;
		case 'B':
			return -1;
		case 'F#':
			return -6;
		case 'Db':
			return 1;
		case 'Ab':
			return -4;
		case 'Eb':
			return 3;
		case 'Bb':
			return -2;
		case 'F':
			return -7;
		case 'a':
			return 0;
		case 'e':
			return -5;
		case 'b':
			return 2;
		case 'f#':
			return -3;
		case 'c#':
			return 4;
		case 'g#':
			return -1;
		case 'd#':
			return 6;
		case 'a#':
			return 1;
		case 'f':
			return -4;
		case 'c':
			return 3;
		case 'g':
			return -2;
		case 'd':
			return 5;
		default:
			return 0;
	}
};
var _user$project$Views_Scales$scaleStringSchema = F3(
	function (offset, key, scale) {
		var mapper = _elm_lang$core$List$map(
			function (a) {
				return a + offset;
			});
		return {
			one: mapper(scale.e),
			two: mapper(scale.b),
			three: mapper(scale.g),
			four: mapper(scale.d),
			five: mapper(scale.a),
			six: mapper(scale.e6)
		};
	});
var _user$project$Views_Scales$stringView = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _user$project$Styles_ScalesStyles$stringContainerStyle,
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$stringStyle,
				_1: {ctor: '[]'}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$stringStyle,
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_ScalesStyles$stringStyle,
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$stringStyle,
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$stringStyle,
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$stringStyle,
									_1: {ctor: '[]'}
								},
								{ctor: '[]'}),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Views_Scales$dorianModeView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var data = function (accessor) {
		return accessor(
			A3(
				_user$project$Views_Scales$scaleStringSchema,
				_user$project$Views_Scales$fretOffset(model),
				model.musKey,
				_user$project$Views_Scales$dorianMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('dorian'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A4(_user$project$Views_Scales$scaleNameMajor, model, ' DORIAN MODE ', ' ( b3, b7 ) ', 'min7'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('500px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('410px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('310px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('210px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('140px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('40px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$mixolydianModeView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var data = function (accessor) {
		return accessor(
			A3(
				_user$project$Views_Scales$scaleStringSchema,
				_user$project$Views_Scales$fretOffset(model),
				model.musKey,
				_user$project$Views_Scales$mixolydianMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('mixolydian'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A4(_user$project$Views_Scales$scaleNameMajor, model, ' MIXOLYDIAN MODE ', ' ( b7 ) ', '7'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('490px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('390px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('320px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('220px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('120px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('50px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$lydianModeView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var data = function (accessor) {
		return accessor(
			A3(
				_user$project$Views_Scales$scaleStringSchema,
				_user$project$Views_Scales$fretOffset(model),
				model.musKey,
				_user$project$Views_Scales$lydianMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('lydian'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A4(_user$project$Views_Scales$scaleNameMajor, model, ' LYDIAN MODE ', ' ( #4 ) ', 'Maj7'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('490px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('390px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('320px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('220px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('120px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('50px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$minorPentatonicView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var computedOffset = (_elm_lang$core$Native_Utils.cmp(
		_user$project$Views_Scales$fretOffset(model) - 3,
		-8) < 0) ? (_user$project$Views_Scales$fretOffset(model) + 9) : (_user$project$Views_Scales$fretOffset(model) - 3);
	var data = function (accessor) {
		return accessor(
			A3(_user$project$Views_Scales$scaleStringSchema, computedOffset, model.musKey, _user$project$Views_Scales$minorPentatonicMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('minPentatonic'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(_user$project$Views_Scales$scaleNameMinor, model, ' MINOR PENTATONIC SCALE '),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('450px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('370px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('290px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('210px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('130px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('50px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$majorPentatonicView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var data = function (accessor) {
		return accessor(
			A3(
				_user$project$Views_Scales$scaleStringSchema,
				_user$project$Views_Scales$fretOffset(model),
				model.musKey,
				_user$project$Views_Scales$majorPentatonicMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('majPentatonic'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A4(_user$project$Views_Scales$scaleNameMajor, model, ' MAJOR PENTATONIC SCALE ', '', ''),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('450px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('370px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('290px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('210px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('130px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('50px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$aeolianModeView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var computedOffset = (_elm_lang$core$Native_Utils.cmp(
		_user$project$Views_Scales$fretOffset(model) - 3,
		-8) < 0) ? (_user$project$Views_Scales$fretOffset(model) + 9) : (_user$project$Views_Scales$fretOffset(model) - 3);
	var data = function (accessor) {
		return accessor(
			A3(_user$project$Views_Scales$scaleStringSchema, computedOffset, model.musKey, _user$project$Views_Scales$aeolianMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('minor'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(_user$project$Views_Scales$scaleNameMinor, model, ' MINOR SCALE '),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('460px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('380px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('320px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('240px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('150px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('50px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$ionianModeView = function (model) {
	var markup = function (a) {
		return A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_ScalesStyles$fretNumberGroupStyle,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(a)),
				_1: {ctor: '[]'}
			});
	};
	var data = function (accessor) {
		return accessor(
			A3(
				_user$project$Views_Scales$scaleStringSchema,
				_user$project$Views_Scales$fretOffset(model),
				model.musKey,
				_user$project$Views_Scales$ionianMode));
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ScalesStyles$scaleContainerStyle,
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(
					A2(
						_user$project$Logic_Types$Play,
						_user$project$Logic_Audio$scales('major'),
						_user$project$Views_Scales$fretOffset(model))),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scaleTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A4(_user$project$Views_Scales$scaleNameMajor, model, ' MAJOR SCALE ', '', ''),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_Scales$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ScalesStyles$fretNumberStyle('490px'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							markup,
							data(
								function (_) {
									return _.one;
								}))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_ScalesStyles$fretNumberStyle('420px'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								markup,
								data(
									function (_) {
										return _.two;
									}))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_ScalesStyles$fretNumberStyle('320px'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									markup,
									data(
										function (_) {
											return _.three;
										}))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_ScalesStyles$fretNumberStyle('220px'),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										markup,
										data(
											function (_) {
												return _.four;
											}))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _user$project$Styles_ScalesStyles$fretNumberStyle('120px'),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$List$map,
											markup,
											data(
												function (_) {
													return _.five;
												}))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _user$project$Styles_ScalesStyles$fretNumberStyle('50px'),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$List$map,
												markup,
												data(
													function (_) {
														return _.six;
													}))),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_Scales$scalesPage = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: '50px'},
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ScalesStyles$scalePageStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _user$project$Views_Scales$ionianModeView(model),
					_1: {
						ctor: '::',
						_0: _user$project$Views_Scales$aeolianModeView(model),
						_1: {
							ctor: '::',
							_0: _user$project$Views_Scales$majorPentatonicView(model),
							_1: {
								ctor: '::',
								_0: _user$project$Views_Scales$minorPentatonicView(model),
								_1: {
									ctor: '::',
									_0: _user$project$Views_Scales$lydianModeView(model),
									_1: {
										ctor: '::',
										_0: _user$project$Views_Scales$mixolydianModeView(model),
										_1: {
											ctor: '::',
											_0: _user$project$Views_Scales$dorianModeView(model),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};

var _user$project$Styles_HomeStyles$secondaryTitleStyle = F2(
	function (fontSize, color) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 20px 30px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fontSize', _1: fontSize},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'color', _1: color},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '50'},
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Styles_HomeStyles$titleStyle = F2(
	function (fontSize, color) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'margin', _1: '125px auto 25px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fontSize', _1: fontSize},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'color', _1: color},
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Styles_HomeStyles$homePageModalIconStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'fontWeight', _1: '700'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_HomeStyles$homePageTextListItemStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'paddingRight', _1: '30px'},
		_1: {ctor: '[]'}
	});
var _user$project$Styles_HomeStyles$homePageTextListStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'color', _1: '#444'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'margin ', _1: '0 auto'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'textDecoration', _1: 'none'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '24px'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_HomeStyles$homePageStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'height', _1: '100vh'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
			_1: {ctor: '[]'}
		}
	});

var _user$project$Views_Home$homePage = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_HomeStyles$homePageStyle,
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: A2(_user$project$Styles_HomeStyles$titleStyle, '30px', '#444'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Applied Music Theory For Guitarists'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_ChordStyles$chartContainerStyle('row'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A5(
							_user$project$Views_Chords$chordChartModel,
							model,
							1,
							'ii',
							function (_) {
								return _.ii;
							},
							function (_) {
								return _.ii;
							}),
						_1: {
							ctor: '::',
							_0: A5(
								_user$project$Views_Chords$chordChartModel,
								model,
								4,
								'V',
								function (_) {
									return _.v;
								},
								function (_) {
									return _.v;
								}),
							_1: {
								ctor: '::',
								_0: A5(
									_user$project$Views_Chords$chordChartModel,
									model,
									0,
									'I',
									function (_) {
										return _.i;
									},
									function (_) {
										return _.i;
									}),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: A2(_user$project$Styles_HomeStyles$secondaryTitleStyle, '', ''),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('This site provides an interactive experience to help guitarists get a basic understanding of important music theory concepts such as'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _user$project$Styles_HomeStyles$homePageTextListStyle,
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{
												ctor: '::',
												_0: _user$project$Styles_HomeStyles$homePageTextListItemStyle,
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('CHORDS'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$span,
												{
													ctor: '::',
													_0: _user$project$Styles_HomeStyles$homePageTextListItemStyle,
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('SCALES'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$span,
													{
														ctor: '::',
														_0: _user$project$Styles_HomeStyles$homePageTextListItemStyle,
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('NOTES OF THE FRETBOARD'),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$span,
														{
															ctor: '::',
															_0: _user$project$Styles_HomeStyles$homePageTextListItemStyle,
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('RHYTHM & STRUMMING'),
															_1: {ctor: '[]'}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _user$project$Styles_HomeStyles$homePageTextListItemStyle,
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text('FINGERPICKING'),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$span,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Click the '),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$span,
													{
														ctor: '::',
														_0: _user$project$Styles_HomeStyles$homePageModalIconStyle,
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('i'),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$span,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text(' logo on the upper right to get started. '),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}
											}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$style(
													{
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'color', _1: ' #777'},
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Use the menu on the right to select a topic or select a musical key.  Click on any chords or scales to hear how they sound.'),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};

var _user$project$Styles_StrumStyles$buttonStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'background', _1: 'none'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'marginTop', _1: '50px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'border', _1: '1px solid #333'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_StrumStyles$beatStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '225px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'left', _1: '0'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'paddingRight', _1: '20px'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_StrumStyles$strumArrowStyle = F4(
	function (num, mover, borderCol, background) {
		var shadow = function () {
			var _p0 = mover;
			switch (_p0) {
				case 1:
					return '-5px -15px 20px -10px rgba(0,0,0,0.5)';
				case 2:
					return '5px 15px 20px -10px rgba(0,0,0,0.5)';
				default:
					return '0';
			}
		}();
		var rotate = function () {
			var _p1 = mover;
			switch (_p1) {
				case 1:
					return '180deg';
				case 2:
					return '0';
				default:
					return '0';
			}
		}();
		var opacity = function () {
			var _p2 = num;
			switch (_p2) {
				case 1:
					return '1';
				case 2:
					return '0';
				default:
					return 'hidden';
			}
		}();
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'width', _1: '100px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'height', _1: '180px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'margin', _1: '10px 10px 20px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'opacity', _1: opacity},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: '50px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'border',
											_1: A2(_elm_lang$core$Basics_ops['++'], '1px solid ', borderCol)
										},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '10px'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'justifyContent', _1: 'center'},
												_1: {
													ctor: '::',
													_0: {
														ctor: '_Tuple2',
														_0: 'transform',
														_1: A2(
															_elm_lang$core$Basics_ops['++'],
															'rotate(',
															A2(_elm_lang$core$Basics_ops['++'], rotate, ')'))
													},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.4s ease'},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: 'boxShadow', _1: shadow},
															_1: {
																ctor: '::',
																_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: background},
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Styles_StrumStyles$strumGroupMatrixStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'flexWrap', _1: 'wrap'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'justifyContent', _1: 'center'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_StrumStyles$strumGroupStyle = F2(
	function (scale, margin) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'transform',
					_1: A2(
						_elm_lang$core$Basics_ops['++'],
						'scale(',
						A2(_elm_lang$core$Basics_ops['++'], scale, ')'))
				},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'width', _1: '950px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'margin', _1: margin},
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Styles_StrumStyles$strumPageStyle = function (size) {
	var pad = function () {
		var _p3 = size;
		switch (_p3) {
			case '4':
				return '100px';
			case '2':
				return '100px';
			default:
				return '175px';
		}
	}();
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'flexDirection', _1: 'column'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: pad},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'alignItems', _1: 'center'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.3s'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};

var _user$project$Views_Strum$printNotation = function (notes) {
	var strumNotationDotStyle = _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'bottom', _1: '-30px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'right', _1: '-15px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '50px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'color', _1: '#555'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
	var strumNotationFlagStyle = function (flag) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'top', _1: '-7px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'right', _1: '-15px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '15px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'height', _1: '15px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'transform', _1: 'skew(30deg)'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'visibility', _1: flag},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'color', _1: '#555'},
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	};
	var strumNotationContainerStyle = _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'height', _1: '35px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'borderRight', _1: '2px solid #555'},
					_1: {ctor: '[]'}
				}
			}
		});
	var baseStyles = function (fill) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'bottom', _1: '-10px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'left', _1: '-5px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '14px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'height', _1: '15px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'transform', _1: 'skew(-20deg)'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'border', _1: '2px solid #555'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '10px'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: fill},
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	};
	var markup = F3(
		function (fill, dot, flag) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: strumNotationContainerStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: baseStyles(fill),
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: strumNotationFlagStyle(flag),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(')'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: strumNotationDotStyle,
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(dot),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				});
		});
	var _p0 = notes;
	switch (_p0) {
		case 0:
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{ctor: '[]'});
		case 1:
			return A3(markup, '#555', '', 'visible');
		case 2:
			return A3(markup, '#555', '', 'hidden');
		case 3:
			return A3(markup, '#555', '.', 'hidden');
		case 4:
			return A3(markup, 'none', '', 'hidden');
		default:
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{ctor: '[]'});
	}
};
var _user$project$Views_Strum$calculateNotation = F3(
	function (list, index, notes) {
		calculateNotation:
		while (true) {
			var getter = function (a) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					1,
					A2(_elm_community$list_extra$List_Extra$getAt, index + a, notes));
			};
			var notation = (_elm_lang$core$Native_Utils.eq(
				getter(0),
				1) && _elm_lang$core$Native_Utils.eq(
				getter(1),
				2)) ? (_elm_lang$core$Native_Utils.eq(
				getter(2),
				1) ? 2 : (_elm_lang$core$Native_Utils.eq(
				getter(3),
				1) ? 3 : 4)) : ((_elm_lang$core$Native_Utils.eq(
				getter(0),
				1) && _elm_lang$core$Native_Utils.eq(
				getter(1),
				1)) ? 1 : ((_elm_lang$core$Native_Utils.eq(
				getter(4),
				1) && _elm_lang$core$Native_Utils.eq(
				getter(7),
				2)) ? 4 : 0));
			if (_elm_lang$core$Native_Utils.cmp(
				index,
				_elm_lang$core$List$length(notes)) < 0) {
				var _v1 = {ctor: '::', _0: notation, _1: list},
					_v2 = index + 1,
					_v3 = notes;
				list = _v1;
				index = _v2;
				notes = _v3;
				continue calculateNotation;
			} else {
				return _elm_lang$core$List$reverse(list);
			}
		}
	});
var _user$project$Views_Strum$arrow = function (col) {
	var baseStyles = F4(
		function (height, width, x, y) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'transform', _1: 'rotate(45deg)'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'width', _1: width},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'height', _1: height},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'borderTop',
									_1: A2(_elm_lang$core$Basics_ops['++'], '9px solid ', col)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'borderLeft',
										_1: A2(_elm_lang$core$Basics_ops['++'], '9px solid ', col)
									},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'marginLeft', _1: x},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'marginTop', _1: y},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				});
		});
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: A4(baseStyles, '50px', '50px', '0', '0'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$hr,
				{
					ctor: '::',
					_0: A4(baseStyles, '1px', '100px', '-20px', '25px'),
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Strum$strumGroupNumberSelector = A2(
	_elm_lang$html$Html$select,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Events$onInput(_user$project$Logic_Types$ChangeStrumGroupNumber),
		_1: {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'width', _1: '200px'},
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$option,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$value('1'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('NUMBER OF MEASURES: 1'),
				_1: {ctor: '[]'}
			}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$option,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$value('2'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('NUMBER OF MEASURES: 2'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$option,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$value('4'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('NUMBER OF MEASURES: 4'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Views_Strum$strumGroup = F6(
	function (scale, notes, borderCol, arrowCol, background, margin) {
		var arrows = F2(
			function (a, b) {
				return A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: A4(_user$project$Styles_StrumStyles$strumArrowStyle, a, b, borderCol, background),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _user$project$Views_Strum$arrow(arrowCol),
						_1: {ctor: '[]'}
					});
			});
		var notation = function (a) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$style(
						{
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '10px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'margin', _1: '20px 55px 0'},
								_1: {ctor: '[]'}
							}
						}),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _user$project$Views_Strum$printNotation(a),
					_1: {ctor: '[]'}
				});
		};
		var beats = function (a) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$style(
						{
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '10px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 55px 0'},
								_1: {ctor: '[]'}
							}
						}),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(
						_elm_lang$core$Basics$toString(a)),
					_1: {ctor: '[]'}
				});
		};
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: A2(_user$project$Styles_StrumStyles$strumGroupStyle, scale, margin),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$style(
							{
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					},
					A3(
						_elm_lang$core$List$map2,
						arrows,
						notes,
						{
							ctor: '::',
							_0: 1,
							_1: {
								ctor: '::',
								_0: 2,
								_1: {
									ctor: '::',
									_0: 1,
									_1: {
										ctor: '::',
										_0: 2,
										_1: {
											ctor: '::',
											_0: 1,
											_1: {
												ctor: '::',
												_0: 2,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {
														ctor: '::',
														_0: 2,
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						})),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							beats,
							A2(_elm_lang$core$List$range, 1, 8))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								notation,
								A3(
									_user$project$Views_Strum$calculateNotation,
									{ctor: '[]'},
									0,
									notes))),
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Views_Strum$strumGroupMatrix = function (model) {
	var strumPattern = function (n) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(_elm_community$list_extra$List_Extra$getAt, n, model.strumArrow));
	};
	var _p1 = model.strumGroupNumber;
	switch (_p1) {
		case '1':
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A6(
						_user$project$Views_Strum$strumGroup,
						'1,1',
						strumPattern(0),
						'#CCC',
						'#000',
						'#FFF',
						'0'),
					_1: {ctor: '[]'}
				});
		case '2':
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A6(
						_user$project$Views_Strum$strumGroup,
						'0.8,0.8',
						strumPattern(0),
						'#CCC',
						'#000',
						'#FFF',
						'-20px -175px'),
					_1: {
						ctor: '::',
						_0: A6(
							_user$project$Views_Strum$strumGroup,
							'0.8,0.8',
							strumPattern(1),
							'#CCC',
							'#000',
							'#03a9f4',
							'-30px -175px'),
						_1: {ctor: '[]'}
					}
				});
		case '4':
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_StrumStyles$strumGroupMatrixStyle,
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A6(
								_user$project$Views_Strum$strumGroup,
								'0.6,0.6',
								strumPattern(0),
								'#CCC',
								'#000',
								'#FFF',
								'-25px -175px'),
							_1: {
								ctor: '::',
								_0: A6(
									_user$project$Views_Strum$strumGroup,
									'0.6,0.6',
									strumPattern(1),
									'#CCC',
									'#000',
									'#03a9f4',
									'-25px -175px'),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_StrumStyles$strumGroupMatrixStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A6(
									_user$project$Views_Strum$strumGroup,
									'0.6,0.6',
									strumPattern(2),
									'#CCC',
									'#000',
									'#FFF',
									'-25px -175px'),
								_1: {
									ctor: '::',
									_0: A6(
										_user$project$Views_Strum$strumGroup,
										'0.6,0.6',
										strumPattern(3),
										'#CCC',
										'#000',
										'#03a9f4',
										'-25px -175px'),
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				});
		default:
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_StrumStyles$strumGroupMatrixStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A6(
						_user$project$Views_Strum$strumGroup,
						'0.5,0.5',
						strumPattern(0),
						'#CCC',
						'#000',
						'#FFF',
						'0'),
					_1: {ctor: '[]'}
				});
	}
};
var _user$project$Views_Strum$strummingPage = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_StrumStyles$strumPageStyle(model.strumGroupNumber),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _user$project$Views_Strum$strumGroupNumberSelector,
			_1: {
				ctor: '::',
				_0: _user$project$Views_Strum$strumGroupMatrix(model),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$button,
						{
							ctor: '::',
							_0: _user$project$Styles_StrumStyles$buttonStyle,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(
									A2(_user$project$Logic_Types$Randomize, 1, 2)),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Generate Random Strum Pattern'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};

var _user$project$Styles_FingerPickStyles$fingerPickNotationDotStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'bottom', _1: '-30px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'right', _1: '-15px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '50px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'color', _1: '#555'},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Styles_FingerPickStyles$fingerPickNotationFlagStyle = function (flag) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'top', _1: '-7px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'right', _1: '-15px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'width', _1: '15px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'height', _1: '15px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'transform', _1: 'skew(30deg)'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'visibility', _1: flag},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'color', _1: '#555'},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Styles_FingerPickStyles$fingerPickNotationContainerStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'height', _1: '35px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'borderRight', _1: '2px solid #555'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_FingerPickStyles$fingerPickNotationBaseStyles = function (fill) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'bottom', _1: '-10px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'left', _1: '-5px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'width', _1: '14px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'height', _1: '15px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'transform', _1: 'skew(-20deg)'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'border', _1: '2px solid #555'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '10px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: fill},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Styles_FingerPickStyles$buttonStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'background', _1: 'none'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'marginTop', _1: '50px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'border', _1: '1px solid #333'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_FingerPickStyles$fingerPickChordTitleStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '50px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'left', _1: '30px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#000'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'transform', _1: 'scale(0.8, 0.8)'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_FingerPickStyles$beatStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'paddingRight', _1: '200px'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_FingerPickStyles$stringStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '950px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'borderBottom', _1: '1px solid #aaa'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'marginTop', _1: '32px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '-1'},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Styles_FingerPickStyles$fretStyle = F2(
	function (num, mover) {
		var opacity = function () {
			var _p0 = num;
			switch (_p0) {
				case 1:
					return '1';
				case 2:
					return '0';
				default:
					return '0';
			}
		}();
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'width', _1: '100px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'height', _1: '180px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'margin', _1: '10px 10px 20px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'opacity', _1: opacity},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: '50px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'borderRadius', _1: '10px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'justifyContent', _1: 'center'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.4s ease'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'color', _1: '#000'},
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Styles_FingerPickStyles$fingerPickGroupNotationStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '10px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'margin', _1: '5px 55px 0'},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Styles_FingerPickStyles$fingerPickGroupBeatStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '10px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'margin', _1: '5px 55px 10px'},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Styles_FingerPickStyles$fingerPickGroupStyle = function (scale) {
	return _elm_lang$html$Html_Attributes$style(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'transform',
				_1: A2(
					_elm_lang$core$Basics_ops['++'],
					'scale(',
					A2(_elm_lang$core$Basics_ops['++'], scale, ')'))
			},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'margin', _1: '125px 0 0 200px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$Styles_FingerPickStyles$fingerPickingPageStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'height', _1: '100vh'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'width', _1: '100vw'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'flexDirection', _1: 'column'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: '150px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'alignItems', _1: 'center'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});

var _user$project$Views_FingerPick$printNotation = function (notes) {
	var markup = F3(
		function (fill, dot, flag) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_FingerPickStyles$fingerPickNotationContainerStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_FingerPickStyles$fingerPickNotationBaseStyles(fill),
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_FingerPickStyles$fingerPickNotationFlagStyle(flag),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(')'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_FingerPickStyles$fingerPickNotationDotStyle,
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(dot),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				});
		});
	var _p0 = notes;
	switch (_p0) {
		case 0:
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{ctor: '[]'});
		case 1:
			return A3(markup, '#555', '', 'visible');
		case 2:
			return A3(markup, '#555', '', 'hidden');
		case 3:
			return A3(markup, '#555', '.', 'hidden');
		case 4:
			return A3(markup, 'none', '', 'hidden');
		default:
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{ctor: '[]'});
	}
};
var _user$project$Views_FingerPick$calculateNotation = F4(
	function (list, index, notes1, notes2) {
		calculateNotation:
		while (true) {
			var getter2 = function (a) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					1,
					A2(_elm_community$list_extra$List_Extra$getAt, index + a, notes2));
			};
			var possibleNotes2 = function (a) {
				return A2(
					_elm_lang$core$List$member,
					getter2(a),
					A2(_elm_lang$core$List$range, 1, 5));
			};
			var getter1 = function (a) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					1,
					A2(_elm_community$list_extra$List_Extra$getAt, index + a, notes1));
			};
			var possibleNotes1 = function (a) {
				return A2(
					_elm_lang$core$List$member,
					getter1(a),
					A2(_elm_lang$core$List$range, 1, 5));
			};
			var possibleNotes = function (a) {
				return possibleNotes1(a) || possibleNotes2(a);
			};
			var notation = (_elm_lang$core$Native_Utils.eq(
				possibleNotes(0),
				true) && _elm_lang$core$Native_Utils.eq(
				possibleNotes(1),
				false)) ? (_elm_lang$core$Native_Utils.eq(
				possibleNotes(2),
				true) ? 2 : (_elm_lang$core$Native_Utils.eq(
				possibleNotes(3),
				true) ? 3 : 4)) : ((_elm_lang$core$Native_Utils.eq(
				possibleNotes(0),
				true) && _elm_lang$core$Native_Utils.eq(
				possibleNotes(1),
				true)) ? 1 : ((_elm_lang$core$Native_Utils.eq(
				possibleNotes(4),
				true) && _elm_lang$core$Native_Utils.eq(
				possibleNotes(7),
				false)) ? 4 : 0));
			if (_elm_lang$core$Native_Utils.cmp(
				index,
				_elm_lang$core$List$length(notes1)) < 0) {
				var _v1 = {ctor: '::', _0: notation, _1: list},
					_v2 = index + 1,
					_v3 = notes1,
					_v4 = notes2;
				list = _v1;
				index = _v2;
				notes1 = _v3;
				notes2 = _v4;
				continue calculateNotation;
			} else {
				return _elm_lang$core$List$reverse(list);
			}
		}
	});
var _user$project$Views_FingerPick$chordNotes = function (model) {
	var finalChord = {ctor: '[]'};
	var bar = A2(
		_elm_lang$core$Maybe$withDefault,
		'',
		A2(
			_elm_community$list_extra$List_Extra$getAt,
			0,
			function (_) {
				return _.bars;
			}(model.displayedChords)));
	var adder = function (a) {
		return _elm_lang$core$Native_Utils.eq(bar, '') ? a : (_elm_lang$core$Native_Utils.eq(a, '') ? a : _elm_lang$core$Basics$toString(
			_elm_lang$core$Basics$negate(
				A2(
					F2(
						function (x, y) {
							return x - y;
						}),
					2,
					A2(
						_elm_lang$core$Result$withDefault,
						0,
						A3(
							_elm_lang$core$Result$map2,
							F2(
								function (x, y) {
									return x + y;
								}),
							_elm_lang$core$String$toInt(a),
							_elm_lang$core$String$toInt(bar)))))));
	};
	var chord = function (_) {
		return _.i;
	}(model.displayedChords);
	var slicer = F2(
		function (a, b) {
			return A3(_elm_lang$core$String$slice, a, b, chord);
		});
	return (_elm_lang$core$Native_Utils.eq(
		A2(slicer, 2, 3),
		'x') && _elm_lang$core$Native_Utils.eq(
		A2(slicer, 5, 6),
		'x')) ? A2(
		_elm_lang$core$List$map,
		adder,
		A2(
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			{
				ctor: '::',
				_0: A2(slicer, 17, 18),
				_1: finalChord
			},
			A2(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				{
					ctor: '::',
					_0: A2(slicer, 14, 15),
					_1: finalChord
				},
				A2(
					F2(
						function (x, y) {
							return A2(_elm_lang$core$Basics_ops['++'], x, y);
						}),
					{
						ctor: '::',
						_0: A2(slicer, 11, 12),
						_1: finalChord
					},
					A2(
						F2(
							function (x, y) {
								return A2(_elm_lang$core$Basics_ops['++'], x, y);
							}),
						{
							ctor: '::',
							_0: A2(slicer, 8, 9),
							_1: finalChord
						},
						A2(
							F2(
								function (x, y) {
									return A2(_elm_lang$core$Basics_ops['++'], x, y);
								}),
							{ctor: '::', _0: '', _1: finalChord},
							{ctor: '::', _0: '', _1: finalChord})))))) : (_elm_lang$core$Native_Utils.eq(
		A2(slicer, 2, 3),
		'x') ? A2(
		_elm_lang$core$List$map,
		adder,
		A2(
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			{
				ctor: '::',
				_0: A2(slicer, 17, 18),
				_1: finalChord
			},
			A2(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				{
					ctor: '::',
					_0: A2(slicer, 14, 15),
					_1: finalChord
				},
				A2(
					F2(
						function (x, y) {
							return A2(_elm_lang$core$Basics_ops['++'], x, y);
						}),
					{
						ctor: '::',
						_0: A2(slicer, 11, 12),
						_1: finalChord
					},
					A2(
						F2(
							function (x, y) {
								return A2(_elm_lang$core$Basics_ops['++'], x, y);
							}),
						{
							ctor: '::',
							_0: A2(slicer, 8, 9),
							_1: finalChord
						},
						A2(
							F2(
								function (x, y) {
									return A2(_elm_lang$core$Basics_ops['++'], x, y);
								}),
							{
								ctor: '::',
								_0: A2(slicer, 5, 6),
								_1: finalChord
							},
							{ctor: '::', _0: '', _1: finalChord})))))) : A2(
		_elm_lang$core$List$map,
		adder,
		A2(
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			{
				ctor: '::',
				_0: A2(slicer, 17, 18),
				_1: finalChord
			},
			A2(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				{
					ctor: '::',
					_0: A2(slicer, 14, 15),
					_1: finalChord
				},
				A2(
					F2(
						function (x, y) {
							return A2(_elm_lang$core$Basics_ops['++'], x, y);
						}),
					{
						ctor: '::',
						_0: A2(slicer, 11, 12),
						_1: finalChord
					},
					A2(
						F2(
							function (x, y) {
								return A2(_elm_lang$core$Basics_ops['++'], x, y);
							}),
						{
							ctor: '::',
							_0: A2(slicer, 8, 9),
							_1: finalChord
						},
						A2(
							F2(
								function (x, y) {
									return A2(_elm_lang$core$Basics_ops['++'], x, y);
								}),
							{
								ctor: '::',
								_0: A2(slicer, 5, 6),
								_1: finalChord
							},
							{
								ctor: '::',
								_0: A2(slicer, 2, 3),
								_1: finalChord
							})))))));
};
var _user$project$Views_FingerPick$stringView = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'marginBottom', _1: '20px'},
				_1: {ctor: '[]'}
			}),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_FingerPickStyles$stringStyle,
				_1: {ctor: '[]'}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_FingerPickStyles$stringStyle,
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_FingerPickStyles$stringStyle,
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_FingerPickStyles$stringStyle,
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _user$project$Styles_FingerPickStyles$stringStyle,
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_FingerPickStyles$stringStyle,
									_1: {ctor: '[]'}
								},
								{ctor: '[]'}),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Views_FingerPick$fret = F2(
	function (num, model) {
		var opacity = function () {
			var _p1 = num;
			if (_p1 === 0) {
				return '0';
			} else {
				return '1';
			}
		}();
		var height = function () {
			var _p2 = num;
			switch (_p2) {
				case 1:
					return '-202px';
				case 2:
					return '-168px';
				case 3:
					return '-135px';
				case 4:
					return '-103px';
				case 5:
					return '-70px';
				case 6:
					return '-37px';
				default:
					return '0';
			}
		}();
		var baseStyles = _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'marginTop', _1: height},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'width', _1: '120px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'color', _1: '#000'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'justifyContent', _1: 'center'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'opacity', _1: opacity},
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			});
		var getter = function (a) {
			return A2(
				_elm_lang$core$Maybe$withDefault,
				'',
				A2(
					_elm_community$list_extra$List_Extra$getAt,
					a,
					_user$project$Views_FingerPick$chordNotes(model)));
		};
		var message = function () {
			var _p3 = num;
			switch (_p3) {
				case 1:
					return getter(0);
				case 2:
					return getter(1);
				case 3:
					return getter(2);
				case 4:
					return getter(3);
				case 5:
					return getter(4);
				case 6:
					return getter(5);
				default:
					return '';
			}
		}();
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: baseStyles,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(message),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Views_FingerPick$fingerPickGroup = F4(
	function (scale, notes1, notes2, model) {
		var frets = function (a) {
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(_user$project$Views_FingerPick$fret, a, model),
					_1: {ctor: '[]'}
				});
		};
		var notation = function (a) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_FingerPickStyles$fingerPickGroupNotationStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _user$project$Views_FingerPick$printNotation(a),
					_1: {ctor: '[]'}
				});
		};
		var beats = function (a) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_FingerPickStyles$fingerPickGroupBeatStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(
						_elm_lang$core$Basics$toString(a)),
					_1: {ctor: '[]'}
				});
		};
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _user$project$Styles_FingerPickStyles$fingerPickGroupStyle(scale),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _user$project$Views_FingerPick$stringView,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						},
						A2(_elm_lang$core$List$map, frets, notes1)),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							},
							A2(_elm_lang$core$List$map, frets, notes2)),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _user$project$Styles_FingerPickStyles$beatStyle,
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$List$map,
									beats,
									A2(_elm_lang$core$List$range, 1, 8))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$style(
											{
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$List$map,
										notation,
										A4(
											_user$project$Views_FingerPick$calculateNotation,
											{ctor: '[]'},
											0,
											notes1,
											notes2))),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			});
	});
var _user$project$Views_FingerPick$fingerPickingPage = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_FingerPickStyles$fingerPickingPageStyle,
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h1,
				{
					ctor: '::',
					_0: _user$project$Styles_FingerPickStyles$fingerPickChordTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A5(
						_user$project$Views_Chords$chordChartModel,
						model,
						0,
						'',
						function (_) {
							return _.i;
						},
						function (_) {
							return _.i;
						}),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A4(_user$project$Views_FingerPick$fingerPickGroup, '1,1', model.fingerPickPattern.a, model.fingerPickPattern.b, model),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$button,
						{
							ctor: '::',
							_0: _user$project$Styles_FingerPickStyles$buttonStyle,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(
									A2(_user$project$Logic_Types$Randomize, 0, 8)),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Generate Random Fingerpicking Pattern'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};

var _user$project$Styles_ModalStyles$modalHeaderStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: '#333'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'margin', _1: '-25px 0 25px -25px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'padding', _1: '20px 25px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'width', _1: '100vw'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'height', _1: '75px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'color', _1: '#f40331'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_ModalStyles$modalContentStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'left'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'padding', _1: '25px'},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Styles_ModalStyles$closeModalIcon = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '20px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'right', _1: '20px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '20px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'color', _1: '#f40331'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_ModalStyles$modalIconStyle = function (model) {
	var baseStyles = F2(
		function (color, offset) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'top', _1: offset},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'right', _1: '60px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'color', _1: color},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '40px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'fontWeight', _1: '700'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '10001'},
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				});
		});
	return _elm_lang$core$Native_Utils.eq(model.navMenuOpen, true) ? A2(baseStyles, '#FFF', '2px') : (_elm_lang$core$Native_Utils.eq(model.modalOpen, true) ? A2(baseStyles, '#f40331', '2px') : A2(baseStyles, '#03a9f4', '0'));
};
var _user$project$Styles_ModalStyles$modalStyle = function (model) {
	var baseStyles = F2(
		function (trans, opacity) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'top', _1: '75px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'left', _1: '0'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'width', _1: '100vw'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'height', _1: '90vh'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: 'rgba(0,0,0,1)'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '50'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'color', _1: '#ccc'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'overflow', _1: 'scroll'},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: 'opacity', _1: opacity},
															_1: {
																ctor: '::',
																_0: {ctor: '_Tuple2', _0: 'transform', _1: trans},
																_1: {
																	ctor: '::',
																	_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.3s linear'},
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				});
		});
	var _p0 = model.modalOpen;
	if (_p0 === true) {
		return A2(baseStyles, 'translateX(0)', '1');
	} else {
		return A2(baseStyles, 'translateX(101vw)', '0');
	}
};

var _user$project$Views_Modal$strumModalContent = '\nWhen it comes to strumming it is easiest to think of a repeating 8 beat pattern\n##### **COUNT: 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8**\n* With your hand strumming down on any ODD beat and up on any EVEN beat.\n* Thus your down strums would fall on every 1 3 5 or 7 and your up strums on 2 4 6 or 8\n* Your strumming hand should always be following this up down pattern, hovering over the strings even if they do not strum the string\n***\n##### How To Learn\n* Practice strumming **down** on all counts **1 3 5 7**\n* Practice strumming **up** on all counts **2 4 6 8**\n* Use the random strum generator to create a practice pattern choose from one of the patterns below.\n* Be sure that your hand is always moving in the correct direction (down of 1 3 5 7, up on 2 4 6 8)\n***\n##### Common Strum Patterns\n';
var _user$project$Views_Modal$strummingModal = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ModalStyles$modalContentStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ModalStyles$closeModalIcon,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('x'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{
								ctor: '::',
								_0: _user$project$Styles_ModalStyles$modalHeaderStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Strumming'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$elm_markdown$Markdown$toHtml,
								{ctor: '[]'},
								_user$project$Views_Modal$strumModalContent),
							_1: {
								ctor: '::',
								_0: A6(
									_user$project$Views_Strum$strumGroup,
									'0.75,0.75',
									{
										ctor: '::',
										_0: 1,
										_1: {
											ctor: '::',
											_0: 2,
											_1: {
												ctor: '::',
												_0: 1,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {
														ctor: '::',
														_0: 2,
														_1: {
															ctor: '::',
															_0: 1,
															_1: {
																ctor: '::',
																_0: 1,
																_1: {
																	ctor: '::',
																	_0: 1,
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}
											}
										}
									},
									'#444',
									'#FFF',
									'none',
									'0'),
								_1: {
									ctor: '::',
									_0: A6(
										_user$project$Views_Strum$strumGroup,
										'0.75,0.75',
										{
											ctor: '::',
											_0: 1,
											_1: {
												ctor: '::',
												_0: 1,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {
														ctor: '::',
														_0: 2,
														_1: {
															ctor: '::',
															_0: 1,
															_1: {
																ctor: '::',
																_0: 1,
																_1: {
																	ctor: '::',
																	_0: 1,
																	_1: {
																		ctor: '::',
																		_0: 2,
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										},
										'#444',
										'#FFF',
										'none',
										'0'),
									_1: {
										ctor: '::',
										_0: A6(
											_user$project$Views_Strum$strumGroup,
											'0.75,0.75',
											{
												ctor: '::',
												_0: 1,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {
														ctor: '::',
														_0: 2,
														_1: {
															ctor: '::',
															_0: 1,
															_1: {
																ctor: '::',
																_0: 1,
																_1: {
																	ctor: '::',
																	_0: 2,
																	_1: {
																		ctor: '::',
																		_0: 1,
																		_1: {
																			ctor: '::',
																			_0: 1,
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											},
											'#444',
											'#FFF',
											'none',
											'0'),
										_1: {
											ctor: '::',
											_0: A6(
												_user$project$Views_Strum$strumGroup,
												'0.75,0.75',
												{
													ctor: '::',
													_0: 2,
													_1: {
														ctor: '::',
														_0: 1,
														_1: {
															ctor: '::',
															_0: 2,
															_1: {
																ctor: '::',
																_0: 1,
																_1: {
																	ctor: '::',
																	_0: 2,
																	_1: {
																		ctor: '::',
																		_0: 1,
																		_1: {
																			ctor: '::',
																			_0: 2,
																			_1: {
																				ctor: '::',
																				_0: 1,
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}
													}
												},
												'#444',
												'#FFF',
												'none',
												'0'),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$scalesModalContent = '\nScales are usually defined as a collection of 8 notes grouped together by a specific formula of whole **W** and half **H** steps and spanning one musical octve **C2 to C3, for example**. You can think of a half step as moving up or down one fret and a whole step as moving up or down 2 frets.\n**ASCENDING** Scales are played from the lowest pitch note to the highest; **DESCENDING** from the highest pitch to lowest.\n##### Scale Formulas\n* **MAJOR SCALE** **W-W-H-W-W-W-H** (AKA: Ionian Mode)\n* ** MINOR SCALE** **W-H-W-W-H-W-W** (AKA: Aeolian Mode)\n* **LYDIAN MODE** **W-W-W-H-W-W-H**\n* **MIXOLYDIAN MODE** **W-W-H-W-W-H-W**\n* **DORIAN MODE** **W-H-W-W-H-W-W**\n* **MAJOR  PENTATONIC** Made up of the  **1st**,**2nd**,**3rd**,**5th**, & **6th** notes of the **MAJOR SCALE**\n* **MINOR  PENTATONIC** Made up of the  **1st**,**3rd**,**4th**,**5th**, & **6th** notes of the **MINOR SCALE**\n***\n##### How To Learn\n* Start by memorizing the  **MINOR PENTATONIC SCALE**. You will use this scale A LOT.\n* Then proceed to the **MINOR SCALE**, **MAJOR SCALE** & **MAJOR PENTATONIC SCALE**, in that order.\n* A good way to practice these is to play **each note** **4 times ascending**, then **2 times descending**, then **1 time ascending & descending**.\n';
var _user$project$Views_Modal$scalesModal = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ModalStyles$modalContentStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ModalStyles$closeModalIcon,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('x'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{
								ctor: '::',
								_0: _user$project$Styles_ModalStyles$modalHeaderStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Scales'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$elm_markdown$Markdown$toHtml,
								{ctor: '[]'},
								_user$project$Views_Modal$scalesModalContent),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$fretboardModalContent = '';
var _user$project$Views_Modal$fretboardModal = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ModalStyles$modalContentStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ModalStyles$closeModalIcon,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('x'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{
								ctor: '::',
								_0: _user$project$Styles_ModalStyles$modalHeaderStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('FretBoard'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$elm_markdown$Markdown$toHtml,
								{ctor: '[]'},
								_user$project$Views_Modal$fretboardModalContent),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$fingerPickModalContent = '';
var _user$project$Views_Modal$fingerPickModal = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ModalStyles$modalContentStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ModalStyles$closeModalIcon,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('x'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{
								ctor: '::',
								_0: _user$project$Styles_ModalStyles$modalHeaderStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('FingerPicking'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$elm_markdown$Markdown$toHtml,
								{ctor: '[]'},
								_user$project$Views_Modal$fingerPickModalContent),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$chordModalContent = '\nChords are defined as two or more harmonic pitches that are sounded simultaneously.  Most chords played on the guitar consist of 3 notes but many contain 4 or more pitches.\nChords are comprised of the **1st**, **3rd**, & **5th** notes of their corresponding scales.  For example:\n* a C MAJOR **SCALE** contains the notes **C D E F G A B C**\n* a C MAJOR **CHORD** contains the notes **C E G**, the **1st**, **3rd**, & **5th** notes of the C MAJOR SCALE.\n* a G MAJOR **SCALE** contains the notes **G A B C D E F# G**\n* a G MAJOR **CHORD** contains the notes **G B D**, the **1st**, **3rd**, & **5th** notes of the G MAJOR SCALE.\n***\n##### Numeric Chords (i.e. 7th, 9th, 11th, etc.)\n**7th chords** are the same as regular chords but in addition to the standard chord pitches, they also contain the **7th** pitch of the scale.\nSimilarly, **9th chords** add the **9th** pitch of the scale.\n\nFor the scope of this site, we will concentrate on the basic 6 chords:\n* **MAJOR** _written as_ **M** ex: **CM**, or simply **C**\n* **MINOR** _written as_ **m** ex: **Cm**\n* **MAJOR 7TH** _written as_ **M7** ex: **CM7**\n* **MINOR 7TH** _written as_ **m7** ex: **Cm7**\n* **DOMINANT 7TH** _written as_ **7** ex: **C7**\n* **DIMINISHED 7TH** _written as_ **dim7** ex: **Cdim7**\n***\n##### Chord Functions\nWithin any given key, chords are defined by their function, or number, using roman numerals. Within the **C MAJOR SCALE** the **C** chord has the function **I** because it is built off the\nfirst pitch of the scale. The **Dm** chord, has the function **ii** because it is built off the 2nd pitch of the scale.  _Note the lowercase **ii** because the chord is minor_\nYou should begin by learning the **I**, **IV**,**V**, & **vi** chords of any given key as those are by far the most commonly played chords.\n***\n##### How To Learn\n* Begin by learning the **I**, **IV**,**V**, & **vi** chords in the keys **C, G, D** & **Am**.\n* Once those are comfortable start looking at some of the bar chords in other keys.\n* _NOTE: In some of the \"easier\" keys, we have modified chords that would normally require bar chords to make them more accessible._\n* Once you feel comfortable with basic chords, start looking at 7th chords.\n* A great way to improve your mastery of chords is to memorize the \"shape\" of the chord away from the guitar.\nIn other words, practice the shape of the chord without placing it on the fretboard.  This will accelerate your muscle memory patterning and increase your\nability to quickly move your fingers into that chord position.\n';
var _user$project$Views_Modal$chordModal = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ModalStyles$modalContentStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ModalStyles$closeModalIcon,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('x'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{
								ctor: '::',
								_0: _user$project$Styles_ModalStyles$modalHeaderStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Chords'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$elm_markdown$Markdown$toHtml,
								{ctor: '[]'},
								_user$project$Views_Modal$chordModalContent),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$homeModalContent = '\n#### HOW TO USE THIS WEBSITE\n***\nThis site is broken up into several sections:\n* **CHORDS**\n* **SCALES**\n* **FRETBOARD**\n* **STRUMMING**\n* **FINGERPICKING**\n***\nStart with **CHORDS** and **STRUMMING**.\n\nOnce those are making sense proceed to **SCALES**.\n\nSave the **FRETBOARD** and **FINGERPICKING** sections for last.\n';
var _user$project$Views_Modal$homeModal = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_ModalStyles$modalContentStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_ModalStyles$closeModalIcon,
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('x'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{
								ctor: '::',
								_0: _user$project$Styles_ModalStyles$modalHeaderStyle,
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Guide'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$elm_markdown$Markdown$toHtml,
								{ctor: '[]'},
								_user$project$Views_Modal$homeModalContent),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$modalIcon = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_ModalStyles$modalIconStyle(model),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowModal),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text('i'),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_Modal$modal = function (model) {
	var key = model.musKey;
	var _p0 = model.route;
	switch (_p0.ctor) {
		case 'ChordsPage':
			return _user$project$Views_Modal$chordModal(model);
		case 'ScalesPage':
			return _user$project$Views_Modal$scalesModal(model);
		case 'FretboardPage':
			return _user$project$Views_Modal$fretboardModal(model);
		case 'NotFoundPage':
			return A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{ctor: '[]'});
		case 'HomePage':
			return _user$project$Views_Modal$homeModal(model);
		case 'StrummingPage':
			return _user$project$Views_Modal$strummingModal(model);
		default:
			return _user$project$Views_Modal$fingerPickModal(model);
	}
};

var _user$project$Styles_MainStyles$signatureStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'absolute'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'bottom', _1: '10px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'right', _1: '10px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '12px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'color', _1: '#FFF'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'textDecoration', _1: 'none'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_MainStyles$highlight = {
	ctor: '::',
	_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
	_1: {ctor: '[]'}
};
var _user$project$Styles_MainStyles$textContainerStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'flexFlow', _1: 'row wrap '},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Styles_MainStyles$keyListContainerStyle = function (navOpen) {
	var baseStyles = F2(
		function (display, shift) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'display', _1: 'flex'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'opacity', _1: display},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'top', _1: '200px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'right', _1: '50px'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'width', _1: '500px'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'transform', _1: shift},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.4s ease'},
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				});
		});
	var _p0 = navOpen;
	if (_p0 === true) {
		return A2(baseStyles, '1', 'translateY(0)');
	} else {
		return A2(baseStyles, '0', 'translateY(-600px)');
	}
};
var _user$project$Styles_MainStyles$keyListKeyTitleStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '-30px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'right', _1: '50px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'width', _1: '450px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'right'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '16px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'textTransform', _1: 'underline'},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_MainStyles$keyListStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'width', _1: '60px'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'margin', _1: '10px 10px 0 0 '},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'lineHeight', _1: '60px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'border', _1: '1px solid #333'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '16px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.4s ease'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#fff'},
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_MainStyles$navTitleStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'top', _1: '10px'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'left', _1: '20px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#000'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '30px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'fontWeight', _1: '700'},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Styles_MainStyles$navItemStyle = function (bool) {
	var baseStyles = F2(
		function (iconColor, display) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'display', _1: display},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 0 5px 50px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'padding', _1: '5px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'fontSize', _1: '24px'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'left'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'color', _1: iconColor},
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				});
		});
	var _p1 = bool;
	if (_p1 === true) {
		return A2(baseStyles, '#FFF', 'block');
	} else {
		return A2(baseStyles, '#000', 'none');
	}
};
var _user$project$Styles_MainStyles$navStyle = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'textAlign', _1: 'center'},
		_1: {ctor: '[]'}
	});
var _user$project$Styles_MainStyles$navIconStyleHr = function (bool) {
	var baseStyles = function (color) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'borderTop',
					_1: A2(_elm_lang$core$Basics_ops['++'], '5px solid ', color)
				},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'margin', _1: '0 0 5px'},
					_1: {ctor: '[]'}
				}
			});
	};
	var _p2 = bool;
	if (_p2 === true) {
		return baseStyles('#FFF');
	} else {
		return baseStyles('#000');
	}
};
var _user$project$Styles_MainStyles$navIconStyle = function (model) {
	var baseStyles = function (difference) {
		return _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'top', _1: '20px'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'right', _1: '20px'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'width', _1: '25px'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.5s'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'cursor', _1: 'pointer'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '10001'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'transform', _1: difference},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			});
	};
	var _p3 = model.navMenuOpen;
	if (_p3 === true) {
		return baseStyles('rotate(270deg)');
	} else {
		return baseStyles('none');
	}
};
var _user$project$Styles_MainStyles$navMenuStyle = function (model) {
	var baseStyles = F3(
		function (h, color, pad) {
			return _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'fixed'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'top', _1: '0'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'right', _1: '0'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'transform', _1: 'translateX(0)'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'width', _1: '100vw'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'height', _1: h},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'paddingTop', _1: pad},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'backgroundColor', _1: color},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'transition', _1: 'all 0.3s ease'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'zIndex', _1: '10000'},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: 'borderBottom', _1: '1px solid #ccc'},
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				});
		});
	var _p4 = model.navMenuOpen;
	if (_p4 === true) {
		return A3(baseStyles, '100vh', 'rgba(0,0,0,0.9)', '100px');
	} else {
		return A3(baseStyles, '75px', '#FFF', '15px');
	}
};

var _user$project$Views_MainViews$playbackSpeedSlider = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_MainStyles$navItemStyle(model.navMenuOpen),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$style(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'marginTop', _1: '100px'},
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'+ ',
							A2(_elm_lang$core$Basics_ops['++'], 'AUDIO SPEED', ' -'))),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$input,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$type_('range'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$min('1'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$max('10'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$value(
										_elm_lang$core$Basics$toString(model.sliderValue)),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onInput(_user$project$Logic_Types$ChangeSliderValue),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Views_MainViews$notFoundPage = A2(
	_elm_lang$html$Html$h1,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'margin', _1: '100px 300px'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
					_1: {ctor: '[]'}
				}
			}),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: _elm_lang$html$Html$text('Page Not Found! '),
		_1: {ctor: '[]'}
	});
var _user$project$Views_MainViews$page = function (model) {
	var _p0 = model.route;
	switch (_p0.ctor) {
		case 'ChordsPage':
			return _user$project$Views_Chords$chordsPage(model);
		case 'FretboardPage':
			return _user$project$Views_Fretboard$fretboardPage(model);
		case 'ScalesPage':
			return _user$project$Views_Scales$scalesPage(model);
		case 'HomePage':
			return _user$project$Views_Home$homePage(model);
		case 'StrummingPage':
			return _user$project$Views_Strum$strummingPage(model);
		case 'FingerPickingPage':
			return _user$project$Views_FingerPick$fingerPickingPage(model);
		default:
			return _user$project$Views_MainViews$notFoundPage;
	}
};
var _user$project$Views_MainViews$signature = function (bool) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_MainStyles$navItemStyle(bool),
			_1: {
				ctor: '::',
				_0: _user$project$Styles_MainStyles$signatureStyle,
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A4(
				_jinjor$elm_inline_hover$InlineHover$hover,
				_user$project$Styles_MainStyles$highlight,
				_elm_lang$html$Html$a,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$href('https://www.github.com/fedreg'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$style(
							{
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'color', _1: '#666'},
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('c. 2017 FedReg (v. 0.1)'),
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Views_MainViews$keyListView = function (model) {
	var keyOptions = function (key) {
		return _elm_lang$core$Native_Utils.eq(key, model.musKey) ? A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_MainStyles$keyListStyle,
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$Logic_Types$ChangeKey(key)),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$style(
							{
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'border', _1: '1px solid #03a9f4'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(key),
				_1: {ctor: '[]'}
			}) : A2(
			_elm_lang$html$Html$span,
			{
				ctor: '::',
				_0: _user$project$Styles_MainStyles$keyListStyle,
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$Logic_Types$ChangeKey(key)),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$style(
							{
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'border', _1: '1px solid #333'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#fff'},
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(key),
				_1: {ctor: '[]'}
			});
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_MainStyles$keyListContainerStyle(model.navMenuOpen),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h3,
				{
					ctor: '::',
					_0: _user$project$Styles_MainStyles$keyListKeyTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('SELECT KEY'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _user$project$Styles_MainStyles$textContainerStyle,
						_1: {ctor: '[]'}
					},
					A2(_elm_lang$core$List$map, keyOptions, _user$project$Views_Chords$keyListMajor)),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _user$project$Styles_MainStyles$textContainerStyle,
							_1: {ctor: '[]'}
						},
						A2(_elm_lang$core$List$map, keyOptions, _user$project$Views_Chords$keyListMinor)),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Views_MainViews$navIcon = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_MainStyles$navIconStyle(model),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(_user$project$Logic_Types$ShowNavMenu),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$hr,
				{
					ctor: '::',
					_0: _user$project$Styles_MainStyles$navIconStyleHr(model.navMenuOpen),
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$hr,
					{
						ctor: '::',
						_0: _user$project$Styles_MainStyles$navIconStyleHr(model.navMenuOpen),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$hr,
						{
							ctor: '::',
							_0: _user$project$Styles_MainStyles$navIconStyleHr(model.navMenuOpen),
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Views_MainViews$pathList = function (model) {
	return {
		ctor: '::',
		_0: _user$project$Logic_Routing$homePath,
		_1: {
			ctor: '::',
			_0: _user$project$Logic_Routing$chordsPath(model.musKey),
			_1: {
				ctor: '::',
				_0: _user$project$Logic_Routing$scalesPath(model.musKey),
				_1: {
					ctor: '::',
					_0: _user$project$Logic_Routing$fretboardPath(model.musKey),
					_1: {
						ctor: '::',
						_0: _user$project$Logic_Routing$strummingPath,
						_1: {
							ctor: '::',
							_0: _user$project$Logic_Routing$fingerPickingPath,
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	};
};
var _user$project$Views_MainViews$pageList = {
	ctor: '::',
	_0: 'HOME',
	_1: {
		ctor: '::',
		_0: 'CHORDS',
		_1: {
			ctor: '::',
			_0: 'SCALES',
			_1: {
				ctor: '::',
				_0: 'FRETBOARD',
				_1: {
					ctor: '::',
					_0: 'STRUMMING',
					_1: {
						ctor: '::',
						_0: 'FINGERPICKING',
						_1: {ctor: '[]'}
					}
				}
			}
		}
	}
};
var _user$project$Views_MainViews$nav = function (model) {
	var navItem = F2(
		function (rte, page) {
			return _elm_lang$core$Native_Utils.eq(
				A2(
					_elm_lang$core$String$startsWith,
					page,
					_elm_lang$core$String$toUpper(
						_elm_lang$core$Basics$toString(model.route))),
				true) ? A2(
				_elm_lang$html$Html$a,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$Logic_Types$NewUrl(rte)),
					_1: {
						ctor: '::',
						_0: _user$project$Styles_MainStyles$navItemStyle(model.navMenuOpen),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$style(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'color', _1: '#03a9f4'},
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(page),
					_1: {ctor: '[]'}
				}) : A2(
				_elm_lang$html$Html$a,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$Logic_Types$NewUrl(rte)),
					_1: {
						ctor: '::',
						_0: _user$project$Styles_MainStyles$navItemStyle(model.navMenuOpen),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(page),
					_1: {ctor: '[]'}
				});
		});
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _user$project$Styles_MainStyles$navMenuStyle(model),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _user$project$Styles_MainStyles$navTitleStyle,
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Fret Theory'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Views_MainViews$navIcon(model),
				_1: {
					ctor: '::',
					_0: _user$project$Views_Modal$modalIcon(model),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{ctor: '[]'},
							A3(
								_elm_lang$core$List$map2,
								navItem,
								_user$project$Views_MainViews$pathList(model),
								_user$project$Views_MainViews$pageList)),
						_1: {
							ctor: '::',
							_0: _user$project$Views_MainViews$playbackSpeedSlider(model),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$style(
											{
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _user$project$Views_MainViews$keyListView(model),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: _user$project$Views_MainViews$signature(model.navMenuOpen),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Views_MainViews$mainView = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'position', _1: 'relative'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'overflow', _1: 'hidden'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'padding', _1: '5px'},
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _user$project$Views_MainViews$nav(model),
			_1: {
				ctor: '::',
				_0: _user$project$Views_MainViews$page(model),
				_1: {
					ctor: '::',
					_0: _user$project$Views_Modal$modal(model),
					_1: {ctor: '[]'}
				}
			}
		});
};

var _user$project$Main$chordDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'key',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'names',
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'bars',
			_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'vi7',
				_elm_lang$core$Json_Decode$string,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'v7',
					_elm_lang$core$Json_Decode$string,
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'iv7',
						_elm_lang$core$Json_Decode$string,
						A3(
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
							'i7',
							_elm_lang$core$Json_Decode$string,
							A3(
								_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
								'vii',
								_elm_lang$core$Json_Decode$string,
								A3(
									_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
									'vi',
									_elm_lang$core$Json_Decode$string,
									A3(
										_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
										'v',
										_elm_lang$core$Json_Decode$string,
										A3(
											_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
											'iv',
											_elm_lang$core$Json_Decode$string,
											A3(
												_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
												'iii',
												_elm_lang$core$Json_Decode$string,
												A3(
													_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
													'ii',
													_elm_lang$core$Json_Decode$string,
													A3(
														_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
														'i',
														_elm_lang$core$Json_Decode$string,
														_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Logic_Types$ChordChartData)))))))))))))));
var _user$project$Main$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: function () {
				var val = _elm_lang$core$Basics$toFloat(model.sliderValue) / 10.0;
				return (_elm_lang$core$Native_Utils.cmp(
					model.index,
					_elm_lang$core$List$length(model.currentChord)) < 0) ? A2(
					_elm_lang$core$Time$every,
					val * _elm_lang$core$Time$second,
					_elm_lang$core$Basics$always(_user$project$Logic_Types$SendNotes)) : _elm_lang$core$Platform_Sub$none;
			}(),
			_1: {
				ctor: '::',
				_0: A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$listen, model.phxSocket, _user$project$Logic_Types$PhoenixMsg),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Main$initPhoenixSocket = A4(
	_fbonetti$elm_phoenix_socket$Phoenix_Socket$on,
	'chord_select',
	'chordChannel:chords',
	_user$project$Logic_Types$ReceiveMessage,
	_fbonetti$elm_phoenix_socket$Phoenix_Socket$withDebug(
		_fbonetti$elm_phoenix_socket$Phoenix_Socket$init('wss://damp-wave-74595.herokuapp.com/socket/websocket')));
var _user$project$Main$joinChannel = A2(
	_elm_lang$core$Task$perform,
	_elm_lang$core$Basics$identity,
	_elm_lang$core$Task$succeed(_user$project$Logic_Types$JoinChannel));
var _user$project$Main$init = function (location) {
	var currentRoute = _user$project$Logic_Routing$parseLocation(location);
	return {
		ctor: '_Tuple2',
		_0: {
			route: currentRoute,
			musKey: 'C',
			index: 6,
			currentChord: {ctor: '[]'},
			displayedChords: _user$project$Views_Chords$startKey,
			notePosition: 80.0,
			showAccidental: '0',
			sliderValue: 1,
			navMenuOpen: false,
			pitchShift: 0,
			modalOpen: false,
			strumGroupNumber: '1',
			strumArrow: {
				ctor: '::',
				_0: {
					ctor: '::',
					_0: 1,
					_1: {
						ctor: '::',
						_0: 2,
						_1: {
							ctor: '::',
							_0: 1,
							_1: {
								ctor: '::',
								_0: 1,
								_1: {
									ctor: '::',
									_0: 2,
									_1: {
										ctor: '::',
										_0: 1,
										_1: {
											ctor: '::',
											_0: 1,
											_1: {
												ctor: '::',
												_0: 1,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '::',
						_0: 1,
						_1: {
							ctor: '::',
							_0: 2,
							_1: {
								ctor: '::',
								_0: 1,
								_1: {
									ctor: '::',
									_0: 1,
									_1: {
										ctor: '::',
										_0: 2,
										_1: {
											ctor: '::',
											_0: 1,
											_1: {
												ctor: '::',
												_0: 1,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: 1,
							_1: {
								ctor: '::',
								_0: 2,
								_1: {
									ctor: '::',
									_0: 1,
									_1: {
										ctor: '::',
										_0: 1,
										_1: {
											ctor: '::',
											_0: 2,
											_1: {
												ctor: '::',
												_0: 1,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {
														ctor: '::',
														_0: 1,
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '::',
								_0: 1,
								_1: {
									ctor: '::',
									_0: 2,
									_1: {
										ctor: '::',
										_0: 1,
										_1: {
											ctor: '::',
											_0: 1,
											_1: {
												ctor: '::',
												_0: 2,
												_1: {
													ctor: '::',
													_0: 1,
													_1: {
														ctor: '::',
														_0: 1,
														_1: {
															ctor: '::',
															_0: 1,
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							},
							_1: {ctor: '[]'}
						}
					}
				}
			},
			fingerPickPattern: {
				a: {
					ctor: '::',
					_0: 2,
					_1: {
						ctor: '::',
						_0: 0,
						_1: {
							ctor: '::',
							_0: 0,
							_1: {
								ctor: '::',
								_0: 3,
								_1: {
									ctor: '::',
									_0: 0,
									_1: {
										ctor: '::',
										_0: 1,
										_1: {
											ctor: '::',
											_0: 0,
											_1: {
												ctor: '::',
												_0: 2,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				},
				b: {
					ctor: '::',
					_0: 5,
					_1: {
						ctor: '::',
						_0: 0,
						_1: {
							ctor: '::',
							_0: 4,
							_1: {
								ctor: '::',
								_0: 0,
								_1: {
									ctor: '::',
									_0: 5,
									_1: {
										ctor: '::',
										_0: 0,
										_1: {
											ctor: '::',
											_0: 5,
											_1: {
												ctor: '::',
												_0: 0,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			phxSocket: _user$project$Main$initPhoenixSocket
		},
		_1: _user$project$Main$joinChannel
	};
};
var _user$project$Main$send = _elm_lang$core$Native_Platform.outgoingPort(
	'send',
	function (v) {
		return {
			note: {frequency: v.note.frequency, octave: v.note.octave, sustain: v.note.sustain},
			waveType: v.waveType
		};
	});
var _user$project$Main$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'NoOp':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					{ctor: '[]'});
			case 'JoinChannel':
				var channel = _fbonetti$elm_phoenix_socket$Phoenix_Channel$init('chordChannel:chords');
				var _p1 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$join, channel, model.phxSocket);
				var phxSocket = _p1._0;
				var phxCmd = _p1._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{phxSocket: phxSocket}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Logic_Types$PhoenixMsg, phxCmd)
				};
			case 'PhoenixMsg':
				var _p2 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$update, _p0._0, model.phxSocket);
				var phxSocket = _p2._0;
				var phxCmd = _p2._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{phxSocket: phxSocket}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Logic_Types$PhoenixMsg, phxCmd)
				};
			case 'SendMessage':
				var payload = _elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'key',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {ctor: '[]'}
					});
				var push_ = A2(
					_fbonetti$elm_phoenix_socket$Phoenix_Push$withPayload,
					payload,
					A2(_fbonetti$elm_phoenix_socket$Phoenix_Push$init, 'chord_select', 'chordChannel:chords'));
				var _p3 = A2(_fbonetti$elm_phoenix_socket$Phoenix_Socket$push, push_, model.phxSocket);
				var phxSocket = _p3._0;
				var phxCmd = _p3._1;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{phxSocket: phxSocket}),
					{
						ctor: '::',
						_0: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Logic_Types$PhoenixMsg, phxCmd),
						_1: {ctor: '[]'}
					});
			case 'ReceiveMessage':
				var updatedChords = A2(
					_elm_lang$core$Result$withDefault,
					_user$project$Views_Chords$startKey,
					A2(
						_elm_lang$core$Json_Decode$decodeString,
						_user$project$Main$chordDecoder,
						A2(_elm_lang$core$Json_Encode$encode, 0, _p0._0)));
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{displayedChords: updatedChords}),
					{ctor: '[]'});
			case 'ShowNavMenu':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{navMenuOpen: !model.navMenuOpen, modalOpen: false}),
					{ctor: '[]'});
			case 'ShowModal':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{modalOpen: !model.modalOpen}),
					{ctor: '[]'});
			case 'Randomize':
				var _p6 = _p0._1;
				var _p5 = _p0._0;
				var _p4 = model.route;
				switch (_p4.ctor) {
					case 'StrummingPage':
						return {
							ctor: '_Tuple2',
							_0: model,
							_1: A2(
								_elm_lang$core$Random$generate,
								_user$project$Logic_Types$StrumArrowDirection,
								A2(
									_elm_lang$core$Random$list,
									4,
									A2(
										_elm_lang$core$Random$list,
										8,
										A2(_elm_lang$core$Random$int, _p5, _p6))))
						};
					case 'FingerPickingPage':
						return {
							ctor: '_Tuple2',
							_0: model,
							_1: _elm_lang$core$Platform_Cmd$batch(
								{
									ctor: '::',
									_0: A2(
										_elm_lang$core$Random$generate,
										_user$project$Logic_Types$FingerPickPatternBuilderA,
										A2(
											_elm_lang$core$Random$list,
											8,
											A2(_elm_lang$core$Random$int, _p5, _p6))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$core$Random$generate,
											_user$project$Logic_Types$FingerPickPatternBuilderB,
											A2(
												_elm_lang$core$Random$list,
												8,
												A2(_elm_lang$core$Random$int, _p5, _p6))),
										_1: {ctor: '[]'}
									}
								})
						};
					default:
						return A2(
							_elm_lang$core$Platform_Cmd_ops['!'],
							model,
							{ctor: '[]'});
				}
			case 'StrumArrowDirection':
				var _p8 = _p0._0;
				var _p7 = A2(_elm_lang$core$Debug$log, 'numList', _p8);
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{strumArrow: _p8}),
					{ctor: '[]'});
			case 'ChangeStrumGroupNumber':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{strumGroupNumber: _p0._0}),
					{ctor: '[]'});
			case 'FingerPickPatternBuilderA':
				var pattern = model.fingerPickPattern;
				var newPattern = _elm_lang$core$Native_Utils.update(
					pattern,
					{a: _p0._0});
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{fingerPickPattern: newPattern}),
					{ctor: '[]'});
			case 'FingerPickPatternBuilderB':
				var pattern = model.fingerPickPattern;
				var newPattern = _elm_lang$core$Native_Utils.update(
					pattern,
					{b: _p0._0});
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{fingerPickPattern: newPattern}),
					{ctor: '[]'});
			case 'OnLocationChange':
				var _p9 = _p0._0;
				var newKey = A2(
					_elm_lang$core$Maybe$withDefault,
					'C',
					A2(_user$project$Logic_Routing$modelUpdateOnHash, model, _p9));
				var newRoute = _user$project$Logic_Routing$parseLocation(_p9);
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{route: newRoute, musKey: newKey, modalOpen: false, navMenuOpen: false}),
					{ctor: '[]'});
			case 'NewUrl':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _elm_lang$navigation$Navigation$newUrl(_p0._0)
				};
			case 'ChangeKey':
				var _p10 = _p0._0;
				return A2(
					_ccapndave$elm_update_extra$Update_Extra_Infix_ops[':>'],
					{
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{musKey: _p10, navMenuOpen: false}),
						_1: _user$project$Main$joinChannel
					},
					_user$project$Main$update(
						_user$project$Logic_Types$SendMessage(_p10)));
			case 'Play':
				return A2(
					_ccapndave$elm_update_extra$Update_Extra_Infix_ops[':>'],
					A2(
						_ccapndave$elm_update_extra$Update_Extra_Infix_ops[':>'],
						A2(
							_elm_lang$core$Platform_Cmd_ops['!'],
							_elm_lang$core$Native_Utils.update(
								model,
								{currentChord: _p0._0, pitchShift: _p0._1}),
							{ctor: '[]'}),
						_user$project$Main$update(_user$project$Logic_Types$ResetIndex)),
					_user$project$Main$update(_user$project$Logic_Types$SendNotes));
			case 'ResetIndex':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{index: 0}),
					{ctor: '[]'});
			case 'SendNotes':
				var note = _user$project$Logic_Audio$noteSorter(
					A2(
						_elm_lang$core$Maybe$withDefault,
						'e2w',
						A2(_elm_community$list_extra$List_Extra$getAt, model.index, model.currentChord)));
				var shiftedNote = _elm_lang$core$Native_Utils.update(
					note,
					{
						frequency: note.frequency * Math.pow(
							1.059463,
							_elm_lang$core$Basics$toFloat(model.pitchShift)),
						sustain: note.sustain * (_elm_lang$core$Basics$toFloat(model.sliderValue) / 2)
					});
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{index: model.index + 1}),
					_1: _user$project$Main$send(
						A2(_user$project$Logic_Types$PlayBundle, shiftedNote, 'triangle'))
				};
			case 'DrawNote':
				var fretOffset = _user$project$Views_Fretboard$noteFretPos(_p0._0);
				var stringOffset = _user$project$Views_Fretboard$noteStringPos(_p0._1);
				var finalOffset = fretOffset + stringOffset;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{notePosition: finalOffset, showAccidental: _p0._2}),
					{ctor: '[]'});
			default:
				var val = A2(
					_elm_lang$core$Result$withDefault,
					1,
					_elm_lang$core$String$toInt(_p0._0));
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{sliderValue: val}),
					{ctor: '[]'});
		}
	});
var _user$project$Main$main = A2(
	_elm_lang$navigation$Navigation$program,
	_user$project$Logic_Types$OnLocationChange,
	{init: _user$project$Main$init, update: _user$project$Main$update, view: _user$project$Views_MainViews$mainView, subscriptions: _user$project$Main$subscriptions})();

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
if (typeof _user$project$Main$main !== 'undefined') {
    _user$project$Main$main(Elm['Main'], 'Main', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);


});

require.register("web/static/js/socket.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _phoenix = require("phoenix");

var socket = new _phoenix.Socket("/socket", { params: { token: window.userToken } });

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
socket.connect();

// Now that you are connected, you can join channels with a topic:
var channel = socket.channel("topic:subtopic", {});
channel.join().receive("ok", function (resp) {
  console.log("Joined successfully", resp);
}).receive("error", function (resp) {
  console.log("Unable to join", resp);
});

exports.default = socket;
});

;require.alias("process/browser.js", "process");
require.alias("phoenix/priv/static/phoenix.js", "phoenix");
require.alias("phoenix_html/priv/static/phoenix_html.js", "phoenix_html");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('web/static/js/app');
//# sourceMappingURL=app.js.map