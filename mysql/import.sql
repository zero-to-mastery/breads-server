-- USERS
INSERT INTO users ( 
    first_name,
    last_name,
    email,
    username,
    password,
    image,
    created_at
) VALUES
('First','User','first@user.com','firstUser','$2b$10$6Hlgf70PI6lZT5ZP7RRNQuLfRcG3wx.PsAcOu983TgFEp/bhDYKwa','https://res.cloudinary.com/breads/image/upload/v1613539776/naan_mzwzze.jpg','2020-03-21 14:54:19'),
('Second','User','second@user.com','secondUser','$2b$10$6Hlgf70PI6lZT5ZP7RRNQuLfRcG3wx.PsAcOu983TgFEp/bhDYKwa','https://res.cloudinary.com/breads/image/upload/v1613539680/focaccia_jasnlz.jpg','2020-03-21 18:39:00'),
('Third','User','third@user.com','thirdUser','$2b$10$6Hlgf70PI6lZT5ZP7RRNQuLfRcG3wx.PsAcOu983TgFEp/bhDYKwa','https://res.cloudinary.com/breads/image/upload/v1613539497/baguette_sa1wgi.jpg','2020-03-23 18:23:03'),
('Fourth','User','fourth@user.com','fourthUser','$2b$10$6Hlgf70PI6lZT5ZP7RRNQuLfRcG3wx.PsAcOu983TgFEp/bhDYKwa','https://res.cloudinary.com/breads/image/upload/v1613539536/sourdough_kb4mt4.jpg','2020-03-27 11:33:27'),
('Fifth','User','fifth@user.com','fifthUser','$2b$10$6Hlgf70PI6lZT5ZP7RRNQuLfRcG3wx.PsAcOu983TgFEp/bhDYKwa','https://res.cloudinary.com/breads/image/upload/v1613539580/tortilla_fvnmgn.jpg','2020-03-27 11:46:36');

