import re
from app import models
from random import randint
from api_exceptions.api_exceptions import ParameterError

def parse_question(questions):
    separated_questions = _separate_questions(questions)
    parsed_questions = []
    for i in range(0, len(separated_questions), 2):
        try:
            name = separated_questions[i]
            print('question name: ', name)
            question = separated_questions[i+1]
            print('actual question: ', question)
            question_type = _get_type(question)
            points = _get_points(question)
            solution_space = _get_solution_space(question)
            ques = _get_question(question)
            solution = _get_solution(question)

            q = models.Question(id=random_with_n_digits(10),
                                course='',
                                subject='Computer Science',
                                name=name,
                                question_type=question_type,
                                points=points,
                                solution_space=solution_space,
                                question=ques,
                                solution=solution)
            parsed_questions.append(q)
        except (ValueError, IndexError):
            print('Error parsing question "', questions[i], '", please look at question formatting again')
            pass
    return parsed_questions


def _get_type(question):
    question_type = _get_parameter(question, "type=", "points=")
    return question_type.replace('\n\t', '')


def _get_points(question):
    if question.find("solutionSpace") != -1:
        points = _get_parameter(question, "points=", "solutionSpace=")
    else:
        points = _get_parameter(question, "points=", "question=")
    points = points.replace('\n\t', '')
    print('Points: ', points)
    if len(points) > 0:
        return int(points)
    return 0


def _get_solution_space(question):
    solution_space = _get_parameter(question, "solutionSpace=", "question=")
    return solution_space.replace('\n\t', '')


def _get_question(question):
    return _get_parameter(question, "question=", "solution=")


def _get_solution(question):
    return _get_parameter(question, "solution=")


# Separates Questions by delimiter "[question name 1]", "[question name 2]", etc.
def _separate_questions(questions):
    split_questions = re.split('(?sm)^\[([^][]*)]\s*(.*?)(?=\n\[[^][]*]|\Z)', questions)
    return [sq for sq in split_questions if sq.strip()]


def _get_parameter(s, start_param, end_param=None):
    find_result = s.find(start_param)
    if find_result == -1:
        print(start_param, ' not present in given string')
        return ''
    start = s.find(start_param) + len(start_param)
    if end_param:
        end = s.find(end_param)
        substring = s[start:end]
    else:
        substring = s[start:]
    return substring


def random_with_n_digits(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)


