---
layout: post
title: "Using Native Facebook Login Button in Xamarin.Forms"
date: "2018-03-09"
categories: [facebook,xamarin,xamarin-forms]
---
iOS | Android
![](/images/2018-03-09-using-native-facebook-login-button-in-xamarin-forms/1.png) | ![](/images/2018-03-09-using-native-facebook-login-button-in-xamarin-forms/2.png)

Very often I hear questions like "Is there any Facebook SDK for Xamarin.Forms? Because there is one for Android Xamarin Native.". This kind of questions can apply to different SDK that are compatible only with specific platforms and cannot be consumed directly in Xamarin.Forms. The answer to these questions usually is "If there is an available native Xamarin SDK it can be consumed in your Xamarin.Forms project. All you have to do is to create an abstraction like you would do with any other platform specific code.".

As you might already understand, in this article we will create an abstraction over [Xamarin.Facebook.Android](https://components.xamarin.com/view/facebookandroid) and [Xamarin.Facebook.iOS](https://components.xamarin.com/view/facebookios) in order to display a native [Facebook Login Button](https://developers.facebook.com/docs/facebook-login/web/login-button) and handle the authentication related events in our Xamarin.Forms application.

* Please note that this technique can be applied to any Xamarin native SDKs.

Let's create our PCL Xamarin.Forms project. It should have 2 targets: Android and iOS. I would highly recommend to [switch to .netstandard 2.0](https://gist.github.com/yuv4ik/063a35fe3986e62d69aee2f0ed0607bf) and update all the NuGet packages. Don't forget that you Android project should target Android 8.1 without it the NuGet update will fail.

## Facebook

Now we have to create a Facebook application on [https://developers.facebook.com/](https://developers.facebook.com/). Once created we have to add a "Facebook Login" product. Then we have to create 2 platforms for our application Android and iOS, it can be easily done if you will follow the Quickstart instructions per platform, you can ignore all the steps involving code or configuration files manipulations. Please pay attention to your package name and bundle identifier, they should match your Android and iOS projects. For Android you will have to provide a "Key Hashes", luckily the Quickstart instructions are nicely explaining how to achieve that. I am on purpose not going into details since it is a very straightforward process, thumbs up for the Facebook team. Also you can easily generate test users for your application on Facebook under Roles > Test Users.

It's time to write some code!

## Xamarin.Forms

Let's create our abstraction layer, it will be a very simple Xamarin.Forms control:

{% highlight csharp %}
public class FacebookLoginButton: View {
    public string[] Permissions {
      get {
        return (string[]) GetValue(PermissionsProperty);
      }
      set {
        SetValue(PermissionsProperty, value);
      }
    }

    public static readonly BindableProperty PermissionsProperty = BindableProperty.Create(nameof(Permissions), typeof (string[]), typeof (FacebookLoginButton), // This permission is set by default, even if you don't add it, but FB recommends to add it anyway             defaultValue: new string[] { "public_profile", "email" });

      public Command<string> OnSuccess {
        get {
          return (Command<string> ) GetValue(OnSuccessProperty);
        }
        set {
          SetValue(OnSuccessProperty, value);
        }
      }

      public static readonly BindableProperty OnSuccessProperty\ = BindableProperty.Create(nameof(OnSuccess), typeof (Command<string> ), typeof (FacebookLoginButton));

      public Command<string> OnError {
        get {
          return (Command<string> ) GetValue(OnErrorProperty);
        }
        set {
          SetValue(OnErrorProperty, value);
        }
      }

      public static readonly BindableProperty OnErrorProperty = BindableProperty.Create(nameof(OnError), typeof (Command<string> ), typeof (FacebookLoginButton));

      public Command OnCancel {
        get {
          return (Command) GetValue(OnCancelProperty);
        }
        set {
          SetValue(OnCancelProperty, value);
        }
      }

      public static readonly BindableProperty OnCancelProperty = BindableProperty.Create(nameof(OnCancel), typeof (Command), typeof (FacebookLoginButton));

    }
{% endhighlight %}

This View is exposing the next properties:

- `Permissions` - array of permission to be asked from the FB user account
- `OnSuccess` - a Command that will return the authentication token and execute when the authentication process will complete
- `OnError` - a Command that will return the error description and execute when an exception will be thrown by the authentication process
- `OnCancel` - a Command that will execute when the user will manually cancel the authentication process

Now create a `ViewModel` and set it as a `BindingContext` of you main / root `Page` with a `FacebookLoginButton` on it:


{% highlight csharp %}
public class LoginViewModel {
  public ICommand OnFacebookLoginSuccessCmd { get; }
  public ICommand OnFacebookLoginErrorCmd { get; }
  public ICommand OnFacebookLoginCancelCmd { get; }

  public LoginViewModel() {
    OnFacebookLoginSuccessCmd = new Command<string> ((authToken) => DisplayAlert("Success", $ "Authentication succeed: {authToken}"));
    OnFacebookLoginErrorCmd = new Command<string> ((err) => DisplayAlert("Error", $ "Authentication failed: {err}"));
    OnFacebookLoginCancelCmd = new Command(() => DisplayAlert("Cancel", "Authentication cancelled by the user."));
  }

  void DisplayAlert(string title, string msg) => (Application.Current as App).MainPage.DisplayAlert(title, msg, "OK");
}
{% endhighlight %}

## iOS

1. Add `Xamarin.Facebook.iOS` NuGet package.
2. Add the next lines to your `Info.plist`, replacing `%APP_ID%` by your FB app id:
    ```
    <key\>CFBundleURLTypes</key\> <array>
            <dict>
                <key>CFBundleURLSchemes</key>
                <array>
                    <string>fb**%APP\_ID%**</string>
                </array>
            </dict>
        </array>
        <key>FacebookAppID</key>
        <string>**%APP\_ID%**</string>
        <key>FacebookDisplayName</key>
        <string>XFFBLoginExample</string>
        <key>LSApplicationQueriesSchemes</key>
        <array>
            <string>fbapi</string>
            <string>fb-messenger-share-api</string>
            <string>fbauth2</string>
            <string>fbshareextension</string>
        </array>
    ```
3. Your `AppDelegate.cs` should override the `OpenUrl` method:
{% highlight csharp %}
    public override bool OpenUrl(
        UIApplication application,
        NSUrl url,
        string sourceApplication,
        NSObject annotation) { 
            // We need to handle URLs by passing them to their own OpenUrl in order to make the SSO authentication works. return ApplicationDelegate.SharedInstance.OpenUrl(application, url, sourceApplication, annotation);
    }
{% endhighlight %}
{:start="4"}
4. Create a `FacebookLoginButtonRenderer`:
{% highlight csharp %}
[assembly: ExportRenderer(typeof (FacebookLoginButton), typeof (FacebookLoginButtonRenderer))] namespace YourNamespace.iOS {
public class FacebookLoginButtonRenderer: ViewRenderer {
    bool disposed;

    protected override void OnElementChanged(ElementChangedEventArgs <View> e) {
        base.OnElementChanged(e);
        if (Control == null) {
        var fbLoginBtnView = e.NewElement as FacebookLoginButton;
        var fbLoginbBtnCtrl = new LoginButton {
            LoginBehavior = LoginBehavior.Native, ReadPermissions = fbLoginBtnView.Permissions
        };

        fbLoginbBtnCtrl.Completed += AuthCompleted;
        SetNativeControl(fbLoginbBtnCtrl);
        }
    }

    void AuthCompleted(object sender, LoginButtonCompletedEventArgs args) {
        var view = (this.Element as FacebookLoginButton);
        if (args.Error != null) { // Handle if there was an error
        view.OnError?.Execute(args.Error.ToString());
        } else if (args.Result.IsCancelled) { 
        // Handle if the user cancelled the login request
        view.OnCancel?.Execute(null);
        } else {
        // Handle your successful login
        view.OnSuccess?.Execute(args.Result.Token.TokenString);
        }
    }
    
    protected override void Dispose(bool disposing) {
        if (disposing && !this.disposed) {
            if (this.Control != null) {
                (this.Control as LoginButton).Completed -= AuthCompleted;
                this.Control.Dispose();
            }
            this.disposed = true;
            }
            base.Dispose(disposing);
        }
    }
}
{% endhighlight %}
## Android

1. Add `Xamarin.Facebook.Android` NuGet package.
2. Create a `strings.xml` under Resources/values, don't forget to replace `%APP_ID%` by FB app id & `%APP_NAME%` by your Android  application name:
{% highlight xml %}<?xml version\="1.0" encoding="utf-8"?>
<resources>
    <string name="app\_id"\>%APP\_ID%</string>
    <string name="app\_name"\>%APP\_NAME%</string>
    <string name="fb\_login\_protocol\_scheme"\>fb%APP\_ID%</string>
</resources>{% endhighlight %}
{:start="3"}
3. In your `AndroidManifest.xml` add `Internet` permission.
4. Add the next lines to your `AndroidManifest.xml` inside the ​`application` tag:
{% highlight xml %}<meta-data android:name="com.facebook.sdk.ApplicationId"android:value="@string/app_id" />
    <activity android:name="com.facebook.FacebookActivity"
        android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
        android:label="@string/app_name" />
    <activity android:name="com.facebook.CustomTabActivity" android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="@string/fb_login_protocol_scheme" />
        </intent-filter>
    </activity>{% endhighlight %}
{:start="5"}
5. Add a `CallbackManager`​ to your `MainActivity.cs` and override `OnActivityResult`:
{% highlight csharp %}public static ICallbackManager CallbackManager;
protected override void OnCreate(Bundle bundle) {
    TabLayoutResource = Resource.Layout.Tabbar;
    ToolbarResource = Resource.Layout.Toolbar;
    // Create callback manager using CallbackManagerFactory
    CallbackManager = CallbackManagerFactory.Create();
    base.OnCreate(bundle);
    global::Xamarin.Forms.Forms.Init(this, bundle);
    LoadApplication(new App());
}
    
protected override void OnActivityResult(int requestCode,Result resultCode,Intent data) {
    base.OnActivityResult(requestCode, resultCode, data);
    CallbackManager.OnActivityResult(requestCode, Convert.ToInt32(resultCode), data);
}{% endhighlight %}

- Create a `FacebookLoginButtonRenderer`:
    {% highlight csharp %}
[assembly: ExportRenderer(typeof(FacebookLoginButton), typeof(FacebookLoginButtonRenderer))]
namespace XFFacebookExample.Droid {
    public class FacebookLoginButtonRenderer : ViewRenderer {
        Context ctx;
        bool disposed;
    
        public FacebookLoginButtonRenderer(Context ctx) : base(ctx) {
            this.ctx = ctx;
        }
    
        protected override void OnElementChanged(ElementChangedEventArgs<View> e) {
            if (Control == null) {
                var fbLoginBtnView = e.NewElement as FacebookLoginButton;
                var fbLoginbBtnCtrl = new Xamarin.Facebook.Login.Widget.LoginButton(ctx) {
                    LoginBehavior = LoginBehavior.NativeWithFallback
                };
    
                fbLoginbBtnCtrl.SetReadPermissions(fbLoginBtnView.Permissions);
                fbLoginbBtnCtrl.RegisterCallback(MainActivity.CallbackManager, new MyFacebookCallback(this.Element as FacebookLoginButton));
                SetNativeControl(fbLoginbBtnCtrl);
            }
        }
    
        protected override void Dispose(bool disposing) {
            if (disposing && !this.disposed) {
                if (this.Control != null) {
                    (this.Control as Xamarin.Facebook.Login.Widget.LoginButton).UnregisterCallback(MainActivity.CallbackManager);
                    this.Control.Dispose();
                }
                
                this.disposed = true;
            }
            base.Dispose(disposing);
        }
    
        class MyFacebookCallback : Java.Lang.Object, IFacebookCallback {
            FacebookLoginButton view;

            public MyFacebookCallback(FacebookLoginButton view) { this.view = view; }

            public void OnCancel() => view.OnCancel?.Execute(null);

            public void OnError(FacebookException fbException) => view.OnError?.Execute(fbException.Message);

            public void OnSuccess(Java.Lang.Object result) => view.OnSuccess?.Execute(((LoginResult)result).AccessToken.Token);                     }
} }
{% endhighlight %}
 

## Conclusion

Our abstraction is a simple custom `View` that is rendered on different platforms via custom `Renderer`s. The rendering is pretty straightforward, we create an instance of a  native `FacebookLoginButton` and we listen to platform specific authentication related events to fire our own XF events.

It is a fairly simple solution that demonstrates that you don't have to avoid using Xamarin Native SDKs just because they are not supported out-of-the-box on `Xamarin.Forms`.

The source code is available on [github](https://github.com/yuv4ik/XFFacebookLoginButtonExample).

P.S.: There is a second part, dedicated QA article for this topic that you can find [here](http://evgenyzborovsky.com/2019/09/10/facebook-sdk-qa/). Most popular questions have been answered there.
