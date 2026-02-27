"""create eventos table

Revision ID: 001
Revises:
Create Date: 2026-02-27

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "eventos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(255), nullable=False),
        sa.Column("tipo", sa.String(100), nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("horario_inicio", sa.Time(), nullable=False),
        sa.Column("horario_fim", sa.Time(), nullable=False),
        sa.Column("local", sa.String(255), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=False),
        sa.Column("valor_ingresso", sa.Numeric(10, 2), nullable=False),
        sa.Column("capacidade", sa.Integer(), nullable=False),
        sa.Column("organizador", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_eventos_id"), "eventos", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_eventos_id"), table_name="eventos")
    op.drop_table("eventos")
