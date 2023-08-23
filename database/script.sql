Create DATABASE Alumni_Space_DB;

CREATE TABLE Alumni_Space_Account (
    account_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE, -- Added UNIQUE constraint
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    time_recorded TIMESTAMP NOT NULL DEFAULT NOW(),
    account_status VARCHAR(20) NOT NULL
);

CREATE TABLE Tut_Alumni (
    alumni_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(50) REFERENCES Alumni_Space_Account(username),
    password VARCHAR(100)
);

CREATE TABLE Administrator (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    username VARCHAR(50) REFERENCES Alumni_Space_Account(username),
    password VARCHAR(100)
);