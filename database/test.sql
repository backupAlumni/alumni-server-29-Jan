-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2023 at 12:53 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`admin_id`, `account_id`, `name`, `surname`) VALUES
(1, 1, 'Busi', 'Mbatha');

-- --------------------------------------------------------

--
-- Table structure for table `alumni_space_account`
--

CREATE TABLE `alumni_space_account` (
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `alumni_space_account`
--

INSERT INTO `alumni_space_account` (`account_id`, `email`, `password`, `role`) VALUES
(1, 'admin@email.com', '123', 'Admin'),
(2, '123@email.com', '123', 'Alumni');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `alumni_id` int(11) DEFAULT NULL,
  `event_title` varchar(50) NOT NULL,
  `event_description` varchar(100) NOT NULL,
  `event_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `joblisting`
--

CREATE TABLE `joblisting` (
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `Organisation` varchar(50) NOT NULL,
  `job_title` varchar(50) NOT NULL,
  `workplace_type` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `job_type` varchar(50) NOT NULL,
  `job_description` varchar(50) NOT NULL,
  `date_posted` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tut_alumni`
--

CREATE TABLE `tut_alumni` (
  `alumni_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tut_alumni`
--

INSERT INTO `tut_alumni` (`alumni_id`, `account_id`, `name`, `surname`) VALUES
(1, 2, 'Lindo', 'Zane'),
(2, 3, 'Sihle', 'Mlongo'),
(3, 7, 'Kefentse', 'Mnisi'),
(4, 5, 'Themba', 'Mabena'),
(5, 6, 'Snenhlanhla', 'Masuku'),
(6, 4, 'Innocent', 'Masia'),
(7, 8, 'Noxolo', 'Sibiya'),
(8, 3, 'Elias', 'Mashia'),
(9, 3, 'Kgaogelo', 'Lebelo'),
(10, 3, 'Kabelo', 'Lehlojane');

-- --------------------------------------------------------

--
-- Table structure for table `userprofile`
--

CREATE TABLE `userprofile` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `location` varchar(50) NOT NULL,
  `qualification` varchar(100) NOT NULL,
  `employment_status` varchar(50) NOT NULL,
  `skills` varchar(50) NOT NULL,
  `experience` varchar(50) NOT NULL,
  `interest` varchar(50) NOT NULL,
  `bio` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `userprofile`
--

INSERT INTO `userprofile` (`user_id`, `account_id`, `location`, `qualification`, `employment_status`, `skills`, `experience`, `interest`, `bio`) VALUES
(1, 2, '', '', '', '', '', '', ''),
(2, 3, 'Soshanguve', 'PHD', 'Employed', 'Java,React,Angular,NodeJS,MySQL Database', '6 Years', 'Coding/Full-Stack', 'team player and hackerthon master'),
(3, 7, 'Hammanskraal', 'Doctrate', 'Employed', 'C#,Java,React,Angular,NodeJS,MySQL Database', '12 Years', 'Full-Stack', ' hackerthon master'),
(4, 5, 'Kwazulu-Natal', 'Diploma', 'UnEmployed', 'Java,MySQL Database', '0', 'Business Analyst', 'like attending hackerthon'),
(5, 6, 'Sandton', 'masters', 'Self-Employed', 'Java,AWS Deploying,MySQL Database,Azure', '2 months', 'Scrum Master', ' hackerthon Master'),
(6, 4, 'Pretoria', 'Diploma', 'UnEmployed', 'Analytical Thinking,Legal Knowledge,AdvocacyTime M', '3 years', 'Criminal Law', ' hackerthon Master');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `alumni_space_account`
--
ALTER TABLE `alumni_space_account`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `joblisting`
--
ALTER TABLE `joblisting`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `tut_alumni`
--
ALTER TABLE `tut_alumni`
  ADD PRIMARY KEY (`alumni_id`);

--
-- Indexes for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administrator`
--
ALTER TABLE `administrator`
  MODIFY `admin_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `alumni_space_account`
--
ALTER TABLE `alumni_space_account`
  MODIFY `account_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `event_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `joblisting`
--
ALTER TABLE `joblisting`
  MODIFY `job_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tut_alumni`
--
ALTER TABLE `tut_alumni`
  MODIFY `alumni_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `userprofile`
--
ALTER TABLE `userprofile`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
