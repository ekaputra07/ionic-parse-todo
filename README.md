Parse Todo
===========

A simple todo app powered by [Ionic Framework](http://ionicframework.com/getting-started/) and [Parse](https://www.parse.com/) datastore.

## Using this project

Make sure the `ionic` utility is installed:

```bash
$ sudo npm install -g ionic cordova
```

And **register an application at Parse**. https://www.parse.com/.

Add your Parse application ID and Key in `www/js/services.js`.

```javascript
var parseAppId = 'myappid',
    parseAppKey = 'myappkey';
```

Then run it:

```bash
$ ionic serve
```

Then open your browser at http://localhost:8100

If you want to run it as Android application, you should install the platform first.

```bash
$ cordova platform add android
$ cordova plugin add org.apache.cordova.device
$ cordova plugin add org.apache.cordova.network-information
$ cordova build android
$ cordova emulate android
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.

Screenshots
===========

![screen-1.png](https://raw.github.com/ekaputra07/ionic-parse-todo/master/screen-1.png)
![screen-2.png](https://raw.github.com/ekaputra07/ionic-parse-todo/master/screen-2.png)