import time
from flask import Flask, request
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/MKTDataBase"
mongo = PyMongo(app)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/exams', methods=['GET'])
def get_exams():
    all_exams = []
    try:
        for e in mongo.db.exams.find():
            all_exams.append(e)
        return {'exams': all_exams}
    except Exception as e:
        return {'response': 500, 'message': e}


@app.route('/exam', methods=['POST'])
def get_exam():
    content = request.json
    exam_id = int(content['id'])
    exam = mongo.db.exams.find({'_id': exam_id})
    return {'exam': exam}


@app.route('/addExam', methods=['POST'])
def add_exam():
    content = request.json
    try:
        mongo.db.exams.insert(content)
        return {'response': 200}
    except Exception as e:
        return {'response': 500, 'message': e}


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
        result = mongo.db.questions.delete_one({'_id': ObjectId(content['id'])})
        if result.deleteCount == 1:
            return {'response': 200}
        else:
            return {'response': 404, 'message': 'Question not found matching id: ' + content['id']}
    except Exception as e:
        return {'response': 500, 'message': e}



