#!/bin/bash
set -e

# Install prefix used by electron-builder for deb (productName → DNSChanger)
INSTALL_DIR="/opt/DNSChanger"
BIN_NAME="dnschanger"

# Chromium SUID sandbox (required for Electron without --no-sandbox)
SANDBOX="${INSTALL_DIR}/chrome-sandbox"
if [ -f "$SANDBOX" ]; then
	chown root:root "$SANDBOX"
	chmod 4755 "$SANDBOX"
fi

# Ensure binary is on PATH (some packages only install under /opt)
if [ -x "${INSTALL_DIR}/${BIN_NAME}" ]; then
	ln -sf "${INSTALL_DIR}/${BIN_NAME}" "/usr/bin/${BIN_NAME}"
fi

# Refresh desktop/mime databases when tools are available
if command -v update-desktop-database >/dev/null 2>&1; then
	update-desktop-database -q /usr/share/applications 2>/dev/null || true
fi

if command -v gtk-update-icon-cache >/dev/null 2>&1; then
	gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor 2>/dev/null || true
fi
