class Analytics {
    constructor(id, contentId, views, watchTime, engagementMetrics) {
      this.id = id;
      this.contentId = contentId;
      this.views = views;
      this.watchTime = watchTime;
      this.engagementMetrics = engagementMetrics;
    }
  
    getId() {
      return this.id;
    }
  
    setId(id) {
      this.id = id;
    }
  
    getContentId() {
      return this.contentId;
    }
  
    setContentId(contentId) {
      this.contentId = contentId;
    }
  
    getViews() {
      return this.views;
    }
  
    setViews(views) {
      this.views = views;
    }
  
    getWatchTime() {
      return this.watchTime;
    }
  
    setWatchTime(watchTime) {
      this.watchTime = watchTime;
    }
  
    getEngagementMetrics() {
      return this.engagementMetrics;
    }
  
    setEngagementMetrics(engagementMetrics) {
      this.engagementMetrics = engagementMetrics;
    }
  }
  
  module.exports = Analytics;
  
  