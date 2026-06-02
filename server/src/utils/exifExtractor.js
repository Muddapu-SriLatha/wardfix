const fs = require('fs');
const exifParser = require('exif-parser');

/**
 * Extract EXIF metadata (GPS latitude/longitude, date, camera info) from image file buffer or path
 * @param {Buffer|string} source - Image buffer or file path
 * @returns {Object} Extracted metadata containing lat, lng, timestamp, cameraMake, cameraModel, tags
 */
function extractExifMetadata(source) {
  try {
    let buffer;
    if (typeof source === 'string') {
      if (!fs.existsSync(source)) {
        return { hasGps: false, error: 'File does not exist' };
      }
      buffer = fs.readFileSync(source);
    } else if (Buffer.isBuffer(source)) {
      buffer = source;
    } else {
      return { hasGps: false, error: 'Invalid source type' };
    }

    const parser = exifParser.create(buffer);
    const result = parser.parse();

    if (!result || !result.tags) {
      return { hasGps: false, tags: {} };
    }

    const tags = result.tags;
    const hasGps = Boolean(tags.GPSLatitude && tags.GPSLongitude);

    const latitude = hasGps ? Number(tags.GPSLatitude) : null;
    const longitude = hasGps ? Number(tags.GPSLongitude) : null;
    const altitude = tags.GPSAltitude ? Number(tags.GPSAltitude) : null;

    let timestamp = null;
    if (tags.DateTimeOriginal) {
      timestamp = new Date(tags.DateTimeOriginal * 1000).toISOString();
    } else if (tags.CreateDate) {
      timestamp = new Date(tags.CreateDate * 1000).toISOString();
    } else if (result.hasThumbnail && tags.ModifyDate) {
      timestamp = new Date(tags.ModifyDate * 1000).toISOString();
    }

    return {
      hasGps,
      latitude,
      longitude,
      altitude,
      timestamp,
      cameraMake: tags.Make || null,
      cameraModel: tags.Model || null,
      orientation: tags.Orientation || 1,
      imageWidth: result.imageSize ? result.imageSize.width : tags.ExifImageWidth || null,
      imageHeight: result.imageSize ? result.imageSize.height : tags.ExifImageHeight || null,
      rawTags: tags,
    };
  } catch (error) {
    console.warn('EXIF parsing notice (non-fatal, may not be JPEG with EXIF header):', error.message);
    return {
      hasGps: false,
      error: error.message,
    };
  }
}

module.exports = {
  extractExifMetadata,
};
