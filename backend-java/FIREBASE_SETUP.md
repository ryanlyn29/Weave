# Firebase Service Account Setup

## Quick Setup

1. **Download your Firebase Service Account Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to **Project Settings** → **Service Accounts**
   - Click **"Generate New Private Key"**
   - Save the downloaded JSON file

2. **Place the file in the correct location**:
   ```
   backend-java/src/main/resources/firebase-service-account.json
   ```

3. **Verify the file is in place**:
   - The file should be named exactly: `firebase-service-account.json`
   - It should be in: `backend-java/src/main/resources/`
   - It should contain JSON with fields like `type`, `project_id`, `private_key`, `client_email`, etc.

4. **Start the backend**:
   ```bash
   cd backend-java
   mvn spring-boot:run
   ```

## Expected Startup Logs

When the file is correctly placed, you should see:
```
[FirebaseAdmin] Initializing Firebase Admin SDK...
[FirebaseAdmin] Loading credentials from classpath: firebase-service-account.json
[FirebaseAdmin] Firebase Admin initialized successfully
[FirebaseAdmin] App name: [DEFAULT]
[FirebaseAdmin] Project ID: <your-project-id>
```

## Troubleshooting

**Error: "Firebase service account file not found at classpath:firebase-service-account.json"**
- Make sure the file is in `src/main/resources/` (not in `src/main/`)
- Check the filename is exactly `firebase-service-account.json`
- Rebuild the project: `mvn clean compile`

**Error: "Firebase Admin SDK initialization failed"**
- Verify the JSON file is valid (open it and check it's proper JSON)
- Ensure you downloaded the service account key (not the web app config)
- Check that the file has the required fields: `project_id`, `private_key`, `client_email`
