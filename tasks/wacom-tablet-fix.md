# Wacom Intuos Pro (PTH-451) — Pen Not Working

## Prediction: Yes, very likely fixable ✅

The fact that the tablet registers as a trackpad is the key signal — **hardware and USB/Bluetooth connection are fine**. The pen not being recognised is a software/permissions problem, not a hardware failure. This is one of the most common Wacom issues on macOS and has a reliable fix path. Budget 20–30 minutes.

---

## Diagnosis

| Symptom | What it means |
|---------|---------------|
| Tablet works as trackpad | Hardware connection is fine. Driver is partially loaded. |
| Pen not recognised | Driver doesn't have Input Monitoring / Accessibility permission — macOS is blocking it. |
| Old Wacom Center crashes | Old driver is incompatible with your current macOS version. Don't use it. |
| Recent driver installed but not working | Permissions weren't approved after install (very common post-macOS update). |

---

## Step-by-Step Fix

### Step 1 — Check your macOS version
Apple menu → About This Mac. Note the version number. You need macOS 10.15+ for current Wacom drivers.

### Step 2 — Check Privacy & Security permissions (do this first, before reinstalling)

Go to: **System Settings → Privacy & Security**

Check all three of these sections and make sure the Wacom driver/tablet helper is listed AND enabled:
- **Input Monitoring** — Wacom Tablet.prefPane or TabletDriver must be toggled ON
- **Accessibility** — same
- **Screen Recording** — same (needed for some Wacom features)

If Wacom entries are there but toggled off → toggle them on → restart the Mac → test the pen.

**This alone may fix it without any reinstall.**

### Step 3 — If permissions look fine or entries are missing: clean reinstall

1. Download the **Wacom Uninstaller** from [wacom.com/support](https://www.wacom.com/support/product-support/drivers)
2. Run the uninstaller — this removes all Wacom driver files cleanly
3. **Restart your Mac**
4. Download the **latest driver for PTH-451** (Intuos Pro Medium) from the Wacom driver page — confirm it matches your macOS version
5. Install the driver
6. When macOS prompts for Privacy & Security approval during or after install, approve it — **don't skip this**
7. If no prompt appears, go manually to System Settings → Privacy & Security → check Input Monitoring and Accessibility as in Step 2
8. **Restart again**
9. Open Wacom Center — test the pen

### Step 4 — If Wacom Center still crashes or pen still doesn't work

- Check System Settings → General → Login Items & Extensions → scroll to "Drivers" or "Background Items" — Wacom driver extension should be listed and enabled
- On macOS Ventura/Sonoma, there may be an additional "System Extension" approval required — look for a notification in Privacy & Security about a blocked system extension from Wacom
- Approve it, restart, test again

---

## Compatible Driver Version for PTH-451

The PTH-451 (Intuos Pro Medium, ~2013–2016 era) is supported on current drivers. Use the **Wacom Professional Tablet** driver, not the Intuos (consumer) driver. Check [wacom.com](https://www.wacom.com/support/product-support/drivers) and filter by your device and macOS version.

---

## Notes
- Reported: ~12 March 2026
- Blocking: Logo mark deliverable
- Status: Attempting fix
