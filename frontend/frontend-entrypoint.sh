#!/bin/bash

echo "Installing packages..."
mkdir -p node_modules
npm i
echo "Executing: $@"
exec $@
