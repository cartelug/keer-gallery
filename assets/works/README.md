# Artwork photos go here

Drop your artwork images into this folder, then point to them from
`js/site-data.js` using the `image` field, e.g.:

```js
{
  id: "portrait-charcoal-1",
  title: "Portrait in Charcoal No. 1",
  ...
  image: "assets/works/portrait-charcoal-1.jpg",
  ...
}
```

## Tips for great-looking artwork
- **Shape:** portrait/tall images look best (the cards use a ~3:3.7 ratio).
- **Size:** aim for ~1200px on the longest edge — large enough to look crisp,
  small enough to load fast.
- **Format:** JPG for photos, or WebP for smaller files. PNG is fine too.
- **Naming:** use simple lowercase names with dashes, e.g. `faces-of-home-large.jpg`.
- **Lighting:** photograph the art flat, in even daylight, with no glare.

Until you add an image, the website shows an elegant tinted placeholder with
the artwork title, so nothing ever looks broken.
