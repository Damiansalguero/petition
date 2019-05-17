-- FOR PART 3
DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL UNIQUE,
    signature TEXT NOT NULL
);


-- Now we set up the table we need for part 1 and part 2
-- CREATE TABLE signatures(
--     id SERIAL PRIMARY KEY,
--     firstname VARCHAR(255) NOT NULL,
--     lastname VARCHAR(255) NOT NULL,
--     signature TEXT   NOT NULL
-- )
-- So far we created a database and the table we'll need for part 1 and 2
