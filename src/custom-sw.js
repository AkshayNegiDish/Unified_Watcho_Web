if ('function' === typeof importScripts) {
    importScripts("https://cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js");
    importScripts('./ngsw-worker.js')
}