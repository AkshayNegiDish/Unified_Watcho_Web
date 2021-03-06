// These are important and needed before anything else
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as compression from 'compression';
import * as express from 'express';
import { join } from 'path';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';




const expressStaticGzip = require('./compressor');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// static expiry

const expiry = require('static-expiry');


// Express server
const app = express();
app.use(compression({ level: 7, })) //compressing dist folder 

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');


app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.enable('eatg');
app.set('etag', 'strong');
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

app.get('/health', (req, res) => {
  res.status(200).send({'status': 'OK'});
});

// Server static files from /browser
function cacheControl(req, res, next) {
  res.header('Cache-Control', 'max-age=86400');
  next();
}

// app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
app.get('*.*', expressStaticGzip(join(DIST_FOLDER, 'browser'), {
  enableBrotli: true
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
