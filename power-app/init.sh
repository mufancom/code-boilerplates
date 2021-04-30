#!/bin/bash
set -e
# MagicSpace Makeflow PowerApp Template for Linux initialize script
# See https://github.com/makeflow/mufan-code-boilerplates/tree/master/power-app

warning() {
    echo -e "\033[33m $1 \033[0m"
}

error() {
    echo -e "\033[31m $1 \033[0m"
}

warning "npm version: $(npm -v)"

dependencies=()
global_dependencies=$(npm ls -g --depth 0 | sed -n 'p')

if [[ !($global_dependencies =~ 'magicspace') ]]; then
    dependencies+=('magicspace')
fi

if [[ !($global_dependencies =~ '@mufan/code-boilerplate') ]]; then
    dependencies+=('@mufan/code-boilerplates')
fi

if [ ${#dependencies[@]} -gt 0 ]; then
    warning "executing: npm install --global ${dependencies[@]}"
    echo "$(npm install --global ${dependencies[@]})"
fi

name='awesome-power-app'
port='9966'

for param in $@; do
    flag=${param:0:7}
    if [ $flag == '--name=' ]; then
        name=${param##$flag}
    elif [ $flag == '--port=' ]; then
        port=${param##$flag}
    else
        error "unknown param ${flag}"
        exit 1
    fi
done

DEFAULT_BOILERPLATE_JSON=$(
    cat <<EOF
{
  "extends": "@mufan/code-boilerplates/power-app",
  "options": {
    "name": "$name",
    "powerApp": {
      "port": $port,
      "images": []
    }
  }
}
EOF
)

mkdir $name
cd $name

magicspace create @mufan/code-boilerplates/power-app
echo "$DEFAULT_BOILERPLATE_JSON" >.magicspace/boilerplate.json

warning "executing: git repository initialize"
git init
git add .
git commit -m "init"

warning "executing: magicspace init"
magicspace init
