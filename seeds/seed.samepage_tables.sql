BEGIN;

TRUNCATE
    messages,
    users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, password)
VALUES
    ('username', 'password');

INSERT INTO messages (chat_id, content, author)
VALUES
    (1, 'test message', 'author');


COMMIT;

{/*('username1', '$2a$12$/3W1WcHLnZeF4liWkIjg3e63wAnUxp/hE63xDb6l73zl/oF2wvCUq');*/}