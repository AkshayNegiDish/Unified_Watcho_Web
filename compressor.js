const mime = require('mime');
const serveStatic = require('serve-static');
const fileSystem = require('fs');

module.exports = expressStaticGzip;

/**
 * Generates a middleware function to serve static files.
 * It is build on top of the express.static middleware.
 * It extends the express.static middleware with
 * the capability to serve (previously) gziped files. For this
 * it asumes, the gziped files are next to the original files.
 * @param {string} rootFolder: folder to staticly serve files from
 * @param {{enableBrotli:boolean,
 * customCompressions:[{encodingName:string,fileExtension:string}],
 * indexFromEmptyFile:boolean}} options: options to change module behaviour
 * @returns express middleware function
 */
function expressStaticGzip(rootFolder, options) {
  options = options || {};
  if (typeof (options.indexFromEmptyFile) === 'undefined') options.indexFromEmptyFile = true;

    // create a express.static middleware to handle serving files
  const defaultStatic = serveStatic(rootFolder, options);
  const compressions = [];
  const files = {};

    // read compressions from options
  setupCompressions();

    // if at least one compression has been added, lookup files
  if (compressions.length > 0) {
    findAllCompressionFiles(fileSystem, rootFolder);
  }

  return function middleware(req, res, next) {
    changeUrlFromEmptyToIndexHtml(req);

        // get browser's' supported encodings
    const acceptEncoding = req.header('accept-encoding');

        // test if any compression is available
    const matchedFile = files[req.path];
    console.log(req.originalUrl, matchedFile);
    if (matchedFile) {
        // as long as there is any compression available for this
        // file, add the Vary Header (used for caching proxies)
      res.setHeader('Vary', 'Accept-Encoding');

                // use the first matching compression to serve a compresed file
      const compression =
            findAvailableCompressionForFile(matchedFile.compressions, acceptEncoding);
      if (compression) {
        convertToCompressedRequest(req, res, compression);
      }
    }

      // allways call the default static file provider
    defaultStatic(req, res, (err) => {
      if (err && (req.originalUrl.indexOf(options.urlContains) > -1)) {
        console.log('Hola', req.originalUrl, err);
        return res.status(404).json({ error: `No file found with ${req.originalUrl}` });
      }
      return next();
    });
  };

    /**
     * Reads the options into a list of available compressions.
     */
  function setupCompressions() {
        // register all provided compressions
    if (options.customCompressions && options.customCompressions.length > 0) {
      for (let i = 0; i < options.customCompressions.length; i += 1) {
        const customCompression = options.customCompressions[i];
        registerCompression(customCompression.encodingName, customCompression.fileExtension);
      }
    }

        // enable brotli compression
    if (options.enableBrotli) {
      registerCompression('br', 'br');
      console.log('Registering brotli compression');
    }

        // gzip compression is enabled by default
    registerCompression('gzip', 'gz');
  }

    /**
     * Changes the url and adds required headers to serve a compressed file.
     * @param {Object} req
     * @param {Object} res
     */
  function convertToCompressedRequest(req, res, compression) {
    const type = mime.lookup(req.path);
    const charset = mime.charsets.lookup(type);
    let search = req.url.split('?').splice(1).join('?');

    if (search !== '') {
      search = `?${search}`;
    }

    req.url = req.path + compression.fileExtension + search;
    res.setHeader('Content-Encoding', compression.encodingName);
    res.setHeader('Content-Type', type + (charset ? `; charset=${charset}` : ''));
  }

    /**
     * In case it's enabled in the options and the
     * requested url does not request a specific file, "index.html" will be appended.
     * @param {Object} req
     */
  function changeUrlFromEmptyToIndexHtml(req) {
    if (options.indexFromEmptyFile && req.url.endsWith('/')) {
      req.url += 'index.html';
    }
  }

    /**
     * Searches for the first matching compression available from the given compressions.
     * @param {[Compression]} compressionList
     * @param {string} acceptedEncoding
     * @returns
     */
  function findAvailableCompressionForFile(compressionList, acceptedEncoding) {
    if (acceptedEncoding) {
      for (let i = 0; i < compressionList.length; i += 1) {
        if (acceptedEncoding.indexOf(compressionList[i].encodingName) >= 0) {
          return compressionList[i];
        }
      }
    }
    return null;
  }

    /**
     * Picks all files into the matching compression's file list. Search is done recursively!
     * @param {Object} fs: node.fs
     * @param {string} folderPath
     */
  function findAllCompressionFiles(fs, folderPath) {
    const filesMain = fs.readdirSync(folderPath);
        // iterate all files in the current folder
    for (let i = 0; i < filesMain.length; i += 1) {
      const filePath = `${folderPath}/${filesMain[i]}`;
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
                // recursively search folders and append the matching files
        findAllCompressionFiles(fs, filePath);
      } else {
        addAllMatchingCompressionsToFile(filesMain[i], filePath);
      }
    }
  }

    /**
     * Takes a filename and checks if there is any compression type matching the file extension.
     * Adds all matching compressions to the file.
     * @param {string} fileName
     * @param {string} fillFilePath
     */
  function addAllMatchingCompressionsToFile(fileName, fullFilePath) {
    for (let i = 0; i < compressions.length; i += 1) {
      if (fileName.endsWith(compressions[i].fileExtension)) {
        addCompressionToFile(fullFilePath, compressions[i]);
        return;
      }
    }
  }

    /**
     * Adds the compression to the file's list of available compressions
     * @param {string} filePath
     * @param {Compression} compression
     */
  function addCompressionToFile(filePath, compression) {
    const srcFilePath = filePath.replace(compression.fileExtension, '').replace(rootFolder, '');
    const existingFile = files[srcFilePath];
    if (!existingFile) {
      files[srcFilePath] = { compressions: [compression] };
    } else {
      existingFile.compressions.push(compression);
    }
  }

    /**
     * Registers a new compression to the module.
     * @param {string} encodingName
     * @param {string} fileExtension
     */
  function registerCompression(encodingName, fileExtension) {
    if (!findCompressionByName(encodingName)) {
      compressions.push(new Compression(encodingName, fileExtension));
    }
  }

    /**
     * Constructor
     * @param {string} encodingName
     * @param {string} fileExtension
     * @returns {encodingName:string, fileExtension:string,files:[Object]}
     */
  function Compression(encodingName, fileExtension) {
    this.encodingName = encodingName;
    this.fileExtension = `.${fileExtension}`;
  }

    /**
     * Compression lookup by name.
     * @param {string} encodingName
     * @returns {Compression}
     */
  function findCompressionByName(encodingName) {
    for (let i = 0; i < compressions.length; i += 1) {
      if (compressions[i].encodingName === encodingName) { return compressions[i]; }
    }
    return null;
  }
}