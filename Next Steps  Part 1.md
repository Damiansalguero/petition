### Next steps for petition part 1:

1. ~~**Create the templates** you need for petition, thank-you page, and signers page.~~
   - make it so the user can navigate to:
     -  the /petition route and see the petition template; 
     

  

![1557760287802](/home/damian/.config/Typora/typora-user-images/1557760287802.png)

- the /petition/signed route to see the thank-you template; ![1557760404480](/home/damian/.config/Typora/typora-user-images/1557760404480.png)

- and the /petition/signers to see the signers template
  server routes we'll need:

 ![1557760454575](/home/damian/.config/Typora/typora-user-images/1557760454575.png)

1. ~~**GET /petition**~~
   - renders petition template (the one with input fields and the canvas element)
2. ~~**POST /petition**~~
   - runs when the user enters a first name, last name, and signs the canvas element, and then clicks the "submit" button
3. ~~**GET /petition/signed**~~ 
   - renders the thank-you template. That's it!
4. **GET /petition/signers** 
- ~~renders the signers template~~ 
   ~~handlebars templates etc that we'll need:~~
- ~~petition template (that's the one with the input fields and canvas)~~
  
  - <form> tag, <input> for first name, <input> for last name, <input> signature (this input field will be HIDDEN), and canvas  
    - we will need front-end JS code to: (1) allowed user to MOUSEDOWN on canvas: (2) allow user to MOUSEMOVE on canvas, and draw a line as user mouse moves, and (3) allow user to MOUSEUP to stop drawing on the canvas
    - what's up with the hidden input field??? when the user signs the petition, we need to convert the canvas drawing into a url that can be inserted into our table. That url should be assigned as the value of the hidden input field when the user finishes signing the petition. 
      - We do this so that when the "submit" button is clicked and the POST request is made, the values of the first, last, and hidden input fields are sent to the server 
  - ~~we need a <form> tag because form tags will make POST requests to our servers when the user clicks the "submit" button~~
- ~~thank-you template (that's the one that just says, "Thanks for signining!" along with the # of signers, and a link to the signers page)~~
- ~~signers template (that's the one that lists everyone who's signed the petition so far)~~
- ~~layout (our link to CSS, front-end JS will go here)~~
- ~~INSERT INTO signatures~~

  - ~~should be invoked when the user signs the petition (so the user gives us their first, last, and signature)~~
- SELECT the names of the signers 
  
  - this query should run when the user goes to the /petition/signers 
- (optional) SELECT query to get the number of signers 
  
  - this query should run when the user goes to the /petition/signed page (the "Thank-you" page)



