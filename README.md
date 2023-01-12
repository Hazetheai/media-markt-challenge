# Media Markt Challenge

### Overview

> This scenario is meant to test your every capability in programming modern day applications. Specifically, we want you to build a frontend for a GraphQL API. The result of your little scenario is then presented by you in person.

> We want you to build a frontend for the GitHub GraphQL API. The frontend should allow to browse the issues of a GitHub repository, specifically of the official React repository. You will build a little search which allows to search for a text term in either the body or title of the issues as well as for the status OPEN or CLOSED. After listing these issues, a user should be able to view a single issue and all the comments. Please ensure that sufficient queries of users are faster than initial requests with a reasonable caching strategy.

> Every important aspect of the application shall be tested. Rules to programming style apply as usual and documentation shall be down to a minimum. Your application should be able to handle wrong input by the user or any unusual behavior.

> For this scenario we expect you to deliver a high quality web application. Your code should be typed using either Typescript or Flow. Furthermore, we expect you to use all available ES6+ features, including Async programming style. Your implementation is based on React with a structured state management using Redux and a sensible routing strategy. Alternatively, you may apply Apollo and appropriate client side state management.

## Process

1. Understand brief and derive logical steps
2. Find & research appropriate documentation if necessary
3. Set up environment
4. Build boilerplate
5. Assess steps needed for MVP
6. Build
7. Align features with brief if out of sync
8. Fix>Test>Align
9. Document process

## Result

#### Successful

- Use Redux
- Use Static Typing
- Use ES6
- Implement caching strategy
- Browse React Repo Issues
- Paginate forward through results
- Filter by issue status
- filter by a search term

#### Areas for improvement

- Caching is not persistent when switching routes
- Queries for multiple repos overlap
- Pagination only works going forward, & changing filters breaks it
- Selectors for derived data (number of issues etc.)
- Styling
- Layout could use more of the provided data (comment reactions etc.)
- Structure: Better separation of concerns

#### Unsuccessful

- Implement automated testing
- pagination for comments
- Handle incorrect input / unusual behaviour
