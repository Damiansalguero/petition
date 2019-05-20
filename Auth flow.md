# Auth flow

1. registration || login
   - Profile
     - user_id (should not be visible unless you register)
   - Petition
     - user_id
   - Signed(thank-you page)
     - signature_id (not visible unless you signed the pet)
   - edit profile || signers (by city)
     - user_id
     - user_id
   - login --> Petition || Signed
     - if no signature_id --> petition
     - if signature:id --> signed
   - 