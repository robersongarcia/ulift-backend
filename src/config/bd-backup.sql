create table Confirmation_Token
(
    token varchar(400) not null
        primary key
);

create table Messages
(
    messageID   int auto_increment
        primary key,
    description varchar(100) not null
);

create table Rating
(
    raterID    int          not null,
    receiverID int          not null,
    rate       int          null,
    commentary varchar(255) null,
    finished   tinyint(1)   not null,
    liftID     int          not null,
    primary key (raterID, receiverID, liftID)
);

create index Rating_ibfk_2
    on Rating (receiverID);

create definer = bd2_202225_27922357@`%` trigger calcRating
    after update
    on Rating
    for each row
BEGIN
    DECLARE SUMA INT default 0;
    DECLARE N INT default 0;

    SELECT SUM(rate)
        INTO SUMA
    FROM Rating
        WHERE receiverID = NEW.receiverID AND finished = TRUE;

    SELECT count(liftID)
        INTO N
    FROM Rating
        WHERE receiverID = NEW.receiverID AND finished = TRUE;

    IF N=0 OR SUMA = 0 THEN
        UPDATE User
        SET rate = 0
        WHERE id = new.receiverID;
    ELSE
       UPDATE User
        SET rate = round(SUMA/N)
        WHERE id = new.receiverID;
    END IF;

END;

create table User
(
    id               int auto_increment
        primary key,
    email            varchar(30)          not null,
    nameU            varchar(30)          not null,
    lastname         varchar(30)          not null,
    passwordU        varchar(255)         not null,
    gender           char                 not null,
    rate             int        default 0 null,
    role             char                 not null,
    verified         tinyint(1) default 0 not null,
    photo            varchar(100)         null,
    emergencyContact varchar(20)          null,
    emergencyName    varchar(20)          null,
    constraint check_gender
        check (`gender` in ('M', 'F', 'N')),
    constraint check_role
        check (`role` in ('E', 'P', 'T'))
);

create table Chat_historial
(
    senderID      int         not null,
    receiverID    int         not null,
    dateMessage   datetime    not null,
    messageID     int         not null,
    statusMessage tinyint(1)  not null,
    room          varchar(10) not null,
    primary key (senderID, receiverID, dateMessage),
    constraint Chat_historial_ibfk_1
        foreign key (senderID) references User (id),
    constraint Chat_historial_ibfk_2
        foreign key (receiverID) references User (id)
);

create index receiverID
    on Chat_historial (receiverID);

create table Destination
(
    userID  int                               not null,
    dNumber int                               not null,
    name    varchar(20) default 'Por defecto' null,
    lat     decimal(8, 6)                     null,
    lng     decimal(9, 6)                     null,
    primary key (userID, dNumber),
    constraint Destination_ibfk_1
        foreign key (userID) references User (id)
            on update cascade
);

create table Driver
(
    driverID     int        not null
        primary key,
    status       char       not null,
    availability tinyint(1) not null,
    waitingTime  int        null,
    constraint Driver_ibfk_1
        foreign key (driverID) references User (id)
            on update cascade on delete cascade
);

create table Favorites
(
    userID1 int not null,
    userID2 int not null,
    primary key (userID1, userID2),
    constraint Favorites_ibfk_1
        foreign key (userID1) references User (id)
            on update cascade,
    constraint Favorites_ibfk_2
        foreign key (userID2) references User (id)
            on update cascade
);

create index userID2
    on Favorites (userID2);

create table Route
(
    driverID int                          not null,
    rNumber  int                          not null,
    path     longtext collate utf8mb4_bin null
        check (json_valid(`path`)),
    name     varchar(20)                  null,
    active   tinyint(1) default 0         null,
    primary key (driverID, rNumber),
    constraint Route_Driver_null_fk
        foreign key (driverID) references Driver (driverID)
);

create table Vehicle
(
    driverID int         not null,
    plate    varchar(7)  not null,
    color    varchar(10) not null,
    model    varchar(20) not null,
    seats    int         not null,
    primary key (driverID, plate),
    constraint Vehicle_ibfk_1
        foreign key (driverID) references User (id)
            on update cascade on delete cascade
);

create table Lift
(
    passengerID int                                                                    not null,
    driverID    int                                                                    not null,
    plate       varchar(7)                                                             not null,
    liftID      int                                                                    not null,
    dateL       date       default cast(current_timestamp() - interval 4 hour as date) not null,
    timeL       time       default cast(current_timestamp() - interval 4 hour as time) not null,
    seats       int                                                                    not null,
    rdNumber    int                                                                    null,
    complete    tinyint(1) default 0                                                   null,
    driverCheck tinyint(1) default 0                                                   not null,
    primary key (passengerID, driverID, plate, liftID),
    constraint Lift_ibfk_1
        foreign key (passengerID) references User (id)
            on update cascade on delete cascade,
    constraint Lift_ibfk_2
        foreign key (driverID, plate) references Vehicle (driverID, plate)
            on update cascade on delete cascade
);

create definer = bd2_202225_27922357@`%` trigger cleanWaitingList
    after insert
    on Lift
    for each row
    delete from Waiting_List
    where Waiting_List.passengerID = NEW.passengerID;

create table Waiting_List
(
    passengerID int not null,
    driverID    int not null,
    primary key (passengerID, driverID),
    constraint Waiting_List_ibfk_1
        foreign key (passengerID) references User (id)
            on update cascade,
    constraint Waiting_List_ibfk_2
        foreign key (driverID) references Driver (driverID)
            on update cascade
);

create index driverID
    on Waiting_List (driverID);

create
    definer = bd2_202225_27922357@`%` procedure insert_raters(IN driver_id int, IN response tinyint(1),
                                                              IN finished_lift tinyint(1), IN rater_id int,
                                                              IN receiver_id int)
BEGIN
	IF ((SELECT availability FROM Driver WHERE driverID = driver_id) = TRUE AND response = TRUE) THEN
		UPDATE Driver
		SET availability = FALSE
		WHERE driverID = driver_id;
		INSERT INTO Rating(raterID, receiverID, finished)
		VALUES(rater_id, receiver_id, 0);
	END IF;
END;

create
    definer = bd2_202225_27922357@`%` procedure update_rating(IN driver_id int, IN rater_id int, IN receiver_id int,
                                                              IN finished_lift tinyint(1), IN rate_p int,
                                                              IN commentary_p varchar(255))
BEGIN
	IF ((SELECT availability FROM Driver WHERE driverID = driver_id) = FALSE AND finished_lift = TRUE) THEN
		UPDATE Driver
		SET availability = TRUE
		WHERE driverID = driver_id;
		UPDATE Rating
		SET rate = rate_p, commentary = commentary_p, finished = finished_lift
		WHERE raterID = rater_id AND receiverID = receiver_id;
	END IF;
END;


