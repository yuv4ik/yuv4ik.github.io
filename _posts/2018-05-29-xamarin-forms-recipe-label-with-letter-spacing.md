---
layout: post
title: "Xamarin.Forms Recipe: Label with Letter Spacing"
date: "2018-05-29"
categories: [andorid,ios,xamarin-forms,kerning]
---
iOS | Android
![](/images/2018-05-29-xamarin-forms-recipe-label-with-letter-spacing/1.png) | ![](/images/2018-05-29-xamarin-forms-recipe-label-with-letter-spacing/2.png)

Setting a letter spacing for a `Label` in Android and iOS turned into an interesting research for me. I would expect that such a common task would be easily done with a help of a `Renderer` or an `Effect`. However, I was very surprised to discover that some platforms do not have a built-in support for setting letter spacing.

## Android

It turned out that setting letter spacing it is not possible on pre Lollipop (< 21) without hacks when on Lollipop+ there is a dedicated method: [setLetterSpacing()](https://developer.android.com/reference/android/widget/TextView.html#setLetterSpacing(float)). Luckily [this SO post](https://stackoverflow.com/a/16429758/1970317) offered a creative solution:

> .. method adds a space between each letter of the String and with [SpannedString](http://developer.android.com/reference/android/text/SpannedString.html) changes the TextScaleX of the spaces, allowing positive and negative spacing ..

The math in this solution is a bit weird and should be adjusted according to your specific needs. Otherwise it is doing it's job nicely.

Checking the [Distribution dashboard](https://developer.android.com/about/dashboards/), it seems that 15.3% of users are using KitKat or older and 84.7% are using Lollipop or newer Android version. So hopefully very soon this recipe could be simplified🤞.

## iOS

On iOS it is (as expected) a one-liner using [attributedText](https://developer.apple.com/documentation/uikit/uilabel/1620542-attributedtext) property.

## The recipe

I combined the details described above into [Effect](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/effects/introduction):

{% gist bf1bd8a82d1880f53825baf69d9fa1fe %}
