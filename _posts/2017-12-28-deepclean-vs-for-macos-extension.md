---
layout: post
title: "DeepClean is a must have Visual Studio extension for macOS"
date: "2017-12-28"
categories: [visual-studio-for-mac]
---
![](/images/2017-12-28-deepclean-vs-for-macos-extension/1.png)

Yesterday I shared with you a [command](https://smellyc0de.wordpress.com/2017/12/27/quickly-delete-bin-obj-and-packages-directories-under-a-net-solution/) to recursively delete /bin, /obj and /packages directories. While this command is helpful, it might be a pain to use. Since you have to keep a terminal window opened and in general switch context from your IDE to terminal and etc.

A simple solution would be to execute this command without leaving the IDE at all, however in this case I had to extend the IDE itself. Thats how [DeepClean](https://github.com/yuv4ik/vsmacdeepclean) extension was born. I am planning to write a proper post about how to extend visual studio for mac a bit later. So stay tuned.

Currently the extension does 2 simple things:
- Deleting /bin & /obj dirs
- Deleting /packages dir - after this you will have to restore the nuget packages, otherwise the solution wont build

You are welcome to download, test and contribute on [github](https://github.com/yuv4ik/vsmacdeepclean). **Please keep in mind that this extension is making it's first steps, please make sure you have a back up of your code before using it!**
