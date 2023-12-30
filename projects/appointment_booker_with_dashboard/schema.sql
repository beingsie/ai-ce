DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME NOT NULL,
    appointment_date DATE NOT NULL,
    name TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    email TEXT NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT 0
);