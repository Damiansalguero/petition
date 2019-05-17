# Part 5

1. **Update**

   - JOIN `users` and `user_profiles`

   - 2 queries in POST route

     - update `users` table

     - pick one to do so; determine if to update 3 or 4 columns

     - do the hash before that

     - fill in data in to fields where available (not password; stays blank)

     - second query for` user_profiles`

     - use `upsert` to update `users_profile`table

     - Promise.all([]) for the updates

       

2. **Delete Signature**

   - POST request to delete