-- =========================================
-- skill stack — seed data
-- Run after schema.sql
-- =========================================

insert into courses (slug, title, description, icon, sort_order)
values ('javascript-basics', 'JavaScript Basics', 'Variables, arrays, and functions', '🟨', 1)
on conflict (slug) do nothing;

-- Lesson 1: Variables & Types
with c as (select id from courses where slug = 'javascript-basics')
insert into lessons (course_id, title, sort_order)
select id, 'Variables & Types', 1 from c
returning id;

-- Lesson 2: Arrays
with c as (select id from courses where slug = 'javascript-basics')
insert into lessons (course_id, title, sort_order)
select id, 'Arrays', 2 from c
returning id;

-- Lesson 3: Functions
with c as (select id from courses where slug = 'javascript-basics')
insert into lessons (course_id, title, sort_order)
select id, 'Functions', 3 from c
returning id;

-- ---- Questions for Lesson 1: Variables & Types ----
with l as (
  select id from lessons
  where title = 'Variables & Types'
  and course_id = (select id from courses where slug = 'javascript-basics')
)
insert into questions (lesson_id, type, prompt, code_snippet, options, correct_answer, explanation, sort_order)
select id, 'code_output',
  'What does this log?',
  E'let x = "5";\nlet y = 5;\nconsole.log(x == y);',
  '["true", "false", "undefined", "NaN"]'::jsonb,
  'true',
  '== compares values after type coercion, so "5" and 5 are considered equal.',
  1
from l
union all
select id, 'multiple_choice',
  'Which keyword declares a block-scoped, reassignable variable?',
  null,
  '["var", "let", "const", "function"]'::jsonb,
  'let',
  'let is block-scoped and reassignable. const is block-scoped but not reassignable, var is function-scoped.',
  2
from l
union all
select id, 'code_output',
  'What is the type of this value?',
  E'typeof null;',
  '["\"object\"", "\"null\"", "\"undefined\"", "\"boolean\""]'::jsonb,
  '"object"',
  'This is a famous JavaScript quirk — typeof null returns "object" due to a legacy bug kept for compatibility.',
  3
from l;

-- ---- Questions for Lesson 2: Arrays ----
with l as (
  select id from lessons
  where title = 'Arrays'
  and course_id = (select id from courses where slug = 'javascript-basics')
)
insert into questions (lesson_id, type, prompt, code_snippet, options, correct_answer, explanation, sort_order)
select id, 'code_output',
  'What does this log?',
  E'const nums = [1, 2, 3];\nconsole.log(nums.map(n => n * 2));',
  '["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "6", "undefined"]'::jsonb,
  '[2, 4, 6]',
  '.map() returns a new array with the function applied to every element.',
  1
from l
union all
select id, 'multiple_choice',
  'Which method removes the last element of an array and returns it?',
  null,
  '["shift()", "pop()", "slice()", "splice()"]'::jsonb,
  'pop()',
  'pop() removes and returns the last element. shift() does the same for the first element.',
  2
from l
union all
select id, 'code_output',
  'What does this log?',
  E'const arr = [1, 2, 3];\nconsole.log(arr.filter(n => n > 1));',
  '["[2, 3]", "[1]", "true", "[1, 2, 3]"]'::jsonb,
  '[2, 3]',
  '.filter() keeps only the elements for which the callback returns true.',
  3
from l
union all
select id, 'multiple_choice',
  'What does Array.isArray([]) return?',
  null,
  '["true", "false", "undefined", "TypeError"]'::jsonb,
  'true',
  'Array.isArray() checks specifically for arrays, unlike typeof which returns "object" for arrays too.',
  4
from l;

-- ---- Questions for Lesson 3: Functions ----
with l as (
  select id from lessons
  where title = 'Functions'
  and course_id = (select id from courses where slug = 'javascript-basics')
)
insert into questions (lesson_id, type, prompt, code_snippet, options, correct_answer, explanation, sort_order)
select id, 'code_output',
  'What does this log?',
  E'const add = (a, b) => a + b;\nconsole.log(add(2, 3));',
  '["5", "23", "undefined", "NaN"]'::jsonb,
  '5',
  'Arrow functions with an implicit return give back the result of the expression — here, 2 + 3.',
  1
from l
union all
select id, 'multiple_choice',
  'What is the default value of a parameter that is not passed to a function?',
  null,
  '["null", "0", "undefined", "false"]'::jsonb,
  'undefined',
  'Missing arguments are undefined unless a default value is specified in the function signature.',
  2
from l
union all
select id, 'code_output',
  'What does this log?',
  E'function greet(name = "friend") {\n  return `Hi, ${name}!`;\n}\nconsole.log(greet());',
  '["Hi, friend!", "Hi, undefined!", "Hi, !", "Error"]'::jsonb,
  'Hi, friend!',
  'Default parameters kick in when the argument is omitted (or explicitly undefined).',
  3
from l;
