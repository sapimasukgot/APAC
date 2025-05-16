import os
from app import create_app
from app import db

app = create_app()

os.makedirs(os.path.join("app", "instance"), exist_ok=True)

with app.app_context():
    db.create_all()
    
if __name__ == "__main__":
    app.run(debug=True, port=8000, host="0.0.0.0")
