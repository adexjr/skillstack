-- Additional beginner learning tracks for SkillStack.
-- Run after schema.sql. Safe to rerun: existing catalog rows are preserved.

begin;

-- Python and SQL already exist as Basics tracks in the starter catalog.
delete from courses
where slug in ('python-foundations', 'sql-foundations');

insert into courses (slug, title, description, icon, sort_order)
values
  ('html-foundations', 'HTML Foundations', 'Build clear, semantic page structures', 'HTML', 2),
  ('css-foundations', 'CSS Foundations', 'Style interfaces with layout and responsive rules', 'CSS', 3),
  ('cpp-foundations', 'C++ Foundations', 'Learn types, decisions, and repetition', 'C++', 4)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

with curriculum(slug, lesson_title, lesson_order) as (
  values
    ('html-foundations', 'Document Structure', 1),
    ('html-foundations', 'Semantic Elements', 2),
    ('html-foundations', 'Links and Forms', 3),
    ('css-foundations', 'Selectors and Cascade', 1),
    ('css-foundations', 'The Box Model', 2),
    ('css-foundations', 'Flexbox Layout', 3),
    ('cpp-foundations', 'Variables and Types', 1),
    ('cpp-foundations', 'Conditions', 2),
    ('cpp-foundations', 'Loops', 3)
)
insert into lessons (course_id, title, sort_order)
select courses.id, curriculum.lesson_title, curriculum.lesson_order
from curriculum
join courses on courses.slug = curriculum.slug
where not exists (
  select 1
  from lessons existing
  where existing.course_id = courses.id
    and existing.title = curriculum.lesson_title
);

