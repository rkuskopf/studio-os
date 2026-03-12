# Wacom Intuos Pro (PTH-451) — Pen Not Working

## Prediction: Still fixable, but the path is a legacy driver ⚠️

**Updated diagnosis (March 2026):** The latest Wacom driver says "incompatible with device" — this means Wacom has dropped PTH-451 from their current driver. The PTH-451 (Intuos Pro Medium, ~2013 era) needs a **specific archived driver version** that is new enough to run on your macOS but old enough to still list PTH-451 as supported.

Good news: **drivers are fully uninstalled** — you're starting clean, which is exactly where you want to be.

Budget 30–45 minutes. Achievable.

---

## Current State

| Item | Status |
|------|--------|
| Hardware | ✅ Fine — tablet registered as trackpad at one point, so hardware/USB is OK |
| Drivers | ✅ Fully uninstalled (clean slate) |
| Latest Wacom driver | ❌ Says "incompatible with device" — PTH-451 dropped from current drivers |
| Old driver (wrong model) | ❌ Crashes — was the wrong driver for PTH-451 anyway |

---

## The Real Problem

The PTH-451 is old enough that Wacom has removed it from their current driver. You need an **archived driver** from Wacom's driver history — one that:
- Still lists PTH-451 / Intuos Pro as a supported device
- Is compatible with your macOS version

---

## Step-by-Step Fix

### Step 1 — Confirm your macOS version
Apple menu → About This Mac. This determines which archived driver to grab.

### Step 2 — Download the correct archived driver

Go to the Wacom driver archive page:
**[wacom.com/support/product-support/drivers](https://www.wacom.com/support/product-support/drivers)**

On that page:
1. Select your product: **Intuos Pro** (PTH series)
2. Select your OS: macOS + your version
3. If the current driver still says "incompatible" — look for an **"Older Drivers"** or **"Driver Archive"** link on the same page (Wacom does keep these)
4. Target driver series: **6.3.45.x** — this was the last major release that included full Intuos Pro (PTH-451) support before Wacom narrowed the supported device list

> **Alternative source:** Wacom's archived driver index is at `https://cdn.wacom.com/u/productsupport/drivers/mac/` — you can browse versions directly if the main support page doesn't surface them.

### Step 3 — Install the archived driver

1. Open the downloaded `.dmg` and run the installer
2. During or immediately after install, macOS will prompt for Privacy & Security approval — **do not skip this, approve everything it asks**
3. If it asks to allow a System Extension (common on Ventura/Sonoma) — approve it
4. **Restart your Mac**

### Step 4 — Manually confirm permissions (after restart)

Go to **System Settings → Privacy & Security** and check:
- **Input Monitoring** → Wacom Tablet / TabletDriver should be listed and toggled **ON**
- **Accessibility** → same
- **General → Login Items & Extensions → Drivers** → Wacom driver extension should be listed and enabled

If any are missing or toggled off → toggle on → restart again → test pen.

### Step 5 — Test

Open **Wacom Center** (installs with the driver), hover the pen 5–10mm above the tablet surface — the cursor should move. If it does, you're done.

---

## If None of That Works

If even the archived driver says incompatible, or pen still dead after permissions:

- **macOS + driver version mismatch** — the archived driver may predate your macOS. Post your macOS version and we can find a more specific version match.
- **Try driver 6.3.46.1** — another candidate that was the last to support PTH-451 on Monterey/Ventura before Wacom's next major cut.
- **Last resort:** Use the tablet as a trackpad-only input device for the logo mark deadline and deal with pen support after.

---

## Notes
- Reported: ~12 March 2026
- Blocking: Logo mark deliverable
- Status: Drivers uninstalled — ready to try archived driver install
- PTH-451 = Intuos Pro Medium (2013). Not the same as current Intuos Pro line.
