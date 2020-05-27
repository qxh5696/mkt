# Look inside specified QuestionPool folder
# add each question to the database
# script must be executed with flask server running
import sys
import os
from question_parsing.parse import parse_question
from app import db



def load_questions(paths):
    """
    Add each question in file path to database
    """
    for path in paths:
        os.chdir(path)
        directory = os.listdir(path)
        for listing in directory:
            if '.txt' in listing:
                print(listing)
                with open(listing, 'r') as f:
                    data = f.read()  # read the file
                    questions = parse_question(data)  # parse the questions
                    for question in questions:  # write the questions into the database
                        db.session.add(question)
                        db.session.commit()


if __name__ == '__main__':
    load_questions(sys.argv[1:])

