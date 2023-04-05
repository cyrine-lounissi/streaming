class Video {
    constructor(id, duration,hours,minutes,seconds, url) {
      this.id = id;
      var hours = hours;
      var minutes =minutes;
      var seconds=seconds;
      this.url = url;
      this.duration=duration;
      
    }
  
    getId() {
      return this.id;
    }
  
    setId(id) {
      this.id = id;
    }
  
    getHours() {
      return this.hours;
    }
  
    setHours(h) {
      this.hours = h;
    }
  
    getMinutes() {
      return this.minutes;
    }
  
    setMinutes(m) {
      this.minutes = m;
    }
    getSeconds() {
      return this.seconds;
    }

  
    setSeconds(s) {
      this.seconds = s;
    }
  
    getUrl() {
      return this.url;
    }
  
    setUrl(url) {
      this.url = url;
    }
    getDuration() {
      return this.duration;
    }
  
    setDuration(dur) {
      this.duration = dur;
    }
  }
  module.exports = Video;