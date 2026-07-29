import numpy as np


class Similarity:

    @staticmethod
    def cosine(v1, v2):

        v1 = np.array(v1, dtype=float)
        v2 = np.array(v2, dtype=float)

        denominator = (
            np.linalg.norm(v1) *
            np.linalg.norm(v2)
        )

        if denominator == 0:
            return 0.0

        return float(
            np.dot(v1, v2) / denominator
        )