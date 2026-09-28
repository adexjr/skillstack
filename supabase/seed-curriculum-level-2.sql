-- Second-stage lessons and practice for every SkillStack track.
-- Run after seed-catalog.sql. Safe to rerun; existing lessons/questions are kept.

begin;

with curriculum(course_slug, lesson_title, lesson_order) as (
  values
    ('javascript-basics', 'DOM and Events', 4),
    ('javascript-basics', 'Asynchronous JavaScript', 5),
    ('python-basics', 'Dictionary Patterns', 4),
    ('python-basics', 'Exceptions and Validation', 5),
    ('html-foundations', 'Images and Media', 4),
    ('html-foundations', 'Accessible Pages', 5),
    ('css-foundations', 'CSS Grid', 4),
    ('css-foundations', 'Responsive Design', 5),
    ('react-basics', 'State and Effects', 4),
    ('react-basics', 'Forms and Composition', 5),
    ('sql-basics', 'Constraints and Data Integrity', 4),
    ('sql-basics', 'Indexes and Query Planning', 5),
    ('cpp-foundations', 'Functions and Scope', 4),
    ('cpp-foundations', 'Vectors and Strings', 5)
)
insert into lessons (course_id, title, sort_order)
select courses.id, curriculum.lesson_title, curriculum.lesson_order
from curriculum
join courses on courses.slug = curriculum.course_slug
where not exists (
  select 1
  from lessons existing
  where existing.course_id = courses.id
    and existing.title = curriculum.lesson_title
);

