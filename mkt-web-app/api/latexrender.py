import os
from pdf2image import convert_from_path
from functools import reduce


def create_latex_file(exam_object):
    exam_file_name = exam_object['examName'].replace(' ', '_')
    tex_file_name = '{}.tex'.format(exam_file_name)
    pdf_file_name = '{}.pdf'.format(exam_file_name)
    os.chdir(os.getcwd() + '/exam_previews')
    exam_id = exam_object['_id']['$oid']
    os.system('mkdir {}'.format(exam_id))
    os.chdir(os.getcwd() + '/' + exam_id)
    total_points = 0
    for q in exam_object['questions']:
        total_points += int(q['points'])
    with open(tex_file_name, 'w') as f:
        f.write('\\documentclass{article}\n')
        f.write('\\begin{document}\n')
        f.write('\\title{' + exam_object['examName'] + '}\n\n\n')
        f.write('\\author{' +
                exam_object['examCourse'] + '\\\\' +
                exam_object['examSubject'] + '\\\\' +
                'Rochester Institute of Technology CS Department' + '\\\\' +
        '}\n\n\n')
        f.write('Total Exam Points: {}\n\n'.format(total_points))
        for i, q in enumerate(exam_object['questions']):
            f.write('{} (Points: {}). '.format(i+1, q['points']))
            f.write(q['question'])
            space = '\n'
            if q['questionType'] == 'longAnswer':
                space *= 5
            f.write(space)
        # f.write('Hello Palo Alto!\n')
        f.write('\\end{document}\n')

    x = os.system('pdflatex {}'.format(tex_file_name))
    full_path = os.getcwd() + '/' + pdf_file_name
    if x != 0:
        print('Exit - code not 0, check result!')
    else:
        print(full_path)
    os.chdir('../../')
    return full_path


def get_exam_preview_images(exam_object):
    exam_id = exam_object['_id']['$oid']
    exam_file_name = exam_object['examName'].replace(' ', '_')
    os.chdir(os.getcwd() + '/exam_previews')
    os.chdir(os.getcwd() + '/' + exam_id)
    os.system('mkdir preview_images')
    exam_name_path = os.getcwd() + '/' + exam_file_name + '.pdf'
    os.chdir(os.getcwd() + '/preview_images')
    images_from_path = convert_from_path(exam_name_path, output_folder=os.getcwd())
    images = []
    for i, image in enumerate(images_from_path):
        image.save('page-{}.png'.format(i), 'PNG')
        # img_byte_arr = io.BytesIO()
        # image.save(img_byte_arr, format='PNG')
        # encoded_img = base64.encodebytes(img_byte_arr.getvalue()).decode('ascii')
        # images.append(encoded_img)
        images.append(os.getcwd() + '/page-{}.png'.format(i))
    os.system('rm *.ppm')
    os.chdir('../../../')
    return images
