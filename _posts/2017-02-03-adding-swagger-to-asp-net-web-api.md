---
title: "Adding swagger to ASP.NET Web.Api"
date: "2017-02-03"
categories: 
  - "net"
  - "asp-net"
  - "owin"
  - "swagger"
  - "web-api-2"
---

  

Sounds easy right? But it turn to be very confusing. When I first tried to integrate [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle) I met few problems:

1. Auto generated documentation totally ignored existing and working API endpoints (methods in ApiControllers). So it was totally empty.
2. After solving the first issue I realised that "/Token" endpoint is still not listed.
3. Had to find a way to pass a bearer token with each request swagger generated for me.

So let's start solving those problems one by one.

First we have to install Swashbuckle nuget package: _Install-Package Swashbuckle_

That should generate _SwaggerConfig.cs_ under _App\_Start_ folder:

  

![swashbuckle swagger](/images/2017-02-03-adding-swagger-to-asp-net-web-api/1.jpg)![swashbuckle swagger](/images/2017-02-03-adding-swagger-to-asp-net-web-api/2.jpg)![swashbuckle swagger](/images/2017-02-03-adding-swagger-to-asp-net-web-api/3.jpg)![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/4.jpg)![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/5.jpg)![](/images/2017-02-03-adding-swagger-to-asp-net-web-api/6.jpg)

  
Good luck!  
  
P.S.: You can get the file from [GitHub Gist](https://gist.github.com/yuv4ik/8e41b47d3ad3d54827cac0808cf19e98)
