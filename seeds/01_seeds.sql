INSERT INTO users(name, email, password)
VALUES ('Dan', 'dpappo@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Nick', 'nick@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Adam', 'adam@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Dans House', 'Where Dan lives', 'TinyApp.com/DanThumb', 'TinyApp.com/DanCover', 100, 3, 4, 3, 'Canada', 'The Lane', 'Richmond Hill', 'ON', 'L4E 3M6', true),
(2, 'Nicks House', 'Where Nick lives', 'TinyApp.com/NickThumb', 'TinyApp.com/NickCover', 120, 2, 5, 7, 'Canada', 'Kitchner Road', 'Waterloo', 'ON', 'H0H 0H0', true),
(2, 'Adams House', 'Where Adam lives', 'TinyApp.com/AdamThumb', 'TinyApp.com/AdamCover', 150, 4, 9, 10, 'Canada', 'Town Street', 'Markham', 'ON', 'M5M 3N3', true);

INSERT INTO reservations(start_date, end_date, property_id, guest_id)
VALUES ('2020-12-29', '2021-01-05', 1, 2),
('2021-01-29', '2021-02-05', 2, 1),
('2021-02-28', '2021-03-05', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 5, 'Dans house is fricking sweet'),
(1, 2, 2, 4, 'Nicks house is cool!'),
(1, 3, 3, 4, 'I enjoyed Adams house');