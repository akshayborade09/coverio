// Minimal Sharp stub that returns unprocessed buffers
module.exports = function(input) {
  return {
    resize() { return this; },
    toBuffer() { return Promise.resolve(input); },
    jpeg() { return this; },
    png() { return this; },
    webp() { return this; },
    avif() { return this; },
    toFormat() { return this; },
    rotate() { return this; },
    flip() { return this; },
    flop() { return this; },
    sharpen() { return this; },
    blur() { return this; },
    extend() { return this; },
    extract() { return this; },
    trim() { return this; },
    metadata() { return Promise.resolve({}); }
  };
}; 