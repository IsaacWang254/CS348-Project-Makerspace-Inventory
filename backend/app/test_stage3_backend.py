import unittest
from unittest.mock import Mock

from sqlalchemy.exc import SQLAlchemyError

from app import commit_or_rollback
from models import Category, Component


class Stage3BackendTest(unittest.TestCase):
    def test_models_declare_stage3_indexes(self):
        category_index_names = {index.name for index in Category.__table__.indexes}
        component_index_names = {index.name for index in Component.__table__.indexes}

        self.assertIn("ix_categories_name", category_index_names)
        self.assertIn("ix_components_category_id", component_index_names)
        self.assertIn("ix_components_quantity_in_stock", component_index_names)
        self.assertIn("ix_components_price", component_index_names)
        self.assertIn("ix_components_report_filters", component_index_names)

    def test_commit_helper_rolls_back_and_reraises_on_database_error(self):
        session = Mock()
        session.commit.side_effect = SQLAlchemyError("database unavailable")

        with self.assertRaises(SQLAlchemyError):
            commit_or_rollback(session)

        session.rollback.assert_called_once_with()


if __name__ == "__main__":
    unittest.main()
