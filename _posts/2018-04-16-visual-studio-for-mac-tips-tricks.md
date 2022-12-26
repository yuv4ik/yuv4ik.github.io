---
layout: post
title: "Visual Studio for Mac tips &amp; tricks"
date: "2018-04-16"
categories: [.net,visual-studio-for-mac,xamarin,xamarin-forms]
---

Switching from old good VS (for Windows) to a new cool VS for Mac can be painful. Original VS was released in 1997 (according to [wikipedia](https://en.wikipedia.org/wiki/Microsoft_Visual_Studio)) while VS for Mac was released only in 2016. Yes, it is based on XamarinStudio which is built on MonoDevelop but it still has a long way to go in order to be close to it's ancient relative.

In this article we will take a look on VS for Mac "hidden gems" that can optimize and smooth your workflow. All you have to do is to open Mac's VS Preferences and read this article on the side.

# Environment

## Font

One of the very basic yet very important settings is the `Font`. While there is nothing bad using the default font, [FiraCode](https://github.com/tonsky/FiraCode) could beautify your code and improve it's readability by replacing sequences of characters by a single ligature.

![](https://camo.githubusercontent.com/3a8948f34284f378ead7af5846aa432035c687ad/687474703a2f2f732e746f6e736b792e6d652f696d67732f666972615f636f64655f6c6f676f2e737667)

The project repository on [github](https://github.com/tonsky/FiraCode) contains detailed information on how to install it in your system. It's also great because this font can be used almost everywhere.

# Projects

## Load Save

If you have a long running project, you could load it by default every time you open the IDE. Just tick the `Load previous solution on startup`.

# Text Editor

## General

For some reason regions are not foldable by default in VS for Mac. Luckily we just have to tick `Enable code folding` option in order to enable it.

## Behavior

It might be useful to have `Format document on Save` option enabled to ensure the default formatting applied to all our documents in case we accidentally break it.

## IntelliSence

It is possible to let the IDE to suggest us namespaces to be imported by enabling the `Show import items` option.

![](/images/2018-04-16-visual-studio-for-mac-tips-tricks/1.png)

## Code Snippets

We can define a set of code snippets to be quickly inserted by typing a keywords. There are quite a lot of useful built-in code snippets like `class`, `ctor` and `prop`, however we can define our own ones. My personal favourite is `propb` for a quick generation of a `BindableProperty`:
{% highlight csharp %}
public $proptype$ $propname$ {
  get { return ($proptype$)GetValue ($propname$Property); }
  set { SetValue ($propname$Property, value); }
}

public static readonly BindableProperty $propname$Property = BindableProperty.Create (nameof($propname$), typeof($proptype$), typeof($classname$));
$end$
{% endhighlight %}

Previous is just a single example but you may consider adding more snippets for your specific needs.

# Other

## Feedback

I do believe that in order to make Mac's VS a great product, all of us have to contribute to it. The smallest contribution you can make is to enable the `Yes, I am willing to participate` option.

# Extensions

This a separate topic not a part of VS for Mac Preferences that's worth mentioning. Extensions are very powerful sets of features that can be added to your IDE. There is a built-in `Extensions Manager`, however keep in mind that since it is currently impossible to publish extensions to the official repository due to some works on the old portal, you may found more extensions available on github than in the built-in `Gallery`.

I am an author of two extensions that you may want to check:

- [Mutatio](https://github.com/yuv4ik/Mutatio) - Visual Studio for Mac add-in/extension for converting old PCLs to .NET Standard 2.0 targeting projects automatically.
- [DeepClean](https://github.com/yuv4ik/vsmacdeepclean) - Visual Studio for macOS add-in / extension that let's you easily clean projects, NuGet, Xamarin and VS cache without leaving the IDE.

# Conclusion

We saw few different and very simple methods that can improve your productivity. Hopefully I gave you few ideas, so take a moment to think and discover other hidden gems in your favourite IDE.

P.S.: You might be interested in reading [Most common mistakes beginners make in Xamarin.Forms]({{ site.baseurl }}{% post_url 2018-03-19-most-common-mistakes-beginners-make-in-xamarin-forms %}) to get more ideas on workflow optimization.
