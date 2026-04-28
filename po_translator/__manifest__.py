{
    'name': 'PO Smart Translator',
    'version': '18.0.1.0.0',
    'category': 'Localization',
    'summary': 'AI-powered PO file translation editor with multi-source suggestions',
    'description': """
PO Smart Translator
=============
Full-featured .po file editor embedded inside Odoo.

Features:
- Bulk AI translation (Google, DeepL, Claude, Gemma)
- Multi-source candidate review
- Glossary & Translation Memory
- HTML / QWeb / Email template safe translation pipeline
- Quality scoring & terminology audit
    """,
    'author': 'PHEM',
    'website': '',
    'license': 'LGPL-3',
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'data/ir_config_parameter.xml',
        'views/menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'po_translator/static/src/js/po_translator.js',
            'po_translator/static/src/xml/po_translator.xml',
        ],
    },
    'application': True,
    'installable': True,
    'auto_install': False,
}
