I was intrigued when I first heard about testing software. I always liked to see the result of my work and at the same time make sure everything was working correctly. The idea that we could make that a process, or even better, an automated process, made me want to learn more. I loved that I could automatically test all the things I wanted my software to do, until I noticed how much more code I would have to write to get there.

Some people say writing tests is hard. I think that writing good tests is hard, harder than writing good software. I agree with that because to write good tests you have to start with good code. Which means that you have to write good code so that you can write good tests. Another thing that makes testing hard are the many dimensions that are involved when testing. If you go to the “Software Testing” page in Wikipedia you're going to see an infinite amount of combinations between the three different dimensions: levels, types and method.

In this blog post I'm going to talk a bit about what are these three dimensions, how they relate to each other and based on what your goals are, what you should be testing and what data you should pay more attention to.

<!-- more -->

To make testing easier, before you start writing your tests, you have to think about what you're trying to get from them. Are you testing a complex algorithm to make sure you got all your use cases right? Are you trying to make sure that if you change something, nothing else breaks? Are you trying to increase your code coverage so that you have tests that exercise every single line of code? Are you trying to write tests so that if any line of code changes, at least one test breaks? There are many ways to write tests and you have to find the one that works better for your team and company.

## Dimensions

To help answer these questions it's useful to understand the levers that you can move.

### Levels

The level that you test defines how much of the code will be affected by each test. You can write unit tests to test a method in a class, or you can write an acceptance test to test a group of screens or APIs in your app.

If you have an old code base with lots of code and functionality already in production, higher level tests will give you more coverage and better protection against change. For example, if you add acceptance tests for all the major, high priority functionality.
