"""add FK to Billing

Revision ID: a43efa8b3060
Revises: 14a0814d7ad4
Create Date: 2024-09-10 10:53:57.688169

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a43efa8b3060'
down_revision = '14a0814d7ad4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('billings', schema=None) as batch_op:
        batch_op.create_foreign_key(batch_op.f('fk_billings_appointment_id_appointments'), 'appointments', ['appointment_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('billings', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_billings_appointment_id_appointments'), type_='foreignkey')

    # ### end Alembic commands ###
