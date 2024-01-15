
# Contributing

First off, thank you for considering contributing to Kratos. It's people like you that make the future of Kratos brighter.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## How to contribute
There are many ways to contribute, from writing blog posts (tutorials) or making video content, improving the documentation, submitting bug reports and feature requests or writing code which can be incorporated into Kratos itself.

# Style guide

1. Variables should be in `camelCase`.
2. Functions should be in `camelCase()`.
3. Object keys should be in `snake_case: value`
4. File names should be in `camelCase.js` except classes but you're not allowed to create new classes without discussing it with core team first.

# Responsibilities

* Ensure code follows above listed style-guide
* Make sure to [KISS](https://en.wikipedia.org/wiki/KISS_principle)
* Make sure to follow [StackOverflow's API design best practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
* Make sure code is bug free and properly tested.

## Getting started

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

Steps required:
1. Create your own fork of the code
2. Do the changes in your fork
* follow style guide and read responsibilities above
3. Test the code by creating a test project and [linking to it](https://urre.me/writings/test-local-npm-packages/) (Package name is: @kratosbase/kratos).
4. If code works and is bug-free, submit a PR

##
Beginner Note: If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

## How to suggest a feature
The Kratos philosophy is to provide a system for deploying web APIs as quickly as possible and is largely opinionated. To ensure a high quality and scalable system, a lot of patterns have to be forced like how resources should be routed and consumed.

If you find yourself wishing for a feature that doesn't exist in Kratos, you are probably not alone. There are bound to be others out there with similar needs. Many of the features that Kratos has today have been added because our users saw the need. Open an issue on our issues list on GitHub which describes the feature you would like to see, why you need it, and how it should work.

## Code review process
As long as your code follows the style guide and you carry out your responsibilities as a contributor, your PR will be accepted and merged so long as there are no conflicts.

In the case of conflicts, you might need to rebase or otherwise you should be provided support on how to fix these conflicts.

Happy contributing ✌🏿