from flask import Flask, session, flash, render_template


app = Flask(__name__)
app.secret_key = 'ABC'

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['UPLOAD_FOLDER'] = 'lives'

@app.route('/')
def main_page():
    return render_template('index.html')

