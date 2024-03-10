# goit-js-hw-11

Sixth homework in JavaScript module in GoIT course.

## General info

In this part I've learned about CRUD operations and about async/await syntax.

The webside is an image searcher where user can simply search images based on
the query he/she provided. Code uses SimpleLightbox library to make gallery and
allow expending the chosen image. It also uses Notiflix to infrom how many
images where found and when there are no images found or are no more because the
webside uses pagination and allows to view more images.

To hide secret data that is needed to communicate with server program store this
in .env file and uses dotenv library to get taht data from it.

Loading screen:

![Loading screen][picture1]

Loaded screen:

![Loaded screen][picture2]

## Technologies

Used technologies:

- JS,
- HTML,
- CSS,
- SCSS

Used libraries:

- axios,
- Notiflix,
- SimpleLightbox,
- dotenv

## GH-Pages

[https://mattmalicki.github.io/goit-js-hw-11/]

## Install and run

Install all dependencies:

```shell
npm install
```

Run project in your localhost:

```shell
npm start
```

[picture1]: ./goit-js-hw-11_1.png
[picture2]: ./goit-js-hw-11_2.png
