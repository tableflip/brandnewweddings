# br&newweddings

Website for http://brandnewweddings.co.uk

## Getting started

With node and npm installed:

```sh
npm install
npm start
```

This project uses npm scripts to build the site to the `dist` directory.

- `npm start` - Build site, watch for changes and run a hot code reloading server on http://localhost:3000

## Helpers

Any module dropped into the *helpers* folder will be passed in the `content` variable to all templates, with the obvious camel-case conversion (i.e. `is-equal` would be available as `content.isEqual`).

## Declaring schemas

Fields in a *content.json* or *facts.json* which do not have a declared `type` in the corresponding *schema.json* are assumed to be of type *text*.  The available types are:

* collection
* color
* img
* list
* map
* text
* textarea

If validation beyond that which is built in for these fields is required, it can be supplied in a `validation` key in the *schema.json*:

```json
{
  "exampleField": {
    "type": "text",
    "validation": {
      "pattern": "^(https?://)?([0-9a-z.-]+).([a-z.]{2,6})([/[0-9][a-z].-]*)*/?$"  
    }
  },  
}
```

Available validation options are as per JSON-schema and can be found [here](http://json-schema.org/latest/json-schema-validation.html).

### Regex validation

JSON-schema regex patterns only allow a subset of those available in Javascript - for example, periods will match the period character rather than any character.  Full details can be found under the *pattern* section [here](http://json-schema.org/latest/json-schema-validation.html).

Some useful JSON-schema regex patterns:

**URL** - `^(https?://)?([0-9a-z.-]+).([a-z.]{2,6})([/[0-9][a-z].-]*)*/?$`

## Defining collections

A collection (array of objects) is declared in the appropriate *schema.json* as a **one-element array** containing the declaration object rather than the object itself.  Within this single object, declarations are as they would be for any other field.  For example:

```json
{
  "carousel": [{
    "title": {
      "type": "text",
      "default": "New entry"
     },
    "image": {
      "type": "img",
      "default": "http://placehold.it/350x150"
    },
    "link": {
      "type": "text",
      "default": "http://example.com",
      "validation": {
        "pattern": "^(https?://)?([0-9a-z.-]+).([a-z.]{2,6})([/[0-9][a-z].-]*)*/?$"  
      }
    }
  }]
}
```

**Note that in a collection every field requires a `default` to be set for the client to be able to add new items.**

## Collections which define sub-pages

Collections can be used to define subpages, so that the build process will provide a separate page in the same folder as the parent page for each item in a collection.  To achieve this, you need to add the following key to the *package.json*:

```json
"subPages": {
  "my-page": {
    "field": "subPages",
    "slugFrom": "title",
    "template": "subpage"
  }
}
```

Each key in *subPages* should correspond to the page which contains the collection in question and under which the sub-pages will live.

* **field** (required) - the page field which will be used to generate the sub-pages. Must be a collection.
* **slugFrom** (required) - the key within each collection entry from which to generate the page slug (e.g. `title` or `name`).
* **template** (optional) - the name of the alternative template to use to render subpages.  If not supplied, the parent page's *index.jade* will be used.  *Do not append `.jade` to the template name here*.

The parent page template will receive the same content it would have otherwise, but each entry in the given collection will have `_slug` and `_index` values attached to it for easy routing.

For the child page template (either *index.jade* or the supplied alternative), the contents local is exactly as per the parent, but with an additional `_entry` field containing the contents of the specific entry (including `_slug` and `_index`).