-- READINGS
INSERT INTO READINGS (
    title,
    domain,
    description,
    image,
    word_count,
    url,
    user_id,
    created_at
) VALUES
('Learning How to Think: The Skill No One Taught You','fs.blog',"One of the best skills you can learn is how to think for your self. Only we've never been taught how to think. Read this to learn how to think better.",'https://149366099.v2.pressablecdn.com/wp-content/uploads/2015/08/William-Deresiewicz-Thinking.png',851,'https://fs.blog/2015/08/how-to-think/',2,"2020-03-21 18:42:33"),
('How a Decision Journal Changed the Way I make Decisions (Template Included)','fs.blog','Read this article to learn how a decision journal (template included) can improve the way you make decisions by giving you a critical feedback loop.','https://149366099.v2.pressablecdn.com/wp-content/uploads/2014/02/decision-Journal.png',1260,'https://fs.blog/2014/02/decision-journal/',1,"2020-03-22 13:51:01"),
('A Home Maintenance Checklist: An Incredibly Handy Tool to Keep Your House in Tip-Top Shape | The Art of Manliness','www.artofmanliness.com',"A home maintenance checklist that's incredibly handy and will keep your house in tip-top shape. Organized annually, biannually, quarterly, and seasonally.",'https://content.artofmanliness.com/uploads/2013/10/Screen-Shot-2019-01-27-at-7.50.00-PM.png',2396,'https://www.artofmanliness.com/articles/keep-your-house-in-tip-top-shape-an-incredibly-handy-home-maintenance-checklist/',3,"2020-03-23 18:23:35"),
('The Best way to Improve Your Performance at Almost Anything','fs.blog','','',10991,'https://fs.blog/2014/05/improving-your-performance/',2,"2020-03-23 23:38:27"),
('Why Men Should Read Fiction | The Art of Manliness','www.artofmanliness.com','Learn how reading fiction will help you become a better man.','https://content.artofmanliness.com/uploads//2012/04/manreading.jpg',2182,'https://www.artofmanliness.com/articles/why-men-should-read-more-fiction/',1,"2020-03-25 16:35:15"),
('How to Create a Life Plan in 5 Easy Steps | The Art of Manliness','www.artofmanliness.com','Create a plan for the life you want in just five simple steps.','https://content.artofmanliness.com/uploads/2011/02/blueprint-1.jpg',2554,'https://www.artofmanliness.com/articles/create-a-life-plan/',1,"2020-03-27 11:17:33"),
("Richard Feynman’s Love Letter to His Wife, Sixteen Months After Her Death",'fs.blog','','',4007,'https://fs.blog/2013/08/richard-feynman-love-letter/',3,"2020-03-27 11:19:53"),
('From “Simple” to Serious Endurance','www.strongfirst.com','','',17892,'https://www.strongfirst.com/where-do-you-go-after-simple/',3,"2020-03-27 11:21:27"),
('What the Most Successful People Do Before Breakfast','fs.blog','','',10690,'https://fs.blog/2014/01/what-the-most-successful-people-do-before-breakfast/',2,"2020-03-27 11:22:55"),
('"The 3 steps I teach trainers and health coaches to help fix any diet problem. A proven formula for helping people look and, "feel their best".','www.precisionnutrition.com','','',16085,'https://www.precisionnutrition.com/fix-any-diet-problem',4,"2020-03-27 11:44:37"),
('Teimour Radjabov: "I should consult a lawyer"','www.chess.com','','',30188,'https://www.chess.com/news/view/teimour-radjabov-interview-fide-candidates-chess',5,"2020-03-27 12:06:08"),
('Programs','www.oaklandsmostpowerful.com','','',2322,'https://www.oaklandsmostpowerful.com/programming-resources',5,"2020-03-27 20:31:28"),
('What is “Work Capacity”?  [Part I]','www.strongfirst.com','','',19915,'https://www.strongfirst.com/work-capacity-part-i/',5,"2020-03-27 20:33:10"),
('My Journey to the Beast: Pressing a 48kg Kettlebell','www.strongfirst.com','','',10179,'https://www.strongfirst.com/my-journey-to-the-beast-pressing-a-48kg-kettlebell/',3,"2020-03-27 20:34:44"),
('Willpower: How to Strengthen and Conserve Your Willpower | The Art of Manliness','www.artofmanliness.com','Strengthen and conserve your willpower with these 20 tips.','https://content.artofmanliness.com/uploads//2012/01/gas.jpg',3270,'https://www.artofmanliness.com/articles/how-to-strengthen-willpower/',4,"2020-03-27 20:37:14"),
('The Mechanics of the War Economy','www.linkedin.com','What is happening now would have been unimaginable not long ago.  It was only unimaginable because it had never happened in our lifetimes.','https://media-exp1.licdn.com/dms/image/C4D12AQGBrORFqUfwEA/article-cover_image-shrink_600_2000/0?e=1602720000&v=beta&t=pSeyu4WWv3KetXYucJTqoaR65jAtDZaYSV9xlaAI6R0',5916,'https://www.linkedin.com/pulse/mechanics-war-economy-ray-dalio/?trackingId=yB1ZbrXdSgGRvc%2FAq3m%2FIQ%3D%3D',4,"2020-03-29 18:14:53"),
('Our Disembodied Selves and the Decline of Empathy','www.artofmanliness.com','','',14526,'https://www.artofmanliness.com/articles/our-disembodied-selves-and-the-decline-of-empathy/',2,"2020-03-30 11:23:48"),
('How to Implement Infinite Scrolling with ReactJs','www.pluralsight.com','','',6036,'https://www.pluralsight.com/guides/how-to-implement-infinite-scrolling-with-reactjs',2,"2020-03-30 23:03:22"),
('How to Use the Python or Operator','realpython.com','','',19777,'https://realpython.com/python-or-operator/',2,"2020-04-22 23:32:16"),
('From Simple to Sinister: Waving Volume on S&S','www.strongfirst.com','','',12592,'https://www.strongfirst.com/from-simple-to-sinister/',5,"2020-04-25 13:23:54"),
('"Things Are Going So Well, Help Me Screw It Up, Part 2"','www.strongfirst.com','','',13542,'https://www.strongfirst.com/things-are-going-so-well-help-me-screw-it-up-part-2/',5,"2020-04-25 13:24:19"),
("bvaughn / react-virtualized",'github.com','','',3081,'https://github.com/bvaughn/react-virtualized/issues/1378',5,"2020-04-29 14:05:35"),
('Optimizing Performance','reactjs.org','','',9027,'https://reactjs.org/docs/optimizing-performance.html',5,"2020-04-29 14:40:35"),
("Chaining async await API calls in Redux",'dev.to','','',1300,'https://dev.to/sanderdebr/chaining-async-await-api-calls-in-redux-2m96',4,"2020-04-30 23:20:46"),
('How to dispatch a Redux action with a timeout?','stackoverflow.com','','',15620,'https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout',4,"2020-04-30 23:24:39"),
('#Usage with React','redux.js.org','','',6996,'https://redux.js.org/basics/usage-with-react',4,'2020-04-30 23:35:40'),
('The complete guide to Forms in React','medium.com','','',6527,'https://medium.com/@agoiabeladeyemi/the-complete-guide-to-forms-in-react-d2ba93f32825',4,'2020-04-30 23:36:41'),
('Why logic gates behave the way they do?','cs.stackexchange.com','','',3001,'https://cs.stackexchange.com/questions/125000/why-logic-gates-behave-the-way-they-do',4,'2020-04-30 23:40:18'),
('How to Be a Man | The Art of Manliness','www.artofmanliness.com',"How to be a man in the 21st century, based on years of reading, research, and experience. Included are principles and actions that will make you a better man.",'https://content.artofmanliness.com/uploads/2014/06/road.png',19967,'https://www.artofmanliness.com/articles/semper-virilis-a-roadmap-to-manhood-in-the-21st-century/#chapter2',1,'2020-04-30 23:42:22'),
("To Succeed in Work and Life, Be a T-Shaped Man | The Art of Manliness",'www.artofmanliness.com',"A well-rounded life is T-shaped; he has expertise in one specific area, and a broad knowledge across multiple disciplines.",'https://content.artofmanliness.com/uploads//2013/04/mrtx.jpg',1787,'https://www.artofmanliness.com/articles/to-succeed-in-work-and-life-be-mr-t/',1,'2020-05-01 0:12:41'),
('Why do logic gates behave the way they do?','cs.stackexchange.com',"I am a Software Developer but I came from a non-CS background so maybe it is a wrong question to ask, but I do not get why logic gates/boolean logic behave the way they do. Why for example: 1 A...",'https://cdn.sstatic.net/Sites/cs/Img/apple-touch-icon@2.png?v=324a3e0c2b03',28,'https://cs.stackexchange.com/questions/125000/why-logic-gates-behave-the-way-they-do',1,'2020-05-01 13:05:45'),
('Uploading Images to Cloudinary Using Multer and ExpressJS','medium.com','','',6790,'https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54',5,'2020-05-02 19:43:56'),
('Coronavirus Live Updates: Trump Administration Models Predict Near Doubling of Daily Death Toll by June','www.nytimes.com','','',36240,'https://www.nytimes.com/2020/05/04/us/coronavirus-updates.html',2,'2020-05-04 12:55:08'),
('Trump and  Biden Would Tie in Texas if Presidential Election Were Held Today: Poll','www.newsweek.com','','',2880,'https://www.newsweek.com/biden-trump-would-tie-election-texas-1501639',3,'2020-05-04 15:11:14'),
("LeBron: My style would've jelled with Jordan's",'www.espn.com','','',646,'https://www.espn.com/nba/story/_/id/29192329/lebron-james-mulls-role-mj-teammate-my-best-assets-work-perfectly',2,'2020-05-18 23:23:57'),
('Zoom Acquires Keybase and Announces Goal of Developing the Most Broadly Used Enterprise End-to-End Encryption Offering','blog.zoom.us','','',1094,'https://blog.zoom.us/wordpress/2020/05/07/zoom-acquires-keybase-and-announces-goal-of-developing-the-most-broadly-used-enterprise-end-to-end-encryption-offering/',2,'2020-05-18 23:27:29'),
("Americans don't trust the Federal Reserve to look out for them amid coronavirus pandemic",'www.axios.com','','',447,'https://www.axios.com/federal-reserve-trust-americans-coronavirus-0ce40d39-c39c-4a7f-bc42-22f75af69772.html',2,'2020-05-18 23:27:51'),
("Why flats dominate Spain’s housing market",'www.bbc.com','','',348,'https://www.bbc.com/worklife/article/20200506-why-do-flats-dominate-spains-housing-market',2,'2020-05-18 23:28:33'),
("Commentary on the Epistle to The Galatians, by Martin Luther",'www.gutenberg.org','','',80116,'https://www.gutenberg.org/files/1549/1549-h/1549-h.htm#link2HCH0002',3,'2020-05-18 23:31:10'),
('Obsession With Fraud Sabotages U.S. Aid to Millions Without Jobs','www.bloomberg.com',"The safeguards often end up doing more harm than good, a researcher says.",'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/izhcpElAS5qA/v1/1200x691.jpg',1135,'https://www.bloomberg.com/news/articles/2020-05-07/obsession-with-fraud-sabotages-u-s-aid-to-millions-without-jobs?srnd=premium&sref=73c0pvQV',3,'2020-05-18 23:32:05'),
('April Snapshot','www.katerra.com','','',623,'https://www.katerra.com/2020/04/30/april-snapshot/',2,'2020-05-18 23:32:51'),
('Danaos expands fleet with secondhand acquisitions','splash247.com','','',188,'https://splash247.com/danaos-expands-fleet-with-secondhand-acquisitions/',4,'2020-05-18 23:33:32'),
('Matt Cogar','www.redbull.com','','',17,'https://www.redbull.com/us-en/athlete/matt-cogar',4,'2020-05-18 23:36:39'),
('Maersk launches its cold store in St. Petersburg (Russia)','www.maersk.com','','',335,'https://www.maersk.com/news/articles/2020/04/17/maersk-launches-its-cold-store-in-st-petersburg-russia',5,'2020-05-18 23:37:23'),
('How to ensure artificial intelligence benefits society: A conversation with Stuart Russell and James Manyika','www.mckinsey.com','','',2448,'https://www.mckinsey.com/featured-insights/artificial-intelligence/how-to-ensure-artificial-intelligence-benefits-society-a-conversation-with-stuart-russell-and-james-manyika',5,'2020-05-18 23:37:53'),
("Who’s Behind the Reopen Domain Surge? — Krebs on Security",'krebsonsecurity.com','','',11,'https://krebsonsecurity.com/2020/04/whos-behind-the-reopen-domain-surge/',2,'2020-05-18 23:38:21'),
('The sprint to solve coronavirus protein structures — and disarm them with drugs','www.nature.com','Stopping the pandemic could rely on breakneck efforts to visualize SARS-CoV-2 proteins and use them to design drugs and vaccines.','https://media.nature.com/lw1024/magazine-assets/d41586-020-01444-z/d41586-020-01444-z_17985490.jpg',2914,'https://www.nature.com/articles/d41586-020-01444-z',1,'2020-05-18 23:39:17'),
('Knowledge Debt','amir.rachum.com','','',682,'https://amir.rachum.com/amp/blog/2016/09/15/knowledge-debt.html',1,'2020-05-18 23:39:37'),
('Taste for Makers','www.paulgraham.com','','',4257,'http://www.paulgraham.com/taste.html',5,'2020-05-18 23:40:03'),
("College basketball's 'greatest of all time' bracket -- South Region breakdown",'www.espn.com','','',901,'https://www.espn.com/mens-college-basketball/story/_/page/playerbracket-south/college-basketball-greatest-all-bracket-south-region-breakdown',4,'2020-05-19 0:07:23');

