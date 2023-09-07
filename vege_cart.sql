-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2023-09-07 05:05:32
-- 伺服器版本： 10.4.28-MariaDB
-- PHP 版本： 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `vege`
--

-- --------------------------------------------------------

--
-- 資料表結構 `cart`
--

CREATE TABLE `cart` (
  `cid` smallint(6) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `c_createtime` timestamp NOT NULL DEFAULT current_timestamp(),
  `pid` varchar(50) NOT NULL,
  `c_note` varchar(50) DEFAULT NULL,
  `oid` varchar(50) DEFAULT NULL,
  `c_status` varchar(10) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- 傾印資料表的資料 `cart`
--

INSERT INTO `cart` (`cid`, `uid`, `c_createtime`, `pid`, `c_note`, `oid`, `c_status`) VALUES
(1, '1', '2023-09-04 02:15:53', 'aa002', NULL, '9014842', 'inactive'),
(2, '1', '2023-09-04 02:16:28', 'aa004', NULL, '9014842', 'inactive'),
(3, '4', '2023-09-04 02:16:57', 'aa0013', NULL, '8430352', 'inactive'),
(4, '3', '2023-09-04 13:33:28', 'aa0012', NULL, NULL, 'active'),
(5, '3', '2023-09-04 13:33:28', 'aa004', NULL, NULL, 'active'),
(6, '4', '2023-09-04 02:16:57', 'aa0013', NULL, '937362', 'inactive'),
(7, '4', '2023-09-04 02:16:57', 'aa003', NULL, '937362', 'inactive'),
(8, '2', '2023-09-05 18:41:40', 'aa001', NULL, '8472034', 'inactive'),
(9, '2', '2023-09-05 18:53:49', 'aa003', NULL, '', 'active'),
(10, '2', '2023-09-05 18:54:28', 'aa0015', NULL, '', 'active'),
(11, '2', '2023-09-06 04:02:56', 'aa001', NULL, '4140847', 'inactive'),
(12, '2', '2023-09-06 04:03:10', 'aa0012', NULL, '', 'active');

-- --------------------------------------------------------

--
-- 資料表結構 `temp_coupon`
--

CREATE TABLE `temp_coupon` (
  `coupon` varchar(50) NOT NULL,
  `discount` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- 傾印資料表的資料 `temp_coupon`
--

INSERT INTO `temp_coupon` (`coupon`, `discount`) VALUES
('c001', '-20'),
('c002', '*0.9');

-- --------------------------------------------------------

--
-- 資料表結構 `temp_product`
--

CREATE TABLE `temp_product` (
  `pid` varchar(50) NOT NULL,
  `pname` varchar(20) NOT NULL,
  `pinfo` varchar(100) NOT NULL,
  `size` varchar(10) NOT NULL,
  `freq` varchar(10) NOT NULL,
  `price` smallint(6) NOT NULL,
  `pic` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- 傾印資料表的資料 `temp_product`
--

INSERT INTO `temp_product` (`pid`, `pname`, `pinfo`, `size`, `freq`, `price`, `pic`) VALUES
('aa001', '蔬果健康箱', '四樣水果、三樣蔬菜', 's', '每周一次', 550, 'img\\fruitbox.png'),
('aa0012', '蔬果健康箱', '四樣水果、三樣蔬菜', 'l', '每周一次', 750, 'img\\fruitbox.png'),
('aa0013', '蔬果健康箱', '四樣水果、三樣蔬菜', 'l', '雙周一次', 750, 'img\\fruitbox.png'),
('aa0014', '蔬果健康箱', '四樣水果、三樣蔬菜', 's', '雙周一次', 550, 'img\\fruitbox.png'),
('aa0015', '蔬果健康箱', '四樣水果、三樣蔬菜', 's', '單次配送', 550, 'img\\fruitbox.png'),
('aa002', '蔬果減脂箱', '三樣水果、四樣蔬菜', 'l', '雙周一次', 650, 'img\\fruitbox.png'),
('aa003', '只想吃菜菜箱', '五樣蔬菜', 's', '單次配送', 250, 'img\\fruitbox.png'),
('aa004', '假期箱', '三樣水果、三樣蔬菜、節令節氣小物', 's', '單次配送', 500, 'img\\fruitbox.png');

-- --------------------------------------------------------

--
-- 資料表結構 `vgorder`
--

CREATE TABLE `vgorder` (
  `oid` varchar(50) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `o_ceatetime` timestamp NOT NULL DEFAULT current_timestamp(),
  `useCoupon` varchar(10) DEFAULT NULL,
  `useBonus` smallint(6) DEFAULT NULL,
  `paid` varchar(10) NOT NULL DEFAULT 'unpaid',
  `oName` varchar(20) DEFAULT NULL,
  `oTel` varchar(30) DEFAULT NULL,
  `oMail` varchar(50) DEFAULT NULL,
  `rName` varchar(20) DEFAULT NULL,
  `rTel` varchar(30) DEFAULT NULL,
  `rAddr` varchar(50) DEFAULT NULL,
  `convName` varchar(20) DEFAULT NULL,
  `convTel` varchar(30) DEFAULT NULL,
  `convStore` varchar(50) DEFAULT NULL,
  `payment` varchar(50) DEFAULT NULL,
  `transName` varchar(20) DEFAULT NULL,
  `transNum` varchar(20) DEFAULT NULL,
  `transDate` date DEFAULT NULL,
  `creditName` varchar(20) DEFAULT NULL,
  `creditNum` varchar(20) DEFAULT NULL,
  `creditMM` varchar(3) DEFAULT NULL,
  `creditYY` varchar(3) DEFAULT NULL,
  `creditCSV` varchar(3) DEFAULT NULL,
  `billDonate` varchar(50) DEFAULT NULL,
  `billPersonal` varchar(20) DEFAULT NULL,
  `billCompName` varchar(50) DEFAULT NULL,
  `billCompNum` varchar(10) DEFAULT NULL,
  `billCompAddr` varchar(50) DEFAULT NULL,
  `o_note` varchar(250) DEFAULT NULL,
  `o_status` varchar(50) DEFAULT 'active',
  `o_updatetime` varchar(30) DEFAULT NULL,
  `o_cancel_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- 傾印資料表的資料 `vgorder`
--

INSERT INTO `vgorder` (`oid`, `uid`, `o_ceatetime`, `useCoupon`, `useBonus`, `paid`, `oName`, `oTel`, `oMail`, `rName`, `rTel`, `rAddr`, `convName`, `convTel`, `convStore`, `payment`, `transName`, `transNum`, `transDate`, `creditName`, `creditNum`, `creditMM`, `creditYY`, `creditCSV`, `billDonate`, `billPersonal`, `billCompName`, `billCompNum`, `billCompAddr`, `o_note`, `o_status`, `o_updatetime`, `o_cancel_time`) VALUES
('4140847', '2', '2023-09-06 04:05:54', NULL, NULL, 'unpaid', 'aa', 'aa', 'aaa', 'aa', 'aa', '', '', '', NULL, NULL, '', '', '0000-00-00', '', '', '', '', '', NULL, NULL, '', '', '', 'aaa', 'inactive', '1693973208164', NULL),
('8430352', '4', '2023-09-05 17:18:15', NULL, NULL, 'unpaid', '李大美', '0912333444', '111@gmail.com', '陳怡君', '0966707506', '桃園縣龜山區中山路112號', '', '', NULL, NULL, '陳怡君', '12345', '2023-09-09', '', '', '', '', '', NULL, NULL, '', '', '', '好晚了該睡覺了', 'inactive', '1693937252161', NULL),
('8472034', '2', '2023-09-05 18:43:08', NULL, NULL, 'unpaid', '測試用', '測試用', '測試用', '', '', '', '', '', NULL, NULL, '', '', '0000-00-00', '測試用', '測試用', '測試用', '測試用', '測試用', NULL, NULL, '測試用', '測試用', '測試用', '測試用測試用測試用測試用測試用', 'inactive', '1693939982392', NULL),
('9014842', '1', '2023-09-05 16:02:10', NULL, NULL, 'unpaid', '李小美', '0912333444', 'aa@gmail.com', '王大華', '0966707506', '桃園縣龜山區中山路112號', '', '', NULL, NULL, '陳怡君', '12345', '2023-09-09', '', '', '', '', '', NULL, NULL, '', '', '', '我愛吃香蕉和蘋果', 'active', NULL, NULL),
('937362', '4', '2023-09-05 18:40:15', NULL, NULL, 'unpaid', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', NULL, NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `wishlist`
--

CREATE TABLE `wishlist` (
  `wid` tinyint(4) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `pid` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- 傾印資料表的資料 `wishlist`
--

INSERT INTO `wishlist` (`wid`, `uid`, `pid`) VALUES
(1, '1', 'aa001'),
(2, '2', 'aa002'),
(3, '2', 'aa003'),
(4, '3', 'aa004'),
(5, '4', 'aa004'),
(6, '4', 'aa0012');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `cart`
--
ALTER TABLE `cart`
  ADD UNIQUE KEY `cid` (`cid`);

--
-- 資料表索引 `temp_coupon`
--
ALTER TABLE `temp_coupon`
  ADD PRIMARY KEY (`coupon`);

--
-- 資料表索引 `temp_product`
--
ALTER TABLE `temp_product`
  ADD PRIMARY KEY (`pid`);

--
-- 資料表索引 `vgorder`
--
ALTER TABLE `vgorder`
  ADD PRIMARY KEY (`oid`);

--
-- 資料表索引 `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wid`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cart`
--
ALTER TABLE `cart`
  MODIFY `cid` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wid` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
