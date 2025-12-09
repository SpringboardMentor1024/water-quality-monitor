create table
    users (
        id SERIAL primary key,
        name varchar(100) not null,
        email varchar(150) unique not null,
        password varchar(200) not null,
        role user_role not null default 'citizen',
        location varchar(150),
        created_at timestamp default current_timestamp
    );