# Next Steps Part 2

1. set up the cookie session-middleware
2. change to the POST petition route that was created in part 1 to now put the id of the signature in the cookie
   - you should be able to `console.log(re.session)` and see the id of the signature that was just made
3. change the GET `/petition/signed`route (the thank-you route) to get the user's signautre from the database and render it on screen
   - to render it, you will have to take the signature url and put it in an <img> tag