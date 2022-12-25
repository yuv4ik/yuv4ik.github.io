---
layout: post
title: "Adding swagger to ASP.NET Web.Api"
date: "2017-02-03"
categories: [net,asp-net,owin,swagger,web-api-2]
---
Sounds easy right? But it turn to be very confusing. When I first tried to integrate [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle) I met few problems:

1. Auto generated documentation totally ignored existing and working API endpoints (methods in ApiControllers). So it was totally empty.
2. After solving the first issue I realised that "/Token" endpoint is still not listed.
3. Had to find a way to pass a bearer token with each request swagger generated for me.

So let's start solving those problems one by one.

First we have to install Swashbuckle nuget package: _Install-Package Swashbuckle_

That should generate _SwaggerConfig.cs_ under _App\_Start_ folder:

![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/1.jpg)

To solve problem **#1** we need to use the right HttpConfiguration:

1. Remove _\[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")\]_ from _SwaggerConfig.cs__._ We will register it manually. 
2. Change the signature of _Register_ method to _public static void Register(HttpConfiguration httpConfig)__._ This will allow us to pass the right _HttpConfiguration_.
3. Change _GlobalConfiguration.Configuration_ to httpConfig.EnableSwagger.  This will allow us to use the right HttpConfiguration upon the registration_._

![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/2.jpg)

Now we have to manually register our swagger, for that we just have to add one additional line to _Startup.cs__;_  

![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/3.jpg)

At this point all our API endpoints should be visible if you navigate to _http://yourapi:port/swagger_

To solve problem number #2 we have to manually define documentation for our /Token endpoint by creating a _AuthTokenDocumentFilter.cs_ ([source](http://stackoverflow.com/a/32325951)):
{% highlight csharp %}
public class AuthTokenDocumentFilter : IDocumentFilter  
    {  
        public void Apply(SwaggerDocument swaggerDoc, SchemaRegistry schemaRegistry, IApiExplorer apiExplorer)  
        {  
            swaggerDoc.paths.Add("/token", new PathItem  
            {  
                post = new Operation  
                {  
                    tags = new List { "Auth" },  
                    consumes = new List  
                {  
                    "application/x-www-form-urlencoded"  
                },  
                    parameters = new List {  
                    new Parameter  
                    {  
                        type = "string",  
                        name = "grant\_type",  
                        required = true,  
                        @in = "formData",  
                        @default = "password"  
                    },  
                    new Parameter  
                    {  
                        type = "string",  
                        name = "username",  
                        required = false,  
                        @in = "formData"  
                    },  
                    new Parameter  
                    {  
                        type = "string",  
                        name = "password",  
                        required = false,  
                        @in = "formData"  
                    }  
                }  
                }  
            });  
        }
{% endhighlight %}
The next step will be to add _AuthTokenDocumentFilter_ to our swagger configuration:

![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/4.jpg)

At this point "Auth" endpoint will become visible at _http://yourapi:port/swagger_  
  
To solve problem number #3 we have to make few small changes in _SwaggerConfig.cs._  
Add the next line inside EnableSwagger section:  
{% highlight csharp %}
c.ApiKey("Token")  
 .Description("Bearer token")  
 .Name("Authorization")  
 .In("header"); 
 {% endhighlight %}

Inside EnableSwaggerUi section add the next line:  
{% highlight csharp %}
c.EnableApiKeySupport("Authorization", "header");  
{% endhighlight %}
![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/5.jpg)

Now in order to get a bearer token you can use swagger and if you want to use the retrieved token in all calls simply add it near the "Explore" button:  

![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/6.jpg)

Good luck!  
  
P.S.: You can get the file from [GitHub Gist](https://gist.github.com/yuv4ik/8e41b47d3ad3d54827cac0808cf19e98)