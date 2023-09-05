Create DATABASE Alumni_Space_DB;

CREATE TABLE ALUMNI_SPACE_UI (
    account_id SERIAL PRIMARY KEY,
    fullname VARCHAR(20) NOT NULL
    email VARCHAR(50) NOT NULL UNIQUE, -- Added UNIQUE constraint
    password VARCHAR(100) NOT NULL,
);

CREATE TABLE Alumni_Space_Account (
    account_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE, -- Added UNIQUE constraint
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
);

CREATE TABLE Tut_Alumni (
    alumni_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES Alumni_Space_Account(account_id),
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    date_of_birth DATE,
);

CREATE TABLE Administrator (
    admin_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES Alumni_Space_Account(account_id),
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
);

--Profile