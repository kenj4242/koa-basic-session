class Store {

	constructor() {
		this.session = {};
	}

	// given options (with session identifier), return session data 
	async get(opts) {
		return {}; // get returns the session data
	}

	// given session data and options (with session identifier)
	// write the session data to storage
	// return the session identifier
	async set(data, opts) {
		return null; // set should return the session id
	}

	// destroy a session
	async destroy(opts) {
		return true; // bool for successfully destroyed
	}

	// garbage collect written session data that is expired
	async gc() {
		return; // return null
	}

}


