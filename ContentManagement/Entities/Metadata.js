class Metadata {
    constructor(id,title, description, contentId, genre, releaseDate,thumbnail) {
      
      this.id =id;
      this.title = title;
      this.description = description;
      this.contentId = contentId;
      this.genre = genre;
      this.releaseDate = releaseDate;
      this.thumbnail=thumbnail;

    }
  
    getThumbnail() {
      return this.thumbnail;
    }
  
    setThumbnail(thumbnail) {
      this.thumbnail = thumbnail;
    }
  
  
    getTitle() {
      return this.title;
    }
  
    setTitle(title) {
      this.title = title;
    }
  
    getDescription() {
      return this.description;
    }
  
    setDescription(description) {
      this.description = description;
    }
  
    getContentId() {
      return this.contentId;
    }
  
    setContentId(contentId) {
      this.contentId = contentId;
    }
  
    getGenre() {
      return this.genre;
    }
  
    setGenre(genre) {
      this.genre = genre;
    }
  
    getReleaseDate() {
      return this.releaseDate;
    }
  
    setReleaseDate(releaseDate) {
      this.releaseDate = releaseDate;
    }
    getId()
    {
      return this.id;
    }
    setId(id)
    {
      this.id=id;
    }
    
  }

  module.exports = Metadata;