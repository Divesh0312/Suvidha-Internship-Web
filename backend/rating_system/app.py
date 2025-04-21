import os
from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename


from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.secret_key = 'suvidha-802'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('MYSQL_DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ------------------ Models ------------------ #
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student, employee, or company

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    to_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)


    from_user = db.relationship('User', foreign_keys=[from_id])
    to_user = db.relationship('User', foreign_keys=[to_id])


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    resume_path = db.Column(db.String(200))
    user = db.relationship('User', backref=db.backref('profile', uselist=False))

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(200))

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_name = db.Column(db.String(100))
    github_link = db.Column(db.String(200))


# ------------------ Database Initialization ------------------ #
def init_db():
    with app.app_context():
        db.create_all()

# Initialize database during app setup
init_db()

# ------------------ Routes ------------------ #
@app.route('/')
def home():
    return redirect('/login')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        try:
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                return render_template('register.html', error="Username already exists!")
            new_user = User(
                username=username,
                password=request.form['password'],
                role=request.form['role']
            )
            db.session.add(new_user)
            db.session.commit()
            return redirect('/login')
        except Exception as e:
            db.session.rollback()
            return render_template('register.html', error=f"Registration failed: {str(e)}")
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            user = User.query.filter_by(
                username=request.form['username'],
                password=request.form['password']
            ).first()
            if user:
                session['user_id'] = user.id
                return redirect('/dashboard')
            else:
                return render_template('login.html', error="Invalid credentials")
        except Exception as e:
            return render_template('login.html', error=f"Login failed: {str(e)}")
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect('/login')
    try:
        user = User.query.get(session['user_id'])
        others = User.query.filter(User.id != user.id).all()
        received = Rating.query.filter_by(to_id=user.id).all()
        return render_template('dashboard.html', user=user, others=others, received=received)
    except Exception as e:
        return render_template('login.html', error=f"Error loading dashboard: {str(e)}")


#--------approute for uploading resume,certificates and project

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/profile', methods=['GET', 'POST'])
def stu_uploads():
    if 'user_id' not in session:
        return redirect('/login')

    user_id = session['user_id']

    if request.method == 'POST':
        # Handle single resume upload
        resume = request.files.get('resume')
        resume_path = None

        if resume and allowed_file(resume.filename):
            resume_filename = secure_filename(resume.filename)
            resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_filename)
            resume.save(resume_path)

            profile = Profile.query.filter_by(user_id=user_id).first()
            if profile:
                profile.resume_path = resume_path
            else:
                profile = Profile(user_id=user_id, resume_path=resume_path)
                db.session.add(profile)

        # Handle multiple certificate uploads
        certificate_files = request.files.getlist('certifications')
        for cert_file in certificate_files:
            if cert_file and allowed_file(cert_file.filename):
                cert_filename = secure_filename(cert_file.filename)
                cert_path = os.path.join(app.config['UPLOAD_FOLDER'], cert_filename)
                cert_file.save(cert_path)
                new_cert = Certificate(user_id=user_id, filename=cert_path)
                db.session.add(new_cert)

        # Handle multiple projects
        project_names = request.form.getlist('project_name')
        github_links = request.form.getlist('github_link')
        for pname, glink in zip(project_names, github_links):
            if pname.strip() != '' and glink.strip() != '':
                new_project = Project(user_id=user_id, project_name=pname, github_link=glink)
                db.session.add(new_project)

        db.session.commit()
        return redirect('/dashboard')

    profile = Profile.query.filter_by(user_id=user_id).first()
    certificates = Certificate.query.filter_by(user_id=user_id).all()
    projects = Project.query.filter_by(user_id=user_id).all()
    return render_template('profile.html', profile=profile, certificates=certificates, projects=projects)



@app.route('/rate/<int:to_id>', methods=['GET', 'POST'])
def rate(to_id):
    if 'user_id' not in session:
        return redirect('/login')
    if request.method == 'POST':
        try:
            rating_value = int(request.form['rating'])
            comment_text = request.form['comment']
            existing = Rating.query.filter_by(from_id=session['user_id'], to_id=to_id).first()
            if existing:
                existing.rating = rating_value
                existing.comment = comment_text
            else:
                rating = Rating(
                    from_id=session['user_id'],
                    to_id=to_id,
                    rating=rating_value,
                    comment=comment_text
                )
                db.session.add(rating)
            db.session.commit()
            return redirect('/dashboard')
        except Exception as e:
            db.session.rollback()
            to_user = User.query.get(to_id)
            return render_template('rate.html', to_user=to_user, error=f"Rating failed: {str(e)}")
    try:
        to_user = User.query.get(to_id)
        return render_template('rate.html', to_user=to_user)
    except Exception as e:
        return redirect('/dashboard', error=f"Error loading rate page: {str(e)}")

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/initdb')
def initdb():
    init_db()
    return "Database initialized!"

# ------------------ Main ------------------ #
if __name__ == '__main__':
    app.run(debug=True)