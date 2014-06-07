# Abstract the servo-scraper

Borne out of an effort to make web scraping a little smarter in node, I'm building a helper library called `servo`.

# License
MIT

# Usage
`npm install`

# API

### testPage

Get the headers for a given url
```servo.testPage (site_url, callback)```

### getETags
Get the etag for a particular url
```servo.getETags(site_url, callback)```

### getPageHash
Calculate a `sha256` for a particular url
```servo.getPageHash(site_url, callback)```