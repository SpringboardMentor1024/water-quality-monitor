create table
    waterstations (
        id SERIAL primary key,
        name varchar(150) not null,
        location varchar(150),
        latitude NUMERIC (9, 6),
        longitude NUMERIC (9, 6),
        managed_by varchar(150),
        created_at timestamp default current_timestamp
    );