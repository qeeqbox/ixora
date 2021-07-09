#!/bin/bash
echo "Auto pip Package Creator - QeeqBox"
echo "[x] Deleting pip-ixora"
[[ -d pip-ixora ]] && rm -r pip-ixora
echo "[x] Making pip-ixora"
mkdir -p pip-ixora/ixora
echo "[x] Copying qbixora.py, setup.py and README.rst"
cp qbixora.py pip-ixora/ixora/__main__.py
cat >>pip-ixora/ixora/__init__.py <<EOL
#!/usr/bin/env python
from .__main__ import QBIxora
EOL
cp setup.py pip-ixora/setup.py
cp README.rst pip-ixora/README.rst
mkdir -p pip-ixora/ixora/data
cp -r graph.html pip-ixora/ixora/data/
cd pip-ixora/
echo "[x] Checking setup.py"
python3 setup.py check -r -s
echo "[x] Creating pypi Package"

python3 setup.py sdist bdist_wheel 2>stderr.log 1>stdout.log
if grep -q "error:" stderr.log
then
	echo "[x] Creating pypi failed.."
	cat stderr.log
else
	echo "[x] pypi Package was created successfully"
	read -p "Do you want to upload? (y/n)?" USER_INPUT
	if [ "$USER_INPUT" = "y" ]; then
		echo "[x] Uploading pypi Package"
		twine upload dist/*
	fi
fi

