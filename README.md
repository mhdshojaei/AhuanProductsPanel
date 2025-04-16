# Ahuan Products Panel

A simple product management panel built with Vue 3, TypeScript, and Vuetify.

## Features

- List of products with fields: Title, Description, Price, Category, Image,
  C_OR_R
- Create, Edit, and Delete products
- Search and sort by product title
- Price formatted with thousand separators and "تومان"
- Validations for required fields and image URL length

## API Endpoints

- `GET /api/foods?type=T&cat=test` – Get product list
- `POST /api/foods` – Create a new product
- `PUT /api/foods?id=...` – Update a product
- `DELETE /api/foods?id=...` – Delete a product

> Notes:
>
> - `C_OR_R` must always be sent as `"T"`
> - `category` must always be `"test"`
> - The `image` field must not exceed 50 characters

## Demo

You can view the live demo here:  
🔗
[https://productsdemo.mehdishojaei.ir/](https://productsdemo.mehdishojaei.ir/)

## Setup

```bash
npm install
npm run dev
```
