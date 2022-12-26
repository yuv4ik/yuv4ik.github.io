---
layout: post
title: "Immutable Models in MVVM"
date: "2018-05-16"
categories: [.net,c#,entity-framework,mvvm,sqlite,visual-studio,xamarin-forms]
---

![](/images/2018-05-16-immutable-models-in-mvvm/1.jpg)
###### Source: flickr/ Jeff Attaway

## <span style="color:red">M</span>VVM

The first `M` stands for Model - an implementation of the application's domain model that includes a data model along with business and validation logic. Examples of model objects include repositories, business objects, data transfer objects (DTOs), Plain Old CLR Objects (POCOs), and generated entity and proxy objects.

[definition source](https://msdn.microsoft.com/en-us/library/hh848246.aspx?f=255&MSPPError=-2147217396)

## Immutability

In object-oriented and functional programming, an immutable object(unchangeable object) is an object whose state cannot be modified after it is created. This is in contrast to a mutable object (changeable object), which can be modified after it is created.

[definition source](https://en.wikipedia.org/wiki/Immutable_object)

## Why bother?

Imagine the next simple situation, your application downloads a JSON,  deserialises it to an object and then presents the downloaded data. You would expect the downloaded data to be one-to-one to the data on the remote server, however the data can be accidentally or intentionally mutated.

Here is an example of a mutable `Model`:
{% highlight csharp %}
public class MyMutableObject
{
    public long Id { get; set; }
    public string Title { get; set; }
    public List<string> Contents { get; set; }
}
{% endhighlight %}
All the properties has public setters which means that any of those can be changed after the object creation. Even if we make all the setters private, it could be still possible to manipulate data within the `List`.

Here is an example of immutable `Model`:
{% highlight csharp %}
public sealed class MyImmutableObject
{
    public long Id { get; }
    public string Title { get; }
    public IReadOnlyCollection<string> Contents { get; }
    public MyImmutableObject(
        long id,
        string title,
        IReadOnlyCollection<string> contents)
    {
        Id = id;
        Title = title;
        Contents = contents;
    }
}
{% endhighlight %}
There are no public setters available and mutable collection type is replaced by "immutable" one. There is no option to extend this class as well as changing the data after the object is created.

> Note: IReadOnlyCollection is not a real immutable collection but an immutable facade. It is not thread safe and possible to cast to IList and try to manipulate the collection, however System.NotSupportedException will be thrown.

Alternatively we can add a `System.Collections.Immutable` NuGet package and replace `IReadOnlyCollection<T>` by `IImmutableList<T>` if we want a real immutable collection.

## JSON Deserialization

Often `Models` used for deserialization and it can be tricky to deserialize JSON to immutable object. Luckily with [Json.NET](https://github.com/JamesNK/Newtonsoft.Json) it is not an issue. We can easily serialize and deserialize `MyImmutableObject`:
{% highlight csharp %}
var myImmutableObject = new MyImmutableObject(
        id: 1,
        title: “Test”,
        contents: new List<string> { “One”, “Two”, “Three” });
var json = JsonConvert.SerializeObject(myImmutableObject);
var deserializedObject = JsonConvert.DeserializeObject<MyImmutableObject>(json);
{% endhighlight %}
Please note that if your `Model` has more than one constructor you will need to mark  one for deserialization explicitly,  by adding a `JsonConstructor` [attribute](http://james.newtonking.com/projects/json/help/html/T_Newtonsoft_Json_JsonConstructorAttribute.htm).

## ORM

With .NET Standard we can use EntityFramework Core in our Xamarin.Forms applications which is great! And it is great twice since we can have a code first  immutable model fully supported by EF.

Example:
{% highlight csharp %}
[Table(“ToDo”)]
public sealed class ToDoModel
{
    [Key]
    public int Id { get; private set; }
    public string Title { get; private set; }
    public string Notes { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    ToDoModel() { /* EF requires a parameterless constructor. */ }

    public ToDoModel(
        int id,
        string title,
        string notes,
        DateTimeOffset createdAt,
        DateTimeOffset? updatedAt)
    {
        Id = id;
        Title = title;
        Notes = notes;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }      
}
{% endhighlight %}
When using an "immutable" `Model` with EF keep in mind:

- Parameterless constructor - is required, should be private.
- Setters - are required, should private.
- Object tracking - should be disabled.

> Notes:
> 
> - [SQLite.NET](https://www.nuget.org/packages/sqlite-net-pcl/) did not work properly with private constructor and setters.
> - We have to count with private setters since it is still possible to change a value with a private setter within the same class.

## Conclusion

In this blogpost we discussed how to make immutable `Models` and checked few common scenarios. I would recommend to start immutable and change to mutable if necessary. Here are few recommendations to keep in mind:

- Forget about private setters: prop -> propg
- Make publicly available properties readonly
- Use constructors
- Seal classes
- Use [immutable collections](https://www.nuget.org/packages/System.Collections.Immutable/) or at least `[IReadOnlyCollection<T>](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ireadonlycollection-1?view=netstandard-2.0)`
- The goal is not to get 100% immutability but to improve code quality

Immutability is a very interesting topic which has pros and cons. For example it may harm performance or introduce unnecessary complexity in some cases, so use it wisely. There are few great resources that I would recommend to get familiar with:

- [Immutability in C# Part One: Kinds of Immutability](https://blogs.msdn.microsoft.com/ericlippert/2007/11/13/immutability-in-c-part-one-kinds-of-immutability/) by Eric Lippert
- [.NET Framework - Immutable Collections](https://msdn.microsoft.com/en-us/magazine/mt795189.aspx?f=255&MSPPError=-2147217396) by Hadi Brais
- [The changing state of immutability C#](https://www.youtube.com/watch?v=O89-zG84QK4) by Jon Skeet (video)
