from app import app, db
from app.models import Question, Exam
from question_parsing.parse import random_with_n_digits
from flask import request
import time
from utility_functions import create_json_objects as utils


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/exams', methods=['GET'])
def get_exams():
    exams = Exam.query.all()
    all_exams = []
    for e in exams:
        all_exams.append(utils.create_exam_json_object(e))
    return {'exams': all_exams}


@app.route('/exam', methods=['POST'])
def get_exam():
    content = request.json
    exam_id = int(content['id'])
    e = Exam.query.get(exam_id)
    return {'exam': utils.create_exam_json_object(e)}


@app.route('/addExam', methods=['POST'])
def add_exam():
    content = request.json
    course = content['course']
    name = content['name']
    subject = content['subject']
    question_ids = content['questions']
    total_points = 0
    for q in question_ids.split(','):
        question_dict = Question.query.get(int(q))
        total_points += question_dict['points']

    ex = Exam(id=random_with_n_digits(10),
             course=course,
             subject=subject,
             name=name,
             points=total_points,
             question_ids=question_ids
        )
    try:
        db.session.add(ex)
        db.session.commit()
        return {'response': 200}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/questions', methods=['GET'])
def get_questions():
    questions = Question.query.all()
    all_questions = []
    for q in questions:
        d = {
            'id': q.id,
            'name': q.name,
            'question': q.question,
            'points': q.points,
            'type': q.question_type,
            'solution': q.solution
        }
        all_questions.append(d)
    return {'questions': all_questions}


@app.route('/addQuestion', methods=['POST'])
def add_question():
    content = request.json
    course = content['course']
    subject = content['subject']
    question_name = content['question-name']
    question_type = content['question-type']
    points = int(content['points'])
    ques = content['question']
    solution = content['solution']
    solution_space = content['solution_space'] if 'solution_space' in content else None
    q = Question(id=random_with_n_digits(10),
                 course=course,
                 subject=subject,
                 name=question_name,
                 question_type=question_type,
                 points=points,
                 solution_space=solution_space,
                 question=ques,
                 solution=solution)
    try:
        db.session.add(q)
        db.session.commit()
        return {'response': 200}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/updateQuestion', methods=['POST'])
def update_question():
    content = request.json

    # Find the old instance and delete it
    question_id = int(content['id'])
    q = Question.query.get(question_id)
    db.session.delete(q)

    # Build the new question object
    course = content['course']
    subject = content['subject']
    question_name = content['question-name']
    question_type = content['question-type']
    points = int(content['points'])
    ques = content['question']
    solution = content['solution']
    solution_space = content['solution_space'] if 'solution_space' in content else None
    new_question = Question(id=question_id,
                            course=course,
                            subject=subject,
                            name=question_name,
                            question_type=question_type,
                            points=points,
                            solution_space=solution_space,
                            question=ques,
                            solution=solution)

    # Add the new question to the data base under the same id
    db.session.add(new_question)
    db.session.commit()
    return {'response': 200}


@app.route('/deleteQuestion', methods=['POST'])
def delete_question():
    content = request.json
    question_id = int(content['id'])
    q = Question.query.get(question_id)
    db.session.delete(q)
    return {'response': 200}
