Orgcal is a [react native](http://facebook.github.io/react-native/) app which parses one or more [org-mode](http://orgmode.org/) files and
displays the scheduled tasks within those files in a calendar view. Screenshot
incoming as soon as I have a working prototype. Currently only android is supported.

# Installation
I assume you already have a working react native development environment. If
not, check out the [react native installation process](http://facebook.github.io/react-native/docs/getting-started.html).

    $ git clone https://github.com/dudelson/orgcal.git
    $ cd orgcal
    $ npm install react react-native react-native-fs react-native-button moment --save
    
# Building and running the app
Again, assuming you have a working react native environment, fire up an AVD or
plug in an android device, then run

    $ react-native run-android
