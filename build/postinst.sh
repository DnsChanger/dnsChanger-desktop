#!/bin/bash
# Fix Chromium SUID sandbox permissions required for Electron on Linux
SANDBOX="/opt/DNSChanger/chrome-sandbox"
if [ -f "$SANDBOX" ]; then
  chown root "$SANDBOX"
  chmod 4755 "$SANDBOX"
fi

# Create symlink so 'dnschanger' is available on PATH
ln -sf /opt/DNSChanger/dnschanger /usr/bin/dnschanger
