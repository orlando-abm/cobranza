# Importar PRDs a Linear

Los PRDs viven en `docs/prds/` organizados como:

- `docs/prds/<issue>/issue.md`
- `docs/prds/<issue>/subissues/*.md`
- `docs/prds/prd-2026-07-14-00-indice-linear.md`

## 1. Revisar el plan local

Este comando no toca Linear ni requiere API key:

```bash
npm run linear:import-prds -- --offline
```

## 2. Configurar la API key

No guardes la key en el repo. Exportarla solo en tu terminal:

```bash
export LINEAR_API_KEY="tu_api_key"
```

## 3. Listar equipos de Linear

```bash
npm run linear:teams
```

El comando imprime `key`, nombre e id de cada equipo.

## 4. Dry-run contra Linear

Valida equipo, credenciales y duplicados, pero no crea issues:

```bash
npm run linear:import-prds -- --team TEAM_KEY
```

Para probar solo el primer issue padre:

```bash
npm run linear:import-prds -- --team TEAM_KEY --limit 1
```

El script revisa duplicados por:

- Marcador estable en la descripción: `prodbooster-linear-prd:<slug>`.
- Fallback por título dentro del mismo equipo y, para subissues, dentro del mismo parent.

## 5. Crear issues y subissues

```bash
npm run linear:import-prds -- --team TEAM_KEY --execute
```

Por defecto, si un issue ya existe, lo reutiliza o salta para no duplicarlo.

Para sincronizar cambios de contenido en PRDs ya creados, por ejemplo ajustes de AC, usa:

```bash
npm run linear:import-prds -- --team TEAM_KEY --update-existing --execute
```

Ese modo mantiene la misma protección contra duplicados y actualiza los issues encontrados por marcador o título.

Para asignar o reasignar todos los PRDs importados a una persona:

```bash
npm run linear:import-prds -- --team TEAM_KEY --assign-to "Nombre Apellido" --update-existing --execute
```

El valor de `--assign-to` puede ser id, email, nombre o display name de Linear.

Si prefieres que el proceso falle al encontrar duplicados:

```bash
npm run linear:import-prds -- --team TEAM_KEY --fail-on-duplicate --execute
```

Opcionalmente puedes asociar todos los issues a un proyecto:

```bash
npm run linear:import-prds -- --team TEAM_KEY --project-id LINEAR_PROJECT_ID --execute
```

## Notas

- El script crea primero cada `issue.md` como issue padre.
- Luego crea cada archivo de `subissues/` como subissue usando `parentId`.
- Re-ejecutar con `--execute` no debería duplicar issues mientras el marcador o el título sigan iguales.
- La API key se lee desde `LINEAR_API_KEY` y nunca se escribe a disco.
