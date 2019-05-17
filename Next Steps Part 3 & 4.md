# Part 3

- left join

  - change query, remove from login
  - add id from signatures table

- signatures table can be changed too

  - first/last should just be in one table
  - join signature table

- new route /profile

  - no link to this unless you send them after successful registration
  - ask for additional info
  - all optional

- new route /signers (city)

  - app.get('/signers/:city', function(req, res) {

    const city = rq.params.city;

    db.getSignersByCity(city). then()

    })

    WHERE LOWER(city) = LOWER($1);

  - City shows also in text of list of city signers

- Put url names/cities

  - {{#if url}}

    `<a href="{{url}}">{{first}}{{last}}</a>`

    {{else}}

    {{first}}{{last}}

    {{/if}}

