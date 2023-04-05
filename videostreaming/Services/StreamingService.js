const fs = require('fs');
const ffmpeg = require('ffmpeg');

class StreamingService {
   constructor() {
    this.playing = false;
    this.playbackRate = 1.0;
    this.volume = 1.0;
    this.quality = '720p';
    this.availableQualities = ['480p', '720p', '1080p'];
    this.playbackPosition = 0;
  }
    PlayVideo(filePath, range) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const headers = {
      'Content-Type': 'video/mp4',
    };
    let start = 0;
    let end = fileSize - 1;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
  
      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      headers['Accept-Ranges'] = 'bytes';
      headers['Content-Length'] = chunksize;
    } else {
      headers['Content-Length'] = fileSize;
    }
  
    const fileStream = fs.createReadStream(filePath, { start, end });
    return {
      headers,
      stream: fileStream,
    };
  }
  async transcodeVideo(inputPath, outputPath, format, codec) {
    try {
      // Open input file using ffmpeg
      const video = await ffmpeg(inputPath);
  
      // Set output format and codec
      video.format(format).videoCodec(codec);
  
      // Save transcoded video to output file
      await video.save(outputPath);
  
      console.log('Video transcoded successfully!');
    } catch (error) {
      console.error('Error transcoding video:', error.message);
    }
  }
  ForwardVideo(seconds, stream) {
    const newPosition = stream.position + seconds * 1000; // Multiply seconds by 1000 to convert to milliseconds
    stream.seek(newPosition);
    console.log(`Fast forwarded video by ${seconds} seconds`);
  }
  
  RewindVideo(seconds, stream) {
    // Calculate new position in stream
    const newPosition = stream.position - seconds * 1000; // Multiply seconds by 1000 to convert to milliseconds

    // Seek to new position in stream
    stream.seek(newPosition);

    // Log message indicating successful rewind
    console.log(`Rewound video by ${seconds} seconds`);
  }

  SetPlaybackRate(rate, stream) {
    // Set playback rate of stream
    stream.setPlaybackRate(rate);

    // Log message indicating successful rate change
    console.log(`Changed playback speed to ${rate}`);
  }

  SetVolume(volume, stream) {
    // Set volume of stream
    stream.setVolume(volume);

    // Log message indicating successful volume change
    console.log(`Changed volume to ${volume}`);
  }

  SetQuality(quality, stream) {
    // Set quality of stream
    stream.setQuality(quality);

    // Log message indicating successful quality change
    console.log(`Changed video quality to ${quality}`);
  }

  GetAvailableQualities(stream) {
    // Get available qualities from stream
    const availableQualities = stream.getAvailableQualities();

    // Log message indicating available qualities and return list
    console.log(`Available video qualities: ${availableQualities}`);
    return availableQualities;
  }

  GetPlaybackPosition(stream) {
    // Get current playback position from stream
    const playbackPosition = stream.getPlaybackPosition();

    // Log message indicating current position and return value
    console.log(`Current playback position: ${playbackPosition}`);
    return playbackPosition;
  }

  SetPlaybackPosition(position, stream) {
    // Set playback position of stream
    stream.setPlaybackPosition(position);

    // Log message indicating successful position change
    console.log(`Changed playback position to ${position}`);
  }
 
  }

  module.exports = StreamingService;