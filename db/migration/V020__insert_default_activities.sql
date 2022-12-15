INSERT INTO principals () VALUES ();
SET @principalId = LAST_INSERT_ID();

INSERT INTO curriculums (principal_id, title) VALUES
  (@principalId, 'Custom Curriculum'),
  (@principalId, 'Professional Mentorship Program');
SET @curriculumId = LAST_INSERT_ID();

INSERT INTO programs (title, start_date, end_date, time_zone, principal_id, curriculum_id) VALUES
  ('Cohort 4', '2022-10-24', '2022-12-16', 'America/Vancouver', @principalId, @curriculumId);

INSERT INTO activities (title, description_text, curriculum_week, curriculum_day, start_time, end_time, duration, activity_type_id, curriculum_id) VALUES
-- Week 1, Day 1:
  -- Tasks / All-day Activities:
  ('Program Preparation', 'Configure your local development environment and complete any other pre-program assignments.', 1, 1, NULL, NULL, NULL, 1, @curriculumId),
  -- Scheduled Activities:
  ('Welcome Meeting', 'Welcome to our program! Join our discussion in Discord to introduce yourself, learn more about the Professional Mentorship Program, and to get a feel for what the next eight weeks have in store for us.', 1, 1, '10:00:00', '12:00:00', 120, 9, @curriculumId),
-- Week 1, Day 2:
  -- Scheduled Activities:
  ('Repository Onboarding', 'Get more acquainted with our product&#8217;s GitHub repository. Become familiar with our contribution guidelines, processes supporting a branching workflow, and technology stack.', 1, 2, '10:00:00', '12:00:00', 120, 9, @curriculumId),
