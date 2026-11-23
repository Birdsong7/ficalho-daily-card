# Trail de Ficalho 2027 — Automated Daily Liquid Glass Card

## Quick Setup (3 Minutes)
1. Create a new GitHub repository (e.g., `ficalho-daily-card`).
2. Upload all files from this ZIP (keeping `.github/workflows/render-daily-card.yml` in its folder).
3. Go to **Settings -> Secrets and variables -> Actions -> New repository secret**:
   - Name: `APPS_SCRIPT_URL`
   - Secret: Your deployed Google Apps Script Web App URL.
4. Go to the **Actions** tab -> **Render Daily Liquid Glass Card** -> click **Run workflow** to generate your first `tomorrow.png`.
5. Your direct image URL for Apple Shortcuts is:
   `https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/ficalho-daily-card/main/tomorrow.png`
