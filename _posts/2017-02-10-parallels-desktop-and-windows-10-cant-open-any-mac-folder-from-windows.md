---
layout: post
title: "Parallels Desktop and Windows 10: Can't open any Mac folder from Windows"
date: "2017-02-10"
categories: [parallels-desktop,windows-10]
---
![](/images/2017-02-10-parallels-desktop-and-windows-10-cant-open-any-mac-folder-from-windows/57.png)

For last few months, I had multiple problems with Parallels and Windows 10 but the most annoying problem happened just yesterday. For some reason, I couldn't access shared Mac folders anymore.

Double click simply leads to nothing, however, if I tried to delete a directory I got a "There is a problem accessing \\\\Mac\\Home...".

Luckily I found a [solution](https://forum.parallels.com/threads/windows-cannot-access-mac-home-desktop.336220/) very quickly. All I had to do is:

![](/images/2017-02-10-parallels-desktop-and-windows-10-cant-open-any-mac-folder-from-windows/53.png)

**Right click on Win10 Icon > Actions > Reinstall Parallels Tools.**

Original solution is talking about updating the Parallelels Tools but in my case reinstalling did the trick.

Happy coding!
