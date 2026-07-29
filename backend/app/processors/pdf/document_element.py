from dataclasses import dataclass, field


@dataclass
class DocumentElement:

    element_type: str

    page_number: int

    content: str

    metadata: dict = field(default_factory=dict)

    embedding_text: str = ""

    source_file: str = ""