-- TAGS
INSERT INTO tags (
    tag_name,
    created_at,
    count
) VALUES
('basketball','2020-05-18 23:39:17',2),
('tech','2020-05-18 23:39:37',3),
('covid','2020-05-18 23:40:03',3),
('freight','2020-05-19 0:07:23',1);

-- SUBSCRIPTIONS
INSERT INTO subscriptions (
    subscriber_id,
    publisher_id,
    created_at,
    isNew
) VALUES
(1,2,'2020-04-30 16:42:16',0),
(1,3,'2020-04-30 16:42:11',0),
(1,4,'2020-08-08 12:03:19',1),
(2,1,'2020-03-27 11:09:59',0),
(2,3,'2020-04-12 23:55:26',1),
(2,4,'2020-04-23 0:54:05',0),
(2,5,'2020-05-27 22:34:14',0),
(3,2,'2020-08-09 0:16:48',0),
(3,4,'2020-08-09 0:16:54',0),
(4,1,'2020-03-27 12:10:16',1),
(4,2,'2020-03-27 12:10:13',0),
(4,3,'2020-03-27 12:10:14',0),
(5,2,'2020-04-30 11:13:07',1);

-- FAVORITES
INSERT INTO favorites (
    user_id,
    reading_id,
    created_at
) VALUES
(1,2,'2020-07-24 20:14:25'),
(2,1,'2020-05-26 14:19:00'),
(2,4,'2020-05-26 14:18:52'),
(2,19,'2020-05-26 14:18:48'),
(2,35,'2020-05-26 14:18:46'),
(4,15,'2020-05-28 18:39:10'),
(4,16,'2020-05-28 20:24:38'),
(5,13,'2020-08-08 23:04:39'),
(5,45,'2020-08-08 23:04:41');

