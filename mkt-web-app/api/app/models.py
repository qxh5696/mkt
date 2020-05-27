from app import db

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(64), index=True)
    subject = db.Column(db.String(64), index=True)
    name = db.Column(db.String(64), index=True)
    question_type = db.Column(db.String(64), index=True)
    points = db.Column(db.Integer)
    solution_space = db.Column(db.Text())
    question = db.Column(db.Text())
    solution = db.Column(db.Text())

    def __repr__(self):
        return 'Question: {}\nCourse: {}\nSubject: {}\nType: {}\nPoints: {}'\
            .format(self.question, self.course, self.subject, self.question_type, self.points)


class Exam(db.Model):
    __tablename__ = 'exam'
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(64), index=True)
    subject = db.Column(db.String(64), index=True)
    name = db.Column(db.String(64))
    questions = db.Column(db.Text())

    def __repr__(self):
        question_ids = self.questions.split(',')
        return 'Name: {}\nCourse: {}\nSubject: {}\nQuestions: {}'\
            .format(self.name, self.course, self.subject, question_ids)

