---
layout: post
title: "Repeater or Bindable StackLayout"
date: "2018-06-06"
categories: [android,ios,xamarin-forms]
---
iOS | Android
![](/images/2018-06-06-repeater-or-bindable-stacklayout/1.png) | ![](/images/2018-06-06-repeater-or-bindable-stacklayout/2.png)

## Intro

When designing a View (Page) we need to take into consideration that there might be a lot of content to show. Typically we should use a `ListView`, which by default is scrollable. However, what if you have to show more than one `ListView` on a single page? Nesting `ScrollViews` is a very bad practice that should be avoided unless natively supported. In this case it will most probably make sense to put all the content within a single `ScrollView`. But how? Here is where the `Repeater` or `BindableStackLayout` comes into play.

## Custom Control

In order to solve the problem described in the Intro, we will have to extend a `StackLayout` and expose the next bindable properties:

- `ItemsSource` - Gets/sets the source of items to template and display.
- `ItemDataTemplate` - Gets/sets the item template.
- `Title` - Gets/sets the header/title of the control.

The implementation is very simple and does not require any custom renderers since we are simply going to reuse a layout that arranges child views vertically or horizontally. We are going to use [BindableProperties](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/xaml/bindable-properties) in order to be able to react to value changes in a real time.

Here is a very simple implementation in ±50 lines of code:
{% highlight csharp %}
public class BindableStackLayout : StackLayout
{
    readonly Label header;
    public BindableStackLayout()
    {
        header = new Label();
        Children.Add(header);
    }

    public IEnumerable ItemsSource
    {
        get { return (IEnumerable)GetValue(ItemsSourceProperty); }
        set { SetValue(ItemsSourceProperty, value); }
    }
    public static readonly BindableProperty ItemsSourceProperty =
        BindableProperty.Create(nameof(ItemsSource), typeof(IEnumerable), typeof(BindableStackLayout),
                                propertyChanged: (bindable, oldValue, newValue) => ((BindableStackLayout)bindable).PopulateItems());

    public DataTemplate ItemDataTemplate
    {
        get { return (DataTemplate)GetValue(ItemDataTemplateProperty); }
        set { SetValue(ItemDataTemplateProperty, value); }
    }
    public static readonly BindableProperty ItemDataTemplateProperty =
        BindableProperty.Create(nameof(ItemDataTemplate), typeof(DataTemplate), typeof(BindableStackLayout));

    public string Title
    {
        get { return (string)GetValue(TitleProperty); }
        set { SetValue(TitleProperty, value); }
    }
    public static readonly BindableProperty TitleProperty =
        BindableProperty.Create(nameof(Title), typeof(string), typeof(BindableStackLayout),
                                propertyChanged: (bindable, oldValue, newValue) => ((BindableStackLayout)bindable).PopulateHeader());

    void PopulateItems()
    {
        if (ItemsSource == null) return;
        foreach (var item in ItemsSource)
        {
            var itemTemplate = ItemDataTemplate.CreateContent() as View;
            itemTemplate.BindingContext = item;
            Children.Add(itemTemplate);
        }
    }

    void PopulateHeader() => header.Text = Title;
}
{% endhighlight %}
All the "stuff" is happening within the `PopulateItems` method which is called when a value of `ItemSource` property is changing. We simply iterate through the collection of items and add them as children to the root view. Please note that each child is represented by `ItemDataTemplate`, so all we have to do, is to invoke `CreateContent` method that will be generate the view for us.

Usage example:
{% highlight csharp %}
public sealed class MyColor
{
    public string Name { get; }
    public string HexCode { get; }
    public MyColor(string name, string hexCode)
    {
        Name = name;
        HexCode = hexCode;
    }
} 

public class MainViewModel
{
    public IReadOnlyCollection<MyColor> MyColors { get; } = new List<MyColor>
    {
        new MyColor(“Black”, “#000000”),
        new MyColor(“Hot Pink”, “#ff69b4”),
        new MyColor(“Red”, “#ff0000”),
        new MyColor(“Sort of Green”, “#7cff00”)
    };
}
{% endhighlight %}
{% highlight xml %}
<?xml version=“1.0“ encoding=“utf-8“?>
<ContentPage
    xmlns=“http://xamarin.com/schemas/2014/forms“
    xmlns:x=“http://schemas.microsoft.com/winfx/2009/xaml“
    xmlns:local=“clr-namespace:XFBindableStackLayout“
    x:Class=“XFBindableStackLayout.MainPage“>
    <ContentPage.BindingContext>
        <local:MainViewModel />
    </ContentPage.BindingContext>
    <local:BindableStackLayout
        Title=“Colors:“
        ItemsSource=“{Binding MyColors}“
        VerticalOptions=“Center“
        HorizontalOptions=“Center“>
        <local:BindableStackLayout.ItemDataTemplate>
            <DataTemplate>
                <StackLayout
                    Orientation=“Horizontal“>
                    <BoxView
                        WidthRequest=“50“
                        HeightRequest=“50“
                        Color=“{Binding HexCode}“ />
                    <Label
                        Text=“{Binding Name}“
                        VerticalTextAlignment=“Center“ />
                </StackLayout>
            </DataTemplate>
        </local:BindableStackLayout.ItemDataTemplate>
    </local:BindableStackLayout>
</ContentPage>
{% endhighlight %}

## Conclusion

The implementation above is very simple, however some corner cases are not handled on purpose. This can be a nice homework for you to discover and handle those. The code above is fully available on [github](https://github.com/yuv4ik/XFBindableStackLayout).

Good luck!
