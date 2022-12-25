---
layout: post
title: "Numeric keyboard with &quot;Done&quot; button on iOS Xamarin.Forms"
date: "2017-05-05"
categories: [net,c#,ios,xamarin-forms]
---
![](/images/2017-05-05-numeric-keyboard-with-done-button-on-ios-xamarin-forms/1.png)

'Done' button on Numeric keyboard on iOS is a very popular clients request, but it does not appear out of the box. Luckily the solution is very easy (as usual), all we have to do is to extend 'Entry' control and to add a custom renderer:

{% gist 4592401836bd6bc54ac85fcc5cdbaa2f %}

As you can see all the 'magic' is happing in AddDoneButton() method. We create a toolbar and add a 'Done' UIBarButtonItem which will hide the keyboard and send a 'Completed' event back.

The solution is based on this [thread](https://forums.xamarin.com/discussion/comment/271389#Comment_81117) and available as a gist on [github](https://gist.github.com/yuv4ik/4592401836bd6bc54ac85fcc5cdbaa2f).