DROP TABLE IF EXISTS cards;

CREATE TABLE cards (
    id VARCHAR(64) PRIMARY KEY,
    image VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(64) NOT NULL,
    quote VARCHAR(256) NOT NULL
);

INSERT INTO cards (id, image, name, quote) VALUES
("123", "/uploads/image.jpg", "kalam", "quote");