with question_seed(
  course_slug, lesson_title, question_order, question_type, prompt,
  code_snippet, options, correct_answer, explanation
) as (
  values
    ('javascript-basics', 'DOM and Events', 1, 'multiple_choice',
      'Which method selects the first element matching a CSS selector?', null,
      jsonb_build_array('document.querySelector()', 'document.getElementsByTagName()', 'document.createElement()', 'window.matchMedia()'),
      'document.querySelector()',
      'querySelector accepts a CSS selector and returns the first matching element, or null.'),
    ('javascript-basics', 'DOM and Events', 2, 'code_output',
      'What does the click handler display?',
      $code$const button = document.querySelector("button");
button.addEventListener("click", () => console.log("Saved"));
button.click();$code$,
      jsonb_build_array('Saved', 'click', 'undefined', 'Nothing'),
      'Saved',
      'Calling click dispatches a click event, so the registered handler logs Saved.'),
    ('javascript-basics', 'DOM and Events', 3, 'multiple_choice',
      'When should event delegation be useful?', null,
      jsonb_build_array('When many child elements share one parent listener', 'When preventing all browser events', 'When loading a script module', 'When converting a string to a number'),
      'When many child elements share one parent listener',
      'A parent can handle bubbled events from many descendants, reducing per-element listeners.'),

    ('javascript-basics', 'Asynchronous JavaScript', 1, 'code_output',
      'What is logged first?',
      $code$console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");$code$,
      jsonb_build_array('A, then C, then B', 'A, then B, then C', 'B, then A, then C', 'C, then B, then A'),
      'A, then C, then B',
      'Synchronous statements finish before the timer callback runs, even with a zero delay.'),
    ('javascript-basics', 'Asynchronous JavaScript', 2, 'multiple_choice',
      'What does an async function always return?', null,
      jsonb_build_array('A Promise', 'A callback', 'A generator', 'A DOM element'),
      'A Promise',
      'An async function wraps its returned value in a Promise; thrown errors become rejections.'),
    ('javascript-basics', 'Asynchronous JavaScript', 3, 'code_output',
      'What value does this await expression produce?',
      $code$async function getScore() {
  return 12;
}
const score = await getScore();$code$,
      jsonb_build_array('12', 'Promise {12}', 'undefined', 'null'),
      '12',
      'Await unwraps the fulfilled Promise value, so score receives the number 12.'),

    ('python-basics', 'Dictionary Patterns', 1, 'code_output',
      'What value is printed?',
      $code$profile = {"name": "Mina", "level": 3}
print(profile.get("level"))$code$,
      jsonb_build_array('3', 'level', 'None', 'KeyError'),
      '3',
      'get returns the value stored for an existing key.'),
    ('python-basics', 'Dictionary Patterns', 2, 'multiple_choice',
      'Which expression safely returns 0 when a key is missing?', null,
      jsonb_build_array('scores.get("bonus", 0)', 'scores["bonus"]', 'scores.find("bonus")', 'scores.value("bonus", 0)'),
      'scores.get("bonus", 0)',
      'dict.get(key, default) returns the default when the key is absent instead of raising KeyError.'),
    ('python-basics', 'Dictionary Patterns', 3, 'code_output',
      'What keys are in doubled?',
      $code$values = {"a": 2, "b": 4}
doubled = {key: value * 2 for key, value in values.items()}
print(list(doubled.keys()))$code$,
      jsonb_build_array('["a", "b"]', '[2, 4]', '["aa", "bb"]', '[]'),
      '["a", "b"]',
      'The comprehension preserves each original key and transforms the corresponding value.'),

    ('python-basics', 'Exceptions and Validation', 1, 'multiple_choice',
      'Which block handles an exception raised in a try block?', null,
      jsonb_build_array('except', 'catch', 'rescue', 'finally'),
      'except',
      'Python uses except to handle exceptions; finally is for cleanup that should always run.'),
    ('python-basics', 'Exceptions and Validation', 2, 'code_output',
      'What does this print?',
      $code$try:
    number = int("cat")
except ValueError:
    print("Try a number")$code$,
      jsonb_build_array('Try a number', 'cat', 'ValueError', 'Nothing'),
      'Try a number',
      'Converting cat to an integer raises ValueError, which is handled by the except block.'),
    ('python-basics', 'Exceptions and Validation', 3, 'multiple_choice',
      'Why should code catch a specific exception type?', null,
      jsonb_build_array('To handle expected failures without hiding unrelated bugs', 'To make every error disappear', 'To skip input validation', 'To automatically retry every operation'),
      'To handle expected failures without hiding unrelated bugs',
      'Specific handlers keep expected recovery paths clear and allow unexpected errors to surface.'),

    ('html-foundations', 'Images and Media', 1, 'multiple_choice',
      'Which attribute provides a text alternative for an informative image?', null,
      jsonb_build_array('alt', 'title', 'caption', 'label'),
      'alt',
      'The alt attribute provides a text alternative for assistive technology and when an image cannot load.'),
    ('html-foundations', 'Images and Media', 2, 'multiple_choice',
      'Which element associates a visible caption with an image?', null,
      jsonb_build_array('<figure> with <figcaption>', '<picture> with <legend>', '<img> with <summary>', '<media> with <caption>'),
      '<figure> with <figcaption>',
      'A figure can group self-contained media with a figcaption that provides its caption.'),
    ('html-foundations', 'Images and Media', 3, 'multiple_choice',
      'Which attribute hints that a below-the-fold image can load later?', null,
      jsonb_build_array('loading="lazy"', 'decoding="async"', 'fetch="later"', 'defer="true"'),
      'loading="lazy"',
      'Native lazy loading lets the browser defer offscreen images until they approach the viewport.'),

    ('html-foundations', 'Accessible Pages', 1, 'multiple_choice',
      'What is the main purpose of a page landmark such as <nav>?', null,
      jsonb_build_array('Help users identify and navigate major page regions', 'Apply a default font size', 'Make every link open a new tab', 'Replace the document title'),
      'Help users identify and navigate major page regions',
      'Semantic landmarks expose meaningful regions so assistive technology users can move around efficiently.'),
    ('html-foundations', 'Accessible Pages', 2, 'multiple_choice',
      'How should a heading hierarchy generally be structured?', null,
      jsonb_build_array('Use headings in a logical outline without skipping levels for styling', 'Choose heading tags only by their default font size', 'Use h1 for every paragraph', 'Use headings only inside a header element'),
      'Use headings in a logical outline without skipping levels for styling',
      'Heading levels communicate document structure; CSS should control appearance.'),
    ('html-foundations', 'Accessible Pages', 3, 'multiple_choice',
      'What should a form label do?', null,
      jsonb_build_array('Programmatically identify the purpose of its input', 'Provide placeholder text only', 'Submit the form automatically', 'Hide validation messages'),
      'Programmatically identify the purpose of its input',
      'A connected label gives the control an accessible name and a larger click target.'),

    ('css-foundations', 'CSS Grid', 1, 'multiple_choice',
      'Which declaration creates a two-column grid?', null,
      jsonb_build_array('grid-template-columns: 1fr 1fr;', 'grid-columns: 2;', 'display: columns;', 'grid-template-rows: 1fr 1fr;'),
      'grid-template-columns: 1fr 1fr;',
      'grid-template-columns defines the grid tracks; two 1fr tracks share available space equally.'),
    ('css-foundations', 'CSS Grid', 2, 'code_output',
      'How many explicit columns are defined?',
      $code$.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}$code$,
      jsonb_build_array('3', '1', '6', 'It depends on the item count'),
      '3',
      'repeat(3, 1fr) creates three equal-width column tracks.'),
    ('css-foundations', 'CSS Grid', 3, 'multiple_choice',
      'Which property adds space between grid tracks?', null,
      jsonb_build_array('gap', 'padding', 'outline-offset', 'text-indent'),
      'gap',
      'The gap shorthand sets spacing between grid rows and columns.'),

    ('css-foundations', 'Responsive Design', 1, 'multiple_choice',
      'What does a media query let a stylesheet do?', null,
      jsonb_build_array('Apply styles when viewport or device conditions match', 'Load a JavaScript module', 'Create a new HTML element', 'Validate form data'),
      'Apply styles when viewport or device conditions match',
      'Media queries let layouts adapt to conditions such as viewport width.'),
    ('css-foundations', 'Responsive Design', 2, 'code_output',
      'At a viewport width of 700px, what is the container width?',
      $code$.container { width: 100%; }
@media (min-width: 600px) {
  .container { width: 80%; }
}$code$,
      jsonb_build_array('80%', '100%', '600px', '0%'),
      '80%',
      'The 600px minimum-width condition matches at 700px, so the later rule sets width to 80%.'),
    ('css-foundations', 'Responsive Design', 3, 'multiple_choice',
      'Why use minmax() in a responsive grid track?', null,
      jsonb_build_array('Set a minimum and maximum size for a flexible track', 'Set a fixed viewport width', 'Create a breakpoint without a media query', 'Change the HTML display order'),
      'Set a minimum and maximum size for a flexible track',
      'minmax(min, max) lets a grid track flex while respecting size bounds.'),

    ('react-basics', 'State and Effects', 1, 'multiple_choice',
      'What causes React to render again after a state update?', null,
      jsonb_build_array('React schedules an update when a state setter receives a new value', 'Every local variable assignment', 'A component name change', 'Every browser paint'),
      'React schedules an update when a state setter receives a new value',
      'State setters schedule rendering; changing an ordinary local variable does not.'),
    ('react-basics', 'State and Effects', 2, 'multiple_choice',
      'When should an effect cleanup function run?', null,
      jsonb_build_array('Before the effect re-runs and when the component unmounts', 'Only when the browser closes', 'Before every render, including the first', 'Only after a failed request'),
      'Before the effect re-runs and when the component unmounts',
      'Cleanup releases resources from the previous effect before replacement or unmount.'),
    ('react-basics', 'State and Effects', 3, 'multiple_choice',
      'What does an empty dependency array mean for a client-side effect?', null,
      jsonb_build_array('Run after the initial mount, then clean up on unmount', 'Run after every state update', 'Never run', 'Run only during server rendering'),
      'Run after the initial mount, then clean up on unmount',
      'An empty dependency list means the effect has no reactive dependencies.'),

    ('react-basics', 'Forms and Composition', 1, 'multiple_choice',
      'What makes a React input controlled?', null,
      jsonb_build_array('Its value comes from React state and changes through an event handler', 'It has a required attribute', 'It is inside a form element', 'It uses a CSS class'),
      'Its value comes from React state and changes through an event handler',
      'A controlled input receives its current value from state and updates through onChange.'),
    ('react-basics', 'Forms and Composition', 2, 'multiple_choice',
      'Why pass children to a reusable layout component?', null,
      jsonb_build_array('To let callers compose content inside the shared layout', 'To make the component render twice', 'To avoid using props', 'To force a client-side route'),
      'To let callers compose content inside the shared layout',
      'The children prop is the standard way to compose nested content in React.'),
    ('react-basics', 'Forms and Composition', 3, 'multiple_choice',
      'When is a form submit handler the right place for validation?', null,
      jsonb_build_array('Before saving or sending the submitted values', 'Only after the component unmounts', 'Before every keystroke regardless of UX', 'Inside a CSS selector'),
      'Before saving or sending the submitted values',
      'Submission validation checks the final values before performing the requested action.'),

    ('sql-basics', 'Constraints and Data Integrity', 1, 'multiple_choice',
      'What does a primary key guarantee?', null,
      jsonb_build_array('Each row has a unique, non-null identifier', 'Every column contains text', 'Rows are stored in alphabetical order', 'Related rows are deleted automatically'),
      'Each row has a unique, non-null identifier',
      'A primary key enforces uniqueness and non-null identity for each row.'),
    ('sql-basics', 'Constraints and Data Integrity', 2, 'multiple_choice',
      'What does a foreign key enforce?', null,
      jsonb_build_array('A reference points to a valid row in another table', 'A column contains no duplicate values', 'A query uses an index', 'A value is always positive'),
      'A reference points to a valid row in another table',
      'A foreign key maintains referential integrity between related tables.'),
    ('sql-basics', 'Constraints and Data Integrity', 3, 'multiple_choice',
      'Which constraint prevents a column from storing NULL?', null,
      jsonb_build_array('NOT NULL', 'UNIQUE', 'DEFAULT', 'CHECK'),
      'NOT NULL',
      'NOT NULL requires every inserted row to provide a value for that column.'),

    ('sql-basics', 'Indexes and Query Planning', 1, 'multiple_choice',
      'What is the primary purpose of a database index?', null,
      jsonb_build_array('Speed up lookups and sorting for selected queries', 'Guarantee all queries are faster', 'Replace a primary key', 'Store a backup copy of every table'),
      'Speed up lookups and sorting for selected queries',
      'Indexes can reduce lookup cost, but they consume space and add write overhead.'),
    ('sql-basics', 'Indexes and Query Planning', 2, 'multiple_choice',
      'What is a tradeoff of adding many indexes?', null,
      jsonb_build_array('Writes can become slower and storage use increases', 'SELECT statements stop working', 'Constraints are disabled', 'Tables can no longer be joined'),
      'Writes can become slower and storage use increases',
      'Each affected insert, update, or delete may also need to maintain its indexes.'),
    ('sql-basics', 'Indexes and Query Planning', 3, 'multiple_choice',
      'Which tool helps inspect how a query will be executed?', null,
      jsonb_build_array('EXPLAIN', 'DESCRIBE ONLY', 'CHECK QUERY', 'SHOW PLAN TEXT'),
      'EXPLAIN',
      'EXPLAIN displays the planner’s chosen execution plan for a statement.'),

    ('cpp-foundations', 'Functions and Scope', 1, 'multiple_choice',
      'What is a function parameter?', null,
      jsonb_build_array('A named input declared in a function signature', 'A value printed by cout', 'A loop condition', 'A header file'),
      'A named input declared in a function signature',
      'Parameters name the inputs a function accepts; arguments are the values passed at a call site.'),
    ('cpp-foundations', 'Functions and Scope', 2, 'code_output',
      'What is printed?',
      $code$int add(int left, int right) {
  return left + right;
}
std::cout << add(3, 4);$code$,
      jsonb_build_array('7', '34', '3', '4'),
      '7',
      'add returns the sum of its two integer arguments.'),
    ('cpp-foundations', 'Functions and Scope', 3, 'multiple_choice',
      'Where is a variable declared inside a function normally in scope?', null,
      jsonb_build_array('Inside that function block', 'Every source file', 'Only inside main', 'Inside the compiler'),
      'Inside that function block',
      'A local variable is available within its enclosing block and not outside it.'),

    ('cpp-foundations', 'Vectors and Strings', 1, 'multiple_choice',
      'Which standard container grows dynamically and stores a sequence?', null,
      jsonb_build_array('std::vector', 'std::array', 'std::pair', 'std::tuple'),
      'std::vector',
      'std::vector is a dynamically sized sequence container from the standard library.'),
    ('cpp-foundations', 'Vectors and Strings', 2, 'code_output',
      'What value does values.size() return?',
      $code$std::vector<int> values{2, 4, 6};
std::cout << values.size();$code$,
      jsonb_build_array('3', '2', '6', '0'),
      '3',
      'The vector contains three elements, so size() returns 3.'),
    ('cpp-foundations', 'Vectors and Strings', 3, 'multiple_choice',
      'Which standard header declares std::string?', null,
      jsonb_build_array('<string>', '<vector>', '<iostream>', '<algorithm>'),
      '<string>',
      'Include the string header to use std::string.' )
)
insert into questions (
  lesson_id, type, prompt, code_snippet, options,
  correct_answer, explanation, sort_order
)
select
  lessons.id,
  question_seed.question_type,
  question_seed.prompt,
  question_seed.code_snippet,
  question_seed.options,
  question_seed.correct_answer,
  question_seed.explanation,
  question_seed.question_order
from question_seed
join courses on courses.slug = question_seed.course_slug
join lessons
  on lessons.course_id = courses.id
  and lessons.title = question_seed.lesson_title
where not exists (
  select 1
  from questions existing
  where existing.lesson_id = lessons.id
    and existing.prompt = question_seed.prompt
);

commit;
