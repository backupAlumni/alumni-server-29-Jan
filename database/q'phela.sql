CREATE TABLE ALUMNI_SPACE_UI (
    account_id SERIAL PRIMARY KEY,
    fullname VARCHAR(20) NOT NULL
    email VARCHAR(50) NOT NULL UNIQUE, -- Added UNIQUE constraint
    password VARCHAR(100) NOT NULL,
    
);
