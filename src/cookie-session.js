
function Session(opts = {}) {
  opts.key = opts.key || "sid";

	if (!opts.store) {
		throw new Error('session store must be provided');
	}

  return async function(ctx, next) {

    var sid = ctx.cookies.get(opts.key, opts);
		var state = ctx.state;

		// read session
		if (sid) {
			var sess = await opts.store.get(sid);
			state.sessionid = sess.id;
      state.session = sess.data;

      // check session should always be a not-null object
      if (typeof state.session !== "object" || state.session == null) {
        state.session = {};
      }

		} else {
			state.sessionid = null;
			state.session = {};
		}

		let old;
		if (opts.writeOnDirty) {
	    old = JSON.stringify(state.session);
		}


    await next();


		// null session gets destroyed
		if (state.sessionid && state.session === null) {
			await opts.store.destroy(state.sessionid);
			state.sessionid = null;

		} else {

	    // write the session file
			if (!opts.writeOnDirty || old != JSON.stringify(state.session)) {
		    // write session to store
				state.sessionid = await opts.store.set(state.sessionid, state.session);
			}
		}

		// set the cookie if we have an sid
		if (state.sessionid) {
	    ctx.cookies.set(opts.key, state.sessionid, opts);
		}


		// garbage collect sessions
		await opts.store.gc();

  }
}


module.exports = Session