-- READING TAGS
INSERT INTO reading_tags (
    reading_id,
    tag_id
) VALUES
(35,1),
(36,2),
(37,3),
(40,3),
(44,4),
(45,2),
(46,2),
(47,3),
(50,1);

-- USER READINGS
INSERT INTO user_readings (
    user_id,
    reading_id
) VALUES
(1,2),
(1,5),
(1,6),
(1,29),
(1,30),
(1,31),
(1,47),
(1,48),
(2,1),
(2,4),
(2,9),
(2,17),
(2,18),
(2,19),
(2,33),
(2,35),
(2,36),
(2,37),
(2,38),
(2,41),
(2,46),
(3,3),
(3,7),
(3,8),
(3,14),
(3,34),
(3,39),
(3,40),
(4,10),
(4,15),
(4,16),
(4,24),
(4,25),
(4,26),
(4,27),
(4,28),
(4,42),
(4,43),
(4,50),
(5,11),
(5,12),
(5,13),
(5,20),
(5,21),
(5,22),
(5,23),
(5,32),
(5,44),
(5,45),
(5,49);

-- USER TAGS
INSERT INTO user_tags (
    user_id,
    tag_id
) VALUES
(1,3),
(2,1),
(2,2),
(2,3),
(2,2),
(3,3),
(4,1),
(5,4),
(5,2);

'SELECT 
    user_readings.reading_id,
    readings.title,
    readings.domain,
    readings.description,
    readings.image as readings_image,
    readings.word_count,
    readings.url,
    readings.created_at,
    user_readings.user_id,
    users.username,
    users.image,
    favorites.user_id as favorite,
    GROUP_CONCAT(reading_tags.tag_id) as tag_ids
FROM user_readings
LEFT JOIN readings ON readings.id = user_readings.reading_id
LEFT JOIN users ON users.id = user_readings.user_id
LEFT JOIN favorites on favorites.reading_id = user_readings.reading_id
LEFT JOIN reading_tags on reading_tags.reading_id = user_readings.reading_id
GROUP BY 
    user_readings.reading_id,
    readings.title,
    readings.domain,
    readings.description,
    readings.image,
    readings.word_count,
    readings.url,
    readings.created_at,
    user_readings.user_id,
    users.username,
    users.image,
    favorites.user_id
ORDER BY user_readings.reading_id'
