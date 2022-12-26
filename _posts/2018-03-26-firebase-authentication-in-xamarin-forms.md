---
layout: post
title: "Firebase authentication in Xamarin.Forms"
date: "2018-03-26"
categories: [.net,asp-net-core-web-api,firebase,xamarin-forms]
---

![Firebase Authentication](/images/2018-03-26-firebase-authentication-in-xamarin-forms/1.png)

Integrating Firebase Auth in Xamarin.Forms is very easy and basic authentication flow implementation can be achieved under 20 lines of code. There is more work with settings than code writing. In this article we will:

1. Configure Firebase app
2. Create Xamarin.Forms application to authenticate users via Firebase Auth
3. Create a .NET Core WEB API project to validate Firebase Auth token and return simple data

## Firebase Configuration

Firebase has simple and intuitive UI and it is very hard to get lost there, thumbs up for the great work Google! In order to achieve our goal we have to do few simple steps:

1. Create a new project
    - Add application for Android
        - Download google-services.json
    - Add application for iOS
        - Download GoogleService-Info.plist
2. Open Authentication section
    - Switch to "Sign-in method" tab
        - Enable "Email/Password"
    - Switch to "Users" tab
        - Add a new user

At this point we should be done with the Firebase configuration and should have all the necessary files in place.

## Xamarin.Forms Configuration

### Android

- Add `Xamarin.Firebase.Auth` NuGet package
- Import "google-services.json" and set the building action to "GoogleServicesJson"
    - In other words the `.csproj` should contain the next line: <GoogleServicesJson Include="google-services.json" />
- Make sure that your package name is identical to the package name inside "google-services.json"
- Add the next line of code in the MainActivity.cs OnCreate before LoadApplication:
```
FirebaseApp.InitializeApp(Application.Context);
```
### iOS

- Add `Xamarin.Firebase.iOS.Auth` NuGet package to iOS project
- Import "GoogleService-Info.plist" and set the building action to "BundleResource"
- Make sure that your bundle identifier is identical to the bundle identifier inside "GoogleService-Info.plist"
- Add the next line of code in the AppDelegate.cs FinishedLaunching before LoadApplication:
```
Firebase.Core.App.Configure();
```
- Please note that if you want to test on the iOS simulator you will have to do one extra step as described [here](https://stackoverflow.com/a/39488013/1970317) due to a bug.

### Xamarin.Forms

Since there are only platform specific `Xamarin.Firebase` NuGet packages, we will have to create a simple abstraction layer that will look like this:
{% highlight csharp %}
public interface IFirebaseAuthenticator {
    Task<string> LoginWithEmailPassword(string email, string password);
}
{% endhighlight %}

Each platform will have to implement this interface separately. Android implementation:
{% highlight csharp %}
public class FirebaseAuthenticator : IFirebaseAuthenticator {
    public async Task<string> LoginWithEmailPassword(string email, string password) {
        var user = await FirebaseAuth.Instance.SignInWithEmailAndPasswordAsync(email, password);
        var token = await user.User.GetIdTokenAsync(false);
        return token.Token;
    }
}
{% endhighlight %}
iOS implementation:
{% highlight csharp %}
public class FirebaseAuthenticator : IFirebaseAuthenticator {
    public async Task<string> LoginWithEmailPassword(string email, string password) {
        var user = await Auth.DefaultInstance.SignInAsync(email, password);
        return await user.GetIdTokenAsync();
    }
}
{% endhighlight %}
The implementations are almost identical and in both cases are 2-3 lines of code to authenticate a user and return a token.

After obtaining a token we could use it to access our protected API:
{% highlight csharp %}
using (var httpClient == new HttpClient { DefaultRequestHeaders = { Authorization = token } }) {
    var res = await httpClient.GetAsync("http://10.0.2.2:5001/api/data");
    var content = await res.Content.ReadAsStringAsync();
}
{% endhighlight %}
## .NET Core WEB API Configuration

Now we want to validate the Firebase token we obtained in our Xamarin.Forms app. For this, we have to setup and enable `Authentication` in `Startup.cs`:
{% highlight csharp %}
public void ConfigureServices(IServiceCollection services) {
    var firebaseProjectId = "SET_ME_UP";
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options => {
            options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
            options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuer = true,
                ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
                ValidateAudience = true,
                ValidAudience = firebaseProjectId,
                ValidateLifetime = true
        };
    });

    services.AddMvc();
}

public void Configure(IApplicationBuilder app, IHostingEnvironment env) { 
    if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); }
    // Order matters
    app.UseAuthentication();
    app.UseMvc();
}
{% endhighlight %}

The code is self explanatory, but if you would like to dive into details [there is a great article](https://blog.markvincze.com/secure-an-asp-net-core-api-with-firebase/) explaining the code above.

## Conclusion

Integrating Firebase to Xamarin.Forms and .NET Core WEB API is simple and fun. While this example was pretty ordinary you could extend it to support other Firebase Auth flows as a homework.

Code example is available on [github](https://github.com/yuv4ik/XFFirebaseAuthExample).
