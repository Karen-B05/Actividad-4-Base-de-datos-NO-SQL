
---

## REFLECTION.md

```md
# REFLECTION.md — MovieStream NoSQL

## 1. Volviendo a empezar

Si volviera a empezar el proyecto probablemente cambiaría cómo manejé a los actores y el cast de las películas.  
Al inicio decidí guardar los actores directamente dentro de cada película porque parecía lo más simple para mostrar la información, sin embargo, después cuando quise agregar la sección de actores y empezar a pensar en búsquedas más específicas, por ejemplo encontrar todas las películas donde aparece cierto actor. Ahí me di cuenta de que estaba usando información repetida en varias películas y que realmente los actores ya se estaban comportando como una entidad separada.

Creo que el error vino de no pensar desde el inicio en las consultas reales que iba a necesitar. Al principio solo estaba pensando en “guardar películas”, pero conforme fui haciendo el frontend y las rutas empecé a notar que el modelo también tenía que facilitar la lectura y no solo la escritura.

---

## 2. La conversación con mi modelo

La parte que más incómoda se sintió fue trabajar con las interacciones y mostrar información relacionada de usuarios y películas. Las interacciones solamente guardan los ObjectId del usuario y la película para evitar duplicar datos, pero cuando quería mostrar la lista de interacciones en la interfaz necesitaba traer también el nombre del usuario y el título de la película. Ya que no estaba utilizando SQL, donde se utilizaria un JOIN, tuve que usar `$lookup`, `$addFields` y manejar arreglos aunque solo existiera un resultado, lo que hizo que el código se volviera más largo y menos claro.

También hubo momentos donde sentía que estaba resolviendo manualmente cosas que en SQL serian más simples, como la eliminación interacciones relacionadas cuando se elimina una película. Aun así, considero que parte del problema fue mi modelo, ya que algunas consultas habrían sido mucho más simples si hubiera duplicado ciertos datos directamente dentro de las interacciones pero evitando inconsistencias.

---

## 3. La pregunta honesta

Para MovieStream específicamente, considero que SQL es la mejor opción. Mientras hacía la app me di cuenta de que casi todo el proyecto gira alrededor de las relaciones entre los componentes, en donde es mejor trabajar con bases relacionales porque constantemente necesitas conectar información entre tablas o mantener integridad entre datos.

MongoDB sí hizo algunas cosas más cómodas, por ejemplo el guardado géneros o la habilidad de modificar documentos sin preocuparme demasiado por schemas estrictos, pero conforme el proyecto fue creciendo, las relaciones empezaron a sentirse más importantes. Aun así, el proyecto sí me ayudó a entender mejor cuándo MongoDB tiene sentido y cuándo no tanto. 