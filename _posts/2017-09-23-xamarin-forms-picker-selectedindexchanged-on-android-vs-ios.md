---
layout: post
title: "Xamarin.Forms Picker SelectedIndexChanged on Android vs iOS"
date: "2017-09-23"
categories: [android,ios,xamarin-forms]
---

Picker is a very common UI control. In order to capture user input we have to listen to 'SelectedIndexChanged' event, which unfortunately behaves differently on iOS and Android:

iOS | Android
--- | ---
![](/images/2017-09-23-xamarin-forms-picker-selectedindexchanged-on-android-vs-ios/1.png) | ![](/images/2017-09-23-xamarin-forms-picker-selectedindexchanged-on-android-vs-ios/2.png)


On iOS 'SelectedIndexChanged' is triggered every-time user moves / scrolls the list. 'Done' button is there only for hiding the list. However, on Android 'SelectedIndexChanged' event will be triggered only once, after user selects an item. This is because on Android the list is displayed as a popup which disappears right after user input.

That may sound as a minor problem, unless you have to do some heavy work on the UI on each 'SelectedIndexChanged'. Luckily, since Xamarin.Forms 2.3.4 it is possible to set the expected behaviour on the Picker control:

> var picker = new Picker(); picker .On<iOS>() .SetUpdateMode(UpdateMode.WhenFinished);

Alternatively we can do the same thing in XAML.

We have to define a new namespace:

> xmlns:ios="clr-namespace:Xamarin.Forms.PlatformConfiguration.iOSSpecific; assembly=Xamarin.Forms.Core"

And consume it the next way:

> <Picker ios:Picker.UpdateMode="WhenFinished" .. />

Easy as it is! So there is no need to write workarounds anymore.

P.S.: Additional information can be found [here](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/platform/platform-specifics/consuming/ios#controlling-picker-item-selection).
