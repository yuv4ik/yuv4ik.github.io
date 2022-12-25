---
layout: post
title: "Most common mistakes beginners make in Xamarin.Forms"
date: "2018-03-19"
categories: [android,ios,visual-studio,visual-studio-for-mac,xamarin-form]
---

We live in a great time where technology evolves fast and we need to keep up with it if we want to stay relevant. Beside this, we also have to be productive, use the latest and greatest tools, implement the best available solutions and deliver on time. Following article mentions a list of most common mistakes we tend to do while using Xamarin.Forms.

## Ignoring MVVM principles

If you are not familiar with MVVM pattern, I recommend you to postpone reading this article and get back to it once you are. Without MVVM your code will look like a big white plate of spaghetti. In contrast if you will use MVVM the right way, your UI and BL layers will be completely separated, well structured, testable, maintainable and easily extendable. Always remember that your `View` and `ViewModel` should know nothing about each other. Use `DataBinding` and `Command`s, in case last is not supported, use [Events To Commands Behavior](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/behaviors/reusable/event-to-command-behavior). You can significantly reduce the amount of boilerplate code related to `INotifyPropertyChanged` implementation by using [PropertyChanged.Fody](https://github.com/Fody/PropertyChanged). There are many good MVVM frameworks out there, but before you pick one, try vanilla Xamarin.Forms in order to understand why these frameworks exist and what are they meant to solve. Current topic is especially painful if you switch to Xamarin.Forms from Android or iOS native, but believe me - without this, it is worth nothing.

## Overusing platform specific code

Before implementing a solution that involves platform specific code, always take a pause and re-check your options. Platform specific code should be your last choice. The reason is simple - instead of writing the code only once, you will get to write it `n` times, where `n` is the number of platforms that you have to support.

Earlier this week I wrote an article [Reducing the amount of code by switching to .NET Standard]({{ site.baseurl }}{% post_url 2018-03-12-reducing-the-amount-of-code-by-switching-to-net-standard %}). I'm mentioning it because it was about elimination of platform specific code. Thanks to .NET Standard many things can be done only in one proper place. More details can be found in article mentioned above.

When it comes to UI customisations, you may consider first using `Effect`s, `Behavior`s and `CustomRenderers` the least. The reason is described above. Keep in mind "the cross-platform idea" for both BL and UI and leave platform specific code as your last option.

## Ignoring .NET Standard

At the begginning there were two common ways of sharing code: PCL & Shared Project, which both had their own advantages and disadvantages. There are many articles including the official documentation that explained both of these approaches.

Starting with Xamarin.Forms 2.4 it is also possible to share code via .NET Standard library. I already mentioned an [article]({{ site.baseurl }}{% post_url 2018-03-12-reducing-the-amount-of-code-by-switching-to-net-standard %}) that I wrote on this topic, so I will not go into details but will share a part of the [new official documentation](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/internals/net-standard) that I find self-explanatory:

> .NET Standard is a specification of .NET APIs that are intended to be available on all .NET implementations. It makes it easier to share code across desktop applications, mobile apps and games, and cloud services, by bringing identical APIs to the different platforms.

Here you can find a [gist](https://gist.github.com/yuv4ik/063a35fe3986e62d69aee2f0ed0607bf) with four very simple steps to do in order to switch to .NET Standard. Sooner you switch the better it is.

## Using outdated libraries

Introducing dependencies on third party libraries can be a sensitive topic. Always make sure that the dependency you introduce is alive, well maintained and there is a warranty that it will not introduce a blocker. By warranty I mean the ability to contribute to the project or ability to contact a dedicated support team.

There are open source libraries with big amount of contributors, big community, many related blogposts but unfortunately not maintained anymore. For some reason I can still see developers trying to use [XLabs/Xamarin-Forms-Labs](https://github.com/XLabs/Xamarin-Forms-Labs) or [aritchie/acr-xamarin-forms](https://github.com/aritchie/acr-xamarin-forms). These projects can be used to read and learn, but I would not recommend to use them in production since they haven't been updated for a while and they are officially not maintained anymore.

Another good example is Xamarin.Forms which is a [NuGet](https://www.nuget.org/packages/Xamarin.Forms/) package after all. When you create a new project, make sure that you are working with latest and greatest version. In case of Android you may also need to target the latest version of Android framework which is currently `Android 8.1 (Oreo)`, otherwise the package manager will fail the update process.

Spend some extra time on researching about the libraries that you already use or plan to use and always pay attention to details.

## Using outdated tools

> _If you get stuck, draw with a different pen. Change your tools; it may free your thinking._
> 
> _\- Paul Arden_

Tools can improve productivity or harm it. If there is a memory leak in your IDE and it's working slow, crashing or you have to restart it 2-3 times a day, it is harming your productivity. Therefore always keep your eye on the changelog of your favourite IDE and update when necessary. Never update blindly since there might be new breaking changes or new bugs. Good practice is to wait few days before updating. Alternatively some IDEs can be installed side by side, so always have a backup plan.

Keep in mind that Xamarin.Forms works great with Visual Studio (VS) 2017 and VS for Mac. If you are still using VS 2015 or Xamarin Studio for Mac, you might re-think your tooling.

## Ignoring existing tools

There are so many great tools that can boost your productivity out there. It will be extremely hard to fit all of them here, but I will try to give you some examples that touch different aspects.

One of the main problems in Xamarin.Forms is that there is no stable live preview. Usually we have to deploy the code to see the changes on the emulator / simulator or a real device. Luckily there are tools like: [Xamarin Live Player](https://docs.microsoft.com/en-us/xamarin/tools/live-player/install?tabs=vswin), [Gorilla Player](https://grialkit.com/gorilla-player/), [LiveXAML](https://www.livexaml.com/) & [XAML Previewer](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/xaml/xaml-previewer).

We can remotely deploy our code to devices using [iOS wireless deploy](https://docs.microsoft.com/en-us/xamarin/ios/deploy-test/wireless-deployment?tabs=vsmac) and [Android Debug Bridge](https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/set-up-device-for-development#connecting-over-wifi) [(](https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/set-up-device-for-development#connecting-over-wifi)[ADB](https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/set-up-device-for-development#connecting-over-wifi)[)](https://docs.microsoft.com/en-us/xamarin/android/get-started/installation/set-up-device-for-development#connecting-over-wifi). [ADB](https://developer.android.com/studio/command-line/adb.html) is a separate topic, it is a very powerful tool that all mobile developers should be aware of. Hopefully you know that you can use [Free Provisioning](https://docs.microsoft.com/en-us/xamarin/ios/get-started/installation/device-provisioning/free-provisioning) if you don't have an Apple Developer account in order to deploy your code to physical device.

There are different VS extensions that can boost productivity. Below are some of them:

- [MFractor](https://www.mfractor.com/) - XAML IntelliSense, 100+ XAML inspections and refactorings, image tooling and much more.
    
- [XamarIDEA](https://marketplace.visualstudio.com/items?itemName=EgorBogatov.XamarIDEA) - allows editing .axml files (Xamarin.Android) in IntelliJ IDEA or Android Studio.
    
- [DeepClean](https://github.com/yuv4ik/vsmacdeepclean) - lets you delete /bin & /obj, delete /packages, open a terminal window or delete cache from your VS for Mac.

Most probably there are more good extensions, please leave comments and share your favourites.

Last but not least - [Xamarin Profiler](https://docs.microsoft.com/en-us/xamarin/tools/profiler). Success of an application depends a lot on the stability and responsiveness. Therefore I recommend to use profiler to check the memory consumption and to measure the execution time in order to make your applications better.

## Conclusion

Never stop learning, experimenting and discovering new tools. Pay attention to details and don't be afraid of changes!
