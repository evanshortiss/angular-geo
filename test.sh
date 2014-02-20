#!/bin/bash

read -p "Install dependencies using npm? (y/n) " -n 1 -r
echo "\n"

if [[ $REPLY =~ ^[Yy]$ ]]
    npm install .
then
    echo "Installing dependencies..."


    echo "Finished installing dependencies.\n"

    # jshint
    echo "Running jshint..."
    ./node_modules/jshint/bin/jshint ./src/angular-geo.js
    echo "Running jshint \n"

    #jslint
    echo "Running jslint..."
    ./node_modules/jslint/bin/jslint.js ./src/angular-geo.js
    echo "\nFinished jslint...\n"
fi