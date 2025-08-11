from sqlalchemy import Column, Integer, String, Text
from db import Base

class PipelineResult(Base):
    __tablename__ = "pipeline_results"

    id = Column(Integer, primary_key=True, index=True)
    input_question = Column(Text, nullable=False) 
    original_question = Column(Text, nullable=False)
    original_optimized_final = Column(Text, nullable=False)
    abstract_question = Column(Text, nullable=False)
    abstract_optimized_final = Column(Text, nullable=False)
    detailed_question = Column(Text, nullable=False)
    detailed_optimized_final = Column(Text, nullable=False)
