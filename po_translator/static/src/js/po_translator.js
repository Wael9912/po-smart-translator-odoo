/** @odoo-module **/

// In Odoo 18 the `rpc` service was removed — use the standalone function instead.
import { Component, onWillStart, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";
import { _t } from "@web/core/l10n/translation";

/**
 * PoTranslatorAction
 * ------------------
 * Full-screen client action that embeds the PO Translator Flask app
 * inside Odoo via an iframe.  The Flask app URL is stored in the Odoo
 * system parameter  po_translator.app_url  and fetched at mount time
 * via the /po_translator/config JSON endpoint.
 */
class PoTranslatorAction extends Component {
    static template = "po_translator.MainAction";
    static props = ["*"];

    setup() {
        // `notification` is still a service; `rpc` is now a plain function import.
        this.notification = useService("notification");

        this.state = useState({
            url: "",
            loading: true,
            error: "",
        });

        onWillStart(async () => {
            try {
                const res = await rpc("/po_translator/config");
                this.state.url = res.url || "http://localhost:5100";
            } catch (e) {
                this.state.error = _t("Could not load PO Translator configuration.");
                this.notification.add(this.state.error, { type: "danger" });
            } finally {
                this.state.loading = false;
            }
        });
    }

    onIframeLoad() {
        this.state.loading = false;
    }

    onIframeError() {
        this.state.error = _t(
            "PO Translator is not reachable. Make sure the server is running on: "
        ) + this.state.url;
    }
}

registry.category("actions").add("po_translator.main", PoTranslatorAction);
