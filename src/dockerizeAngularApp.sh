#!/bin/bash

## Configuración
image="edc-fakestore"          ## 👈 Escribe el nombre de tu imagen de docker
server="edc-fakestore"     ## 👈 Escribe el nombre del servidor heroku

## Descargamos la configuración de nginx para Angular.
echo "Creamos la carpega nginx y nos descargamos la configuración."
mkdir nginx
cd nginx
curl https://raw.githubusercontent.com/EricDiCiv5/nginx-heroku-angular-config/master/default.conf -o default.conf
cd ..

## Descargamos el Dockerfile de angular
curl https://raw.githubusercontent.com/EricDiCiv5/heroku_angular_dockerfile/master/Dockerfile -o Dockerfile

## Ejecución de la dokerización
echo "Se va a generar la imagen docker: "$image
docker build -t $image .

## Si Heroku no existe lo instalamos
heroku -v || npm install -g heroku

## Iniciamos el proceso de subida a heroku
echo "Iniciamos sesion en heroku"
heroku login
echo "Iniciamos sesion en container:login"
heroku container:login

## Comprobamos si el servidor ya existe
if [[ $(heroku apps) != *"$server"* ]]; then
    heroku create $server --region eu
fi

## Tratamos la imagen para subirla al repositorio
echo "Le ponemos un tag a la imagen, para que heroku nos entienda"
docker tag $image registry.heroku.com/$server/web

echo "Hago un push al repositorio de contenedores de docker de heroku con un nombre entendible para el"
docker push registry.heroku.com/$server/web

echo "Pasamos a release nuestra imagen en el servidor web"
heroku container:release web --app=$server
