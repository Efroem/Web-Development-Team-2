-- SQLite
DELETE FROM Venue;
DELETE FROM TheatreShow;

INSERT INTO Venue (Name, Capacity)
VALUES ('Main Auditorium', 200);  -- Example venue with a capacity of 200 seats

INSERT INTO TheatreShow (Title, Description, Price, VenueId)
VALUES ('Hamlet', 'A classic Shakespearean play.', 50.00, 1);  -- Reference the Venue ID you inserted above

INSERT INTO TheatreShowDate (DateAndTime, TheatreShowId)
VALUES ('2024-12-01 19:30:00', 1),  -- Future show date and time
       ('2024-12-02 19:30:00', 1);  -- Another future show date for the same show

INSERT INTO Customer (FirstName, LastName, Email)
VALUES ('John', 'Doe', 'john.doe@example.com');  -- Example customer data

INSERT INTO Reservation (AmountOfTickets, Used, CustomerId, TheatreShowDateId)
VALUES (2, 0, 1, 1);  -- Reserve 2 tickets for customer ID 1 and show date ID 1
