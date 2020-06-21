import time
from flask import Flask, request, send_file
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId
from latexrender import create_latex_file

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/MKTDataBase"
mongo = PyMongo(app)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


# Exam Routes
@app.route('/getExam', methods=['GET'])
def get_exam():
    content = request.json
    try:
        exam_dict = mongo.db.exams.find({'_id': ObjectId(content['_id'])})
        questions = []
        for question_id in exam_dict['question_ids']:
            question = mongo.db.questions.find_one({'_id': ObjectId(question_id)})
            questions.append(question)
        del exam_dict['question_ids']
        exam_dict['questions'] = questions
        return {'response': 200, 'exam': exam_dict}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/getExams', methods=['GET'])
def get_exams():
    all_exams = []
    try:
        for e in mongo.db.exams.find():
            questions = []
            exam_dict = e
            for question_id in e['question_ids']:
                question = mongo.db.questions.find_one({'_id': ObjectId(question_id)})
                questions.append(question)
            del exam_dict['question_ids']
            exam_dict['questions'] = questions
            all_exams.append(json.loads(json_util.dumps(exam_dict)))
        return {'exams': all_exams}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/updateExam', methods=['POST'])
def update_exam():
    content = request.json
    question_ids = [q['_id']['$oid'] for q in content['questions']]
    query = {'_id': ObjectId(content['_id']['$oid'])}
    content['question_ids'] = question_ids
    del content['questions']
    try:
        for k, v in content.items():
            if k != '_id':
                mongo.db.exams.update_one(query, {'$set': {k: v}})
        return {'response': 200}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/addExam', methods=['POST'])
def add_exam():
    content = request.json
    question_ids = [q['_id']['$oid'] for q in content['questions']]
    del content['questions']
    content['question_ids'] = question_ids
    print('Exam Object:', content)
    try:
        mongo.db.exams.insert(content)
        return {'response': 200, }
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/deleteExam', methods=['POST'])
def delete_exam():
    content = request.json
    result = mongo.db.exams.delete_one({'_id': ObjectId(content['_id'])})
    try:
        if result.deleteCount == 1:
            return {'response': 200}
        else:
            return {'response': 404, 'message': 'Question not found matching id: ' + content['_id']}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/getExamPreview', methods=['POST'])
def post_exam_preview():
    content = request.json
    exam_url = create_latex_file(content)
    return send_file(exam_url, mimetype='application/pdf')


# Question Routes
@app.route('/questions', methods=['GET'])
def get_questions():
    all_questions = []
    for q in mongo.db.questions.find():
        all_questions.append(json.loads(json_util.dumps(q)))
    return {'questions': all_questions}


@app.route('/addQuestion', methods=['POST'])
def add_question():
    content = request.json
    try:
        mongo.db.questions.insert(content)
        return {'response': 200}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/updateQuestion', methods=['POST'])
def update_question():
    content = request.json
    query = {'_id': ObjectId(content['_id'])}
    try:
        for k, v in content.items():
            if k != '_id':
                mongo.db.questions.update_one(query, {'$set': {k: v}})
        return {'response': 200}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/deleteQuestion', methods=['POST'])
def delete_question():
    content = request.json
    try:
        result = mongo.db.questions.delete_one({'_id': ObjectId(content['_id'])})
        if result.deleteCount == 1:
            return {'response': 200}
        else:
            return {'response': 404, 'message': 'Question not found matching id: ' + content['_id']}
    except Exception as e:
        return {'response': 500, 'message': e}



