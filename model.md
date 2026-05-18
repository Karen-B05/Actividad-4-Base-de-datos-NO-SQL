# MovieStream — Modelo de Datos en MongoDB

## Del modelo relacional al documental

Para esta versión NoSQL se rediseñó el modelo pensando en cómo se consume la información dentro de la aplicación y qué datos conviene mantener juntos dentro del mismo documento.

---

# Decisiones de modelado

## 1. Géneros dentro de la película → EMBEBIDO

### Decisión

Los géneros se almacenan directamente dentro del documento de cada película usando un arreglo.

```json
"genres": ["Sci-Fi", "Action"]
```

### Justificación

- Los géneros son datos pequeños y simples.
- Normalmente siempre se consultan junto con la película.
- No tiene mucho sentido hacer una colección separada únicamente para nombres de géneros.
- El número de géneros por película es pequeño y estable.

### Ventajas

- Obtener una película con sus géneros requiere una sola query.
- Filtrar por género es sencillo usando índices.

```js
db.movies.find({ genres: "Sci-Fi" })
```

### Trade-off

Si algún género cambia de nombre, habría que actualizar múltiples documentos.

---

## 2. Cast dentro de película → EMBEBIDO

### Decisión

El reparto principal se guarda dentro de cada película como un arreglo de objetos.

```json
"cast": [
  { "name": "Leonardo DiCaprio", "role": "Dom Cobb" }
]
```

### Justificación

- El caso de uso principal es mostrar la película junto con su reparto.
- El cast normalmente se consume como parte de la información de la película.
- Permite cargar toda la información con una sola lectura.

### Ventajas

- Las películas son autocontenidas.
- El frontend obtiene toda la información rápidamente.

### Trade-off

Buscar todas las películas donde participa un actor es menos natural que en SQL.

Ejemplo:

```js
db.movies.find({ "cast.name": "Leonardo DiCaprio" })
```

También existe duplicación de información porque un mismo actor puede aparecer repetido en muchas películas.

---

## 3. Actores → COLECCIÓN INDEPENDIENTE

### Decisión

Además del cast embebido, se creó una colección `actors` para almacenar información individual de actores.

### Justificación

Conforme la aplicación creció apareció la necesidad de tener una sección específica de actores y mostrar información independiente como:

- país
- año de nacimiento
- premios
- películas famosas

Eso hizo que los actores dejaran de ser solamente un dato embebido dentro de películas y se comportaran más como una entidad propia.

### Ventajas

- Permite crear vistas independientes de actores.
- Facilita agregar información específica de cada actor.
- Hace más sencillo extender el sistema después.

### Trade-off

Parte de la información queda duplicada entre `actors` y `movies.cast`.

Por ejemplo, si cambia el nombre de un actor, habría que actualizar varios documentos.

---

## 4. Interacciones → REFERENCIAS

### Decisión

Las interacciones (`views` y `ratings`) se guardan en una colección separada usando referencias con `ObjectId`.

```json
{
  "userId": "ObjectId(...)",
  "movieId": "ObjectId(...)"
}
```

### Justificación

- Un usuario puede generar muchísimas interacciones.
- Embebidas dentro del usuario harían crecer demasiado el documento.
- Las interacciones necesitan consultarse de manera independiente.

### Ventajas

- Escala mejor.
- Facilita búsquedas y filtros.
- Mantiene los documentos de usuario pequeños.

### Trade-off

Para mostrar información completa se necesitan agregaciones con `$lookup`.

Ejemplo:

```js
{
  $lookup: {
    from: "movies",
    localField: "movieId",
    foreignField: "_id",
    as: "movie"
  }
}
```

---

## 5. Usuarios → COLECCIÓN INDEPENDIENTE

### Decisión

Los usuarios se almacenan en su propia colección.

### Justificación

Los datos del usuario son independientes de las interacciones y se reutilizan constantemente.

El documento contiene únicamente información de perfil:

- username
- email
- país
- tipo de suscripción
- fecha de registro

---

# Colecciones finales

| Colección | Descripción |
|---|---|
| `movies` | Información de películas con géneros y cast embebidos |
| `actors` | Información individual de actores |
| `users` | Usuarios registrados |
| `interactions` | Vistas y ratings relacionados con usuarios y películas |

---

# Ejemplos de documentos

## movies

```json
{
  "_id": "ObjectId('...')",
  "title": "Inception",
  "year": 2010,
  "duration_min": 148,
  "genres": ["Sci-Fi", "Thriller", "Action"],
  "cast": [
    {
      "name": "Leonardo DiCaprio",
      "role": "Dom Cobb"
    }
  ],
  "awards": 4,
  "main_subject": "A thief enters dreams to steal secrets"
}
```

---

## actors

```json
{
  "_id": "ObjectId('...')",
  "name": "Leonardo DiCaprio",
  "birth_year": 1974,
  "country": "US",
  "oscars": 1,
  "famous_for": [
    "Inception",
    "Titanic",
    "The Revenant"
  ]
}
```

---

## users

```json
{
  "_id": "ObjectId('...')",
  "username": "cinemaniac88",
  "email": "cine@example.com",
  "country": "MX",
  "subscription": "premium",
  "registered_at": "2023-01-15T00:00:00Z"
}
```

---

## interactions

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "movieId": "ObjectId('...')",
  "type": "rating",
  "rating": 4.5,
  "watched_at": "2024-03-20T21:30:00Z",
  "completed": true
}
```

---

# Consultas que se volvieron más fáciles

## Obtener una película completa

Toda la información importante viene en un solo documento:

- géneros
- reparto
- información principal

```js
db.movies.findOne({ title: "Inception" })
```

---

## Filtrar películas por género

```js
db.movies.find({ genres: "Drama" })
```

---

## Obtener historial de un usuario

```js
db.interactions.find({ userId: id })
```

---

# Consultas que se volvieron más complejas

## Obtener filmografía de un actor

Como el cast está embebido:

```js
db.movies.find({ "cast.name": "Leonardo DiCaprio" })
```

---

## Mostrar interacciones con nombres reales

Requiere `$lookup` para unir usuarios y películas.

---

## Mantener consistencia entre actores y cast

Existe duplicación de información entre:

- `actors`
- `movies.cast`

Si cambia información importante de un actor, varios documentos deben actualizarse.