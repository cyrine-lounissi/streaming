class Rating {
    constructor(id, userId, contentId, rating) {
      this.id = id;
      this.userId = userId;
      this.contentId = contentId;
      this.rating = rating;
    }
  
    getId() {
      return this.id;
    }
  
    setId(id) {
      this.id = id;
    }
  
    getUserId() {
      return this.userId;
    }
  
    setUserId(userId) {
      this.userId = userId;
    }
  
    getContentId() {
      return this.contentId;
    }
  
    setContentId(contentId) {
      this.contentId = contentId;
    }
  
    getRating() {
      return this.rating;
    }
  
    setRating(rating) {
      this.rating = rating;
    }
  }
  module.exports = Rating;