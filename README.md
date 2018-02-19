Articles compiler
=======================

Compiler of the articles history of the reader. It retrieves articles from Pocket and uses [Mercury Web Parser](https://mercury.postlight.com/web-parser/) to get article content.
The articles are stored on a noSQL database (MongoDB) and can be analyzed to extract some useful indicators.

| Source | Supported |
|----------|------|
| Pocket | Yes  |
| Medium | No  |

To start
-------
```bash
# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```

Or:
run `npm install -g nodemon` et `nodemon app.js` au lieu de `node app.js`

MongoDB :
```bash
sudo service mongod start
```

License
-------

The MIT License (MIT)

Copyright (c) 2018-2018 Julien Capgras

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
