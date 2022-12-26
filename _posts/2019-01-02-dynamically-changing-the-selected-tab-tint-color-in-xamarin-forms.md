---
layout: post
title: "Dynamically changing the selected tab tint color in Xamarin.Forms"
date: "2019-01-02"
categories: [android,c#,ios,xamarin-forms,xaml]
---
### Android
![droid](/images/2019-01-02-dynamically-changing-the-selected-tab-tint-color-in-xamarin-forms/2.gif)

Since Xamarin.Forms 3.1 a [TabbedPage.BarSelectedItemColor](https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.platformconfiguration.androidspecific.tabbedpage.barselecteditemcolorproperty?view=xamarin-forms) property has been introduced and we can simply use it to achieve our goal.

XAML:
{% highlight xml %}
<TabbedPage
    xmlns:android="clr-namespace:Xamarin.Forms.PlatformConfiguration.AndroidSpecific;assembly=Xamarin.Forms.Core"
    android:TabbedPage.BarSelectedItemColor="Red">
</TabbedPage>
{% endhighlight %}
C#:
{% highlight csharp %}
Xamarin.Forms.PlatformConfiguration.AndroidSpecific.TabbedPage.SetBarSelectedItemColor(%tabbedPage%, %color%);
{% endhighlight %}
### iOS

![ios](/images/2019-01-02-dynamically-changing-the-selected-tab-tint-color-in-xamarin-forms/2.gif)

Unfortunately on iOS we have to implement the solution ourselves. Luckily there is a [TintColor](https://developer.apple.com/documentation/uikit/uitabbar/1623460-tintcolor) property on a `UITabBar` that we can use.

### The solution

We will create an `Effect` using the knowledge listed above. The effect will have a single [AttachedProperty](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/effects/passing-parameters/attached-properties) which will represent the selected tab tint color:
{% highlight csharp %}
public static class SelectedTabItemDynamicTintColorEffect
{
    public static readonly BindableProperty SelectedTabTintColorProperty =
        BindableProperty.CreateAttached("SelectedTabTintColor", typeof(Color), typeof(SelectedTabItemDynamicTintColorEffect), Color.Default);

    public static Color GetSelectedTabTintColor(BindableObject view) => (Color)view.GetValue(SelectedTabTintColorProperty);
    public static void SetSelectedTabTintColor(BindableObject view, Color value) => view.SetValue(SelectedTabTintColorProperty, value);
}
{% endhighlight %}
Next we will create the `RoutingEffect`:
{% highlight csharp %}
public class TabbedPageSelectedTabItemDynamicTintColorEffect : RoutingEffect
{
    public TabbedPageSelectedTabItemDynamicTintColorEffect() : base($"XFDynamicSelectedTabTintColor.Effects.{nameof(TabbedPageSelectedTabItemDynamicTintColorEffect)}") { }
}
{% endhighlight %}
Here is the Android implementation:
{% highlight csharp %}
public class TabbedPageSelectedTabItemDynamicTintColorEffect : PlatformEffect
{
    protected override void OnAttached() { }
    protected override void OnDetached() { }

    protected override void OnElementPropertyChanged(PropertyChangedEventArgs args)
    {
        base.OnElementPropertyChanged(args);

        if (args.PropertyName == SelectedTabItemDynamicTintColorEffect.SelectedTabTintColorProperty.PropertyName)
            SetTintColor();
    }

    void SetTintColor() =>
        Xamarin.Forms.PlatformConfiguration.AndroidSpecific.TabbedPage.SetBarSelectedItemColor(Element, SelectedTabItemDynamicTintColorEffect.GetSelectedTabTintColor(Element));
}
{% endhighlight %}
Here is the iOS implementation:
{% highlight csharp %}
public class TabbedPageSelectedTabItemDynamicTintColorEffect : PlatformEffect
{
    protected override void OnAttached() { }
    protected override void OnDetached() { }

    protected override void OnElementPropertyChanged(PropertyChangedEventArgs args)
    {
        base.OnElementPropertyChanged(args);

        if (args.PropertyName == SelectedTabItemDynamicTintColorEffect.SelectedTabTintColorProperty.PropertyName)
            SetTintColor();
    }

    void SetTintColor()
    {
        var tabBar = Container.Subviews.First(v => v is UIKit.UITabBar);
        tabBar.TintColor = SelectedTabItemDynamicTintColorEffect.GetSelectedTabTintColor(Element).ToUIColor();
    }
}
{% endhighlight %}
In both cases we are monitoring `SelectedTabTintColorProperty` for changes and once changed simply applying a new `TintColor`.

Now we can just add the effect to our `TabbedPage` and change the tint color for example `OnCurrentPageChanged` so each tab will have its own tint color.

Full example can be found on [github](https://github.com/yuv4ik/XFDynamicSelectedTabTintColor).
