---
layout: post
title: "IKnowThatFlag quiz game build with Xamarin.Forms"
date: "2018-02-25"
categories: [android,ios,game,xamairn-forms]
---

Many years ago when I was at high school, I wrote a bot for a web browser flags quiz game, where a flag of a random country and 4 different country names where shown to the player. It was fun!

So I created the same game for iOS and Android using Xamarin.Forms just for fun. It is open source and available on [github](https://github.com/yuv4ik/iknowthatflag):

![](https://raw.githubusercontent.com/yuv4ik/iknowthatflag/master/Screenshots/demo.gif)

This is what you get when an engineer creating a game without a designer. Luckily you can contribute if you have an idea on how to improve the UI/UX or if you want to add new features. I had a couple of them in my head:

- Achievements
- Learning game mode (without time or a game over)
- \[X\] game mode - where the flag image is covered by some objects that the player has to remove and/or etc.

If you are new to Xamarin.Forms or MVVM I would recommend to check the source code, it is touching the next interesting topics:

- MVVM
    - Fody
    - ViewModel first navigation
- Animations
- Custom fonts
- IOC

Otherwise you are free to use the source code as you wish since it is under [MIT license](https://github.com/yuv4ik/iknowthatflag/blob/master/LICENSE).