-- Week 1, Day 3:
  -- Scheduled Activities:
  ('Product Brief', 'Review the product brief with the product owners to understand the major feature that will be developed throughout the program.', 1, 3, '10:00:00', '12:00:00', 120, 9, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 1, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 1, Day 4:
  -- Scheduled Activities:
  ('Agile Project Management', 'Learn or review the agile project management methodology that will be used in the rest of the course.', 1, 4, '10:00:00', '12:00:00', 120, 9, @curriculumId),
-- Week 1, Day 5:
  -- Scheduled Activities:
  ('Self-assessment', 'Learn how to complete a self-assessment and how we chart progress and growth throughout the program.', 1, 5, '10:00:00', '12:00:00', 120, 8, @curriculumId),

-- Week 2, Day 1:
  -- Tasks / All-day Activities:
  ('Product Specification Due', 'Modifications to the product specification should be completed by today, and the product specification will be handed off to the product team and will be locked to ensure no feature creep during the rest of the program.', 2, 1, NULL, NULL, NULL, 1, @curriculumId),
  -- Scheduled Activities:
  ('Prototype Planning', 'Review the tasks necessary to complete a working prototype of each pair programming group&#8217;s approach to how the product should look by the end of the program. The prototype should be ready to demonstrate by the end of the week.', 2, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 2, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 2, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 2, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 2, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 2, Day 3:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 2, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 2, 3, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 2, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 2, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 2, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 2, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 2, Day 5:
  -- Scheduled Activities:
  ('Prototyping Demo &amp; Retrospective', 'Demonstrate the features of your prototype and collaborate with the rest of the cohort on an approach to create the final product using the best features from each prototype.', 2, 5, '10:00:00', '12:00:00', 120, 8, @curriculumId),

-- Week 3, Day 1:
  -- Scheduled Activities:
  ('Sprint Planning', 'Plan the tasks to be accomplished by the end of the sprint, create issues for the tasks, and assign the issues to their owners.', 3, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 3, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 3, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 3, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 3, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 3, Day 3:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 3, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 3, 3, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('One-on-one Mentorship Hours', 'Depending on their availability, mentors will host mentorship sessions one-on-one with mentees to talk about program progress, job search progress, or any other professional growth topics on the mind of mentees.', 3, 3, '14:00:00', '16:00:00', 120, 6, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 3, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 3, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 3, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 3, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('One-on-one Mentorship Hours', 'Depending on their availability, mentors will host mentorship sessions one-on-one with mentees to talk about program progress, job search progress, or any other professional growth topics on the mind of mentees.', 3, 4, '14:00:00', '18:00:00', 240, 6, @curriculumId),
-- Week 3, Day 5:
  -- Scheduled Activities:
  ('Sprint Review', 'Review the week&#8217;s progress on the assigned issues, update the product backlog, and assess what still needs to be done to accomplish any remaining tasks.', 3, 5, '10:00:00', '10:50:00', 50, 8, @curriculumId),
  ('Sprint Retrospective', 'Share observations from the sprint, group them into themes, and plan ways to increase quality and effectiveness of future sprints.', 3, 5, '11:00:00', '12:00:00', 60, 8, @curriculumId),

-- Week 4, Day 1:
  -- Scheduled Activities:
  ('Sprint Planning', 'Plan the tasks to be accomplished by the end of the sprint, create issues for the tasks, and assign the issues to their owners.', 4, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 4, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 4, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 4, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 4, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 4, Day 3:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 4, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 4, 3, '11:00:00', '12:50:00', 110, 5, @curriculumId),
  ('Workshop Wednesday', 'Grow your soft skills to learn how to be a better developer, better teammate, and better co-worker. Being a full-stack engineer requires more skills than just being able to code.', 4, 3, '13:00:00', '14:00:00', 60, 7, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 4, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 4, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 4, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 4, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 4, Day 5:
  -- Scheduled Activities:
  ('Sprint Review', 'Review the week&#8217;s progress on the assigned issues, update the product backlog, and assess what still needs to be done to accomplish any remaining tasks.', 4, 5, '10:00:00', '10:50:00', 50, 8, @curriculumId),
  ('Sprint Retrospective', 'Share observations from the sprint, group them into themes, and plan ways to increase quality and effectiveness of future sprints.', 4, 5, '11:00:00', '12:00:00', 60, 8, @curriculumId),

-- Week 5, Day 1:
  -- Scheduled Activities:
  ('Sprint Planning', 'Plan the tasks to be accomplished by the end of the sprint, create issues for the tasks, and assign the issues to their owners.', 5, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 5, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 5, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 5, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 5, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 5, Day 3:
  -- Tasks / All-day Activities:
  ('Self-assessment', 'Mentees identify gaps in their knowledge, skills and abilities by performing a self-assessment of their functional, behavioural, strategic, organizational, and operational competencies.', 5, 3, NULL, NULL, NULL, 1, @curriculumId),
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 5, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 5, 3, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('One-on-one Mentorship Hours', 'Depending on their availability, mentors will host mentorship sessions one-on-one with mentees to talk about program progress, job search progress, or any other professional growth topics on the mind of mentees.', 5, 3, '14:00:00', '16:00:00', 120, 6, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 5, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 5, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 5, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Pair Programming', 'Work with your assigned pair programmer to accomplish this week&#8217;s tasks.', 5, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('One-on-one Mentorship Hours', 'Depending on their availability, mentors will host mentorship sessions one-on-one with mentees to talk about program progress, job search progress, or any other professional growth topics on the mind of mentees.', 5, 4, '14:00:00', '18:00:00', 240, 6, @curriculumId),
-- Week 5, Day 5:
  -- Scheduled Activities:
  ('Sprint Review', 'Review the week&#8217;s progress on the assigned issues, update the product backlog, and assess what still needs to be done to accomplish any remaining tasks.', 5, 5, '10:00:00', '10:50:00', 50, 8, @curriculumId),
  ('Sprint Retrospective', 'Share observations from the sprint, group them into themes, and plan ways to increase quality and effectiveness of future sprints.', 5, 5, '11:00:00', '12:00:00', 60, 8, @curriculumId),

-- Week 6, Day 1:
  -- Scheduled Activities:
  ('Sprint Planning', 'Plan the tasks to be accomplished by the end of the sprint, create issues for the tasks, and assign the issues to their owners.', 6, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 6, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 6, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 6, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 6, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 6, Day 3:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 6, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 6, 3, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 6, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 6, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 6, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 6, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 6, Day 5:
  -- Scheduled Activities:
  ('Sprint Review', 'Review the week&#8217;s progress on the assigned issues, update the product backlog, and assess what still needs to be done to accomplish any remaining tasks.', 6, 5, '10:00:00', '10:50:00', 50, 8, @curriculumId),
  ('Sprint Retrospective', 'Share observations from the sprint, group them into themes, and plan ways to increase quality and effectiveness of future sprints.', 6, 5, '11:00:00', '12:00:00', 60, 8, @curriculumId),

-- Week 7, Day 1:
  -- Scheduled Activities:
  ('Sprint Planning', 'Plan the tasks to be accomplished by the end of the sprint, create issues for the tasks, and assign the issues to their owners.', 7, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 7, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 7, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 7, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 7, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 7, Day 3:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 7, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 7, 3, '11:00:00', '12:50:00', 110, 5, @curriculumId),
  ('Workshop Wednesday', 'Grow your soft skills to learn how to be a better developer, better teammate, and better co-worker. Being a full-stack engineer requires more skills than just being able to code.', 7, 3, '13:00:00', '14:00:00', 60, 7, @curriculumId),
  ('One-on-one Mentorship Hours', 'Depending on their availability, mentors will host mentorship sessions one-on-one with mentees to talk about program progress, job search progress, or any other professional growth topics on the mind of mentees.', 7, 3, '14:00:00', '16:00:00', 120, 6, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 7, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 7, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 7, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 7, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('One-on-one Mentorship Hours', 'Depending on their availability, mentors will host mentorship sessions one-on-one with mentees to talk about program progress, job search progress, or any other professional growth topics on the mind of mentees.', 7, 4, '14:00:00', '18:00:00', 240, 6, @curriculumId),
-- Week 7, Day 5:
  -- Scheduled Activities:
  ('Sprint Review', 'Review the week&#8217;s progress on the assigned issues, update the product backlog, and assess what still needs to be done to accomplish any remaining tasks.', 7, 5, '10:00:00', '10:50:00', 50, 8, @curriculumId),
  ('Sprint Retrospective', 'Share observations from the sprint, group them into themes, and plan ways to increase quality and effectiveness of future sprints.', 7, 5, '11:00:00', '12:00:00', 60, 8, @curriculumId),

-- Week 8, Day 1:
  -- Scheduled Activities:
  ('Sprint Planning', 'Plan the final tasks to be accomplished to deliver the final product to the product team by the end of the sprint, create issues for the tasks, and assign the issues to their owners.', 8, 1, '10:00:00', '10:50:00', 50, 3, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 8, 1, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 8, Day 2:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 8, 2, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 8, 2, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 8, Day 3:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 8, 3, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 8, 3, '11:00:00', '14:00:00', 180, 5, @curriculumId),
  ('Pathways Meeting', 'Mentees are encouraged but not required to join Pathways meetings, sharing their progress in the job search, welcoming new members of the community, and—if desired and Pathways mentors are free—meeting with Pathways mentors for additional one-on-one mentorship.', 8, 3, '16:00:00', '18:00:00', 120, 9, @curriculumId),
-- Week 8, Day 4:
  -- Scheduled Activities:
  ('Morning Standup', 'Start the day by sharing your progress on this week&#8217;s assigned tasks, sharing what went well from the previous day and any roadblocks that are holding up forward progress on your assigned tasks.', 8, 4, '10:00:00', '10:50:00', 50, 4, @curriculumId),
  ('Bulk Development', 'Work on the assigned tasks independently. As always, make sure to review pull requests when they are filed and use your resources including other mentees and mentors when they are available.', 8, 4, '11:00:00', '14:00:00', 180, 5, @curriculumId),
-- Week 8, Day 5:
  -- Tasks / All-day Activities:
  ('Final Self-assessment', 'Mentees observe the growth in their knowledge, skills and abilities by performing a self-assessment of their functional, behavioural, strategic, organizational, and operational competencies and comparing their results to the beginning of the program.', 8, 5, NULL, NULL, NULL, 1, @curriculumId),
  ('Exit Survey', 'Mentees provide feedback on how the program progressed, and they (optionally) provide suggestions for improvement of the Professional Mentorship Program for the benefit of its future cohorts.', 8, 5, NULL, NULL, NULL, 1, @curriculumId),
  -- Scheduled Activities:
  ('Sprint Review', 'Review the week&#8217;s progress on the final issues, update the product backlog, and wrap up all development of the product feature.', 8, 5, '10:00:00', '10:50:00', 50, 8, @curriculumId),
  ('Program Retrospective', 'Share observations from the program, group them into themes, and share ideas on how to improve the program for future cohorts.', 8, 5, '11:00:00', '11:50:00', 50, 8, @curriculumId),
  ('End of Product Social', 'Mentors and mentees gather together for one last social event at the end of the program.', 8, 5, '12:00:00', '14:00:00', 120, 9, @curriculumId);
