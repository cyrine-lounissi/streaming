class WatchList {
    constructor(id, userId, contentIds) {
      this._id = id;
      this._userId = userId;
      this._contentIds = contentIds;
    }
  
    // Getters
    getId() {
      return this._id;
    }
  
    getUserId() {
      return this._userId;
    }
  
    getContentIds() {
      return this._contentIds;
    }
  
    // Setters
    setId(id) {
      this._id = id;
    }
  
    setUserId(userId) {
      this._userId = userId;
    }
  
    setContentIds(contentIds) {
      this._contentIds = contentIds;
    }
  }
  module.exports = WatchList;