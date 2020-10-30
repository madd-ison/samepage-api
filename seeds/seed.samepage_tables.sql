BEGIN;

TRUNCATE
    messages,
    users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
    ('username1', '$2a$12$d5KaVZ5oqZwUfl3r2sGni.lc/dN.d8mEgHkgbRzjPNC7I6qkLfH1W');

INSERT INTO messages (chat_id, content, author)
VALUES
    (1, 'test message', 'author');


COMMIT;