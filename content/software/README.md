# Software Projects

Each Markdown file in this folder defines one software product shown on the **Software** tab.

## Frontmatter fields

| Field       | Type     | Required | Description                                                                 |
|------------|----------|----------|-----------------------------------------------------------------------------|
| `title`    | string   | Yes      | Product name                                                                |
| `description` | string | Yes      | Short description shown on the card                                         |
| `features` | string[] | Yes     | List of key features (bullets on the card)                                  |
| `icon`     | string   | Yes      | Lucide icon name: `BarChart3`, `Database`, `Code`, `Shield`, `Cpu`, `Zap`   |
| `image`    | string   | Yes      | Image URL (e.g. Unsplash or `/path/to/image.jpg`)                           |
| `order`    | number   | No       | Sort order (lower first). If omitted, order is by filename.                 |

## Example

```yaml
---
title: My Product
description: One-line description of the product.
features:
  - First key feature
  - Second key feature
icon: Database
image: https://example.com/image.jpg
order: 1
---
```

To add a product, create a new `.md` file in this directory with the frontmatter above.
