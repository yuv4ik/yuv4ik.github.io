---
layout: post
title: "Mocking Xamarin.Essentials"
date: "2019-01-09"
categories: [c#,unit-testing,xamarin-essentials,xamarin-forms]
---

> Xamarin.Essentials provides developers with cross-platform APIs for their mobile applications.

If you never heard about Xamarin.Essentials you should get familiar with it as soon as possible! It is a great collection of APIs that is very easy to use and integrate to your projects. You can find more information in the [official documentation](https://docs.microsoft.com/en-us/xamarin/essentials/).

In order to keep the things as simple as possible and easy as possible to pick up for new contributors, all the APIs are written in a static way. The first reaction of developers would be to immediately raise their eyebrows and ask:  "Why so? How are we going to unit test that?". The answer in most cases is easier than you may think at first.

Before we will talk about Xamarin.Essentials specifically, think for a moment how would you mock the static `DateTimeOffset.Now` or any other static API? One way is to use [Shims](https://docs.microsoft.com/en-us/visualstudio/test/isolating-code-under-test-with-microsoft-fakes?view=vs-2017) but that has quite a lot of limitations and implications on the project side. Another way, that I tend to use quite a lot is to create a simple wrapper class around the static API. For example:
{% highlight csharp %}
namespace XFMockingXamarinEssentials
{
    public interface IDateTimeOffsetWrapper
    {
        DateTimeOffset Now { get; }
    }

    public class DateTimeOffsetWrapper : IDateTimeOffsetWrapper
    {
        public DateTimeOffset Now => DateTimeOffset.Now;
    }
}
{% endhighlight %}
This way we will be able to inject `IDateTimeOffsetWrapper` and mock the `Now` property when it is necessary. Same technique can be applied to any static API. Now back to Xamarin.Essentials.

Xamarin.Essentials contains quite a lot of APIs for 3 different platforms. Typically there is no need to use all of those in a single project but just a few. So for example we would like to use:

- Connectivity - for checking if the device is connected to internet
- SecureStorage - for keeping sensitive data that should be encrypted
    
Using the above example we could create 2 wrappers for our specific needs:
{% highlight csharp %}
namespace XFMockingXamarinEssentials
{
    using Xamarin.Essentials;

    public interface IConnectivityWrapper
    {
        bool IsConnectedToInternet();
    }

    public class ConnectivityWrapper : IConnectivityWrapper
    {
        public bool IsConnectedToInternet() => Connectivity.NetworkAccess == NetworkAccess.Internet;
    }
}

namespace XFMockingXamarinEssentials
{
    public interface ISecuredStorageWrapper
    {
        Task<string> GetAuthToken();
        Task SetAuthToken(string token);
    }

    public class SecuredStorageWrapper : ISecuredStorageWrapper
    {
        const string tokenKey = "auth_token";

        public Task<string> GetAuthToken() => Xamarin.Essentials.SecureStorage.GetAsync(tokenKey);
        public Task SetAuthToken(string token) => Xamarin.Essentials.SecureStorage.SetAsync(tokenKey, token);
    }
}
{% endhighlight %}
Easy as it is, now we can mock the data and unit test functionality that is relying on those wrappers. Additional advantage of using wrappers in this case, is that you could painlessly replace Xamarin.Essentials by your own or a third party implementation just within the wrapper itself. Does not happen often but still may.

The down side of this approach is that we have to create wrappers again and again within a single project or from project to project, luckily there is a solution for that as well! There is a great project [Interfaces for Xamarin.Essentials](https://github.com/rdavisau/essential-interfaces) that generates interfaces for you and if you don't want to introduce another  dependency to your project, it is also possible to just copy auto-generated interfaces from [here](https://essential-interfaces.azurewebsites.net/). Thanks to Ryan Davis!

Another example when a wrapper can make sense is to check the running platform:
{% highlight csharp %}
namespace XFMockingXamarinEssentials
{
    public interface IRuntimePlatformWrapper
    {
        bool IsOnAndroid();
    }

    public class RuntimePlatformWrapper : IRuntimePlatformWrapper
    {
        public bool IsOnAndroid() => Device.RuntimePlatform == Device.Android;
    }
}
{% endhighlight %}
As you see it is a pretty simple yet powerful technique that you can apply anywhere. Cheers!

P.S.: GitHub repository is available [here](https://github.com/yuv4ik/XFEssentialsMockExample).
