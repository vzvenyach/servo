# Abstract the servo-scraper

Borne out of an effort to make web scraping a little smarter in node, I'm building a helper library called `servo`.

# License
MIT

# Usage
`npm install servojs`

# API

## Functions

### testPage
Get the headers for a given url.
```servo.testPage (site_url, callback)```

### getETags
Get the etag for a particular url
```servo.getETags(site_url, callback)```

### getPageHash
Calculate a `sha256` for a particular url
```servo.getPageHash(site_url, callback)```

### getElementsFromPage
Select elements from a particular url
```servo.getElementsFromPage(site_url, selector, callback)```

### getElementArrayHash
Calculate the `sha256` for all selected elements (used in conjunction with getElementsFromPage)
```servo.getElementArrayHash(elems, callback)```

## Sample Recipes

### Get an array of hashes for matching elements on a particular url
```
servo.getElementsFromPage(site_url, selector, function (elems) {
	servo.getElementArrayHash(elems, callback)
})
```