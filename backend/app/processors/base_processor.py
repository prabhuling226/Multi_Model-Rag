from abc import ABC, abstractmethod
from pathlib import Path


class BaseProcessor(ABC):

    @abstractmethod
    async def process(
        self,
        file_path: Path
    ) -> dict:
        """
        Returns

        {
            "text": "",
            "tables": [],
            "images": [],
            "metadata": {}
        }
        """
        pass