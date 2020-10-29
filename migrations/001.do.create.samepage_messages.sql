CREATE TABLE messages (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TIMESTAMPTZ DEFAULT now() NOT NULL,
    content TEXT,
    author TEXT
);