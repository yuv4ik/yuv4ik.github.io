---
layout: post
title: "Using Swagger to automatically generate the client code"
date: "2018-03-08"
categories: [xamarin-forms,swagger,asp-net-core-web-api]
---
[Swagger](https://swagger.io/) is a very powerful tool that I highly recommend to integrate into your API projects. It will simplify and speed-up both the development and QA processes. This tutorial is going to demonstrate that. Just keep reading.

For this tutorial I assume that you should have a basic understanding of ASP.NET Core Web API and Xamarin.Forms. If you want to follow this tutorial while checking the source code you are welcome to clone this [tutorial's repo](https://github.com/yuv4ik/XFBlogExample).

In this post we will create a simple ASP.NET Core API with Swagger, we will generate the API consumer code using [NSwag](https://github.com/RSuter/NSwag) and finally we will integrate it to our Xamarin.Forms application.

Let's start with the API. Add a new ASP.NET Core Web API project: ![](/images/2018-03-08-using-swagger-to-automatically-generate-the-client-code/1.png)

Now we will take care of our Android emulator and iOS simulator by explicitly setting the API URL (more details can be found in my [previous post]({{ site.baseurl }}{% post_url 2018-03-03-how-to-access-localhost-from-android-emulator-and-ios-simulator %}):

{% highlight csharp %}
public static IWebHost BuildWebHost(string[] args) =>
  WebHost.CreateDefaultBuilder(args)
  .UseStartup<Startup>()
  .UseUrls("http://127.0.0.1:5000" )
  .Build();
{% endhighlight %}

I though that it might be easier to follow this tutorial if we will use a real world example, so I decided that our API will serve a blog. Lets create a model: 

{% highlight csharp %}
public class BlogPost { 
  public int Id { get; set; }
  public string Title { get; set; }
  public string Description { get; set; }
  public string\[\] Tags { get; set; }
  public DateTimeOffset CreatedAt { get; set; }
  public DateTimeOffset? UpdatedAt { get; set; }
  public DateTimeOffset? DeletedAt { get; set; }
}
{% endhighlight %}

Next step is to create a controller to expose few simple endpoints: 
{% highlight csharp %}
[Route("api/[controller]")]
public class BlogController : Controller {
  static List<BlogPost> dataSource = new List<BlogPost>();

    [HttpPost]
    ProducesResponseType(typeof(BlogPost), 201)]
    [ProducesResponseType(typeof(BlogPost), 400)]
    public IActionResult Add([FromBody]BlogPost post) {
      post.Id = dataSource.Count + 1;
      dataSource.Add(post);
      return Created($"/blog/{post.Id}", post);
    }

    [HttpGet("{id:int}", Name = "GetBlogPostById")]
    [ProducesResponseType(typeof(BlogPost), 200)]
    [ProducesResponseType(typeof(BlogPost), 404)]
    public IActionResult Get(int id) {
      var blogPost = dataSource.ElementAtOrDefault(id \- 1);
      if (blogPost == null)
        return NotFound();
          return Ok(blogPost);
    }

    [HttpGet][ProducesResponseType(typeof(List<BlogPost>), 200)]
    public IActionResult List() => Ok(dataSource);
}
{% endhighlight %}

* Please note that the code is simplified and in real world you would use a database instead of a static List.

As you see we created 3 API endpoints:
1. `/api/blog/add` - POST method that accepts a new BlogPost
2. `/api/blog` - GET method that returns a list of all the BlogPosts
3. `/api/blog/id` - GET method that returns a specific BlogPost by id

Last step on the API side is to integrate Swagger. We will have to add a NuGet package `Swashbuckle.AspNetCore\ and add few lines of code in our Startup.cs:
{% highlight csharp %}
// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services) {
  services.AddMvc();
  services.AddSwaggerGen(c => { 
    c.SwaggerDoc(
      "v1",
      new Swashbuckle.AspNetCore.Swagger.Info { Title = "Blog API", Version = "v1" });
    });
  }

// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
  if (env.IsDevelopment()) {
    app.UseDeveloperExceptionPage();
  }
  app.UseSwagger();
  app.UseSwaggerUI(c => { 
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Blog API V1");
    }); 
    app.UseMvc();
}
{% endhighlight %}

At this point you should be able to navigate to http://localhost:5000/swagger to see the next picture: ![](/images/2018-03-08-using-swagger-to-automatically-generate-the-client-code/2.png)

Now to the most interesting part of this tutorial. What if I tell you that we don't have to write a single line of code in order to consume our API? That can be easily achieved using third party libraries like [NSwag](https://github.com/RSuter/NSwag). Since I am an OSX user I will show how to do it on Mac.

In order to generate the consumer code we need to download a document that describes our blogging API. It can be found on the next url:

> http://localhost:5000/swagger/v1/swagger.json

Now lets clone [NSwag](https://github.com/RSuter/NSwag) repo locally and execute the next command:

> dotnet dotnet-nswag.dll swagger2csclient /input:swagger.json /classname:BlogService /namespace:BlogReader /output:BlogService.cs

The output of this command will be an auto generated [BlogService.cs](https://raw.githubusercontent.com/yuv4ik/XFBlogExample/master/BlogReader/BlogService.cs) that will cover all the API endpoints:
{% highlight csharp %}
ApiBlogGetAsync()
ApiBlogPostAsync(BlogPost post)
ApiBlogByIdGetAsync(int id)
{% endhighlight %}
In order to use BlogService.cs we will have to add a NuGet package `Newtonsoft.Json` and initialize it with a baseUrl:
{% highlight csharp %}
if (Device.RuntimePlatform \== Device.iOS)
  BlogClient = new BlogService("http://localhost:5000/" );
else if (Device.RuntimePlatform == Device.Android)
  BlogClient = new BlogService("http://10.0.2.2:5000/" );
else
  throw new NotSupportedException($"{Device.RuntimePlatform} is not supported.");
{% endhighlight %}

The consumption is pretty straightforward:

{% highlight csharp %}
// To post a new blogpost
await blogClient.ApiBlogPostAsync(new BlogPost{ Title = Title, Description = Description});

// To get all the blogposts
await blogClient.ApiBlogGetAsync();
{% endhighlight %}
Just keep in mind that this technique might be good for prototypes and POCs. In production you may want to implement your own BlogService, however, autogenerated code can give you a good starting point.

As I mentioned earlier the source code can be found on [github](https://github.com/yuv4ik/XFBlogExample).
