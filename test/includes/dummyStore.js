class DummyStore {

	constructor(opts) {
		this.session = {};
		Object.assign(this, opts);
	}

	// given options (with session identifier), return session data 
	async get(opts) {
		return {
			id: this.testId,
			data: this.testData
		};
	}

	// given session data and options (with session identifier)
	// write the session data to storage
	// return the session identifier
	async set(data, opts) {
		return this.testId
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


module.exports = DummyStore;


