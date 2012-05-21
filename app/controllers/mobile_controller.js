var url = require('url'),
qs = require("querystring");

var starttime = (new Date()).getTime();
//session的存储时间
var SESSION_TIMEOUT = 600 * 1000;
//查询通道
var channel = new function() {
	var session;
  this.getAll = function(callback){
    var all_sessions=[];
		for (var i in sessions) {
			if (!sessions.hasOwnProperty(i)) continue;
      all_sessions.push({nick:i.nick,lat:i.lat,lon:i.lon});
    }
    callback(all_sessions);
  };
	this.query = function(watchNick, callback) {
		for (var i in sessions) {
			if (!sessions.hasOwnProperty(i)) continue;
			if (sessions[i].nick == watchNick) {
				session = sessions[i];
				break;
			}
		}
		if (!session) {
			callback({
				error: "该用户已退出！"
			});
			return;
		} else {
			callback({
				lat: session.lat,
				lon: session.lon
			});
			return;
		}
	};
};

var sessions = {};

function createSession(nick, lat, lon) {
	if (nick.length > 50) return null;
	//遍历,如果已经存在用户名则不生成
	for (var i in sessions) {
		var session = sessions[i];
		if (session && session.nick === nick) return null;
	}

	var session = {
		nick: nick,
		id: Math.floor(Math.random() * 99999999999).toString(),
		timestamp: new Date(),
		lat: lat,
		lon: lon,
		setLat: function(lat) {
			session.lat = lat;
		},
		setLon: function(lon) {
			session.lon = lon;
		},
		poke: function() { //将session时间重置为当前,即最后活跃时间.
			session.timestamp = new Date();
		},

		destroy: function() {
			console.log(session.nick + ' apart');
			delete sessions[session.id];
		}
	};

	sessions[session.id] = session;
	return session;
}

//定时清除未活跃的session
setInterval(function() {
	var now = new Date();
	for (var id in sessions) {
		if (!sessions.hasOwnProperty(id)) continue;
		var session = sessions[id];
		if (now - session.timestamp > SESSION_TIMEOUT) {
			session.destroy();
		}
	}
},
1000);

function simpleJSON(obj, clientCallback) {
	var body;
	if (arguments.length == 1) {
		body = new Buffer(JSON.stringify(obj));
	}
	else if (arguments.length == 2) {
		var jsonbody = new Buffer(JSON.stringify(obj));
		body = clientCallback + '(' + jsonbody + ')';
	}
	return body;
}

exports.join = function(req, res, next) {
	console.log("someone try to join");
	var nick = qs.parse(url.parse(req.url).query).nick;
	var lat = qs.parse(url.parse(req.url).query).lat;
	var lon = qs.parse(url.parse(req.url).query).lon;
	var clientCallback = qs.parse(url.parse(req.url).query).callback;
	if (nick == null || nick.length == 0) {
		res.send(simpleJSON({
			error: "Bad nick."
		},
		clientCallback));
		return;
	}
	var session = createSession(nick, lat, lon);
	if (session == null) {
		res.send(simpleJSON({
			error: "Nick in use"
		},
		clientCallback));
		return;
	}

	console.log("connection: " + nick + "@" + res.connection.remoteAddress);
	res.send(simpleJSON({
		id: session.id,
		nick: session.nick,
		starttime: starttime
	},
	clientCallback));
}

exports.sendGPS = function(req, res, next) {
	var id = qs.parse(url.parse(req.url).query).id;
	var lat = qs.parse(url.parse(req.url).query).lat;
	var lon = qs.parse(url.parse(req.url).query).lon;
	var session = sessions[id];
	var clientCallback = qs.parse(url.parse(req.url).query).callback;
	if (!session) {
		res.send(simpleJSON({
			error: "No such session id"
		},
    clientCallback));
		return;
	}
	console.log(session.nick + " send his/her gps point.")
	session.poke();
	session.setLat(lat);
	session.setLon(lon);
	res.send(simpleJSON({
		success: true
	},
	clientCallback));
}
exports.getPosition = function(req,res,next){
	console.log("someone try to get all mobile position");
  channel.getAll(function(data){res.send({succ:data})});
}
