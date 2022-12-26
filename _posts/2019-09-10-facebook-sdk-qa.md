---
layout: post
title: "Using Native Facebook Login Button in Xamarin.Forms QA"
date: "2019-09-10"
categories: [android,facebook,ios,xamarin-forms]
---

On 9th of March 2018 I wrote an article "[Using Native Facebook Login Button in Xamarin.Forms]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %})" which turned out to be the second popular article on my blog. Since then, thanks for my readers, I received many additional questions which I decided to answer in this separate article. However, before diving into those questions, I would like to take a step back and talk about Facebook SDK in relation to Xamarin.

[Facebook SDK](https://github.com/xamarin/FacebookComponents) is available for Xamarin.Android and Xamarin.iOS but not for Xamarin.Forms. This might be the most confusing part, especially if you are working with Facebook SDK on Xamarin.Forms for the first time. Luckily, the problem could be easily solved, please follow the [original article]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %}).

Now the question is "Do you actually need to integrate the official Facebook Login component to your app?". What if you want a fully customised button instead of the official look and feel? What if you just want to obtain an authentication token from Facebook and pass it to your backend? By the end of the day we just want to be productive and write as less code as possible, right? If I just described your case please refer to my [other article]({{ site.baseurl }}{% post_url 2018-08-08-retrieving-facebook-user-access-token-in-xamarin-forms %}) where this can be achieved with a couple lines of code with a [ready made wrapper](https://github.com/CrossGeeks/FacebookClientPlugin) for Xamarin.Forms.

If for some reason you are still willing to use the official Facebook Login component or it is already integrated and there is a need in a slight modification/enhancement please follow the QA section and hopefully you will find the answer for your question in there.

## QA

### Is it possible to change the button label?

We have to keep in mind that Facebook Login button is smart enough to represent the current state and there should be at least 2 labels: Login and Logout. In case of Android it is possible as `Xamarin.Facebook.Login.Widget.LoginButton` has a dedicated method for each state `SetLoginText` and `SetLogoutText`. Unfortunately on iOS those methods are not available. We could use the `SetAttributedTitle` method, however, this will result on a static label and will completely ignore the states unless you will handle those state changes explicitly.

### Is it possible to catch the logout event?

There are some platform differences, where on iOS you could simply catch and response to logout event on the Facebook Login button level, where on Android you could not. In order to keep the solution somewhat consistent, I solved the problem by listening to the `Facebook.CoreKit.AccessToken.DidChangeNotification` on iOS and by extending the `Xamarin.Facebook.AccessTokenTracker` abstract class on Android. In both cases an old token and a new one are provided so you could act accordingly. I updated the existing [github repo](https://github.com/yuv4ik/XFFacebookLoginButtonExample) where you can find those implementations.

### Is it possible to logout programmatically?

On Android there is a `LoginManager` singleton class which expose the `LogOut` method, where on iOS you will have to create an instance of `LoginManager` and use the same `LogOut` method. Example can be found in the [github repo](https://github.com/yuv4ik/XFFacebookLoginButtonExample).

### Is it possible to retrieve the first name or email of the logged in user?

Usually this is done by the backend. The application will send the Facebook authentication token to the backend and the backend will take care of retrieving the profile information in order to create an account in your system. However, you could create a Facebook Graph request on the app side as well and request the necessary information about the user, using the login token.

### Unhandled Exception is thrown on Android: Xamarin.Facebook.FacebookSdkNotInitializedException: The SDK has not been initialized, make sure to call FacebookSdk.sdkInitialize() first.

Please make sure to define the Facebook App ID correctly as described in the [original post]({{ site.baseurl }}{% post_url 2018-03-09-using-native-facebook-login-button-in-xamarin-forms %}) (Android/2/3/4). In short `Strings.xml` and `AndroidManifest.xml` should contain Facebook App ID and Name. Additionally, make sure to use the latest and greatest NuGet packages.

## Post scriptum

All the code examples are available on [GitHub](https://github.com/yuv4ik/XFFacebookLoginButtonExample). The repository is updated to latest and greatest NuGet packages and contains additional examples.
