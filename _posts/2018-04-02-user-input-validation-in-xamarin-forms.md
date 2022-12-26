---
layout: post
title: "User input validation in Xamarin.Forms"
date: "2018-04-02"
categories: [.net,xaml,xamarin-forms]
---
iOS | Android
![](/images/2018-04-02-user-input-validation-in-xamarin-forms/1.png) | ![](/images/2018-04-02-user-input-validation-in-xamarin-forms/2.png)

One of the very common tasks that any mobile developer meets is validation of the user input. It can be an email, password complexity, length, not empty or any other sort of input validation. In this article we will try to find an appropriate light-weight and reusable solution, so let's start!

### Prerequisites

I am using [PropertyChanged.Fody](https://github.com/Fody/PropertyChanged) to reduce the `INotifyPropertyChanged` bloatware related code. Some while ago I wrote [a tiny article about it](https://smellyc0de.wordpress.com/2017/04/06/inotifypropertychange-without-boilerplate-code-in-xamarin-forms/). Beside that, there will be no special requirements, just plain MVVM, C# and Xamarin.Forms.

### The solution

Let's start by introducing a generic interface `IValidationRule<T>`. It has to have a `Validate` method which needs to return a bool and a string property to represent the validation description.
{% highlight csharp %}
public interface IValidationRule<T> {
  string Description { get; }
  bool Validate(T value);
}
{% endhighlight %}
Now let's create a generic class `ValidatableObject<T>`. It should have a collection of `IValidationRule<T>`, bool property to represent the validity of the value, property to represent the value itself, string property to aggregate all the validation descriptions and a constructor that takes all the necessary input.
{% highlight csharp %}
public class ValidatableObject<T> : BaseViewModel {
  // Collection of validation rules to apply
  public List<IValidationRule<T>> Validations { get; } = new List<IValidationRule<T>>();
  // The value itself
  public T Value { get; set; }
  // PropertyChanged.Fody will call this method on Value change
  void OnValueChanged() => propertyChangedCallback?.Invoke();
  readonly Action propertyChangedCallback;
 
  public ValidatableObject(Action propertyChangedCallback = null, params IValidationRule<T>[] validations) {
    this.propertyChangedCallback = propertyChangedCallback;
    foreach (var val in validations)
      Validations.Add(val);
  }

  // PropertyChanged.Fody attribute, on Value change IsValid will change as well
  [DependsOn(nameof(Value))]
  public bool IsValid => Validations.TrueForAll(v => v.Validate(Value));

  // Validation descriptions aggregator
  public string ValidationDescriptions => string.Join(Environment.NewLine, Validations.Select(v => v.Description)); }
{% endhighlight %}
The code above might be unclear for you if you are not familiar with `Fody`. For example usage of  [OnValueChanged()](https://github.com/Fody/PropertyChanged/wiki/On_PropertyName_Changed) and usage of [DependsOn](https://github.com/Fody/PropertyChanged/wiki/Attributes#dependsonattribute) attribute, luckily the official documentation nicely explains both of them. I also introduced an optional `Action propertyChangedCallback` which might be useful in case you want to change the button state right after the value change or take some extra action.

### Example
{% highlight csharp %}
public class PasswordValidator : IValidationRule<string> {
  const int minLength = 6;
  public string Description => $"Password should be at least {minLength} characters long.";
  public bool Validate(string value) => !string.IsNullOrEmpty(value) && value.Length >= minLength; }
{% endhighlight %}
The implementation above takes a string as an input, validates that the string is not null or empty and ensures that the string length is equal or greater than 6.
{% highlight csharp %}
public class EmailValidator : IValidationRule<string> {
  const string pattern = @”^(?!\.)(“”([^””\r\\]|\\[“”\r\\])*””|” + @”([-a-z0-9!#$%&’*+/=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)” + @”@[a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]$”;
  public string Description => "Please enter a valid email.";
  public bool Validate(string value) { 
    if (string.IsNullOrEmpty(value)) return false;
    var regex = new Regex(pattern, RegexOptions.IgnoreCase);
    return regex.IsMatch(value);
  }
}
{% endhighlight %}
The implementation above takes a string as an input, validates that the string is not null or empty and ensures that the string represents a valid email address format.

Now lets take a look on a simplified `LoginViewModel` that has two `ValidatableObject`s: Email and Password.
{% highlight csharp %}
public class LoginViewModel : BaseViewModel {
  public ValidatableObject<string> Email { get; }
  public ValidatableObject<string> Password { get; }
  public ICommand LoginCmd { get; }
  Action propChangedCallBack => (LoginCmd as Command).ChangeCanExecute;

  public LoginViewModel() {
    LoginCmd = new Command(async () => await Login(), () => Email.IsValid && Password.IsValid && !IsBusy);
    Email = new ValidatableObject<string>(propChangedCallBack, new EmailValidator());
    Password = new ValidatableObject<string>(propChangedCallBack, new PasswordValidator());
    async Task Login() => { /\* Login logic \*/ };
}
{% endhighlight %}
`LoginCmd` will automatically set the button state to enabled / disabled according to validity of the user input. Preceding is done by triggering `ChangeCanExecute` every time the value of the `ValidatableObject` is changed.

There is one more thing to demonstrate before switching to `XAML` and it is our very simple `BaseViewModel`:
{% highlight csharp %}
\* PropertyChanged.Fody will take care of the boiler plate code related to INotifyPropertyChanged */
public abstract class BaseViewModel : INotifyPropertyChanged {
  public event PropertyChangedEventHandler PropertyChanged;
  // Indicates that the ViewModel is busy
  public bool IsBusy { get; protected set; } }
{% endhighlight %}
Now let's take a look on our `LoginPage`:
{% highlight xml %}
<ContentPage
    xmlns=“http://xamarin.com/schemas/2014/forms“
    xmlns:x=“http://schemas.microsoft.com/winfx/2009/xaml“
    xmlns:converters=“clr-namespace:XFFirebaseAuthExample.Converters“
    x:Class=“XFFirebaseAuthExample.Views.LoginPage“>
    <ContentPage.Resources>
        <ResourceDictionary>
            <converters:InvertBooleanConverter x:Key=“invertBooleanConverter“ />
            <Style TargetType=“Label“ x:Key=“errorDescriptionStyle“>
                <Setter Property=“TextColor“ Value=“Red“ />
                <Setter Property=“FontSize“ Value=“Small“ />
                <Setter Property=“HorizontalTextAlignment“ Value=“Center“ />
            </Style>
        </ResourceDictionary>
    </ContentPage.Resources>
    <StackLayout
        Orientation=“Vertical“
        Padding=“25“
        VerticalOptions=“Center“>
        <Label
            Style=“{StaticResource errorDescriptionStyle}“
            Text=“{Binding Email.ValidationDescriptions}“
            IsVisible=“{Binding Email.IsValid, Converter={StaticResource invertBooleanConverter}}“ />
        <Entry
            Placeholder=“Email“
            Text=“{Binding Email.Value}“>
            <Entry.Triggers>
                <DataTrigger 
                    TargetType=“Entry“
                    Binding=“{Binding Email.IsValid}“
                    Value=“False“>
                    <Setter Property=“TextColor“ Value=“Red“ />
                </DataTrigger>
            </Entry.Triggers>
        </Entry>
        <Label
            Style=“{StaticResource errorDescriptionStyle}“
            Text=“{Binding Password.ValidationDescriptions}“
            IsVisible=“{Binding Password.IsValid, Converter={StaticResource invertBooleanConverter}}“ />
        <Entry
            IsPassword=“true“
            Placeholder=“Password“
            Text=“{Binding Password.Value}“ />
        <Button
            Text=“Login“
            Command=“{Binding LoginCmd}“ />
        <ActivityIndicator
            IsVisible=“{Binding IsBusy}“
            IsRunning=“{Binding IsBusy}“ />
    </StackLayout>
</ContentPage>
{% endhighlight %}
We use `InvertBooleanConverter` to hide / display the validation error descriptions by binding to `IsValid` properties of our `ValidatableObject`s. We also use `DataTrigger`s to set the `TextColor` property of `Entry` to red if the input is not valid. Rather then that, there is nothing extraordinary in the `XAML` above.

The full example is available on [github](https://github.com/yuv4ik/XFFirebaseAuthExample).

### Conclusion

User input validation is rather fun than hard. The proposed solution nicely encapsulates the validation logic and can be easily covered by unit tests. One `ValidatableObject` can have multiple `IValidationRule`s and you can easily decide yourself how to reflect the validity of the input on the UI layer.

P.S. There is a great article on the same topic by David Britch published on [blog.xamarin.com](https://blog.xamarin.com/validation-xamarin-forms-enterprise-apps/). In fact my solution is inspired by [Enterprise Application Patterns using Xamarin.Forms](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/) a free eBook that I highly recommend for reading!
