from app.models import Question


def create_question_json_object(q):
    question = {
        'id': q.id,
        'name': q.name,
        'question': q.question,
        'points': q.points,
        'type': q.question_type,
        'solution': q.solution
    }
    return question


def create_exam_json_object(e):
    question_ids = [int(question_id) for question_id in e.questions.split(',')]
    questions = []
    total_points = 0
    for q in question_ids:
        question_dict = create_question_json_object(Question.query.get(q))
        total_points += question_dict['points']
        questions.append(question_dict)
    exam = {
        'id': e.id,
        'course': e.course,
        'subject': e.subject,
        'name': e.name,
        'points': total_points,
        'questions': questions,
    }
    return exam
