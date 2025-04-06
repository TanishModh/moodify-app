from setuptools import setup, find_packages

setup(
    name="ai_ml",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'tensorflow',
        'torch',
        'transformers',
        'numpy',
        'pandas',
        'scikit-learn',
    ],
)
