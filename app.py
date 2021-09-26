from flask import Flask, render_template, request, session
from PIL import Image
from io import BytesIO
import base64
import cv2
import numpy as np
import random
import string
import os

from model.prediction import prediction

app = Flask(__name__)
app.secret_key = os.urandom(24)


def data_uri_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(encoded_data.decode('base64'), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


@app.route('/')
def hello_world():
    nums = ''.join(random.choices(string.digits, k=4))
    session['nums'] = nums
    return render_template('index.html', nums=nums)


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    b64_string = request.form['img']
    encoded_data = b64_string.split(',', 1)[1]
    imgdata = base64.b64decode(encoded_data)
    image = Image.open(BytesIO(imgdata))
    image.save('img.png')

    pred = prediction("model/trained_ocr.model", "img.png")

    if len(pred['data']) == 0:
        return {"data": []}

    return {"data": list(set(pred['data']).intersection([char for char in session['nums']]))}


@app.route('/new-nums', methods=['GET', 'POST'])
def new_nums():
    session['nums'] = ''.join(random.choices(string.digits, k=4))
    return session['nums']


@app.route('/nums')
def nums():
    if 'nums' in session:
        nums = session['nums']
    else:
        nums = ''.join(random.choices(string.digits, k=4))
        session['nums'] = nums
    color = random.choice(['purple', 'yellow'])
    return render_template('nums.html', nums=nums, color=color)


@app.route('/check')
def check():
    return {"nums": session["nums"]}


if __name__ == '__main__':
    app.run()
