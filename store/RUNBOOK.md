# Undim — finish the App Store submission

Everything below the first step is scripted. The first step needs a signed-in App Store Connect session (Ray's password + 2FA), which is the only thing an agent cannot do.

1. **Create the app record** (ASC web, signed in): Apps → "+" → New App.
   Platform iOS · Name `Undim: Feel Again, On Purpose` · Primary language English (U.S.) · Bundle ID `com.formaz.undim` (G39XDSLNR3) · SKU `undim-feel-again-2026` · Full Access.
   Recipe from the Wisp notes: Name/SKU via `computer type` after clicking the field; the two native `<select>`s via letter keys (`e`×4 → English (U.S.), `u` → Undim bundle). "User access settings could not be saved" modal is harmless.
   Then: App Information → "Declare Regulated Medical Device" → No → Save. App Privacy → Data collected: User ID + Purchase History (App Functionality, not linked, no tracking) → Publish.
   Note the app id (10 digits) = `APP`.

2. Subscriptions (creates group + monthly $9.99 / yearly $39.99 + 175 territories + 7-day trials):
   `cd ~/workspace/landed/.credentials && PYTHONPATH=. python3 ~/workspace/undim_subs.py APP`  → prints `GROUP` and the two sub ids.

3. Metadata, categories, age rating, review notes, 6 screenshots, sub review screenshots:
   `PYTHONPATH=. python3 ~/workspace/undim/store/asc_metadata.py APP SUB_MONTHLY SUB_YEARLY`

4. eas.json: set `submit.production.ios.ascAppId` to APP, commit, push.

5. Upload the IPA from the newest successful `undim-ios-build` run (must be one built AFTER commit 2553800, which baked the RevenueCat key in):
   `gh run list -R tryforma/forma --workflow undim-ios-build.yml --limit 3`
   `gh workflow run undim-ios-upload.yml -R tryforma/forma -f run_id=<RUN_ID>`
   Wait for the build to show `VALID` in ASC (`asc_submit.py --dry-run` prints builds).

6. Submit: `PYTHONPATH=. python3 ~/workspace/undim/store/asc_submit.py APP GROUP SUB_MONTHLY SUB_YEARLY`
   If the submit fails because the subs are not in the submission: in ASC, each subscription page → "Add for Review" → the Draft iOS Submission, then re-run (or PATCH submitted=true).

7. Add Undim to the review-watch cron (app id APP, submission id from step 6), and flip tryforma.app/undim/ + the umbrella card from "Coming soon" to the App Store link on approval.
