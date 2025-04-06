from setuptools import setup, find_packages

setup(
    name="ai_ml",
    version="0.1",
    packages=find_packages('src'),
    package_dir={'': 'src'},
    install_requires=[
        'tensorflow',
        'torch',
        'transformers',
        'numpy',
        'pandas',
        'scikit-learn',
        'python-dotenv',
        'requests',
        'gunicorn'
    ],
    python_requires='>=3.6',
)
