"""add additional data source ids to queries

Revision ID: 51fa47d133ea
Revises: fd4fc850d7ea
Create Date: 2023-08-30 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '51fa47d133ea'
down_revision = 'fd4fc850d7ea'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('queries', sa.Column('additional_data_source_ids', postgresql.ARRAY(sa.Integer()), nullable=False, server_default='{}'))


def downgrade():
    op.drop_column('queries', 'additional_data_source_ids')
