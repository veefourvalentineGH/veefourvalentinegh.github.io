# Vee Valentine site

Plain HTML/CSS. No JavaScript, trackers, cookies, or third-party requests.

## Swap in real photos
1. Strip metadata (GPS, camera, name) and resize:
   `brew install exiftool` then `exiftool -all= -overwrite_original photo.jpg`
   `sips -Z 1600 photo.jpg`
2. Put them in `images/` and update the three `<img>` tags in `index.html`.

## Adding Spotify later
Edit the `<meta http-equiv="Content-Security-Policy">` tag on that page: add
`frame-src https://open.spotify.com` (and `script-src https://open.spotify.com` only if the embed requires it).
