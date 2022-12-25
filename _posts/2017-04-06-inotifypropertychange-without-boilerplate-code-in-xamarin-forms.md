---
layout: post
title: "INotifyPropertyChange without boilerplate code in Xamarin.Forms"
date: "2017-04-06"
categories: [net,c#,xamarin]
---
Implementing [INotifyPropertyChange](https://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged(v=vs.110).aspx) is pretty straightforward. Usually, you create a base ViewModel class which implements it and which usually contains RaisePropertyChanged method:

{% highlight csharp %}
public abstract class BaseViewModel : INotifyPropertyChanged  
{  
    #region INotifyPropertyChanged  
    public event PropertyChangedEventHandler PropertyChanged;  
    protected void RaisePropertyChanged(  
        \[CallerMemberName\] string propertyName = "")  
    {  
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));  
    }  
    #endregion  
}
{% endhighlight %}

Now you can extend the BaseViewModel and use it this way:

{% highlight csharp %}
public class UserViewModel : BaseViewModel  
{
    private string login;

    public string Login
    {
        get
        {
            return login;
        }
        set
        {
            if (login == value)
                return;
            login = value;
            RaisePropertyChanged();
        }
    }

    private string password;

    public string Password
    {
        get
        {
            return password;
        }
        set
        {
            if (password == value)
                return;
            password = value;
            RaisePropertyChanged();
        }
    }
}
{% endhighlight %}

For very small applications it can be a good enough approach, however, in bigger applications it turns into a lot of boring boilerplate code. Here is where [NotifyPropertyChanged.Fody](https://github.com/Fody/PropertyChanged) comes into play! With this nice package our code will turn into:

{% highlight csharp %}
[ImplementPropertyChanged]
public abstract class BaseViewModel {}

public class UserViewModel : BaseViewModel
{
    public string Login { get; set; }
    public string Password { get; set; }
}
{% endhighlight %}

Easy as it is! I highly recommend to get familiar with the [documentation](https://github.com/Fody/PropertyChanged/wiki) as it contains a lot of useful information about more advanced flows. For example, if you need to RaisePropertyChange for dependent properties or to skip equality comparison.
