import sqlalchemy as sa
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Category(db.Model):
  __tablename__ = 'categories'
  category_id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(100), nullable=False, index=True)
  # relationship to components
  components = db.relationship('Component', back_populates='category', lazy=True)

class Component(db.Model):
  __tablename__ = 'components'
  __table_args__ = (
    db.Index('ix_components_report_filters', 'category_id', 'quantity_in_stock', 'price'),
  )

  component_id = sa.Column(sa.Integer, primary_key=True)
  name = db.Column(db.String(200), nullable=False)
  quantity_in_stock = db.Column(db.Integer, nullable=False, index=True)
  price = db.Column(db.Float, nullable=False, index=True)
  resistance_ohms = db.Column(db.Float, nullable=True)
  voltage_volts = db.Column(db.Float, nullable=True)
  capacity_mah = db.Column(db.Float, nullable=True)
  capacitance_farads = db.Column(db.Float, nullable=True)
  # foreign key to category
  category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), nullable=False, index=True)
  category = db.relationship('Category', back_populates='components')
