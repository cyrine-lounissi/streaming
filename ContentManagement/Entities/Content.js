class Content {
    constructor(id, metadata, video) {
      this.id = id;
      this.metadata = metadata;
      this.video = video;
    }
  

    getId() {
      return this._id;
    }
  
    setId(newId) {
      this._id = newId;
    }

    getMetadata() {
      return this._metadata;
    }
  
    setMetadata(newMetadata) {
      this._metadata = newMetadata;
    }
  
   
    getVideo() {
      return this._video;
    }
  
    setVideo(newVideo) {
      this._video = newVideo;
    }
  }
  
  
  
  module.exports = Content;
  
  