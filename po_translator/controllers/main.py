from odoo import http
from odoo.http import request


class PoTranslatorController(http.Controller):

    @http.route('/po_translator/config', type='json', auth='user')
    def get_config(self):
        """Return the Flask app URL so the frontend JS can build the iframe src."""
        url = request.env['ir.config_parameter'].sudo().get_param(
            'po_translator.app_url', 'http://localhost:5100'
        )
        return {'url': url}
