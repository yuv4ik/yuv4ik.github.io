---
layout: post
title: "Archiving your code"
date: "2018-05-03"
categories: [.net,git,xamarin-forms]
---
![](/images/2018-05-03-archiving-your-code/1.png)

## Intro

Title of this blog post may sound very weird in 2018 while github / vsts / bitbucket are still up and running. However, it still seems to be very common to archive your solution and upload it to cloud or send it by email. Don't ask me why, it is just still there.

The most painful and annoying mistake you can make is to include dependencies that can be easily downloaded or compiled code. Painful because it may significantly increase the size of the archive and annoying because you may have to download it for hours because of it.

## The problem in numbers

Blank .NET Standard 2.0 Xamarin.Forms application targeting Android and iOS with latest and greatest NuGet packages is about ±280MB and ±100MB zipped. However, after removing the \\packages, \\bin & \\obj directories, solution size decreases to ±380KB and ±50KB zipped. That's a huge difference!

## Solutions

### Zip

The easiest way to archive a solution the right way is by using the next command:

> zip -r ../test.zip . -x packages/\\\* \*/bin/\\\* \*/obj/\\\* \*.git/\\\* \*.vs/\\\*

Please note that this is a simple MacOS command to create a zip archive with recurse into directories (-r) which will generate a `test.zip` based on current directory (.) excluding (-x) the next directories packages, bin, obj, .git and .vs.

### Git

The alternative and preferred way to create an archive would be using `git` that will respect the `.gitignore` file. If you are new to `git`, `.gitignore` is a list that describes files and folders that should not be a part of your repository, more information can be found [here](https://git-scm.com/docs/gitignore) and there is an example given [here](https://www.gitignore.io/api/visualstudio).

Let's take a look on the `git` command:

> git archive --format zip --output myrepo.zip  my\_lovely\_branch

`git` is much cleaner compare to pure `zip` command. There is no need to specify the exclude filter manually since `.gitignore` is in use. You can specify a commit or branch to be archived and etc. More information can be found [here](https://git-scm.com/docs/git-archive).

Keep in mind that you need to have at least one commit in order to use this solution.

## Summary

Your solution repo / archive should contain only the essential bits and bytes. If it contains inessentials, it doesn't look professional and you better get familiar with best practises.

P.S.: I created an open source add-in for VS for Mac that include the solutions above. You can find it [here](https://github.com/yuv4ik/vsmac-archiver).
