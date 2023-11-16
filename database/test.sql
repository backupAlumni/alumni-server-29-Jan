-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 16, 2023 at 02:54 PM
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
(2, 'mashia@gmail.com', '123', 'Alumni'),
(3, 'mhlongo@gmail.com', '123', 'Alumni'),
(4, 'masia@gmail.com', '123', 'Alumni'),
(5, 'mabena@gmail.com', '123', 'Alumni'),
(6, 'masuku@gmail.com', '123', 'Alumni'),
(7, 'mnisi@gmail.com', '123', 'Alumni'),
(8, 'sibiya@gmail.com', '123', 'Alumni'),
(9, 'lebelo@gmail.com', '123', 'Alumni'),
(10, 'lehlojane@gmail.com', '123', 'Alumni'),
(11, '222965810@tut4life.ac.za', '123456', 'Alumni');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `alumni_id` int(11) DEFAULT NULL,
  `event_title` varchar(50) NOT NULL,
  `event_description` varchar(100) NOT NULL,
  `date_posted` datetime DEFAULT NULL,
  `event_date` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `event_file` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`event_id`, `alumni_id`, `event_title`, `event_description`, `date_posted`, `event_date`, `deadline`, `event_file`) VALUES
(4, NULL, 'Hackthon', 'A hackathon is a brief, intensive event where diverse teams collaborate to solve challenges or creat', '2023-11-16 10:02:16', '2023-11-24 16:00:00', '2023-12-02 23:59:59', ''),
(5, NULL, 'Studython', 'A studython is a concentrated study event where students collaboratively work on coursework and exa', '2023-11-16 10:02:40', '2023-11-30 13:00:00', '2023-12-02 23:59:59', '');

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
  `salary` double DEFAULT NULL,
  `job_description` varchar(50) NOT NULL,
  `required_Skills` varchar(50) NOT NULL,
  `experience` varchar(50) NOT NULL,
  `date_posted` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `query`
--

CREATE TABLE `query` (
  `query_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `query_text` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `query`
--

INSERT INTO `query` (`query_id`, `account_id`, `query_text`, `status`, `date`) VALUES
(1, 0, 'Answered', 'Completed', '2023-11-10 06:44:57');

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
(2, 3, 'Sihle', 'Mlongo'),
(3, 7, 'Kefentse', 'Mnisi'),
(4, 5, 'Themba', 'Mabena'),
(5, 6, 'Snenhlanhla', 'Masuku'),
(6, 4, 'Innocent', 'Masia'),
(7, 8, 'Noxolo', 'Sibiya'),
(8, 2, 'Elias', 'Mashia'),
(9, 9, 'Kgaogelo', 'Lebelo'),
(10, 10, 'Kabelo', 'Lehlojane'),
(11, 11, 'Sbongiseni', 'Ngema');

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
  `bio` varchar(50) NOT NULL,
  `pic_file` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `userprofile`
--

INSERT INTO `userprofile` (`user_id`, `account_id`, `location`, `qualification`, `employment_status`, `skills`, `experience`, `interest`, `bio`, `pic_file`) VALUES
(1, 2, '', '', '', '', '', '', '', 'aboutPic.jpg'),
(2, 3, 'Soshanguve', 'PHD', 'Employed', 'Java,React,Angular,NodeJS,MySQL Database', '6 Years', 'Coding/Full-Stack', 'team player and hackerthon master', ''),
(3, 7, 'Hammanskraal', 'Doctrate', 'Employed', 'C#,Java,React,Angular,NodeJS,MySQL Database', '12 Years', 'Full-Stack', ' hackerthon master', ''),
(4, 5, 'Kwazulu-Natal', 'Diploma', 'UnEmployed', 'Java,MySQL Database', '0', 'Business Analyst', 'like attending hackerthon', ''),
(5, 6, 'Sandton', 'masters', 'Self-Employed', 'Java,AWS Deploying,MySQL Database,Azure', '2 months', 'Scrum Master', ' hackerthon Master', ''),
(6, 4, 'Pretoria', 'Diploma', 'UnEmployed', 'Analytical Thinking,Legal Knowledge,AdvocacyTime M', '3 years', 'Criminal Law', ' hackerthon Master', ''),
(7, 11, '', '', '', '', '', '', '', '');

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
-- Indexes for table `query`
--
ALTER TABLE `query`
  ADD PRIMARY KEY (`query_id`);

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
  MODIFY `account_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `event_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `joblisting`
--
ALTER TABLE `joblisting`
  MODIFY `job_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `query`
--
ALTER TABLE `query`
  MODIFY `query_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tut_alumni`
--
ALTER TABLE `tut_alumni`
  MODIFY `alumni_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `userprofile`
--
ALTER TABLE `userprofile`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
