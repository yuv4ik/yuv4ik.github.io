---
layout: post
title: "Notification about an empty ListView in Xamarin.Forms"
date: "2018-11-12"
categories: [android,c#,ios,xamarin,xamarin-forms,xaml]
---

![](/images/2018-11-12-notification-about-an-empty-listview-in-xamarin-forms/1.gif)

`ListView` is one of my favourite UI controls available in Xamarin.Forms. It is mostly easy to use and customise. Just bind a collection of data, define the representation of each item and you are done!

However, there is one pitfall which most of the developers tend to ignore - if the bound collection is empty, the `ListView` will have nothing to show. Depending on the targeting platform it may look ugly or confusing for the end user.

In this blogpost we will check few possible solutions. One solution will be purely implemented on the `ViewModel` level and the other one will be a reusable `ListView` control wrapper.

Let's start with a simple case where you have a single `ListView` in the app and a reusable solution may sound like an overkill. In this case we will need to add an empty list indication to the View/Page and swap the `IsVisible` property between the `ListView` and the indicator when the collection become empty:
{% highlight csharp %}
 <Label
    IsVisible="{Binding IsNotEmptyData, Converter={StaticResource invertBooleanConverter}}"
    VerticalTextAlignment="Center"
    HorizontalTextAlignment="Center"
    FontAttributes="Italic"
    Text="Sorry, it seems that the list is empty." />

<ListView
    IsVisible="{Binding IsNotEmptyData}"
    ItemsSource="{Binding Data}" />
{% endhighlight %}
As you see both `Label` and `ListView` has the `IsVisible` property bound to `IsNotEmptyData` property that is defined on the `ViewModel` and look like this:
{% highlight csharp %}
List<string> data;
public List<string> Data
{
    get => data;
    set
    {
        data = value;
        RaisePropertyChanged();
        RaisePropertyChanged(nameof(IsNotEmptyData));
    }
}

public bool IsNotEmptyData => data != null && data.Count > 0;
{% endhighlight %}
When `Data` property is changing it also raising a change event of the `IsNotEmptyData` property. Quite easy, but not reusable with multiple `ListView`s in the app.

Second approach I want to demonstrate is a custom control which simply wraps a `ListView` control by a `Label` and the visibility logic is managed by it. Here is how our XAML will look like using this approach:
{% highlight xml %}
<controls:StaticListViewWithEmptyMessage
    EmptyMessage="Sorry, it seems that the list is empty.">
    <controls:StaticListViewWithEmptyMessage.ListView>
        <ListView ItemsSource="{Binding Data}" />
    </controls:StaticListViewWithEmptyMessage.ListView>
</controls:StaticListViewWithEmptyMessage>
{% endhighlight %}
The `ListView` is still under your full control as it is being defined right here. All you need is to set the `EmptyMessage` property and you should be ready to go! Lets take a look on the `StaticListViewWithEmptyMessage` control:
{% highlight csharp %}
public class StaticListViewWithEmptyMessage : Grid
{
    public ListView ListView
    {
        get { return (ListView)GetValue(ListViewProperty); }
        set { SetValue(ListViewProperty, value); }
    }

    public static readonly BindableProperty ListViewProperty =
        BindableProperty.Create(nameof(ListView), typeof(ListView), typeof(StaticListViewWithEmptyMessage), propertyChanged: HandleListViewChanged);

    static void HandleListViewChanged(BindableObject bindable, object oldValue, object newValue)
    {
        var intelligentListView = (StaticListViewWithEmptyMessage)bindable;
        var oldList = (ListView)oldValue;

        if(oldList != null)
        {
            intelligentListView.Children.Remove(oldList);
            oldList.PropertyChanged -= ListViewPropertyChanged;
        }

        var newList = (ListView)newValue;
        newList.IsVisible = false;
        newList.PropertyChanged += ListViewPropertyChanged;

        intelligentListView.Children.Add(newList);
    }

    static void ListViewPropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        if (e.PropertyName != ListView.ItemsSourceProperty.PropertyName) return;

        var listView = (ListView)sender;
        var staticListViewWithEmptyMessage = listView.Parent as StaticListViewWithEmptyMessage;

        if (listView.ItemsSource == null || (listView.ItemsSource as ICollection).Count == 0)
        {
            listView.IsVisible = false;
            staticListViewWithEmptyMessage.emptyMessageLbl.IsVisible = true;
        }
        else
        {
            listView.IsVisible = true;
            staticListViewWithEmptyMessage.emptyMessageLbl.IsVisible = false;
        }
    }

    public string EmptyMessage
    {
        get { return (string)GetValue(EmptyMessageProperty); }
        set { SetValue(EmptyMessageProperty, value); }
    }

    public static readonly BindableProperty EmptyMessageProperty =
        BindableProperty.Create(nameof(EmptyMessage), typeof(string), typeof(StaticListViewWithEmptyMessage));

    readonly Label emptyMessageLbl;

    public StaticListViewWithEmptyMessage()
    {
        Children.Add(emptyMessageLbl = GenerateEmptyLabel());
    }

    Label GenerateEmptyLabel()
    {
        var lbl = new Label
        {
            BindingContext = this, 
            VerticalTextAlignment = TextAlignment.Center,
            HorizontalTextAlignment = TextAlignment.Center,
            FontAttributes = FontAttributes.Italic
        };

        lbl.SetBinding(Label.TextProperty, EmptyMessageProperty.PropertyName);
        return lbl;
    }
}
{% endhighlight %}
First we define a `BindableProperty` of type `ListView` that allows us to expose the `ListView` fully as demonstrated above. In order to show/hide our `ListView` we have to listen and response correctly to related changes.

Please note that both of the examples assumed that the collection bound to the `ListView` is a static collection if you want to handle a dynamic collection, you will have to use `ObservableCollection` and listen to `CollectionChanged` event instead.

The source code is available [here](https://github.com/yuv4ik/XFEmptyListMessage).