with question_seed(
  slug, lesson_title, question_order, question_type, prompt,
  code_snippet, options, correct_answer, explanation
) as (
  values
    ('html-foundations', 'Document Structure', 1, 'multiple_choice',
      'Which declaration tells the browser to use modern HTML?', null,
      jsonb_build_array('<!DOCTYPE html>', '<html5>', '<doctype modern>', '<meta html="5">'),
      '<!DOCTYPE html>',
      'The doctype declaration puts the browser into standards mode for HTML documents.'),
    ('html-foundations', 'Document Structure', 2, 'multiple_choice',
      'Where does visible page content belong?', null,
      jsonb_build_array('<head>', '<body>', '<title>', '<meta>'),
      '<body>',
      'The body contains the document content shown in the browser. The head contains metadata and resource references.'),
    ('html-foundations', 'Semantic Elements', 1, 'multiple_choice',
      'Which element is intended for a page’s main, unique content?', null,
      jsonb_build_array('<main>', '<section>', '<aside>', '<div>'),
      '<main>',
      'A document should normally have one main element identifying its primary content.'),
    ('html-foundations', 'Semantic Elements', 2, 'multiple_choice',
      'Which element best represents a self-contained post that could stand on its own?', null,
      jsonb_build_array('<article>', '<span>', '<nav>', '<footer>'),
      '<article>',
      'Article is designed for independently reusable content such as a post, news item, or forum entry.'),
    ('html-foundations', 'Links and Forms', 1, 'multiple_choice',
      'Which attribute sets the destination of a link?', null,
      jsonb_build_array('href', 'src', 'action', 'target'),
      'href',
      'An anchor’s href attribute contains the URL or page location it navigates to.'),
    ('html-foundations', 'Links and Forms', 2, 'multiple_choice',
      'Which label attribute connects a label to an input with id="email"?', null,
      jsonb_build_array('for="email"', 'id="email"', 'name="email"', 'href="email"'),
      'for="email"',
      'The label’s for value must match the input id, making the form control easier to identify and activate.'),

    ('css-foundations', 'Selectors and Cascade', 1, 'multiple_choice',
      'Which selector targets every element with class="notice"?', null,
      jsonb_build_array('.notice', '#notice', 'notice', '*notice'),
      '.notice',
      'A dot selects a class in CSS. A hash selects an id, while a bare name selects an element type.'),
    ('css-foundations', 'Selectors and Cascade', 2, 'code_output',
      'What color does the paragraph have?',
      $code$<style>
p { color: navy; }
.note { color: tomato; }
</style>
<p class="note">Hello</p>$code$,
      jsonb_build_array('tomato', 'navy', 'black', 'transparent'),
      'tomato',
      'Both rules match, but the class selector is more specific than the element selector.'),
    ('css-foundations', 'The Box Model', 1, 'multiple_choice',
      'Which box-model layer adds space between the content and border?', null,
      jsonb_build_array('padding', 'margin', 'outline', 'gap'),
      'padding',
      'Padding is inside the border and surrounds the content. Margin is outside the border.'),
    ('css-foundations', 'The Box Model', 2, 'code_output',
      'With the default content-box model, what is the rendered width?',
      $code$div {
  width: 120px;
  padding: 10px;
  border: 2px solid;
}$code$,
      jsonb_build_array('144px', '120px', '140px', '124px'),
      '144px',
      'Content-box adds left and right padding and borders: 120 + 20 + 4 = 144 pixels.'),
    ('css-foundations', 'Flexbox Layout', 1, 'multiple_choice',
      'Which property aligns flex items along the main axis?', null,
      jsonb_build_array('justify-content', 'align-items', 'flex-wrap', 'align-content'),
      'justify-content',
      'justify-content distributes items along the main axis. align-items controls the cross axis.'),
    ('css-foundations', 'Flexbox Layout', 2, 'code_output',
      'How many pixels separate the two flex items?',
      $code$<div class="row">
  <span>A</span><span>B</span>
</div>
<style>
.row { display: flex; gap: 12px; }
</style>$code$,
      jsonb_build_array('12px', '0px', '24px', 'It depends on margin'),
      '12px',
      'The gap property adds 12 pixels of spacing between adjacent flex items.'),

    ('cpp-foundations', 'Variables and Types', 1, 'multiple_choice',
      'Which type is commonly used for a whole number in C++?', null,
      jsonb_build_array('int', 'bool', 'char', 'void'),
      'int',
      'int stores integer values. bool stores true/false and char stores a character.'),
    ('cpp-foundations', 'Variables and Types', 2, 'code_output',
      'What value is printed?',
      $code$int score = 7;
score += 3;
std::cout << score;$code$,
      jsonb_build_array('10', '73', '7', '3'),
      '10',
      'The += operator adds 3 to score, changing its value from 7 to 10.'),
    ('cpp-foundations', 'Conditions', 1, 'multiple_choice',
      'Which operator checks whether two values are equal?', null,
      jsonb_build_array('==', '=', '!=', '&&'),
      '==',
      'Double equals compares values. A single equals assigns a value.'),
    ('cpp-foundations', 'Conditions', 2, 'code_output',
      'What does this program print?',
      $code$int temperature = 18;
if (temperature >= 20) {
  std::cout << "warm";
} else {
  std::cout << "cool";
}$code$,
      jsonb_build_array('cool', 'warm', '18', 'Nothing'),
      'cool',
      '18 is less than 20, so the else branch prints cool.'),
    ('cpp-foundations', 'Loops', 1, 'code_output',
      'How many times does the loop body run?',
      $code$for (int i = 0; i < 4; i++) {
  std::cout << i;
}$code$,
      jsonb_build_array('4', '3', '5', '1'),
      '4',
      'The loop runs for i values 0, 1, 2, and 3: four iterations.'),
    ('cpp-foundations', 'Loops', 2, 'multiple_choice',
      'Which keyword skips to the next loop iteration?', null,
      jsonb_build_array('continue', 'break', 'return', 'case'),
      'continue',
      'continue skips the rest of the current iteration. break exits the loop.')
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
join courses on courses.slug = question_seed.slug
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