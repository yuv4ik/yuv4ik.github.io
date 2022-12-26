---
layout: post
title: "Dynamically changing the status bar appearance in Xamarin.Forms"
date: "2018-08-20"
categories: [android,ios,xamarin,xamarin-forms]
---
![](/images/2018-08-20-dynamically-changing-the-status-bar-appearance-in-xamarin-forms/1.gif)

Usually there is a need in changing the status bar appearance to match the application theme at least once. In more advanced cases the appearance of the status bar may change multiple times, due different colour themes on different screens within the application.

Status bar appearance is about it's background and text colours. Both properties has their own limitations on different platforms, however we could manipulate both with the solution described below.

Our goal is simple, we want to be able to switch the status bar appearance between  `LightTheme` and `DarkTheme` at runtime:
{% highlight csharp %}
public interface IStatusBarStyleManager
{
    void SetLightTheme();
    void SetDarkTheme();
}
{% endhighlight %}
## Android

### Background colour

[Since Android Lollipop (21)](https://developer.android.com/guide/topics/ui/look-and-feel/themes#Versions) it is possible to set a custom status bar background colour by simply defining it in style.xml with a key  `colorPrimaryDark` or programatically (check below).

### Text colour

[Since Android M (23)](https://developer.android.com/reference/android/R.attr#windowLightStatusBar) it is possible to set a predefined status bar text colour theme to light or dark.

### Implementation
{% highlight csharp %}
public class StatusBarStyleManager : IStatusBarStyleManager
{
    public void SetDarkTheme()
    {
        if (Build.VERSION.SdkInt >= BuildVersionCodes.M)
        {
            Device.BeginInvokeOnMainThread(() =>
            {
                var currentWindow = GetCurrentWindow();
                currentWindow.DecorView.SystemUiVisibility = 0;
                currentWindow.SetStatusBarColor(Android.Graphics.Color.DarkCyan);
            });
        }
    }

    public void SetLightTheme()
    {
        if (Build.VERSION.SdkInt >= BuildVersionCodes.M)
        {
            Device.BeginInvokeOnMainThread(() =>
            {
                var currentWindow = GetCurrentWindow();
                currentWindow.DecorView.SystemUiVisibility = (StatusBarVisibility)SystemUiFlags.LightStatusBar;
                currentWindow.SetStatusBarColor(Android.Graphics.Color.LightGreen);
            });
        }
    }

    Window GetCurrentWindow()
    {
        var window = CrossCurrentActivity.Current.Activity.Window;

        // clear FLAG_TRANSLUCENT_STATUS flag:
        window.ClearFlags(WindowManagerFlags.TranslucentStatus);

        // add FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS flag to the window
        window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);

        return window;
    }
}
{% endhighlight %}
Please note that I am using [Current Activity Plugin for Xamarin.Android](https://github.com/jamesmontemagno/CurrentActivityPlugin#current-activity-plugin-for-xamarinandroid) in order to get a reference to the current displayed activity.

## iOS

### Background colour

In iOS the status bar background colour by default matching the colour of the navigation bar. In other words, we don't have to explicitly set the background colour of the status bar if we want it to match the background colour of the navigation bar.

### Text colour

[Since iOS 7](https://developer.apple.com/documentation/uikit/uiapplication/1622923-setstatusbarstyle) it is possible to set a predefined status bar text colour theme to light or dark. However, we will have to manipulate the `Info.plist`. Since status bar behaviour is determined by view controllers by default, we have to disable this:

<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>

Next, we can define a default [text colour theme](https://developer.apple.com/documentation/uikit/uistatusbarstyle):

<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleDefault</string>

### Implementation
{% highlight csharp %}
public class StatusBarStyleManager : IStatusBarStyleManager
{
    public void SetDarkTheme()
    {
        Device.BeginInvokeOnMainThread(() =>
        {
            UIApplication.SharedApplication.SetStatusBarStyle(UIStatusBarStyle.LightContent, false);
            GetCurrentViewController().SetNeedsStatusBarAppearanceUpdate();
        });
    }

    public void SetLightTheme()
    {
        Device.BeginInvokeOnMainThread(() =>
        {
            UIApplication.SharedApplication.SetStatusBarStyle(UIStatusBarStyle.Default, false);
            GetCurrentViewController().SetNeedsStatusBarAppearanceUpdate();
        });
    }

    UIViewController GetCurrentViewController()
    {
        var window = UIApplication.SharedApplication.KeyWindow;
        var vc = window.RootViewController;
        while (vc.PresentedViewController != null)
            vc = vc.PresentedViewController;
        return vc;
    }
}
{% endhighlight %}
## Conclusion

At first this topic may seem very confusing, especially on Android, however it turned out to be very simple and easily achievable as you can se above. The code can be found on [github](https://github.com/yuv4ik/XFDynamicStatusBarAppearance).
