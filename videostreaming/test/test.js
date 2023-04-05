const assert = require('assert');
const fs = require('fs');
const StreamingService = require('../Services/StreamingService');

describe('PlayVideo', function() {
  const filePath = '/Users/cyrinelounissi/Downloads/lesson8.mp4';
  const range = 'bytes=1000-2000';
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const streamingService = new StreamingService();

  it('should return video content-Type and content-Length and stream', function() {
    const { headers, stream } = streamingService.PlayVideo(filePath);

    assert.strictEqual(headers['Content-Type'], 'video/mp4');
    assert.strictEqual(parseInt(headers['Content-Length']), fileSize);
    assert.ok(stream);
  });

  it('should return partial video stream when range is specified', function() {
    const range = 'bytes=1000-2000';
    const streamingService = new StreamingService();

    const { headers, stream } = streamingService.PlayVideo(filePath, range);

    const expectedChunksize = 1001;
    const expectedContentRange = `bytes 1000-2000/${fileSize}`;

    assert.strictEqual(headers['Content-Type'], 'video/mp4');
    assert.strictEqual(parseInt(headers['Content-Length']), expectedChunksize);
    assert.strictEqual(headers['Accept-Ranges'], 'bytes');
    assert.strictEqual(headers['Content-Range'], expectedContentRange);
    assert.ok(stream);
  });
});