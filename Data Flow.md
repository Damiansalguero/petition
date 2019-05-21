



### Register

- ~~hashed password~~
- ~~cookies~~
- ~~redirect~~
- register several people and sign does not work
- error handle

### Login 

-  ~~password check~~
  - ~~take email from body~~
  - c~~ompare with `users  `  table and get back the hashed PW~~
    - ~~call `checkPassword` function from `bc.js` to check password entered in input field with hash from db~~
  - ~~write query the SELECTS PW~~
  - login takes to petition even though signed

### Petition

- ~~change table~~
- ~~change~~ form

### Profile

#### First time 

- ~~optional fields in form~~
- ~~POST request to `users_profile `  table~~
  - ~~update `users_profile `  table~~
  - ~~write `query`  in `db.js `~~ 
  - ~~This table will need columns for **id (primary key)**, **user id (foreign key)**, age, city, and url.~~

#### Edit

- ~~two queries~~

  - ~~one thats affects  `users`  table and another for `user_profiles`  table.~~

  - ~~`users` table use `UPDATE`~~ 

    - ~~determine whether the query should update the password column or not~~
    - ~~If the user did not submit a new password, the query should not update the password~~
    - ~~password doesnt work~~
  
- `~~~~user_profiles`  table `UPSERT `  (insert a row if one does not already exist and update it if it does)~~~~
  
  - ~~In the following example, if no row exists with the name 'Penélepe Cruz', one will be created. If one does exist, the existing row will have its age and oscars column updated. For this to work, the name column must have a unique constraint on it.~~
  
    - ```sql
      INSERT INTO actors (name, age, oscars)
      VALUES ('Penélope Cruz', 43, 1)
      ON CONFLICT (name)
      DO UPDATE SET age = 43, oscars = 1;
      ```

#### Unsign 

- use `POST` 
- After unsigning, logged in users should be redirected to the page on which they can sign the petition.

### ~~Logout~~

- ~~navbar with logout~~

  - ~~button/ li for logout~~

- ~~redirect to ....~~

  

### Redirects

- ~~routes~~
- ~~blocked routes~~
- error messages

### ~~Signed~~

- ~~Show thank you note~~
- ~~link to signers~~ 

### ~~Signers~~ 

- ~~Show all signers~~
  - ~~Change  `signatures`~~ 
  -  ~~When showing the list of people who have signed the petition, **get their names** by joining the `users` table.~~
- ~~show the additional profile information~~
  - ~~Age~~
  - ~~City as link~~
    - ~~When clicked, users should be directed to a new page that shows only the people who have signed the petition that live in that city.~~
  - ~~home page = Name + link --> Homepage~~
- ~~Change the query that retrieves information from the `users` table by email address so **that it also gets data from the signatures table**. Thus you will be able to know whether the user has signed the petition or not as soon as they log in.~~

### ~~Signer/:city~~ 

- ~~change handlebar~~
  - ~~if url~~
  - ~~else~~

