from pydantic import BaseModel, Field
from typing import Union, Optional, List, Literal

class Entity(BaseModel):
    topic: Optional[Union[str, List[str]]] = Field(
        ...,
        description="Topic areas and Subheadings present in the user query"
    )
    name: Optional[Union[str, List[str]]] = Field(
        ...,
        description="Name of Contracts or Companies present in the user query"
    )

class IntentWithEntities(BaseModel):
    intent: Literal['Subsection', 'Generic', 'Other'] = Field(
        ...,
        description="Intent of the user query"
    )
    entity: Entity = Field(
        ...,
        description="Entity present in the user query"
    )