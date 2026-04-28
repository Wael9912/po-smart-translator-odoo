# PO Translator — Odoo 18 Module Installation

## 1. Copy the module into your Odoo addons path

### Option A — Docker volume mount (recommended)

In your `docker-compose.yml`, add a volume that maps this folder into Odoo's
custom addons directory:

```yaml
services:
  odoo:
    image: odoo:18
    volumes:
      - ./addons:/mnt/extra-addons          # your existing addons
      - /path/to/PO_Editer/odoo_module:/mnt/extra-addons   # ← add this
    environment:
      - ADDONS_PATH=/usr/lib/python3/dist-packages/odoo/addons,/mnt/extra-addons
```

Then copy the `po_translator` folder into the mapped directory:

```bash
cp -r /path/to/PO_Editer/odoo_module/po_translator  /path/to/your/addons/
```

### Option B — docker cp (no volume needed)

```bash
docker cp /path/to/PO_Editer/odoo_module/po_translator  <container_name>:/mnt/extra-addons/
```

---

## 2. Make sure Odoo sees the addons path

In `odoo.conf` (or your docker-compose environment):

```ini
addons_path = /usr/lib/python3/dist-packages/odoo/addons,/mnt/extra-addons
```

---

## 3. Restart Odoo and update the module list

```bash
docker compose restart odoo
```

Then in Odoo:
1. Enable **Developer Mode** → Settings → Activate the developer mode
2. Go to **Apps** → click **Update Apps List**
3. Search for **"PO Translator"** → click **Install**

---

## 4. Configure the Flask app URL

The module needs to know where to find the running PO Translator Flask server.

Go to:  **Settings → Technical → Parameters → System Parameters**

Find the key:  `po_translator.app_url`

Set the value to the URL the **browser** uses to reach the Flask app:

| Setup | Value |
|---|---|
| Flask on your Mac, Odoo in Docker Desktop (Mac) | `http://localhost:5100` |
| Flask and Odoo on the same Linux server | `http://localhost:5100` |
| Flask on a different machine | `http://<ip-or-hostname>:5100` |

> **Note:** This is the URL the *browser* opens — not what the Docker container
> internally calls. Because the iframe loads in your browser, `localhost` means
> your local machine, not the Docker container.

---

## 5. Start the Flask app

From the `PO_Editer` project folder on your Mac:

```bash
./start.sh
```

---

## 6. Open in Odoo

Click the **PO Translator** icon in the Odoo app switcher (the grid icon, top-left).
The full editor will load inside Odoo's shell.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| App not visible after install | Update Apps List, hard-refresh browser |
| "PO Translator Unreachable" error | Run `./start.sh`, check `po_translator.app_url` |
| Blank white page | Check browser console for CSP/CORS errors (see below) |
| 404 on `/po_translator/config` | Restart Odoo after installing the module |

### CORS / iframe blocked

If the browser blocks the iframe, add this to your Flask app startup
(already included in `po_multisource.py` via Flask's response headers):

The Flask app already runs on a separate origin. If Odoo is on `https://` and
the Flask app is on `http://`, the browser will block it.
**Solution:** run both on the same scheme, or put the Flask app behind the same
Nginx/proxy as Odoo.
