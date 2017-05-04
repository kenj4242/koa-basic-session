"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function Session() {
	var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	opts.key = opts.key || "sid";

	if (!opts.store) {
		throw new Error('session store must be provided');
	}

	return function () {
		var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
			var sid, state, sess, old;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							sid = ctx.cookies.get(opts.key, opts);
							state = ctx.state;

							// read session

							if (!sid) {
								_context.next = 11;
								break;
							}

							_context.next = 5;
							return opts.store.get(sid);

						case 5:
							sess = _context.sent;

							state.sessionid = sess.id;
							state.session = sess.data;

							// check session should always be a not-null object
							if (_typeof(state.session) !== "object" || state.session == null) {
								state.session = {};
							}

							_context.next = 13;
							break;

						case 11:
							state.sessionid = null;
							state.session = {};

						case 13:
							old = void 0;

							if (opts.writeOnDirty) {
								old = JSON.stringify(state.session);
							}

							_context.next = 17;
							return next();

						case 17:
							if (!(state.sessionid && state.session === null)) {
								_context.next = 23;
								break;
							}

							_context.next = 20;
							return opts.store.destroy(state.sessionid);

						case 20:
							state.sessionid = null;

							_context.next = 27;
							break;

						case 23:
							if (!(!opts.writeOnDirty || old != JSON.stringify(state.session))) {
								_context.next = 27;
								break;
							}

							_context.next = 26;
							return opts.store.set(state.sessionid, state.session);

						case 26:
							state.sessionid = _context.sent;

						case 27:

							// set the cookie if we have an sid
							if (state.sessionid) {
								ctx.cookies.set(opts.key, state.sessionid, opts);
							}

							// garbage collect sessions
							_context.next = 30;
							return opts.store.gc();

						case 30:
						case "end":
							return _context.stop();
					}
				}
			}, _callee, this);
		}));

		return function (_x2, _x3) {
			return _ref.apply(this, arguments);
		};
	}();
}

module.exports = Session;