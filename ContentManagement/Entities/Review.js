class Review {
    constructor(id, userId, contentId, comment) {
      this.id = id;
      this.userId = userId;
      this.contentId = contentId;
      this.comment = comment;
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
  
    getComment() {
      return this.comment;
    }
  
    setComment(comment) {
      this.comment = comment;
    }
  }
  module.exports = Review;