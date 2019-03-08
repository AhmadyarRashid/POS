/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bill
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bill` (
  `billid` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `paid` int(11) NOT NULL,
  `pending` int(11) NOT NULL,
  `dis` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `comment` longtext,
  PRIMARY KEY (`billid`)
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: billdes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `billdes` (
  `did` int(11) NOT NULL AUTO_INCREMENT,
  `bid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`did`),
  KEY `billdesTobill` (`bid`),
  KEY `billdesTosale` (`sid`),
  CONSTRAINT `billdesTobill` FOREIGN KEY (`bid`) REFERENCES `bill` (`billid`),
  CONSTRAINT `billdesTosale` FOREIGN KEY (`sid`) REFERENCES `sales` (`saleid`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: company
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `company` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo` varchar(200) NOT NULL,
  `address` varchar(300) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `note` varchar(200) NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `companyToUser` (`uid`),
  CONSTRAINT `companyToUser` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: customer
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `customer` (
  `cusid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` longtext NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(40) NOT NULL,
  `pending` int(11) NOT NULL,
  PRIMARY KEY (`cusid`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: items
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `CodeP` varchar(50) NOT NULL,
  `serial_no` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `items` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `date` varchar(150) NOT NULL,
  `Model` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itemToCompany` (`cid`),
  CONSTRAINT `itemToCompany` FOREIGN KEY (`cid`) REFERENCES `company` (`cid`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sales
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sales` (
  `saleid` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `date` varchar(150) NOT NULL,
  `quantity` int(11) NOT NULL,
  `saleType` varchar(100) NOT NULL,
  `SerialNo` varchar(50) NOT NULL,
  PRIMARY KEY (`saleid`),
  KEY `salesToitem` (`itemid`),
  CONSTRAINT `salesToitem` FOREIGN KEY (`itemid`) REFERENCES `items` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bill
# ------------------------------------------------------------

INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (1, 0, 12, 12, 0, 0, '2019-01-30', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (2, 0, 12, 12, 0, 0, '2019-01-30', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (3, 0, 30, 28, 0, 2, '2019-01-30', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (4, 0, 30, 18, 0, 12, '2019-01-30', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (5, 0, 44, 40, 0, 4, '2019-01-30', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (6, 1, 140, 100, 0, 40, '2019-01-30', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (7, 0, 20, 20, 0, 0, '2019-01-31', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (8, 1, 50, 20, 30, 0, '2019-01-31', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (9, 1, 50, 35, 10, 5, '2019-01-31', '');
INSERT INTO
  `bill` (
    `billid`,
    `cid`,
    `amount`,
    `paid`,
    `pending`,
    `dis`,
    `date`,
    `comment`
  )
VALUES
  (10, 1, 30, 5, 20, 5, '2019-01-31', '');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: billdes
# ------------------------------------------------------------

INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (1, 1, 1);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (2, 2, 2);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (3, 3, 3);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (4, 3, 4);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (5, 4, 5);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (6, 4, 6);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (7, 5, 7);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (8, 5, 8);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (9, 6, 9);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (10, 6, 10);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (11, 7, 11);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (12, 7, 12);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (13, 8, 13);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (14, 8, 14);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (15, 9, 15);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (16, 9, 16);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (17, 10, 17);
INSERT INTO
  `billdes` (`did`, `bid`, `sid`)
VALUES
  (18, 10, 18);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: company
# ------------------------------------------------------------

INSERT INTO
  `company` (
    `cid`,
    `uid`,
    `name`,
    `logo`,
    `address`,
    `phone`,
    `email`,
    `note`
  )
VALUES
  (
    1,
    1,
    'STAR TECH',
    'LOGO.JPEG',
    'UMAIR PLAZA, RAWALPINDI',
    '+92 51 8448286',
    '',
    'GOODS ONCE SOLD CANNOT BE RETURN BACK'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: customer
# ------------------------------------------------------------

INSERT INTO
  `customer` (
    `cusid`,
    `name`,
    `address`,
    `email`,
    `phone`,
    `pending`
  )
VALUES
  (1, 'MEO', '', '', '03131539336', 20);
INSERT INTO
  `customer` (
    `cusid`,
    `name`,
    `address`,
    `email`,
    `phone`,
    `pending`
  )
VALUES
  (2, 'JASIM', '', '', '03155632147', 0);
INSERT INTO
  `customer` (
    `cusid`,
    `name`,
    `address`,
    `email`,
    `phone`,
    `pending`
  )
VALUES
  (3, 'WAQAR', '', '', '03121536996', 0);
INSERT INTO
  `customer` (
    `cusid`,
    `name`,
    `address`,
    `email`,
    `phone`,
    `pending`
  )
VALUES
  (4, 'LT', '', '', '0312315', 0);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: items
# ------------------------------------------------------------

INSERT INTO
  `items` (
    `id`,
    `cid`,
    `CodeP`,
    `serial_no`,
    `description`,
    `items`,
    `unit_price`,
    `date`,
    `Model`
  )
VALUES
  (
    1,
    1,
    '12454',
    '',
    'HEADPHONES',
    26,
    10,
    '2019-01-30',
    '30-HS'
  );
INSERT INTO
  `items` (
    `id`,
    `cid`,
    `CodeP`,
    `serial_no`,
    `description`,
    `items`,
    `unit_price`,
    `date`,
    `Model`
  )
VALUES
  (
    2,
    1,
    'SBJCSN',
    '',
    'MOUSE',
    4,
    10,
    '2019-01-30',
    '31-HS'
  );
INSERT INTO
  `items` (
    `id`,
    `cid`,
    `CodeP`,
    `serial_no`,
    `description`,
    `items`,
    `unit_price`,
    `date`,
    `Model`
  )
VALUES
  (3, 1, 'NCNDJ', '', 'PENS', 20, 10, '2019-01-30', 'HS-32');
INSERT INTO
  `items` (
    `id`,
    `cid`,
    `CodeP`,
    `serial_no`,
    `description`,
    `items`,
    `unit_price`,
    `date`,
    `Model`
  )
VALUES
  (
    4,
    1,
    'KUCH BHI',
    '',
    'TPLINK HE',
    8,
    12,
    '2019-01-30',
    'TP-097217N'
  );
INSERT INTO
  `items` (
    `id`,
    `cid`,
    `CodeP`,
    `serial_no`,
    `description`,
    `items`,
    `unit_price`,
    `date`,
    `Model`
  )
VALUES
  (
    5,
    1,
    '12453',
    '',
    'ATECH MOUSE SLIM HOUSE',
    1,
    900,
    '2019-02-04',
    'G950-30'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sales
# ------------------------------------------------------------

INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (1, 4, '2019-01-30', 1, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (2, 4, '2019-01-30', 1, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (3, 1, '2019-01-30', 2, 'Cash Sale', '45ASD');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (4, 2, '2019-01-30', 1, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (5, 2, '2019-01-30', 1, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (6, 3, '2019-01-30', 2, 'Cash Sale', 'HELLO');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (7, 1, '2019-01-30', 2, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (8, 4, '2019-01-30', 2, 'Cash Sale', '1 YEAR');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (9, 1, '2019-01-30', 12, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (10, 2, '2019-01-30', 2, 'Cash Sale', '1 MONTH');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (11, 2, '2019-01-30', 1, 'Cash Sale', '1 MONTH');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (12, 3, '2019-01-30', 1, 'Cash Sale', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (13, 1, '2019-01-31', 1, 'MEO', '1 YEAR WARRENTY');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (14, 2, '2019-01-31', 1, 'MEO', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (15, 2, '2019-01-31', 1, 'MEO', '1 MONTH');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (16, 3, '2019-01-31', 2, 'MEO', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (17, 1, '2019-01-31', 1, 'MEO', '');
INSERT INTO
  `sales` (
    `saleid`,
    `itemid`,
    `date`,
    `quantity`,
    `saleType`,
    `SerialNo`
  )
VALUES
  (18, 2, '2019-01-31', 1, 'MEO', '1 MONTH');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user
# ------------------------------------------------------------

INSERT INTO
  `user` (`uid`, `email`, `password`)
VALUES
  (1, 'admin', 'admin');

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
