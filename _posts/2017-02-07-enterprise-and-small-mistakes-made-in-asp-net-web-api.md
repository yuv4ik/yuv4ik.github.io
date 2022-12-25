---
title: "Enterprise and small mistakes made in ASP.NET Web.API"
date: "2017-02-07"
categories: 
  - "net"
  - "asp-net"
  - "smelly-code"
  - "web-api-2"
---

![](/images/2017-02-07-enterprise-and-small-mistakes-made-in-asp-net-web-api/mistakes-are-proof-trying_daily-inspiration-3-300x300.jpg)

  

### Short Intro

#### "The only real mistake is the one from which we learn nothing." - Henry Ford

It is important to share our experience to help others avoid stepping into the same bucket.  
  
It was an enterprise distributed project with a small group of developers. Each developer had a different part of the solution to develop and at some point, all of us concentrated on the backend.  
  

### The Story

So here is a list of mistakes we made:

**Security**:

- In some (bad designed) case authentication tokens were sent in a query string as a part of the URL. Please don't try it at home, it's like sharing your username and password with the world. Anyone who will get the URL will be able to access the protected resources.

**Caching**:

- In memory caching for distributed solution - that might work if you manage to sync the in-memory caches between different nodes, but that was not our case. If you would like to get a bit more information about different caching options please check [here](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/memory) and [here](https://medium.com/systems-architectures/distributed-caching-woes-cache-invalidation-c3d389198af3#.elcnvp89w).
- Complicated, bad organised and annoying caching system - in most cases we had a lot of dependent cache but in order to clean the dependent cache, we had to write a lot of boilerplate code. However, upon [Insert](https://msdn.microsoft.com/en-us/library/ddz98ewz(v=vs.110).aspx), we could add [CacheDependency](https://msdn.microsoft.com/en-us/library/system.web.caching.cachedependency(v=vs.110).aspx) to simplify the solution for example.

**Database:**

- We used EntityFramework to work without MSSQL database - but most of our developers were not familiar with "[Performance Considerations for EF 4, 5, and 6](https://msdn.microsoft.com/en-us/data/hh949853)". This led us to quite slow queries without cached query plans and etc.
- We ended up with a lot of copy-paste queries - a violation of [DRY principle](https://en.wikipedia.org/wiki/Don't_repeat_yourself).
- We had to write a lot of boilerplate code on each request - DTO -> SQL Query -> Entity -> DTO. One of the possible solutions here would be to use [Automapper](http://automapper.org/).

**API:**

- A mix of RESTful and RPC.
- Almost RESTful - where POSTs used to return data (query).

**Conflict of interests:**

- Our backend was written in C# and front-end in javascript - we ended up with lowercase property names in our C# DTOs. Well, it's due to different naming conventions but why not use the next [solution](http://odetocode.com/blogs/scott/archive/2013/03/25/asp-net-webapi-tip-3-camelcasing-json.aspx) and let all of the devs be happy?

**General:**

- SOLID principles were totally ignored.
- 0 automated tests.
- DRY principles violated.

### Conclusion

At some point, as you can imagine we had to refactor a lot of code, the problem, as usual, was that we had to do it after release because we didn't have any automated tests it was quite risky and hard to achieve. The good news is that we managed to improve the code quality, maintainability and scalability by making baby steps re-factoring and the most important thing is that we managed to deliver a working solution on time. This story ends up well but if we had a good code base from the begging we would be happier and stress less.

  

Happy coding!

  

P.S.: Don't judge your colleagues, share your knowledge, thoughts and experience to improve the world.
