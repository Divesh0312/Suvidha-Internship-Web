from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ratingsystem.db'
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