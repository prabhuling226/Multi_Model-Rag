from dataclasses import dataclass, field


@dataclass
class Chunk:

    content: str

    chunk_type: str

    page_number: int

    metadata: dict = field(default_factory=dict)

    embedding = None