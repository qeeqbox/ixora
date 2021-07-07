#!/usr/bin/python
# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

with open('README.rst', 'r') as fh:
    long_description = fh.read()

setup(
    name='ixora',
    author='QeeqBox',
    author_email='gigaqeeq@gmail.com',
    description="Automate force-directed graph",
    long_description=long_description,
    version='0.2',
    license='AGPL-3.0',
    url='https://github.com/qeeqbox/ixora',
    packages=['ixora'],
    include_package_data=True,
    package_data={'ixora': ['data/*']},
    python_requires='>=3'
    )
