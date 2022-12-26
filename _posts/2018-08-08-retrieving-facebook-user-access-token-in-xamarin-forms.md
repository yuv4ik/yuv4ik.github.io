---
layout: post
title: "Retrieving Facebook User Access Token in Xamarin.Forms"
date: "2018-08-08"
categories: [facebook,xamarin,xamarin-forms]
---

Few months ago I wrote an article about [Using Native Facebook Login Button in Xamarin.Formsicle]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %}) where I explained how to retrieve user access token using Facebook SDK. It is still a valid read and a good solution, however, recently I discovered that there is a shorter way to achieve almost the same thing.

In this article we will learn how to retrieve Facebook user access token, using a custom button (not native) with just a few lines of code. I assume that you know how to create a Facebook application and configure your Android and iOS projects. If I am mistaken please refer to [my previous article]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %}).

There is an open source project [Facebook Client Plugin](https://github.com/CrossGeeks/FacebookClientPlugin) that allow you to login, share and query Facebook using static API. It has a good documentation and good well known developers behind it. As you may already understand we are going to use it to retrieve user access token from Facebook in our project.

Here is the recipe:

1. Create and configure Facebook app (more info [here]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %}) or [here](https://github.com/CrossGeeks/FacebookClientPlugin/blob/master/docs/FacebookPortalSetup.md)).
2. Add `Plugin.FacebookClient` NuGet package to .NET Standard and platform targeting projects.
3. Configure platform targeting projects (more info [here]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %}) or [here](https://github.com/CrossGeeks/FacebookClientPlugin)).
4. Add a custom Facebook login button to your Page/View.
5. Bind a command to the previously created button with the next code:
{% highlight csharp %}
var fbLoginResponse=
    awaitCrossFacebookClient.Current.LoginAsync(newstring[]{“email”});
if(fbLoginResponse.Status == FacebookActionStatus.Completed)
{
    var fbUserAccessToken=CrossFacebookClient.Current.ActiveToken;
    // TODO: Use the fb access token
}
else
{
    // Something went wrong
}
{% endhighlight %}

That should be it!

You could create a wrapper interface and class to make this code testable, to be able to inject it as a dependency and to adjust it to your needs. This solution might be less configurable, however, the integration is very easy and the amount of code is miserable compare to the previous solution.

Big thanks to [CrossGeeks](https://github.com/CrossGeeks)!
